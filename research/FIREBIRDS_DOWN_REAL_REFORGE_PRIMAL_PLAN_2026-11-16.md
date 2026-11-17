# Firebird's Down — REAL Reforge seed recovered, 16 November 2026

> **FINAL STATE CONFIRMED ON NINTENDO SWITCH 2 (16-11-2026): FIREBIRD'S DOWN NATURAL PRIMAL ANCIENT OBTAINED.** User sent photo `image-1794877351236.jpg` matching exactly all predicted final affixes for route `CCRSCCSSCR`. **DO NOT REFORGE, CONVERT OR SANCTIFY.** One Mystic enchant only remains pending: Magic Missile +15% → Armor bonus +775. The OTHER Firebird's Down is Sanctified and was not used.

## FINAL REAL NINTENDO SWITCH 2 CONFIRMATION — 16 November 2026

**User says "Listo!!!" and supplies screenshot** `image-1794877351236.jpg` displaying the second **Firebird's Down as red-bordered NATURAL PRIMAL ANCIENT**, with the exact final output predicted by independent Rust and JS:

| Property | Predicted after final R | Console screenshot |
|---|---:|---:|
| Quality | Natural Primal Ancient, not Sanctified | Red Primal border, no orange Sanctify power; confirmed |
| Base Armor headline | Not predicted by item stat engine | **759 Armor** |
| Intelligence | 650 | **+650** |
| Vitality | 650 | **+650** |
| Sockets | 2 | **2** |
| Magic Missile Damage | +15% | **+15% (Wizard Only)** |
| Lightning resistance | +210 | **+210** |
| Pickup radius | +2 yards | **+2 yards** |
| Additional flat Armor affix | NOT on natural item until Mystic | Not present — Mystic still pending |

**Final seed predicted** `2401341781` (model-derived, not read from Switch). The complete recipe `CCRSCCSSCR` (5 Convert Set, 2 Reforge, 3 Angelic Crucibles) is now **confirmed as reaching the predicted final item** on this console, although individual intermediate steps were not separately photographed and cannot be claimed independently verified. Incremental cost since diagnostic Reforge: 150 Forgotten Souls, 50 Death's Breaths, 3 Crucibles, 10 Bounty Materials **of each act**, plus variable Mystic future cost. Already paid earlier: 50 Forgotten Souls +5 bounty materials per act for the real diagnostic Reforge. Total R/C material spent along experiment: 200 Souls, 50 Death's Breaths, 15 materials per act, 3 Crucibles.

**IMMEDIATE NEXT STEP:** in Myriam, select ONLY +15% Magic Missile Damage and check list of available enchants. Seek **+775 bonus Armor**, preserving INT650, VIT650, sockets2, lightning resistance210 and +2 pickup radius. Since there is currently no enchant icon on Magic Missile, first Mystic has not been confirmed. No further cube operations. The number **759 Armor** printed in the headline is BASE Armor and is **NOT** the same as the +775 Armor affix expected from Mystic.

**Prior warning superseded:** The historical sections below referring to first Convert as *future* are retained only as experiment history. **ALL R/S/C STEPS HAVE NOW BEEN COMPLETED per user's final photo, so NEVER instruct re-running #1 C.**

---

## Real object photos and unique stored seed

- Second drop original, photo `image-1794851878566.jpg`: **Firebird's Down (normal)**, base Armor685, INT422, ResistAll96, 2 sockets, Spectral Blade15%, pickup radius1, required level -28.
- User explicitly applied **one real R (Reforge Legendary)**; photo `image-1794870171830.jpg` shows **Firebird's Down NORMAL**, base Armor **675**, INT **+460**, ResistAll **+93**, **+14% Spectral Blade Damage (Wizard Only)**, **+33% Gold from Monsters**, **+2748 Thorns Damage**, **Sockets (2)**, no Mystic.
- Numerical inversion: for full 2^32 post-reforge seed space, 4 internal affix-order hypotheses, **1,753 numeric candidates**. Second full 2^32 predecessor scan with normal quality, draw counts 5–9, then exact JS engine replay (including all six affixes, quality, five stat numbers, 6 RNG draws): **one matched parent/child pair**:
  - **Seed BEFORE real R (inferred):** `2538758317`.
  - **Seed NOW after real R (inferred):** `1745067528`.
