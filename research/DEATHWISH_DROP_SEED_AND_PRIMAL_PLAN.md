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
