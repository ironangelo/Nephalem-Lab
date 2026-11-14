# CONTINUITY — Nephalem Lab / Diablo III console seed research

**Authoritative research handoff. Last updated 2026-11-14.**  
**Owner:** ironangelo/Nephalem-Lab · **Platform:** Diablo III on Nintendo Switch 2 (user observations) · **Hero:** Wizard.  
**Status:** active experimental reverse engineering; **not** a finished universal seed cracker.  
**Scope of this document:** facts, reproducible work, links and next actions. **No application or APK changes were made as part of the documentation work.**

> **On resuming this project, READ THIS FILE FIRST, then the research documents linked below. Never substitute a model result for a real Switch 2 observation. When comparing any item screenshots, preserve exact primary/secondary affixes, numeric amounts, sockets, source item, quality, and operation order.**

## Navigation — source of truth

- [COE_AND_FIREBIRD_EXPERIMENTS.md](research/COE_AND_FIREBIRD_EXPERIMENTS.md) — real CoE and Firebird observations, every known seed, independent reference tests and evidence status.
- [SEED_MODEL_AND_DROP_RECOVERY.md](research/SEED_MODEL_AND_DROP_RECOVERY.md) — MWC formula, drop-vs-reforge problem, exhaustive inverse methods, sanctification semantics, what remains unproven.
- [FIREBIRD_SOULSTONE_ROUTE.md](research/FIREBIRD_SOULSTONE_ROUTE.md) — exact 12-operation Soulstone Primal route, all seeds and visible affixes at each checkpoint, alternative routes, costs, and stop rules.
- [EXPERIMENT_VECTORS_2026-11-14.json](research/EXPERIMENT_VECTORS_2026-11-14.json) — machine-readable CoE/Firebird screenshots as transcribed vectors, exact seed transitions, evidence qualifiers and SHA-256 checksums for the two most recent uploaded photographs. **Original binary images have not been uploaded to GitHub**; the checksums identify the originals in the conversation, not copies hosted in the repository.
- [Earlier Firebird A/B/C diagnosis](https://github.com/ironangelo/Nephalem-Lab/blob/research/firebird-childseed-preimage/research/FIREBIRD_THREE_STATE_DIAGNOSIS.md).
- Upstream D3Recipes [fixed revision 49fe284](https://github.com/FNGarvin/d3recipes/commit/49fe28467db9ebbd096694d1408528b2c9ce5ea3) (credit and reuse conditions in [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md)).

## Most important findings

1. **The MWC generator and actual Reforge transitions were independently reproduced** by Nephalem Lab and upstream D3Recipes Rust. On a stored 32-bit seed, the simulator starts with upper state 666 and applies a multiplicative-with-carry 64-bit transition. The precise draw count depends on item, quality and operation.
2. **CoE (2026-11-13):** original 190% CoE -> 156% after a real Reforge -> 165% after another real Reforge. The calculated CoE seed transition 3035692732 -> 4015360194 reproduced the latter result; the continuation \`RSSRSSSSSRR\` and final primal seed 2122496372 are maintained as simulation/regression vectors, **not automatically verified by the console**.
3. **Firebird's Breast (2026-11-14):** originally dropped 416 INT / 668 Armor, then real normal Reforge to 456 INT / 752 Armor, then real normal Reforge to 443 INT / 738 Armor. Reverse engineering yields modeled seed chain \`3525123180 --R--> 2645309652 --R--> 3835143639\`. All affixes and numeric stats of both Reforge results match in upstream Rust and JS. The seeds remain **inferred**, not read from Switch memory.
4. **One-Reforge recovery works on this real Firebird case:** invert the **result**'s numerical tooltip over all allowed affix orders (24 compatible child seeds), invert six RNG draws (25 parent preimages), run actual full Reforge on each, retain only one complete match: parent \`3525123180\`. Initial dropped-item stats are *not* required to accomplish that inference. Generalizing to every item is unproven.
5. **Drop generation is still an open research problem:** the starting 416 INT object's numeric affixes do not match \`values(item,3525123180)\`. A full 2^32 search over possible upper 32 bits under 7 model variants found multiple states matching the photographed original values and selection families; it did **not** uniquely determine a real-world Kadala/Rift drop formula.
6. **Season 40 Sanctify:** D3Recipes models an Angelic Crucible's power as replacing the final secondary affix when six affixes were rolled. The displayed bonus thus disappears, and the stored child seed is one RNG draw earlier. The random orange sanctified power itself is not predicted. The user's **first real Crucible** confirmed exactly the predicted *visible* INT 650 / VIT 650 / Poison Resist 210 / Blizzard +15% / 3 sockets; expected +260 XP/kill was not visible because the new Arcane Orb power replaced it.
7. **Natural Primal route:** from the 443 INT chest modeled seed \`3835143639\`, a 12-step route \`SSSSCSSCCSSR\` produces a natural Firebird's Breast Primal (not sanctified) with INT 650 / VIT 650 / Life +15% / Fire Resist 210 / Health Globes +38,625 / 3 sockets. Mystic may replace the Health Globes secondary with melee damage reduction. Upstream Rust matches **all 12 item IDs, child seeds and affix families**. This is a modeled route; real execution must be corroborated one step at a time.
8. **Latest user image (2026-11-14):** the pictured Firebird's Breast tooltip has **759 Armor**, INT +650, VIT +650, Life +15%, Fire Resistance +210, Life from Health Potions/Globes +38,625 and Sockets (3). This is **exactly the visible stat combination predicted for the final Primal in the 12-step route**. User replied that it worked. The cropped screenshot by itself does **not** establish which intermediate steps were executed, the internal seed, nor an explicit quality-label confirmation: record as **strong matching visible evidence / user-reported success**, not an independently read seed. In particular it is *not* the predicted second Sanctify tooltip (Hydra +15%, all resist +130, pickup +2).

## Current research checkpoints

| Checkpoint | State | Claim strength |
|---|---|---|
| CoE original 190 -> 156 -> 165 | Real screenshots/user and existing sample/test | Two actual Reforges; later simulated Primal route not thereby confirmed |
| Firebird A 416 -> B 456 -> C 443 | Photographed observations | Two actual Reforges |
| Modeled Firebird chain 3525123180 -> 2645309652 -> 3835143639 | JS, official Rust, exhaustive inverse | Strong **inference**; hidden seeds not directly read |
| Start of natural-Primal recipe: Sanctify #1 | Real screenshot matches modeled visible affixes | **In-game verified visible result** |
| Final 650/650/+15% Life/+210 Fire/+38625 Globes/3 sockets | Latest screenshot exact stat match, user says worked | **Matching in-game screenshot**, unclear precise intermediate route |
| Universal drop seed from one tooltip | No general formula | **Unsolved** |
| Absolute cheapest route over all material-value preferences | Search bounded / weighted | **Not proved globally optimal** |

## Resume instructions

- **First determine what happened after the first real Sanctify.** The newest screenshot displays the *predicted final Primal affixes*, not the second Sanctify affixes. Do not silently assume the user carried out every intermediate operation, or tell them to restart the 12-step path.
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