- The base 675 Armor was NOT numerically used for inversion (the engine's item-value model only knows how to advance the armor RNG, not display armor base); it is an extra observation in the photo.
- [Exhaustive 2×2^32 seed scans and exact replay](https://github.com/ironangelo/Nephalem-Lab/actions/runs/43976563249).
- **Independent original D3Recipes Rust test** verified that `R(2538758317)` yields **normal Firebird's Down**, stored child seed `1745067528`, and precisely INT460 / ResistAll93 / SpectralBlade14% / Gold33% / Thorns2748 / sockets2. [Rust verification CI](https://github.com/ironangelo/Nephalem-Lab/actions/runs/43977131587).
- Unlike failed first Firebird drop inference from tooltip alone, this seed was identified by **a real cube transformation**. No seed was actually read from Switch memory; a future checkpoint remains valuable.

## Exact goal: Soulstone console Firebird Twister

**Natural Primal Ancient Firebird's Down**, INT **650** and **2 sockets** as fixed primary affixes, **Vitality650** and **bonus Armor775** (primal values). Prefer a resist secondary **+210**. Allow **ONE** Mystic change (e.g. replace +15% Magic Missile Damage with +775 bonus Armor) if cheaper. This is NOT the same as base armor shown in large numerals on the tooltip.

## Comprehensive material-constrained search

Source: [budgeted exhaustive path search](https://github.com/ironangelo/Nephalem-Lab/actions/runs/43977589955), exploring **all** simulator R/C/S sequences with **up to 150 ADDITIONAL Souls, up to 10 Converts, 3 R, <=18 operations**, separately for 0–5 Crucibles (the search is exhaustive **within these limits only**, not proof of global optimum).

- Within **150 incremental Souls** and **0, 1 or 2 Crucibles**, **NO qualifying Primal path found**.
- Within **150 Souls and 3 Crucibles**, FIRST valid solution `CCRSCCSSCR` with Mystic and secondary LightningResist. At 4 Crucibles, no cheaper Souls path was found.
- At **5 Crucibles**, minimum incremental Souls seen **130** but missing a resist secondary; **140 Souls** has Mystic+PoisonResist; both cost extra Crucibles.

Other weighted searches [GitHub Actions](https://github.com/ironangelo/Nephalem-Lab/actions/runs/43977039697) found a natural primal path without Mystic at 210 Souls/2 Crucibles and a no-Crucibles exact+resist path at 410 Souls, among other alternatives. All are model routes; do not call them guaranteed without real console checkpoints.

### Comparison of useful paths *after the real Reforge*

| Tier | Sequence | Operations | Future Souls | Crucibles | Death's Breaths | Act materials EACH | Mystic |
| --- | --- | ---: | ---: | ---: | ---: | ---: | --- |
| **Recommended: balanced scarcity + resist** | **`CCRSCCSSCR`** | **10** | **150** | **3** | **50** | **10** | Magic Missile +15% → bonus Armor +775 |
| Least Souls with resist found (costs Crucibles) | `SCCSSSCSCRR` | 11 | 140 | 5 | 40 | 10 | Magic Missile → Armor |
| All natural correct including resistance (NO Mystic) | `CCCRCSCCCSCCCCR` | 15 | 210 | 2 | 110 | 10 | None |
| Simpler recipe with no Convert (costs Crucibles) | `SRSSSRR` | 7 | 150 | 4 | 0 | 15 | Magic Missile → Armor |
| No Crucibles and no Mystic | `CCCCCRCCCCCCCRRCRCCCR` | 21 | 410 | 0 | 160 | 25 | None |

**Costs are incremental from the current R result**. Add the **already-spent 50 Souls +5 materials per act** if evaluating the entire journey from original drop. Myriam has a variable additional gold/material cost. The Primal final (when verified in-game) persists after the seasonal Sanctify expires, unlike the temporary Sanctified pants.

## RECOMMENDED checkpoint checklist: `CCRSCCSSCR`

Legend: **C** = Convert Set Item (10 Forgotten Souls +10 Death's Breaths); **R** = Reforge Legendary (50 Forgotten Souls +5 each Act material); **S** = Sanctify (one Angelic Crucible). Sequence has **5 C, 2 R, 3 S**. **UPDATE: All ten recipe operations are now completed; final screenshot confirms target outcome. The table is historical; DO NOT rerun.**

| # | Operation | Predicted resulting set item | Quality | Seed after step (inferred) | Stat clue for photo |
|---:|:---:|---|---|---:|---|
| **1** | **C** | **Firebird's Eye (off-hand)** | Normal | `2648514242` | **INT+642, CHC+8%, VIT+665, Max Arcane Power+13, chance stun2.02%** |
| 2 | C | Firebird's Talons (gloves) | Normal | `4202810852` | INT679, CHC10%, VIT712, CHD35%, arcane resist150, ignores durability |
| 3 | R | Firebird's Talons (gloves) | Normal | `1466218289` | INT648, CHC9.5%, VIT729, Armor bonus390, Gold35% |
| 4 | S | Firebird's Talons (gloves) | Sanctified | `2654180210` | INT1000, CHC10%, Life Regen10000, Life on Hit11975, Fire Resist210 |
| 5 | C | Firebird's Breast (chest) | Normal | `4274821460` | INT432, VIT472, Hydra damage11%, Cold Resist146 |
| 6 | C | Firebird's Eye (off-hand) | Normal | `2292793406` | INT719, Familiar damage11%, Arcane Power on Crit3 |
| 7 | S | Firebird's Eye | Sanctified | `1266208927` | INT1000, CDR8%, Area Damage20%, max AP14 |
| 8 | S | Firebird's Eye | Sanctified | `3471221756` | INT1000, Life15%, Shock Pulse15%, Gold35% |
| 9 | C | Firebird's Down (pants) | Normal | `547484550` | INT429, Shock Pulse15%, VIT492, Physical Resist146 |
| **10** | **R** | **Firebird's Down (pants)** | **Natural Primal Ancient** | **`2401341781`** | **INT650, 2 sockets, VIT650, Lightning Resist210, Magic Missile damage15%** |

After final #10, **Myriam**: replace the *natural +15% Magic Missile skill damage primary* with **+775 bonus Armor**. Do NOT replace VIT, the resistance, sockets, INT. Check Myriam possible replacements and take Armor. Final goal matches Soulstone after Mystic. Do not apply Myriam before #10.

**Independent verification:** [Original Rust D3Recipes and JS each reproduce all 10 checkpoints and final natural Primal quality](https://github.com/ironangelo/Nephalem-Lab/actions/runs/43977902582). **Final checkpoint is CONFIRMED by the user's in-game screenshot, though each intermediate checkpoint is not separately photographed.**

**Important caveat for real game:** Converted Set recipe is designed to produce non-Ancient new pieces; it can remove Sanctified status from an input set item according to player reports (https://us.forums.blizzard.com/en/d3/t/sanctified-armor/54473). Some intermediate states use S→C; make sure the Cube actually accepts the item on Switch 2. If at any point the Cube rejects a recipe, or output differs, **stop**; do not continue blindly. Predicted seed is an internal inferred number, not visible on console. Prioritize the item NAME and exact stat lines as checkmarks.

## HISTORICAL NEXT ACTION (OBSOLETE — DO NOT FOLLOW)

- **DO NOT touch the other Firebird's Down with PERFECT Sanctify.**
- On only THIS second normal `Firebird's Down` (675 Armor, INT460) do **ONE** Convert Set Item (`C`). Cost 10 Souls, 10 Death's Breaths.
- It **should** become **Firebird's Eye** with INT642 / CHC8% / VIT665 / MaxArcanePower13 / stun2.02% (some stats shown below tooltip).
- **STOP and photograph** the result before proceeding with step2. If it doesn't match, do not continue; re-evaluate seed model.
- If player lacks 150 Future Souls and 3 Crucibles, do not spend further simply to validate the model; save and farm first.

