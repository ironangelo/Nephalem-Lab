# Experiments — CoE -> Firebird's Breast (2026-11-13 to 2026-11-14)

This is a dated research log of **user-reported in-game observations** and **computational results**. The two are never interchangeable. Intended to accompany [CONTINUITY.md](../CONTINUITY.md), [seed-model notes](SEED_MODEL_AND_DROP_RECOVERY.md) and [Primal route](FIREBIRD_SOULSTONE_ROUTE.md).

## Conventions

- \`R\`: Reforge Legendary / Reforjar legendario.
- \`S\`: Sanctify / Santificar usando Angelic Crucible, only when current season rules enable it.
- \`C\`: Convert Set Item / Convertir objeto de conjunto. **Changes item identity**; track the new piece, not merely its seed.
- \`P\`: Improve Legendary / primalize (separate recipe; do not confuse with a *natural* Primal from R).
- Quality terms: **normal**, **ancient**, **primal**, **sanctified**. Sanctified is not a natural Primal.
- \`INT\` = Intelligence, \`VIT\` = Vitality, \`CHC\` = critical-hit chance, \`CDR\` = cooldown reduction.
- **Evidence levels:** real screenshot or user-confirmed action; upstream Rust verified **model**; JS or C verified **model**; conjecture/unresolved.

## Experiment 1 — Convention of Elements (CoE), November 13

Console: Switch 2. Hero performing Reforge: Wizard. Original ring had Strength, so source **does not need to share the Wizard core attribute**.

| State | In-game CoE stats | Source / confidence |
| --- | --- | --- |
| CoE0 — as acquired | legendary power **190%**; **+455 Strength**; **+5.0% CHC**; **+8% CDR** (natural, not rerolled); **+151 Poison Resistance**; **1 socket** | Real user observation |
| CoE1 — first R | power **156%**; **+423 Intelligence**; **+4.5% CHC**; **+5% attack speed**; **+142 Fire Resistance**; **1 socket** | Real Reforge; stored in \`src/storage.js\` as \`SAMPLE_156\` |
| CoE2 — second R | power **165%**; **+433 Intelligence**; **+425 Vitality**; **+4.5% CHC**; **+144 Lightning Resistance**; **1 socket** | Real Reforge; stored as \`SAMPLE_165\` |

There were exactly two consecutive actual reforges of the same ring in the documented case, separate from future modeled routes. The first inverse constraint scan on CoE1 reported **4,081 preliminary candidate seeds** (\`assets/coe-sample-4081.csv\` is a historical candidate artifact, not a list of certified actual seeds). After the second observation, the known modeled state transition became:

    seed(CoE1) = 3035692732
         -- R --> 4015360194  [CoE2: power 165, INT433/VIT425/CHC4.5/Lightning144]

The code in \`src/engine.js\`, \`src/storage.js\` and \`tests/engine.test.mjs\` records this CoE proof of concept. In particular \`applyOperation(3035692732,'R')\` returns seed \`4015360194\`, power 165, and a match for \`SAMPLE_165\`.

### CoE primal continuation — simulation, not automatically real

From modeled CoE2 seed \`4015360194\`, the **modeled** 11-step chain is:

    RSSRSSSSSRR

The regression test asserts:
- 11 modeled operations.
- At step five, a modeled Sanctify with selected affix families \`Int / CriticalChance / Sockets / DR / KillLife\`.
- Last modeled R gives a **natural Primal** CoE: power **200%**, affix families \`Int / CriticalChance / Sockets / CriticalD / PoisonResist\`; child seed **2122496372**.
- Those test assertions **do not certify** that the entire route was carried out on Switch 2 or that its Primal has every Soulstone target affix. Its \`CDR\` target would need a legal Mystic replacement decision; do not remove desirable INT by accident.

The CoE experiment provided a **real observed Reforge validation** for the 32-bit MWC transition, not a universal proof of all item-drop seeds.

## Experiment 2 — Firebird's Breast obtained as loot, November 14

Source of original object per user: **drop in a Greater Rift, Nephalem Rift, or from Kadala**. The precise one of these three sources is not known; **do not invent it**. The user took photographs of all three items. All three had three sockets, with no observed Mystic reroll on A.

| State | Base Armor on screenshot | Visible primary and secondary values | Actual operation |
| --- | ---: | --- | --- |
| **A** | **668** | **416 INT**, **+10% Life**, **+198 XP/kill**, **+2 yd Pickup Radius**, **+11% Explosive Blast**, **Sockets (3)** | Originally obtained as loot/Kadala |
| **B** | **752** | **456 INT**, **484 VIT**, **149 Lightning Resistance**, **5,366 Thorns**, **+13% Explosive Blast**, **Sockets (3)** | One real **R** on A |
| **C** | **738** | **443 INT**, **476 VIT**, **+11% Life**, **149 Poison Resistance**, **+1 yd Pickup Radius**, **Sockets (3)** | One real **R** on B |

The genuine model chain that generates **both B and C exactly** from the same inferred predecessor seed is:

    A (seed inferred: 3525123180)
       -- R, Wizard, 6 RNG draws -->
    B (seed inferred: 2645309652)
       -- R, Wizard, 6 RNG draws -->
    C (seed inferred: 3835143639)

**Independent upstream official Rust verification:** [run 43560278798](https://github.com/ironangelo/Nephalem-Lab/actions/runs/43560278798). The earlier candidates 376089158, 1818121089, 2114793458, 2928563961, 3125153708, and 3493351128 **failed** to reproduce B via the full Reforge. Their numerical constraints alone were insufficient. The actual seed is not directly exposed by any game screenshot.

### Failure of naive original-drop recovery

The original tool tried to apply \`values(item,currentSeed)\` to the **pre-Reforge loot A**, assuming the values seen on A share the formula used for post-Reforge items. A screenshot of A confirms that its input numbers were correctly transcribed.

- **12** independent numerical-affix order hypotheses for A.
- **145,668** numerical-compatible A seeds from exhaustive full-space inversion.
- **95** of those produced B's affix *families* but **zero** reproduced all B's exact numbers.
- The true predecessor **inferred independently** from B/C, \`3525123180\`, does not match the A tooltip under those \`values\` hypotheses.
- The source's **668 Armor** was not a constraint in that inversion; \`Sim::values\` does not calculate displayed base armor. Do not misstate this as an independent armor validation.

See the [deep A/B/C diagnosis](https://github.com/ironangelo/Nephalem-Lab/blob/research/firebird-childseed-preimage/research/FIREBIRD_THREE_STATE_DIAGNOSIS.md) and [permutation test](https://github.com/ironangelo/Nephalem-Lab/actions/runs/43559950255).

### Breakthrough: recover source seed with ONE observed Reforge

Use **only the B tooltip and knowledge that a single R happened**, ignoring the original A's numeric stats entirely:

1. Enumerate all internal affix-generation orders and applicable value formulas for the observed **B**.
2. Run 2^32 seed inversion with numerical constraints, retaining **24 distinct B-seed candidates**.
3. Invert the six-draw MWC map to possible predecessor seeds across the complete 2^32 input space; **25 parent preimages**.
4. Simulate actual \`reforge(Firebird's Breast, candidateParent)\` for each, discard Ancient candidates (they use more draws), verify resulting item, quality, affix *selection* and exact values.
5. **Exactly one** parent reproduces B: \`3525123180\`; the generated B seed is \`2645309652\`.

[One-Reforge full inverse run 43563886534](https://github.com/ironangelo/Nephalem-Lab/actions/runs/43563886534). This is a research success **for this one item/test**, not a universal recovery guarantee. Another observed item may yield multiple surviving seeds or a different number of draws.

### Original-drop 64-bit state experiment

D3Recipes has \`drop_item(item,x0,ancient,primal)\`, starting with a full 64-bit state \`x0\`, whereas \`reforge(item,seed)\` starts a new RNG with high half = 666. The former models known recipe drops (e.g. Hope of Cain), not every real monster/Kadala loot source.

Fixing the lower 32 bits to inferred parent \`3525123180\`, try different higher 32-bit values, pre-draw offsets and value-RNG resets. An initial grid of 32,768 variants yielded at most 4 of 5 original numeric values. A later **complete 2^32 high-half search across seven variants** found many possible complete matches for all five original values; some generated the same visible affix families. A stricter validator found **1 to 6 possible high-half states per tested variant** compatible with actual selected affix families and numeric values, but **zero exact internal affix-ID ordering matches** in its constrained check. A socket affix-ID discrepancy remains unresolved. This neither identifies a **unique original 64-bit state** nor proves how actual Rift/Kadala drops are seeded.

Source and CI:
- [drop-high32 source branch](https://github.com/ironangelo/Nephalem-Lab/tree/research/drop-seed-formula)
- [full 64-bit state search 43563626496](https://github.com/ironangelo/Nephalem-Lab/actions/runs/43563626496)

**The drop origin and the precise mapping from physical drop generation to stored 32-bit Reforge seed are still open.** Never claim a universal "photo-only drop seed" formula.

## Experiment 3 — first real Sanctify and current photographic evidence

The user continued **from Firebird C**, inferred seed \`3835143639\`, targeting a natural Firebird's Breast Primal with INT+VIT+Life+3 sockets and useful defensive secondaries (Soulstone Firebird Twister).

### Screenshot: first Sanctify, **in-game verified visible values**

One real \`S\` via an Angelic Crucible on the 443 INT chest gave:

- Firebird's Breast, sanctified, **759 displayed Armor**.
- **+650 INT**; **+650 VIT**.
- **+210 Poison Resistance**.
- **Sockets (3)**.
- **+15% Blizzard Damage**.
- Orange sanctified power: **Arcane Orb periodically generates orbiting charges**, as seen in screenshot.
- Model had an additional \`+260 Experience per Kill\` as its sixth picked affix, but in a six-affix Sanctify roll the orange power **replaces the final secondary**. Thus XP/kill is **correctly absent** from actual tooltip. See \`sanctify()\` source docstring and research notes.
- The pictured values and affix families therefore **agree with the first modeled checkpoint**, with a deliberate difference between internal six-affix selection and the five displayed affixes plus power.

The model predicts the next seed after this first S is \`2170510334\`. The hidden seed was not read from Switch.

### Latest user photo: 650/650, Life +15%, Fire +210, Globes +38,625

A later user screenshot (2026-11-14) shows **Firebird's Breast**, **759 displayed Armor**, **650 INT**, **650 VIT**, **+15% Life**, **210 Fire Resistance**, **+38,625 Life from Health Potions/Globes**, and **Sockets (3)**. User reported "¡Excelente! Funcionó". Subsequently, when asked explicitly whether this photograph was taken **after completing the 12 operations `SSSSCSSCCSSR`**, the user confirmed: **«Sí, exactamente al terminar el último paso»**.

This is a complete **visible-stat match** to the model's *final natural-Primal destination* on path \`SSSSCSSCCSSR\`. It does **not** match predicted second \`S\` (which would show Hydra 15%, Resist All 130 and pickup radius +2, with orange power replacing XP). **The user explicitly confirmed executing the complete 12-operation route and taking the screenshot at its final step.** The cropped image does not legibly display a full "Primal Ancient" text label, and hidden seeds are not directly observable; the orange/red item border and exact max-value stats alone are not a substitute for recorded operation history. **The route is completed.** Do not direct the user to do S #2 or repeat any Cube operation; only an optional Mystic reroll remains.

The final build's intended **Mystic**: replace **+38,625 Life from Health Potions/Globes** with **up to 7% melee damage reduction**, leaving INT 650 / VIT 650 / Life +15% / sockets 3 / Fire Resist +210 untouched.

For exact path/seed/affix checkpoints and material calculations read [FIREBIRD_SOULSTONE_ROUTE.md](FIREBIRD_SOULSTONE_ROUTE.md).

## Other research observations and engineering learnings

- Early Firebird's Pinions (shoulders) test produced **387 numerical seed candidates** and no certified source seed; no known method can infer it uniquely from the screenshot alone.
- Recovery of original 416 INT chest initially surfaced **36,435** value-compatible seeds before permutations, but none explained the known next real Reforge.
- **AFIX ORDER MATTERS:** the item's tooltip display order is not guaranteed to equal internal pick/draw order; select all valid rolls and orders, and verify complete RNG execution after numerical filtering.
- \`Sockets (3)\` is not a simple numeric RNG roll to invert. The old form error "Cannot identify numerical attribute for Sockets" was a form/recovery bug; record socket identity/count separately.
- Previous Android \`Save observation\` failure was due to a missing \`WebChromeClient\` handling \`confirm()\`; it was fixed in app v0.4.1 but is unrelated to RNG math.
- Season 40 enables Sanctify under verified mode; nonseasonal runs must **not** assume Angelic Crucibles are available.
- Unit tests in \`tests/engine.test.mjs\` validate the CoE proof and deterministic simulation; not all tests are independent console observations.
