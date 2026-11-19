# Firebird's Pinions — drop + one real Reforge; unique seed; natural Primal route (19 Nov 2026)

> **CURRENT REAL STATE, Nintendo Switch 2, Wizard:** the SECOND screenshot after one normal R is **Firebird's Pinions NORMAL**, base Armor 672; INT500, fixed RCR8%, VIT478, Hydra12%, Fire Resistance144, Experience173. **No further in-game C/R/S has happened since that photo.** The R already spent 50 Forgotten Souls +5 bounty materials EACH ACT. The 7 future steps below are **PREDICTIONS** independent Rust+JS, NOT yet completed in game.

## Input images

- **Original DROP**: `image-1795120731825.jpg`, Firebird's Pinions NORMAL, base Armor **1055** (includes bonus Armor 386), INT **443**, AllRes **100**, bonus Armor **386**, Gold **33%**, Health Globe bonus **22751**, fixed Resource Cost Reduction **6%**.
- **AFTER ONE REAL R**: `image-1795120772810.jpg`, Firebird's Pinions NORMAL, base Armor **672**, INT **500**, VIT **478**, Fire Resist **144**, XP per kill **173**, fixed Resource Cost Reduction **8%** (orange/gold text), Hydra Damage **12%** (blue text).
- Crucial discovery: RCR6/8 is **a normal fixed primary affix**, not a separate legendary Power formula. The item has `formulas=[]`, `fixed_slot_groups=[Int,RCR]`, 2 primary picks and 2 secondary picks. BOTH RCR and INT must be supplied to seed inverse.
- Both photos are genuine observations. The original drop values are recorded as evidence but **were not falsely inverted using a hypothetical drop-generation stream**.

## Seed recovery

