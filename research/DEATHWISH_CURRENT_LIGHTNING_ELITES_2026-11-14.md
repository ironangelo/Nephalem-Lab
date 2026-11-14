# Deathwish Primal actual → Primal natural de rayo con élites natural (14-11-2026)

> **INVESTIGACIÓN / NO EJECUTADA EN SWITCH.** Esta receta se calculó desde la seed final inferida `1326569675` del Deathwish Primal actual (al que ya se eligió INT como afijo de la Mística). No usar sin decidir antes si vale la pena arriesgar la pieza existente. **El primer Sanctify es un checkpoint obligatorio** porque desconocemos si los cambios de la Mística alteraron el estado persistente que maneja este modelo.

- Rama de investigación: `research/deathwish-current-seed-1326569675`.
- Punto inicial: Deathwish **Primal natural**, poder **325%**, rayo **1560–1940**, daño **10%**, INT **1000**, CDR **10%**, ralentizar al golpear **2,6%**; INT seleccionado en Mística para reroll, todavía sin +8% de élites.
- Seed **inferida**, no extraída de memoria de Switch: `1326569675`.
- Objetivo: otra Deathwish **Primal natural**, **+1560–1940 rayo**, **+10% Damage natural**, **+8% DamageVsElite natural**, poder **325%**, INT1000 reemplazable por **CDR 10%** en la Mística, sin secundarios Fear/Knockback.
- **Ruta calculada:** `SRSSSSSSRSSSSSSRSSSRSSSSRSSSSSR`.
- **Costo fijo:** 31 pasos = 6 Reforge `R` ×50 Souls = **300 Forgotten Souls** y **30 materiales de cada acto**; 25 Sanctify `S` = **25 Angelic Crucibles**. Mística adicional y posible Ramaladni adicional.
- **Seed final:** `2466891249`.
- **Resultado final (simulación):** Int=1000, LightningD=1560, LightningD=380, Damage=0.1, DamageVsElite=0.08, KillLife=11590; poder 325%; calidad primal (no santificada).
- **Verificación:** Javascript de Nephalem Lab y reproducción independiente **31/31 pasos** en Rust original de `FNGarvin/d3recipes` revisión `49fe28467db9ebbd096694d1408528b2c9ce5ea3`. [GitHub Actions de validación](https://github.com/ironangelo/Nephalem-Lab/actions/runs/43637619148).
- **Límite:** búsqueda ponderada acotada a 2,5 millones de estados por modalidad, no garantiza que ésta sea la ruta global más barata o corta. El cálculo de daño base (DPS) visible y el poder naranja aleatorio de Sanctify no están incluidos.

## Ruta paso a paso confirmada en simulación Rust

Leyenda: S = Sanctify (queda santificado); R = Reforge Legendary. El bonus naranja de S es aleatorio/no predicho. No se debe continuar si el objeto real difiere del checkpoint (excepto DPS total y redondeo UI).

| Paso | Op. | Calidad | Seed inferida resultante | Poder | Tipo daño | Afijos modelados con valores |
| ---: | :---: | --- | ---: | ---: | --- | --- |
| 1 | S | sanctified | `2103620810` | 325% | PoisonD | Int=1000, PoisonD=1560, PoisonD=380, Vit=1000, HitLife=23950, Experience=260 |
| 2 | R | normal | `3160641554` | 288% | ArcaneD | Int=633, ArcaneD=1021, ArcaneD=273, Damage=0.07, HitLife=15613, WeaponHitFear1h=0.0225 |
| 3 | S | sanctified | `2171870126` | 325% | ColdD | Int=1000, ColdD=1560, ColdD=380, HitLife=23950, ResourceCostReduction=0.1, WeaponHitBlind1h=0.0259 |
| 4 | S | sanctified | `4105046037` | 325% | MinMaxDam | Int=1000, MinMaxDam=1560, MinMaxDam=380, Haste=0.07, CooldownReduction=0.1, Experience=260 |
| 5 | S | sanctified | `3637972649` | 325% | ColdD | Int=1000, ColdD=1560, ColdD=380, Vit=1000, HitLife=23950, Experience=260 |
| 6 | S | sanctified | `4151157947` | 325% | HolyD | Int=1000, HolyD=1560, HolyD=380, Damage=0.1, SplashDamage=0.24, KillLife=11590 |
| 7 | S | sanctified | `1218695859` | 325% | PoisonD | Int=1000, PoisonD=1560, PoisonD=380, Vit=1000, Haste=0.07, WeaponHitKnockback1h=0.0259 |
| 8 | S | sanctified | `3319596702` | 325% | ArcaneD | Int=1000, ArcaneD=1560, ArcaneD=380, ResourceCostReduction=0.1, Haste=0.07, KillLife=11590 |
| 9 | R | normal | `400747878` | 276% | PoisonD | Int=682, PoisonD=1127, PoisonD=269, Vit=644, Haste=0.07, Experience=162 |
| 10 | S | sanctified | `2071698118` | 325% | ArcaneD | Int=1000, ArcaneD=1560, ArcaneD=380, Vit=1000, CooldownReduction=0.1, KillLife=11590 |
| 11 | S | sanctified | `2807853305` | 325% | LightningD | Int=1000, LightningD=1560, LightningD=380, Haste=0.07, Vit=1000, KillLife=11590 |
| 12 | S | sanctified | `891304674` | 325% | MinMaxDam | Int=1000, MinMaxDam=1560, MinMaxDam=380, BleedPercent=0.39, BleedPercent=4, BleedPercent=5, SplashDamage=0.24, Experience=260 |
| 13 | S | sanctified | `1966293928` | 325% | LightningD | Int=1000, LightningD=1560, LightningD=380, SplashDamage=0.24, Vit=1000, KillLife=11590 |
| 14 | S | sanctified | `2488741318` | 325% | MinMaxDam | Int=1000, MinMaxDam=1560, MinMaxDam=380, SplashDamage=0.24, DamageVsElite=0.08, Experience=260 |
| 15 | S | sanctified | `3506488889` | 325% | ColdD | Int=1000, ColdD=1560, ColdD=380, Vit=1000, SplashDamage=0.24, Experience=260 |
| 16 | R | normal | `4122235020` | 306% | HolyD | Int=739, HolyD=1050, HolyD=208, CooldownReduction=0.1, REQ=9 |
| 17 | S | sanctified | `408109974` | 325% | ColdD | Int=1000, ColdD=1560, ColdD=380, Vit=1000, ResourceCostReduction=0.1, Experience=260 |
| 18 | S | sanctified | `2842823736` | 325% | FireD | Int=1000, FireD=1560, FireD=380, ResourceCostReduction=0.1, CooldownReduction=0.1, WeaponHitChill1h=0.0259 |
| 19 | S | sanctified | `4268114052` | 325% | LightningD | Int=1000, LightningD=1560, LightningD=380, Damage=0.1, SplashDamage=0.24, Experience=260 |
| 20 | R | normal | `3406076817` | 255% | ArcaneD | Int=742, ArcaneD=1023, ArcaneD=263, Vit=656, SplashDamage=0.21, WeaponHitKnockback1h=0.0125 |
| 21 | S | sanctified | `4023107576` | 325% | HolyD | Int=1000, HolyD=1560, HolyD=380, Vit=1000, Haste=0.07, WeaponHitFear1h=0.0259 |
| 22 | S | sanctified | `3413701235` | 325% | MinMaxDam | Int=1000, MinMaxDam=1560, MinMaxDam=380, Vit=1000, ResourceCostReduction=0.1, WeaponHitImmobilize1h=0.0259 |
| 23 | S | sanctified | `3400074030` | 325% | ColdD | Int=1000, ColdD=1560, ColdD=380, Vit=1000, HitLife=23950, REQ=40 |
| 24 | S | sanctified | `2568385519` | 325% | PoisonD | Int=1000, PoisonD=1560, PoisonD=380, Haste=0.07, HitLife=23950, WeaponHitFear1h=0.0259 |
| 25 | R | ancient | `1730332235` | 293% | PoisonD | Int=827, PoisonD=1352, PoisonD=352, ResourceCostReduction=0.1, Vit=864, WeaponHitImmobilize1h=0.0173 |
| 26 | S | sanctified | `3230820904` | 325% | PoisonD | Int=1000, PoisonD=1560, PoisonD=380, ResourceCostReduction=0.1, Vit=1000, KillLife=11590 |
| 27 | S | sanctified | `3781621772` | 325% | MinMaxDam | Int=1000, MinMaxDam=1560, MinMaxDam=380, CooldownReduction=0.1, ResourceCostReduction=0.1, Experience=260 |
| 28 | S | sanctified | `2692157581` | 325% | FireD | Int=1000, FireD=1560, FireD=380, Vit=1000, HitLife=23950, WeaponHitFear1h=0.0259 |
| 29 | S | sanctified | `763568122` | 325% | PoisonD | Int=1000, PoisonD=1560, PoisonD=380, Haste=0.07, BleedPercent=0.39, BleedPercent=4, BleedPercent=5, Experience=260 |
| 30 | S | sanctified | `609618614` | 325% | ColdD | Int=1000, ColdD=1560, ColdD=380, HitLife=23950, Vit=1000, Experience=260 |
| 31 | R | primal | `2466891249` | 325% | LightningD | Int=1000, LightningD=1560, LightningD=380, Damage=0.1, DamageVsElite=0.08, KillLife=11590 |

## Comprobaciones críticas

- **Paso #1 (S)** desde seed `1326569675`: espada santificada, poder325%, daño **VENENO 1560–1940**, **INT1000**, **VIT1000**, **vida por golpe23950**, **+260 experiencia por muerte**; poder naranja estacional aleatorio, ignorar DPS.
- **Paso #2 (R)** desde #1: Deathwish normal, poder **288%**, daño **ARCANO 1021–1294**, **INT633**, **+7% daño de arma**, **vida por golpe15613** y probabilidad de miedo al golpear **2,25%** (redondeo visual posible).
- **Paso #31 (R)** desde #30: **Primal natural** 325%, daño **RAYO 1560–1940**, INT1000, Damage10%, DamageVsElite8%, **vida por muerte11590**; Mística posterior: **INT1000 → CDR10%**.
- La pieza Primal actual **se destruiría como combinación de afijos** al ejecutar el primer S. No hay manera de revertirlo. Conservar una segunda copia es más seguro.
- **No hay confirmación de ejecución de esta nueva ruta en Nintendo Switch 2**, solamente su reproducción exacta por dos simuladores. Si se intenta, fotografiar y comparar el resultado del paso #1 antes de la siguiente operación.
