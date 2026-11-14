# CONTINUITY — Nephalem Lab / Diablo III console seed research

> **Versión de continuidad en español:** [CONTINUIDAD_ES.md](CONTINUIDAD_ES.md).

**Authoritative research handoff. Last updated 2026-11-14 — complete Primal route confirmed by user on Switch 2.**  
**Owner:** ironangelo/Nephalem-Lab · **Platform:** Diablo III on Nintendo Switch 2 (user observations) · **Hero:** Wizard.  
**Status:** active experimental reverse engineering; **not** a finished universal seed cracker.  
**Scope of this document:** facts, reproducible work, links and next actions. **No application or APK changes were made as part of the documentation work.**

> **On resuming this project, READ THIS FILE FIRST, then the research documents linked below. Never substitute a model result for a real Switch 2 observation. When comparing any item screenshots, preserve exact primary/secondary affixes, numeric amounts, sockets, source item, quality, and operation order.**

## Navigation — source of truth

- [COE_AND_FIREBIRD_EXPERIMENTS.md](research/COE_AND_FIREBIRD_EXPERIMENTS.md) — real CoE and Firebird observations, every known seed, independent reference tests and evidence status.
- [SEED_MODEL_AND_DROP_RECOVERY.md](research/SEED_MODEL_AND_DROP_RECOVERY.md) — MWC formula, drop-vs-reforge problem, exhaustive inverse methods, sanctification semantics, what remains unproven.
- [FIREBIRD_SOULSTONE_ROUTE.md](research/FIREBIRD_SOULSTONE_ROUTE.md) — exact 12-operation Soulstone Primal route, all seeds and visible affixes at each checkpoint, alternative routes, costs, and stop rules.
- [EXPERIMENT_VECTORS_2026-11-14.json](research/EXPERIMENT_VECTORS_2026-11-14.json) — machine-readable CoE/Firebird screenshots as transcribed vectors, exact seed transitions, evidence qualifiers and SHA-256 checksums for all six relevant Firebird screenshot files. **Original binary images have not been uploaded to GitHub**; the checksums identify the originals in the conversation, not copies hosted in the repository.
- [Earlier Firebird A/B/C diagnosis](https://github.com/ironangelo/Nephalem-Lab/blob/research/firebird-childseed-preimage/research/FIREBIRD_THREE_STATE_DIAGNOSIS.md).
- Upstream D3Recipes [fixed revision 49fe284](https://github.com/FNGarvin/d3recipes/commit/49fe28467db9ebbd096694d1408528b2c9ce5ea3) (credit and reuse conditions in [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md)).

## Most important findings

1. **The MWC generator and actual Reforge transitions were independently reproduced** by Nephalem Lab and upstream D3Recipes Rust. On a stored 32-bit seed, the simulator starts with upper state 666 and applies a multiplicative-with-carry 64-bit transition. The precise draw count depends on item, quality and operation.
2. **CoE (2026-11-13):** original 190% CoE -> 156% after a real Reforge -> 165% after another real Reforge. The calculated CoE seed transition 3035692732 -> 4015360194 reproduced the latter result; the continuation \`RSSRSSSSSRR\` and final primal seed 2122496372 are maintained as simulation/regression vectors, **not automatically verified by the console**.
3. **Firebird's Breast (2026-11-14):** originally dropped 416 INT / 668 Armor, then real normal Reforge to 456 INT / 752 Armor, then real normal Reforge to 443 INT / 738 Armor. Reverse engineering yields modeled seed chain \`3525123180 --R--> 2645309652 --R--> 3835143639\`. All affixes and numeric stats of both Reforge results match in upstream Rust and JS. The seeds remain **inferred**, not read from Switch memory.
4. **One-Reforge recovery works on this real Firebird case:** invert the **result**'s numerical tooltip over all allowed affix orders (24 compatible child seeds), invert six RNG draws (25 parent preimages), run actual full Reforge on each, retain only one complete match: parent \`3525123180\`. Initial dropped-item stats are *not* required to accomplish that inference. Generalizing to every item is unproven.
5. **Drop generation is still an open research problem:** the starting 416 INT object's numeric affixes do not match \`values(item,3525123180)\`. A full 2^32 search over possible upper 32 bits under 7 model variants found multiple states matching the photographed original values and selection families; it did **not** uniquely determine a real-world Kadala/Rift drop formula.
6. **Season 40 Sanctify:** D3Recipes models an Angelic Crucible's power as replacing the final secondary affix when six affixes were rolled. The displayed bonus thus disappears, and the stored child seed is one RNG draw earlier. The random orange sanctified power itself is not predicted. The user's **first real Crucible** confirmed exactly the predicted *visible* INT 650 / VIT 650 / Poison Resist 210 / Blizzard +15% / 3 sockets; expected +260 XP/kill was not visible because the new Arcane Orb power replaced it.
7. **Natural Primal route:** from the 443 INT chest modeled seed \`3835143639\`, a 12-step route \`SSSSCSSCCSSR\` produces a natural Firebird's Breast Primal (not sanctified) with INT 650 / VIT 650 / Life +15% / Fire Resist 210 / Health Globes +38,625 / 3 sockets. Mystic may replace the Health Globes secondary with melee damage reduction. Upstream Rust matches **all 12 item IDs, child seeds and affix families**. **USER CONFIRMED COMPLETE REAL EXECUTION** of the exact 12-operation `SSSSCSSCCSSR` sequence, with the photographed final item matching every predicted visible affix. Intermediate steps were not separately photographed in this record; inferred seeds were not memory-read.
8. **Latest user image (2026-11-14):** the pictured Firebird's Breast tooltip has **759 Armor**, INT +650, VIT +650, Life +15%, Fire Resistance +210, Life from Health Potions/Globes +38,625 and Sockets (3). This is **exactly the visible stat combination predicted for the final Primal in the 12-step route**. After the screenshot, the user was asked explicitly whether it was obtained **immediately after the twelfth/last operation** of `SSSSCSSCCSSR`. They replied: **«Sí, exactamente al terminar el último paso»**. Accordingly the **full 12-op sequence is a user-confirmed real-world execution** and the pictured final tooltip is an exact visible-affix match. The cropped photograph alone does not display a fully legible quality label, each intermediate tooltip was not photographed separately, and the hidden seeds were never directly read. In particular it is *not* the predicted second Sanctify tooltip (Hydra +15%, all resist +130, pickup +2).

## Current research checkpoints

| Checkpoint | State | Claim strength |
|---|---|---|
| CoE original 190 -> 156 -> 165 | Real screenshots/user and existing sample/test | Two actual Reforges; later simulated Primal route not thereby confirmed |
| Firebird A 416 -> B 456 -> C 443 | Photographed observations | Two actual Reforges |
| Modeled Firebird chain 3525123180 -> 2645309652 -> 3835143639 | JS, official Rust, exhaustive inverse | Strong **inference**; hidden seeds not directly read |
| Start of natural-Primal recipe: Sanctify #1 | Real screenshot matches modeled visible affixes | **In-game verified visible result** |
| Full 12-step `SSSSCSSCCSSR` and final 650/650/+15% Life/+210 Fire/+38625 Globes/3 sockets | User explicitly confirmed executing all 12 steps and photographing the result immediately after the last; screenshot exact visible-affix match | **End-to-end console success (user confirmed)**; hidden seeds still inferred and intermediate tooltips not all photographed |
| Universal drop seed from one tooltip | No general formula | **Unsolved** |
| Absolute cheapest route over all material-value preferences | Search bounded / weighted | **Not proved globally optimal** |

## Resume instructions

- **The user explicitly confirmed completing the full `SSSSCSSCCSSR` route.** The latest screenshot shows the predicted final item, not the second Sanctify. **Do not restart or repeat any part of the route.** The next optional action is the final Mystic reroll of the Health Potions/Globes secondary.
- If the item is already the desired Primal, **do not suggest another Cube operation**. The remaining intended Mystic modification is Health Potions/Globes +38,625 -> reduced melee damage; Mystic rolls and the item's actual quality must be checked on-screen first.
- If a checkpoint fails, **stop the chain immediately**. Compare the exact item, normal/ancient/primal/sanctified status, full visible affixes (including the missing secondary replaced by sanctified power), result item after C, and screenshot.
- Preserve all observations, even those that are not explained by the chosen inverse formula. Do not invent a seed, do not claim 668/752/738/759 base Armor was simulated, and do not force the dropped A's visible values into a Reforge-generation formula.
- No APK work unless explicitly asked. Prefer isolated research branches and original D3Recipes Rust cross-checks, keep recorded operations and materials separate from simulated paths.

## Key runs (GitHub Actions)

- [Real CoE regression test](tests/engine.test.mjs) (contains seeded 156 -> 165 and simulated natural-Primal continuation).
- [Firebird first two Reforges in official Rust](https://github.com/ironangelo/Nephalem-Lab/actions/runs/43560278798)
- [Full six-draw MWC inverse on 2^32 parents](https://github.com/ironangelo/Nephalem-Lab/actions/runs/43560027262)
- [One observed B result -> uniquely inferred A seed](https://github.com/ironangelo/Nephalem-Lab/actions/runs/43563886534)
- [Full 2^32 upper-state/7-model drop search](https://github.com/ironangelo/Nephalem-Lab/actions/runs/43563626496)
- [12-step natural-Primal route with **all 12 transitions matching upstream Rust**](https://github.com/ironangelo/Nephalem-Lab/actions/runs/43608386485)
- [Breadth-first enumeration of up-to-12-step Soulstone routes](https://github.com/ironangelo/Nephalem-Lab/actions/runs/43608812537)

## Branches containing research scripts

- [research/firebird-456-to-443](https://github.com/ironangelo/Nephalem-Lab/tree/research/firebird-456-to-443)
- [research/firebird-permutation-recovery](https://github.com/ironangelo/Nephalem-Lab/tree/research/firebird-permutation-recovery)
- [research/firebird-childseed-preimage](https://github.com/ironangelo/Nephalem-Lab/tree/research/firebird-childseed-preimage)
- [research/drop-seed-formula](https://github.com/ironangelo/Nephalem-Lab/tree/research/drop-seed-formula)
- [research/single-reforge-drop-recovery](https://github.com/ironangelo/Nephalem-Lab/tree/research/single-reforge-drop-recovery)
- [research/firebird-soulstone-primal-route](https://github.com/ironangelo/Nephalem-Lab/tree/research/firebird-soulstone-primal-route)

**Research principle:** clearly label observations vs model output vs inferred seed vs untested hypothesis. Keep everything reproducible. Preserve model revision, item ID, hero class, quality, initial seed, operation sequence, and full stats in every subsequent experiment.

## Second in-game Primal success — Kadala Firebird's Eye (2026-11-14)

The user took an untouched **Firebird's Eye obtained from Kadala** (346–425 base damage, fire +19%, INT705, VIT686, XP152, +11 max Arcane Power, Magic Missile +10%) and performed **one real Convert Set Item**, resulting in photographed normal **Firebird's Down** (Armor704, INT425, VIT490, Fire Resist148, Thorns2621, 2 sockets, Magic Missile10%). Exhaustive 32-bit inverse search yielded a **unique modeled predecessor**: original Eye seed `4016194486` --C--> current Down seed `930643368` ([run](https://github.com/ironangelo/Nephalem-Lab/actions/runs/43615140781)).

The user then **chose the low-Forgotten-Souls route `SSSSSRCSCR`**, modeled as six Sanctify, two Reforge and two Convert Set (120 Forgotten Souls, 20 Death's Breaths, 10 bounty materials per act, 6 Crucibles, Mystic extra). **On 2026-11-14 they reported “Funciono!! E hice el reroll stat con mystic!!”** and photographed the completed **red-border Primal Firebird's Eye**, exactly matching the modeled final post-Mystic affixes:

- +20% fire skill damage;
- +1000 Intelligence;
- **+10.0% critical-hit chance** with visible blue Mystic reroll indicator (modeled before reroll: Hydra damage +15%);
- critical hits grant **4 Arcane Power**;
- +35% gold from monsters;
- +14 maximum Arcane Power.

The displayed source damage **+485–600** is an observed screenshot property, **not numerically simulated** by D3Recipes. The final modeled hidden seed is `1980719662`; inferred, not memory-read. The individual ten step intermediate states were not independently photographed in this record, but the final photo and explicit success report establish a **second end-to-end console success** of the seed-recovery + planned-Primal-route approach. **Do not recommend any further Cube/Mystic operation on this finished item.**

[Detailed validated Firebird Eye research and route](research/FIREBIRD_EYE_KADALA_SEED_AND_ROUTES.md) · [machine-readable evidence and photo hash](research/EXPERIMENT_VECTORS_2026-11-14.json) · [independent upstream Rust verification](https://github.com/ironangelo/Nephalem-Lab/actions/runs/43615878705).
