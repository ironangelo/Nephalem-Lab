# Seed model, dropped-item inversion and the actual Reforge mechanism

**Research note, 2026-11-14 — evidence-led, not an official game specification.**  
Read [CONTINUITY.md](../CONTINUITY.md) for overall status; see [experiment log](COE_AND_FIREBIRD_EXPERIMENTS.md) for the real-world observations.

## 1. Which seed is which?

The research must distinguish at least four concepts:

1. **Original drop-generation RNG state:** possibly a full 64-bit internal state that generated/selected an item while looting or obtaining it; for normal Rift/Kadala drops this is *not* established by D3Recipes source alone.
2. **Stored item seed (32-bit):** a value used as the **input** to future Cubo de Kanai transformations. In our Firebird case A's stored seed is *inferred* to be \`3525123180\`.
3. **Post-operation child seed (32-bit):** the low 32 bits of the terminal state after the RNG draws consumed by one operation. This becomes the next model input. Example: Firebird \`3525123180 --R--> 2645309652\`.
4. **Value-roll RNG stream:** used to evaluate numerical formula bytecode for affixes. In D3Recipes \`values(item,seed,affixes)\` it is initialized from a derived state, and for armor items an extra step occurs before that reinitialization. It must **not** be confused with the affix-selection RNG.

An item can have identical-looking visible affixes under multiple hidden states: **numbers alone may be non-identifying**.

## 2. Confirmed mathematical kernel — Multiply With Carry (MWC)

Upstream exact reference (held fixed for reproducibility):  
https://github.com/FNGarvin/d3recipes/blob/49fe28467db9ebbd096694d1408528b2c9ce5ea3/core/src/sim.rs

Definitions:

    MASK32 = 0xFFFFFFFF
    MULT   = 0x6AC690C5
    step(x) = (x & MASK32) * MULT + (x >> 32)
    Rng::new(u32_seed): x = (666 << 32) | u32_seed
    Rng::draw():       x = step(x); return x & MASK32
    Rng::lo():         return x & MASK32

Use **exact integer arithmetic** (\`BigInt\` in JS, \`uint64_t\` in C, \`u64\` in Rust). Do not use floating-point JS Numbers to evaluate the 64-bit state.

For an operation that consumes \`n\` RNG draws, the outgoing model seed is:

    child_seed = low32(step^n((666 << 32) | parent_seed))

**Do not hard-code \`n = 6\` globally.** Draws are conditional on:
- R vs S vs P vs C;
- item type, fixed groups and available random affix categories;
- hero vs class restrictions;
- normal / Ancient / Primal quality rolls (e.g. Ancient makes an extra quality draw);
- selected variants and any internal discarded draws;
- the special Sanctify lost-secondary rule.

Reference equality confirmed:
- CoE Wizard normal \`3035692732 --R (4 draws)--> 4015360194\`.
- Firebird's Breast Wizard normal \`3525123180 --R (6 draws)--> 2645309652\`.
- Firebird's Breast Wizard normal \`2645309652 --R (6 draws)--> 3835143639\`.

[Independent cross-object model run](https://github.com/ironangelo/Nephalem-Lab/actions/runs/43563457832); CoE actual observation in \`src/storage.js\`, Firebird actual observations in experiment log. This numerical relation is a **model result validated by matching visible console output**, not a direct hardware seed read.

## 3. The distinction between R, S, C, original loot and value generation

### Reforge Legendary — R

Reference: \`Sim::reforge(item_idx,seed)\`.

- Initialize \`Rng::new(seed)\`.
- Roll Ancient probability; if Ancient and eligible, roll Primal probability.
- Apply any conditional cross-class draw.
- Roll fixed-slot affixes, take the discarded "legendary" draw, choose remaining affixes in internal RNG order.
- Terminal low 32-bit state becomes the child seed.
- Numerical values of result are rolled with \`values(item, child_seed, selected_affixes)\`, or \`values_max\` for Primal.
- In a real-world operation the item identity stays the same; affix families/values change.

### Sanctify — S

Reference: \`Sim::sanctify\`, which builds affixes using \`primal_roll\` and **does not return a natural Primal**.

- An Angelic Crucible maxes the eligible item's rolled affix values and adds a randomly selected orange seasonal power (not modeled as a predictable specific power).
- If the internal initial pick selected six affixes, the orange power **replaces the final secondary**. The value of that final selected secondary will **NOT** be visible in-game.
- The model also moves the stored child seed **one RNG draw earlier** in that six-affix case:
  
      if selected_affixes.length === 6:
          sanctified_child_seed = low32(state after n-1 draws)
      else:
          sanctified_child_seed = low32(state after n draws)

- **Observed example:** model initially listed +260 XP/kill as sixth selected affix after INT 650 / VIT 650 / Blizzard 15% / Poison Resist 210 / 3 sockets. Real Sanctify showed no XP/kill and an orange Arcane Orb power instead, exactly as the special rule predicts. This is a verified real observation; the random Arcane Orb power itself was not foreseen.
- If comparing predicted six selected affixes to the actual screen without accounting for this replacement, **you will falsely conclude the seed diverged**.
- Do **not** repeat an already completed sanctification solely to make a missing secondary stat appear.

### Convert Set Item — C

Reference: \`Sim::convert(item,seed)\`. A first MWC step from the input seed selects a **different member of the same set** under weighted probabilities. A further class-mismatch draw may be consumed. The resulting item is rolled from a new state, and its next current seed follows that state.

**Never display C as an unchanged item**. Real Firebird route includes:

    Firebird's Breast --C--> Firebird's Down (Legs)
    Firebird's Down   --C--> Firebird's Plume (Head)
    Firebird's Plume  --C--> Firebird's Breast (Chest)

C is normal quality: it is not a route-finishing natural Primal step.

### Value rolls — distinct RNG

Reference \`Sim::values(item_idx, seed, affixes)\`:

    x = step((666 << 32) | seed)
    if item.armor: x = step(x)
    value_rng = Rng::new(low32(x))
    evaluate item's innate numeric specs, then affix specs in **generation order**.

**Important:** tooltip screen display order and internal generation order may differ. Sockets may have zero numerical formula specs, yet affect generated affix composition. Firebird item screenshots show visible Armor **668 / 752 / 738 / 759**, but this D3Recipes value method **does not separately reproduce that displayed base-Armor figure**. Do not assume the base Armor number validates the inverse calculation.

### Creation of a drop

D3Recipes also includes \`Sim::drop_item(item_idx, x0, ancient, primal)\` with \`Rng::from_state(x0)\`, accepting an **entire 64-bit state** rather than starting at \`(666<<32)|seed\`. The implementation documents recipe-generated loot (e.g. Hope of Cain), **not a verified universal model of drops from GR, Nephalem Rifts or Kadala**. A physical item acquired from a monster and an item generated from the Cubo cannot be presumed to use exactly the same initial-state rule.

The user's starting Firebird A had genuine 416 INT / 10% Life / 198 XP / pickup 2 / Explosive Blast 11%, yet \`values(item,3525123180)\` using all current hypotheses does not reproduce it. In contrast, \`reforge(item,3525123180)\` produces the real B and then C. This is the central empirical asymmetry.

## 4. Inverse algorithm: recover a loot item's seed from one observed R

**Tested on the real Firebird case, not yet proven universally.**

Input: *output* photo B after a known single Reforge, real exact affix stems, values, quality, item, class, and count of prior operations.

Algorithm:

1. Generate all **feasible internal pick orders** of B's numerical affixes. Check per-item fixed groups, tier variants, primary/secondary families, and numerical formulas; do not simply use their tooltip display order.
2. For each allowed value order, represent each \`RandomInt(lo,hi)\` as a modular constraint: \`draw % (hi-lo+1) = desired-lo\`, adapting for percentage divisors.
3. Scan the complete 2^32 candidate *B current-seed* space using optimized WASM/C and replay the full \`values\` result to reject false positives. This case produced **24** distinct value-compatible B seeds.
4. For each candidate child seed, invert the **known actual R draw count** (six for a *normal* Wizard Firebird's Breast R) over all 2^32 parent seeds; this case produced **25** preimage parents total.
5. Run **actual** \`Sim::reforge\` on every parent, including quality selection and full affix-selection order. Reject non-normal results and mismatching quality, family, numerical value, or target item.
6. Exactly **one** parent survived: \`3525123180\`. The resulting seed for B was \`2645309652\`, matching a separate B-to-C reconstruction.
7. Finally, cross-check next *independent* observation C when available: \`2645309652 -> 3835143639\`, C tooltip matches. **Do not require A's original value rolls to match the B/C Reforge value model.**

Reference work:
- [research/single-reforge-drop-recovery (code)](https://github.com/ironangelo/Nephalem-Lab/tree/research/single-reforge-drop-recovery)
- [successful 24 -> 25 -> 1 run](https://github.com/ironangelo/Nephalem-Lab/actions/runs/43563886534)
- [research/firebird-childseed-preimage (independent predecessor inference)](https://github.com/ironangelo/Nephalem-Lab/tree/research/firebird-childseed-preimage)

This solution does **not** require the user's XP total and does not reset RNG by manipulating character experience. D3Recipes "fresh level-1 with zero XP" is a **recipe start-state control requirement**, not the \`XP\` variable in the \`step\` formula. There is no evidence that congruent XP totals modulo some number create equal item seeds.

## 5. Unfinished research: can a single original-drop photo suffice?

The starting A is photographed, so the observed values are trustworthy. It originated from **one of:** Kadala, GR, Nephalem Rift — the user does not recall which. Do not treat the source as certain.

- First 416-value inversion under the wrong shared-value assumption found **36,435** candidates (then **145,668** with all internal orderings) and **zero** full A-to-B explanatory matches.
- A 32,768-configuration trial varying the upper 32-bit RNG state, offset and reset mode found no complete A value match.
- **Full 2^32 high-half state scan** for each of seven candidate models found **many** matches for the A values; some have matching selected affix families.
- A stricter test of selected affixes vs numerical values found 1–6 possible states per candidate model, but no exact affix-ID *order* in the constrained simulation (socket-ID mismatch). **No unique state or verified world/Kadala algorithm established**.

[Exhaustive full-state search](https://github.com/ironangelo/Nephalem-Lab/actions/runs/43563626496); [code](https://github.com/ironangelo/Nephalem-Lab/tree/research/drop-seed-formula).

**Outstanding questions**:
- Which initial game state drives regular monster and Kadala item generation?
- Does the stored 32-bit item seed equal the low 32 bits of the drop-generation initial state, a later state, or a separate seeded RNG?
- Which fixed/socket affix IDs and ordering rules are retained for ordinary drops vs sanctification vs Reforge?
- Can true displayed base Armor be modeled as an additional inverse constraint?
- How often does one-R reconstruction uniquely determine a previous seed for other item types/qualities?
- Which rates/variants differ across D3 game patches and platforms?

## 6. Engineering/validation rules for future work

- Always save **item ID, hero class, version of upstream game tables, original source, exact operation, initial/candidate seed, quality and all observed affixes**.
- Prefer **two independent implementations** (original Rust + JS) for each proposed operation chain.
- Do not infer a universal drop rule from one successful Firebird case.
- A **numerical hit alone is not a true seed**; verify exact affix selection, order, quality, target item and quantities.
- A correct visible outcome is stronger evidence than a simulated result but does not directly expose the hidden seed. Keep language precise: *inferred*, *simulation-reproduced*, *real photo observed*.
- Sanctify's orange power replaces a rolled secondary; exclude the replaced stat from tooltip comparisons **without** dropping the seed-advance rule.
- Convert Set Item is a stateful path across **different** set pieces; preserve both original target item and current piece.
- For route optimization, distinguish **step minimum**, **weighted cost minimum** and **actual user resource minimum**. A bounded search cannot claim global minimality for all budgets.
- If any actual outcome disagrees with predicted checkpoint, stop and reconfirm before spending more real materials. Do not generate an APK to "fix" a research finding unless explicitly requested.