- Working engine: FNGarvin/d3recipes pinned revision `49fe28467db9ebbd096694d1408528b2c9ce5ea3`, Wizard console eligible. Every pair of original/current seeds is inferred through game model, not read from Switch memory.
- Generated 60 numerical hypotheses initially; **only 4 have the fixed affix IDs actually selected by the game** at level70 (INT id3807807131, RCR id2309440884). Numeric inversion MUST constrain fixed selection to highest eligible affix tier. First pass mistakenly used only Int %293 and dropped the true tier70 %85; corrected to include all hypotheses and the actual fixed-tier filter. Never repeat that bad shortcut.
- 2^32 complete POST-R seed sweep -> **87 candidate post-Reforge seeds**.
- 2^32 complete PRE-R seed sweep requiring normal quality and valid RNG draw counts5..12 -> **636 initial parent/child candidate links**.
- Replay each full Reforge including quality, six affix names, values and draw count6 -> **ONE valid parent/child pair**.
- **Seed inferred PRE-R:** `3757624277`.
- **Seed inferred CURRENT post-R:** `1184275071`.
- **Full replay**: INT500, RCR 8.0%, Hydra 12%, VIT478, XP173, FireRes144, quality normal, child seed1184275071, 6 RNG draws.
- [Full 2×2^32 inversions and exact JS replay](https://github.com/ironangelo/Nephalem-Lab/actions/runs/44612968165).
- [Original D3Recipes pinned Rust independent real R + proposed seven operations](https://github.com/ironangelo/Nephalem-Lab/actions/runs/44613607248). Rust confirmed the same exact precursor/current seeds, six lines and all seven Primal checkpoints.

## Soulstone target

Soulstone Firebird Twister Wizard gear: shoulders can be Aughild's Power or **Firebird's Pinions**; priority **INT, CDR, RCR and Life%/Vitality/Armor**, preferred **any secondary resistance**. Source: https://www.soulstone.gg/firebird-twister-wizard .

**Proposed final Primal NATURAL** (without Sanctify) with primary INT650, RCR8% **fixed**, VIT650 and Familiar Damage15%; secondary PhysicalResist210 + PickupRadius2. **ONE Mystic substitution after the very last R**: **+15% Familiar Damage → +8% Cooldown Reduction**. This yields all 4 preferred primaries INT650/RCR8%/VIT650/CDR8% and secondary PhysicalResist210.

## Recommended recipe, FROM ACTUAL post-R seed1184275071

`CCCRCRR` = C C C R C R R, **7 operations: 4 Convert Set Item + 3 Reforge**. **NO Angelic Crucibles**.

| # | Operation | Predicted output set item | Quality | Predicted seed | Key full affixes (game display) |
|---:|---|---|---|---:|---|
| 1 | **C** | **Firebird's Tarsi (Boots)** | Normal | `486954581` | INT460, VIT484, Energy Twister14%, Armor+394, XP183, Gold32% |
| 2 | C | Firebird's Eye (Source) | Normal | `3727573507` | INT706, Electrocute12%, VIT730, Max Arcane Power14, Gold34%; offhand's base Power fields are unmodeled/null |
| 3 | C | Firebird's Tarsi (Boots) | Normal | `1259110121` | INT483, VIT463, Ray of Frost13%, Armor+379, Health Globes23662, LightningRes156 |
| 4 | R | Firebird's Tarsi (Boots) | Normal | `1165012479` | INT440, VIT452, Wave of Force10%, Movement Speed10%, FireRes147, Thorns2654 |
| 5 | C | Firebird's Pinions (Shoulders) | Normal | `4207892437` | INT423, RCR6%, AllRes100, Armor+386, XP195, Pickup Radius2 |
| 6 | R | Firebird's Pinions (Shoulders) | Normal | `3729260236` | INT475, RCR7%, VIT419, AreaDamage16%, FireRes146, Thorns6927 |
| 7 | **R** | **Firebird's Pinions (Shoulders)** | **PRIMAL ANCIENT NATURAL** | `1779143368` | INT650, RCR8%, VIT650, Familiar Damage15%, PhysicalRes210, Pickup Radius2 |

**Future material cost:**
- 4×C × 10 Forgotten Souls = 40 Souls; 4×C ×10 Death's Breaths = **40 DB**.
- 3×R × 50 Forgotten Souls = 150 Souls; 3×R ×5 materials per Act = **15 each Act's contract materials**.
- **TOTAL 190 additional Forgotten Souls, 40 Death's Breaths, 15 of EACH Act material, 0 Crucibles**; plus variable Myriam gold/materials. These totals do **not** include the single R already done to create the pictured item (+50 Souls/+5 bounty mats each Act).
- Quality final MUST be PRIMAL natural produced by last Reforge; one can keep it after season ends.
- In-game state after user photo is STILL normal Pinions after the INITIAL diagnostic R, i.e. future step #1 has NOT been done.

**SAFEST NEXT STEP:** only on these normal Pinions with INT500/RCR8/VIT478/Hydra12/FireRes144/XP173, apply **ONE Convert Set Item** (10 Souls +10 Death's Breaths). Predicted result **Firebird's Tarsi** INT460/VIT484/Twister14%/Armor394/XP183/Gold32%. **STOP and compare screenshot**, do not blindly do step#2. If step1 differs, model state is invalidated; pause.

## Budget search limits / alternatives

- `cheap`: <=100 Souls, <=2 Crucibles, <=20 DB: no solution for tested Soulstone 4 primaries.
- `balanced`: <=150 Souls, <=3 Crucibles, <=50 DB: no solution among explored options (complete within configured 22 steps).
- `no_crucibles`: <=350 Souls, **0 Crucibles**: cheapest observed qualifying VIT+resist route **190 Souls** `CCCRCRR` in enumerated budget.
- `no_crucibles` Life+resist version uses `CCRRCCCCRRCCR`, 330 Souls, 0 S, Familiar→Life Mystic.
- Other budgets including Crucibles and no Mystic were searched separately; results may be computationally bounded. **Do not claim global optimality outside enumerated budgets**.

This experiment is reproducible using `research/pinions-real-*` scripts on this research branch. User must verify actual first Convert in Switch before extending the route.
