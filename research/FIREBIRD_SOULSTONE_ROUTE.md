# Firebird's Breast -> Soulstone Primal: exact route and verification log

**Data version:** D3Recipes reference commit [49fe284](https://github.com/FNGarvin/d3recipes/commit/49fe28467db9ebbd096694d1408528b2c9ce5ea3), Wizard class, Season 40 Angelic Crucibles enabled, Primal eligibility assumed.  
**Target:** Firebird's Breast for Soulstone Firebird Twister; prefer INT + VIT + Life% + sockets with secondary elemental resist and melee/ranged reduction (one Mystic roll can replace one unwanted affix).  
**Source item:** photographed Firebird's Breast **C**, normal, INT 443, VIT 476, Life 11%, Poison Resist 149, Pickup Radius +1 yd, 3 sockets, Armor 738.  
**Source modeled seed:** \`3835143639\`; inferred from two real Reforges, not hardware-read.  
**Status: END-TO-END IN-GAME SUCCESS (user-confirmed 2026-11-14).** All 12 steps of `SSSSCSSCCSSR` were performed on Nintendo Switch 2, as the user confirmed when asked directly. Final screenshot **exactly matches all predicted visible affixes**. Model independently agrees between JS and upstream Rust on all 12 transitions. Intermediate steps were not independently photographed one by one, and hidden seeds were not memory-read.  

Read [CONTINUITY.md](../CONTINUITY.md) and [technical seed model](SEED_MODEL_AND_DROP_RECOVERY.md) for evidence limits.

## 1. Preferred route and estimated materials

    SSSSCSSCCSSR

Operation counts: **8 S**, **3 C**, **1 R** = **12 Cube operations** before any Mystic enchant.

| Cost | Total |
| --- | ---: |
| Angelic Crucibles | 8 |
| Forgotten Souls | 80 (50 from R + 3×10 from C) |
| Death's Breaths | 30 (3×10 from C) |
| Reforge bounty materials | 5 **of each act** |
| Mystic / enchant | additional, variable; not predicted |

This was the best weighted-material route **found within searched constraints** using relative weights R=9, S=1, C=3, **not** proven universally cheapest for every user-specific valuation of Crucibles and bounty materials. A separate breadth-first search found that 11 steps is the shortest among explored solutions to the exact objective, at much greater Reforge cost.

## 2. Full step-by-step CHECKPOINTS (model results)

**Use the "actually visible" column for real screenshots.** D3Recipes \`sanctify()\` may generate an internal last secondary but replaces it with the orange power, which is random and has no predicted identity. The "replaced" stat is deliberately **NOT** expected to appear in the game.

The **seed is hidden**, so it is the model-predicted next seed, not an on-screen stat. Values are full predicted affix rolls; displayed Armor (e.g. 759) is **not** computed in this model.

| # | Op. | Expected item | Quality | Expected **visible** numerical affixes excluding orange power | Replaced last secondary in S (not visible) | Next inferred seed |
| ---: | --- | --- | --- | --- | --- | ---: |
| 0 | — | Firebird's Breast | normal | INT **443**, VIT **476**, Life **11%**, Poison Resist **149**, Pickup **+1 yd**, Sockets **3** | — | **3835143639** |
| 1 | **S** | Firebird's Breast | sanctified | INT **650**, VIT **650**, Blizzard Damage **15%**, Poison Resist **210**, Sockets **3**, orange power | Experience **+260/kill** | **2170510334** |
| 2 | **S** | Firebird's Breast | sanctified | INT **650**, Hydra Damage **15%**, All Resist **130**, Pickup **+2 yd**, Sockets **3**, orange power | Experience **+260/kill** | **4278534881** |
| 3 | **S** | Firebird's Breast | sanctified | INT **650**, Hydra Damage **15%**, VIT **650**, Fire Resist **210**, Sockets **3**, orange power | Life from health globes **+38,625** | **2162753457** |
| 4 | **S** | Firebird's Breast | sanctified | INT **650**, Life **15%**, Blizzard Damage **15%**, Poison Resist **210**, Sockets **3**, orange power | Life per Kill **+7,725** | **4081551520** |
| 5 | **C** | **Firebird's Down (legs)** | normal | INT **472**, Electrocute Damage **12%**, All Resist **97**, Pickup **+1 yd**, Life per Kill **+5,831**, sockets affix | — | **1587946938** |
| 6 | **S** | Firebird's Down | sanctified | INT **650**, Electrocute Damage **15%**, VIT **650**, Poison Resist **210**, sockets affix, orange power | Experience **+260/kill** | **532024587** |
| 7 | **S** | Firebird's Down | sanctified | INT **650**, additional Armor affix **+775**, Magic Missile Damage **15%**, Poison Resist **210**, sockets affix, orange power | Pickup **+2 yd** | **2513811997** |
| 8 | **C** | **Firebird's Plume (head)** | normal | INT **747**, Disintegrate Damage **10%**, CHC **5.5%**, Fire Resist **146**, Experience **+145/kill**, sockets affix | — | **2056686315** |
| 9 | **C** | **Firebird's Breast (chest again)** | normal | INT **421**, VIT **488**, Familiar Damage **14%**, Life from Health Potions/Globes **+24,131**, Life per Kill **+4,561**, Sockets **3** | — | **3284081009** |
| 10 | **S** | Firebird's Breast | sanctified | INT **650**, VIT **650**, Black Hole Damage **15%**, Poison Resist **210**, Sockets **3**, orange power | Life from Health Potions/Globes **+38,625** | **1985892588** |
| 11 | **S** | Firebird's Breast | sanctified | INT **650**, Life **15%**, All Resist **130**, Extra Gold **35%**, Sockets **3**, orange power | Thorns **+9,500** | **3027404123** |
| 12 | **R** | **Firebird's Breast** | **natural Primal** | INT **650**, VIT **650**, Life **15%**, Fire Resist **210**, Life from Health Potions/Globes **+38,625**, Sockets **3** | None; **no orange sanctified power** | **1415768159** |

**Socket-count caveat:** the simulator tracks the presence of a socket affix on chest/legs/head but does not calculate the precise tooltip count for legs/head in this research output. Do not present "Sockets (3)" for the intermediate pants or head as an independent predicted count.

**Armor caveat:** the +775 on step 7 is a **rolled bonus-to-Armor affix** (\`DR\`), not the item's displayed total Armor. The displayed 759 Armor on real screenshots was not reproduced from \`Sim::values\`.

**Mystic after #12:** replace **+38,625 Life from Health Potions/Globes** with **melee damage taken reduced by up to 7%**. The target result should keep INT 650 / VIT 650 / Life +15% / 3 sockets / Fire Resist 210.

## 3. Validation log — Rust vs JavaScript

Complete original Rust replay: [run 43608386485](https://github.com/ironangelo/Nephalem-Lab/actions/runs/43608386485). Independent script branch: [firebird-soulstone-primal-route](https://github.com/ironangelo/Nephalem-Lab/tree/research/firebird-soulstone-primal-route).

- **All 12** expected item identities, op types, affix families and resulting child seeds matched between the official original D3Recipes Rust and Nephalem Lab JS.
- For intermediate \`S\`, the comparison must distinguish *internal selected affixes* and *displayed tooltip affixes*: the final picked secondary is replaced by the orange power and the child seed uses one fewer RNG draw.
- Exact final model \`Firebird's Breast / natural Primal / seed 1415768159\`, affixes:
  
      Int = 650
      Vit = 650
      Life = 0.15  [15%]
      FireResist = 210
      HealthGlobeBonus = 38625
      Sockets = 3  [item-specific displayed count]

- One actual user screenshot of step #1 has displayed INT 650 / VIT 650 / PoisonResist 210 / Blizzard 15% / Sockets 3 + Arcane Orb orange power. It omits XP 260, as required by the Sanctify replacement rule, **thus it is a verified visible-attribute match**.
- **Latest user screenshot (2026-11-14)** shows 759 displayed Armor, INT 650 / VIT 650 / Life 15% / FireResist 210 / HealthGlobeBonus 38,625 / Sockets 3. It is an **exact visible-stat match for the target model result**. **The user subsequently confirmed that they executed the entire `SSSSCSSCCSSR` route and took this photograph immediately after the last operation** (direct answer: «Sí, exactamente al terminar el último paso»). Therefore this is a **real, end-to-end confirmation of the route and final visible stats**, not merely an unperformed simulation. Caveats: intermediate screenshots are not individually available; the exact seeds were not read from console memory; the cropped final photo alone does not provide a fully legible textual quality label.

## 4. Other valid model routes (before Mystic)

Independent up-to-12-operation BFS: [run 43608812537](https://github.com/ironangelo/Nephalem-Lab/actions/runs/43608812537) found **five** routes meeting the modeled strict Soulstone goal.

| Sequence | Operations | R | S | C | Souls | DB | Bounty each act | Main consideration |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| **SSSSCSSCCSSR** | **12** | **1** | **8** | **3** | **80** | **30** | **5** | **Best weighted-material candidate found; recommended** |
| \`SSSRSSSSRRSR\` | 12 | 4 | 8 | 0 | 200 | 0 | 20 | Simpler item identity, more souls |
| \`RSRRCCSSRSCR\` | 12 | 5 | 4 | 3 | 280 | 30 | 25 | Four crucibles |
| \`SSRRRRSRSSR\` | **11** | 6 | 5 | 0 | 300 | 0 | 30 | Shortest steps, high bounty costs |
| \`CRSSRRCRRCR\` | **11** | 6 | 2 | 3 | 330 | 30 | 30 | Only two Crucibles, high bounty costs |

The shortest solution in that **bounded** search was **11 operations**. No solution with 10 or fewer operations met all strict goals in that run. Do not call the 12-step path the shortest, and do not call its heuristically weighted cost universally minimal.

Note: some comparisons may treat extra legendary / sanctified powers or Mystic eligibility differently across game updates. If the first real outcome diverges, stop and reassess.

## 5. How to resume safely

- **The 12-step sequence has already been completed and confirmed by the user. Do not repeat it or perform additional Sanctify/Convert/Reforge operations.** The final screenshot matches all the Primal target's visible stats. If a textual quality label is needed, verify separately; keep the original item intact.
- If the route is in progress, reconcile against the **exact next row**, including item identity after C. Record each real result before advancing.
- It is **expected** that the last internal secondary selected by \`S\` is absent; instead an orange seasonal power appears. Other affixes must still match.
- If all observed stats match and actual quality is confirmed natural Primal, the only remaining intended operation is optional **Mystic** to replace globes with melee reduction. Do **not** use Improve Legendary / Primalize on a natural Primal just to adjust its stats.
- If **anything** differs in quality, item, numerical affix selection, or displayed primary/secondary, do not apply the next recipe. Preserve the discrepancy for debugging, along with current photo.
