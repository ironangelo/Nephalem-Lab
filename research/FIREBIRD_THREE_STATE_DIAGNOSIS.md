# Firebird's Breast: three-state seed reconstruction (research, 2026-11-14)

## Actual in-game evidence

All three screenshots depict a normal, 3-socket Firebird's Breast, and the user performed exactly one Reforge Legendary from A to B, then exactly one from B to C using the console.

| State | Tooltip values (all visible rolled affixes) | Base armor |
| --- | --- | --- |
| A (original) | 416 Intelligence; +10% Life; +198 Experience per Kill; +2 yards Gold/Health Pickup; +11% Explosive Blast damage; 3 sockets | 668 |
| B (after first R) | 456 Intelligence; 484 Vitality; 149 Lightning Resistance; 5366 Thorns; +13% Explosive Blast; 3 sockets | 752 |
| C (after second R) | 443 Intelligence; 476 Vitality; +11% Life; 149 Poison Resistance; +1 yard Pickup Radius; 3 sockets | 738 |

D3Recipes `Sim::values` does not output the displayed base armor, so 668 / 752 / 738 are not validated by these tests. Do not claim the armor values are mathematically verified.

## Positive reconstruction: both R results reproduce exactly

**Known chain under the original D3Recipes Rust engine and JavaScript port:**

```text
parent candidate seed 3525123180
    -- R on Firebird's Breast, Wizard, normal --> B, seed 2645309652
    -- R on Firebird's Breast, Wizard, normal --> C, seed 3835143639
```

Both operations reproduce the item identity, normal quality, chosen affix families and all numerical stat values from screenshots B and C. The independent Rust run was **success**:

https://github.com/ironangelo/Nephalem-Lab/actions/runs/43560278798

An independent **complete native C scan of all 2^32 possible seeds** finds **one** predecessor at exactly 6 MWC draws for B's candidate seed 2645309652, namely 3525123180. At 7 draws it finds two other numeric predecessors, but when simulated as an actual Reforge by a non-Wizard class neither yields the B tooltip. The 6-draw Wizard case does.

Native scanner:

https://github.com/ironangelo/Nephalem-Lab/actions/runs/43560027262

Independent candidate verification across all seven classes:

https://github.com/ironangelo/Nephalem-Lab/actions/runs/43560158300

## Failed reconstruction: original A numeric values

The inverse recovery method maps **visible roll values** onto the hypothetical seed passed to D3Recipes `Sim::values`, and then assumes this seed is also the object's **current Reforge input seed**.

For A, all 120 numerical-affix input orders reduce to 12 distinct hypotheses and 145,668 value-compatible seeds, none of which is 3525123180. Further:
- 131,531 of these seeds produce a normal item after a Wizard R;
- 95 produce the families of B's affixes;
- zero reproduce the exact B tooltip;
- zero of these seeds hit B's candidate current seed at any of the first 64 pure MWC draw indices;
- no class-specific Reforge from these candidates matches B.

In contrast, taking the independently inferred parent seed **3525123180**, an exhaustive check of A's 12 hypotheses finds **zero** matches. With the most favorable available assumed affix order, its simulated A values include Intelligence 440, Life 15%, Experience 200, Pickup Radius 1 and Explosive Blast 11%, NOT the photographed A values. This does NOT refute the user's screenshot. It falsifies the unqualified inference that `values(item, current_seed)` must explain any existing unmodified item.

Permutation analysis including A, B and C:

https://github.com/ironangelo/Nephalem-Lab/actions/runs/43559950255

## What is known vs uncertain

**Verified inside the model:** Both observed transitions B and C are reproduced by the original upstream Rust engine and the JS port from the same continuous seed chain. Exhaustive MWC inversion at six draws yields the single parent above.

**Not independently verified in the game:** The item's hidden seed was never read directly from console memory, so the chain remains a strongly supported inferred model, not a direct hardware read. The display armor has not been verified by the original source formulas.

**Not determined by evidence:** *Why* the starting A values fail the same `values(item,seed)` assumption. Possibilities include the item's original acquisition or generation path (e.g., world loot vs deterministic Cube model), a different original internal RNG state, a legacy data variant, or some hidden property not present in the screenshot. There is no evidence to select one exact mechanism as proven.

D3Recipes documents reliable recipes for controlled creation from a new seasonal hero; it does not promise an inverse function from arbitrary visible pre-existing gear.

## Product correction and safe path to the requested Primal

1. Never treat numeric value inversion of an arbitrary existing item as a certified item seed or erase saved observations because no such seed matches subsequent rolls.
2. Use the later observed **B → C transition** as a reconstruction anchor: enumerate possible current seeds for B from its numerical affixes under every valid internal affix ordering, then filter through the full predicted C Reforge. This yields B seed 2645309652 and therefore a modeled current C seed of 3835143639.
3. Record the upstream A observation as independently photographed historic evidence, but mark it *unreconciled with value-seed inversion*, not a reason to invalidate B → C.
4. Prior to proposing a costly R/C/S route, show a model-only prediction, the current seed, the selected exact target item and goals (with one Mystic substitution if permitted), and the full material costs. Never conflate a model-predicted Primal with an in-game guaranteed Primal.
5. Preserve all preexisting 36,435 candidate data and the screenshot history; never delete user data to work around the model inconsistency.
6. Do not publish an Android APK just to log this diagnosis. Validate end-to-end before any consolidated app release.

Research regression tests in this branch explicitly assert the two matching reforges **and** A's failed value inversion, to prevent a false claim of full three-image reconciliation.
