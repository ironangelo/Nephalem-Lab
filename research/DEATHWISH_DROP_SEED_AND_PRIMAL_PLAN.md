# Deathwish original drop -> Firebird Twister Soulstone Primal

**Dated:** 2026-11-14. **State:** initial screenshot and off-game experiments completed; **no in-game operation on this specific Deathwish has been reported yet**. **Research only**; no APK changed.

## Starting sword — actual Nintendo Switch 2 photograph

An unmodified legendary **Deathwish** sword, user remembers it as a drop from GR or Kadala (not sure which). The screenshot clearly shows:

- Displayed DPS: **2306.1**
- Rolled weapon damage range: **+1166–1382** (must interpret as minimum roll **1166** and incremental upper range **216** in D3Recipes' *two numeric specs belonging to one affix*).
- Intelligence: **652**
- Vitality: **726**
- Attack speed: **+6.0%**
- Life after each kill: **+7904**
- Legendary channeling damage power: **250%**
- The pictured item name is **Deathwish**, legendary sword; the screenshot does not explicitly identify the stored item seed.

## Target: exact Soulstone console Firebird Twister priorities

Source: https://www.soulstone.gg/firebird-twister-wizard

For Deathwish: **high legendary-power affix (max 325% under current formula), high base weapon damage range, +10% Damage, +10% Cooldown Reduction, +Damage to Elites, cold or lightning weapon damage** for Elemental Exposure; no fear/knockback on hit. Highest priority is legendary power + correct offensive primary stats; elemental cold/lightning is desirable but secondary in priority to primary stats. The user's original 250% power is the bottom of the current 250–325% formula range.

At 70, the item model has **two fixed primary families** (Intelligence, elemental/physical weapon damage), **two random primary slots**, and **one secondary slot**. The target's Damage% + CDR + Elite% therefore normally requires **one legal Mystic replacement** of original primary Intelligence after obtaining Damage% and CDR (or an equivalent two-of-three combination that leaves one replaceable primary), with cold/lightning as the fixed damage element. A natural Primal is different from a Sanctified weapon; the last recipe in any natural-Primal path must genuinely produce primal quality. A weapon socket could be added separately with Ramaladni's Gift if appropriate; do not consume a primary slot on socket in the Primal target.

## Critical discovery: weapon damage consists of TWO independent numeric rolls within ONE affix

The original generic seed recoverer had treated each tooltip line as a separate affix, so it could not reliably reconstruct weapon seeds even for **simulated normal Deathwish** with a known parent seed. After fixing a **research-only** inverser to treat one elemental/physical damage *family* as a group with two formula specs, the test generated eight normal Deathwish outputs and correctly found numerical hypotheses reproducing each known resulting seed/affix ordering.

- Regression: https://github.com/ironangelo/Nephalem-Lab/actions/runs/43621783913
- New grouped-value inversion source: https://github.com/ironangelo/Nephalem-Lab/blob/research/deathwish-kadala-drop/research/deathwish-weapon-inversion.mjs

No production code/app changed.

## Original-drop photo cannot certify the stored seed

Mapped all original Deathwish screenshot values into eight candidate **normal Reforge-valued** hypotheses: power=2.50, Int652, physical MinMaxDam two formulas corresponding to 1166 and 216, Vit726, Haste 6%, KillLife7904.

An **exhaustive full 2^32 scan** found **ZERO seeds matching all seven numeric constraints under the Reforge value formula**, even after weapon multi-roll grouping was repaired. This reinforces the distinct-original-drop generation issue previously observed with the Firebird's Breast starting chest, and confirms that original loot's displayed stats cannot simply be treated as \`values(item, storedReforgeSeed)\`.

- Original-photo scan CI: https://github.com/ironangelo/Nephalem-Lab/actions/runs/43621890671
- Code: https://github.com/ironangelo/Nephalem-Lab/blob/research/deathwish-kadala-drop/research/deathwish-original-photo-scan.mjs

This is **NOT** evidence that the user mistyped stats or that the true item has no seed. It invalidates this particular numerical model for direct original-loot inversion.

## Comparing cheap source-seed recovery operations

**Convert Set Item** is unavailable: Deathwish is not part of a set.

**Sanctify via Angelic Crucible** yields maximal numeric stats and therefore loses the numeric randomness essential to quick inverse recovery. For 120,000 simulated parent seeds, the experiment found only **4805 distinct selected-affix-family patterns**; many parent seeds share exactly the same visible families, so an isolated Sanctify result is **not a unique seed identifier**. Multiple observations might eventually identify a seed, but no practical validated algorithm/cost advantage has been demonstrated for this Deathwish yet.

**A normal Reforge Legendary** outputs a non-maximized power, an Intelligence roll, a two-roll damage family, other primary rolls and a secondary roll. Those independent numbers are strong seed constraints. Tested by a separate **full 2^32 synthetic experiment**:
- Take parent seed **8**, generate an actual simulated normal Deathwish R with hidden parent; output seed is **302004969** and normal displayed tooltip was recorded.
- Generate grouped-affix numerical hypotheses and exhaustively scan all possible 2^32 output seeds. Exactly **one** matched, **302004969**.
- Invert the six-draw MWC transform across all 2^32 parent seeds. Exactly **one** parent matched, **8**.
- Simulate full Reforge to verify correct quality, families and all values. **The exact original hidden seed 8 was recovered.**
- Experimental proof: https://github.com/ironangelo/Nephalem-Lab/actions/runs/43622045160

**The simulation proves the method can work on Deathwish; it does NOT certify that every real R gives a unique seed**, especially an Ancient or Primal output. The inverse code as currently tested is for **normal-quality outputs**; a real Ancient R would need a quality-aware version. The probability of normal R in reference model is ~90%.

## Best next step (proposed; not yet executed)

Apply **ONE Reforge Legendary (R)** to this unchanged Deathwish using **the same Wizard**, then stop and photograph **the full result** (entire damage interval, legendary power %, all primary and secondary numbers, any socket, item quality). Cost: **50 Forgotten Souls + 5 bounty materials from each of the five acts**. The item identity remains Deathwish. This first Reforge is our **seed-identification operation**, not necessarily the Primal-finishing step. It might itself yield a Primal by chance, but do not promise this.

Why not recommend S first? One Sanctify alone is unable to identify the parent seed reliably; R gives substantially more numerical constraints and its result remains an object in the recipe chain.

After receiving the real R screenshot, use \`research/deathwish-weapon-inversion.mjs\` and exhaustive MWC inverse to recover a unique parent/current seed if possible, then search \`R/S\` paths ending on a **natural Primal** with **325% power / max damage / cold-or-lightning / Damage% / CDR / elite% with ≤1 Mystic**. Optimize weighted materials AND number of steps (different objectives), confirm all state transitions against original D3Recipes Rust before asking the user to execute a route, and provide a checkable per-step visible-stat list. If resulting gear is Ancient or Primal and the normal scanner cannot solve it, extend the model rather than falsely reporting a seed.

The current screenshot has no evidence of a user Mystic reroll, but preserve any future reroll flags when comparing.


## ACTUAL REAL REFORGE VERIFIED AND SEEDS RECOVERED — 2026-11-14

The user completed exactly **one real Reforge Legendary** on the original unknown-drop Deathwish. Normal Deathwish photographed with 2111.9 DPS (not modeled), **+1096–1361 Fire Damage** (internally 1096 and 265), **715 Intelligence**, **701 Vitality**, **1.6% chance to Stun on Hit**, **18% Area Damage**, legendary power **253%**.

**Vital UI rounding discovery:** the game's displayed **1.6% Stun** actually rolled **1.56% (0.0156)**. The initial inverse demanded exact 0.016 and incorrectly returned zero candidates. An exhaustive partial-constraint diagnosis identified this mismatch. Inverting with correct displayed-decimal rounding across all 2^32 post-operation seeds found EXACTLY ONE candidate; a second exhaustive 2^32 predecessor search found exactly one source seed; full forward Reforge replay matched every affix and raw value.

- **Original drop persistent seed inferred: 1184690904**
- **One real R -> current normal Deathwish seed inferred: 46826983**
- Source quality normal, full output power 2.53, Int715, FireD(1096,265), Area .18, Vit701, Stun .0156.
- [Complete real inverse run](https://github.com/ironangelo/Nephalem-Lab/actions/runs/43628361826).
- [Independent original D3Recipes Rust validates exact same screenshot transition](https://github.com/ironangelo/Nephalem-Lab/actions/runs/43629140525).
- Photo: image-1794681598531.jpg, SHA-256: 95e7d55321599a4f4f34a919ea03f7886d8aa6935247cb251243775579b5dbb1 (binary image only in conversation).

The seeds are mathematical inference, not directly read from hardware. **Do not tell the user to repeat the initial 50-Forgotten-Soul Reforge.** The sword to modify now is specifically the 253% normal Deathwish whose modeled seed is 46826983.

## Natural Primal recipe comparison, from the current 253% sword

The Soulstone console Firebird Twister sword target: **325% legendary power**, high damage, +10% weapon Damage, +10% Cooldown Reduction, **+8% Damage vs Elites** (Primal max in reference), Cold or Lightning damage element (worth an extra Elemental Exposure stack), avoid Fear and Knockback on hit. A weapon has fixed Intelligence and elemental damage and two other primary slots. Thus a natural Primal with two desired offensive primary affixes can become perfect via a single legal Mystic reroll of Intelligence into the third. Ramaladni's Gift can add a socket separately without consuming a primary.

| Predicted operation sequence from seed 46826983 | Ops | R | S | Souls | Bounty each act | Element | Mystic |
| --- | ---: | ---: | ---: | ---: | ---: | --- | --- |
| SSSSSSSSRSSSSSSSSRSSRSR | 23 | 4 | 19 | 200 | 20 | Holy (not preferred) | INT -> +8% Elite |
| **SRRSSRSSSSSSSSSSSSSSSRR** | **23** | **5** | **18** | **250** | **25** | **Lightning** | INT -> +8% Elite |
| SRRSRRSSSSSSSSSRRR | 18 | 7 | 11 | 350 | 35 | Cold | INT -> +10% CDR |
| RSRRSSSRRSSSRRSSR | 17 | 8 | 9 | 400 | 40 | Lightning | INT -> +8% Elite |
| RRSRRRSRSSRSRSSR | 16 | 9 | 7 | 450 | 45 | Lightning | INT -> +10% CDR |

**These are not yet performed in the game.** The 23-operation 5R/18S result is a natural Primal Deathwish with 325% power, 1560–1940 Lightning damage, 1000 INT (Mystic to +8% Elite), +10% Damage, +10% CDR, 2.59% chance Slow on Hit, final seed inferred 1326569675. Original Rust confirmed each of the 23 operations and the original 253% Reforge. The original damage range number and final DPS are NOT themselves simulated; raw two-number damage affix is modeled. Other material routes remain simulation-based.

The resource trade-off matters: the lower-Souls preferred-element 5R/18S candidate saves 100 Souls vs the 7R/11S 18-step option but consumes 7 more Angelic Crucibles. The 200 Souls Holy route is cheaper in Souls but loses the desirable Cold/Lightning element (Soulstone says the extra 5% damage is helpful, not prioritized above other stats).

Exhaustively enumerated every path in three bounded grids: R <= 4 / S <= 30 (no strict Cold/Lightning hit), R <= 6 / S <= 18 (5R18S first strict), R <= 8 / S <= 12 (7R11S and 8R9S strict variants). [Reproducible exhaustive search](https://github.com/ironangelo/Nephalem-Lab/actions/runs/43628886291). These bounds do not prove absolute global optimality.

**Before recommending additional game operations:** choose and explicitly present a route with costs; after selection, provide checkable per-step complete stats and confirm each game screenshot. Never skip the Sanctify random orange-power caveat, and never treat sanctified quality as a natural Primal.

**Tablas exactas de todos los pasos (dos rutas, resultados, seeds):** [DEATHWISH_PRIMAL_CHECKPOINTS.md](research/DEATHWISH_PRIMAL_CHECKPOINTS.md), verificadas paso a paso por el Rust original. Solo la primera foto de Reforge es real; las secuencias finales son predicciones aún no jugadas.
