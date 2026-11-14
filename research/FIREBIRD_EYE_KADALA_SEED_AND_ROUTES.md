# Firebird's Eye: recuperar seed de Kadala usando un Convert Set Item real

**Fecha:** 2026-11-14. **Personaje:** Wizard. **Motor:** D3Recipes @ `49fe28467db9ebbd096694d1408528b2c9ce5ea3`. **Estado actualizado:** el usuario eligió la ruta económica `SSSSSRCSCR`, confirmó que **funcionó** y que **realizó el cambio con la Mística**; la fotografía muestra exactamente los afijos finales previstos. Las seeds son inferidas, no leídas de la Switch 2.

## Evidencia de la pieza original

El usuario obtuvo de **Kadala** una **Firebird's Eye** sin Reforge, Sanctify ni cambios previos. Su fotografía muestra: daño **346–425** (atributo base de fuente no invertido por el simulador), **+19% fuego**, **+705 INT**, **+686 VIT**, **+152 XP/muerte**, **+11 poder arcano máximo**, **+10% Magic Missile**.

Operación **real y única**: `Convert Set Item` sobre la Firebird's Eye. Resultado fotografiado:

- **Firebird's Down (pantalones) normal**; armadura visible **704** (el simulador no verifica armadura base).
- **425 INT**, **490 VIT**, **148 resistencia fuego**, **2621 espinas**, **dos huecos**, **10% Magic Missile**.
- Hash SHA-256 de la fotografía del resultado: `e1cd6e9e3a41dcadc13b4bd940aafd0378fe57ba46c1d3584de797af27de7cbe`; nombre del archivo de conversación `image-1794673125122.jpg`. **El binario de la imagen no se cargó a GitHub**.

## Resultado matemático de recuperación

1. Enumerar las permutaciones internas de los cinco afijos numéricos de Firebird's Down; **12 hipótesis** tras deduplicación.
2. Barrido completo del espacio de **4.294.967.296 posibles seeds de la pieza resultante** mediante restricciones de RNG; **123 seeds** compatibles numéricamente.
3. Usar `seed_resultado = (0x6AC690C5*seed_previa+666) modulo 2^32` y su inverso modular `0x8A3E6E0D` para obtener la precursora de cada resultado.
4. Simular un `Convert Set Item` completo desde la Firebird's Eye original para cada precursora; comparar identidad Firebird's Down, calidad normal, afijos completos, cinco valores y huecos.
5. **Una sola precursora coincidió exactamente:**

```text
Firebird's Eye original de Kadala
seed interna INFERIDA: 4016194486
          -- C (Convert Set Item) -->
Firebird's Down actual
seed interna INFERIDA: 930643368
425 INT · 490 VIT · 148 fuego · 2621 espinas · Magic Missile 10% · 2 huecos
```

**Importante:** las seeds son **inferencias matemáticas** del resultado de la transformación, no lecturas directas de memoria de Nintendo Switch 2. Una transformación posterior que coincida constituye una verificación adicional.

[Búsqueda exhaustiva real de Kadala](https://github.com/ironangelo/Nephalem-Lab/actions/runs/43615140781) · [Código aislado del escáner](https://github.com/ironangelo/Nephalem-Lab/blob/research/firebird-eye-kadala/research/firebird-eye-real-convert-recovery.mjs).

## Objetivo exacto de Soulstone, Firebird Twister para consola

Según https://www.soulstone.gg/firebird-twister-wizard (guía publicada 2023), en Firebird's Eye priorizar **4 Arcane Power on Critical Hit**, **Critical Hit Chance**, y **INT / CDR / RCR / Elite Damage**, sin **fear / knockback on hit** como secundarios. En el motor, `Int` se selecciona fijo; para el Primal ideal se busca `ArcanePowerOnCrit` a **4**, `CriticalChance` a **10%** y un único cambio legal máximo con Mística, si hiciera falta. El afijo inherente `Power` de fuego llega a **+20%** en el Primal natural. El motor **no simula el daño base numérico** `346–425` ni predice el daño base futuro, porque las fórmulas de daño de este objeto dependen de referencias a atributos no implementadas en `Sim::values`.

## Ruta A — la más corta encontrada, sin Mística

**`RCSSSRSSR` (9 operaciones desde los pantalones actuales)**. **3 Reforge**, **1 Convert Set**, **5 Crucibles**. **160 Forgotten Souls**, **10 Death's Breaths**, **15 contratos de cada acto**. Primal final **con APoC4, CHC10%, INT1000, fuego20%, poder arcano máximo14, ceguera al golpear 2.59%**, **sin Fear ni Knockback**. **No necesita Mística**.

| Paso | Op. | Pieza esperada | Calidad | Valores numéricos predichos | Seed resultante inferida |
|---:|---|---|---|---|---:|
| 1 | R | Firebird's Down | normal | INT 488, Regen 4960, MagicMissile 10%, Gold 34%, ArcaneResist 156 · huecos (cantidad no deducida) | 3746662560 |
| 2 | C | Firebird's Eye | normal | daño de fuego 17%, INT 693, Hydra 10%, Regen 5100, MaxArcanePower 12, Gold 35% | 2723685818 |
| 3 | S | Firebird's Eye | sanctified | daño de fuego 20%, INT 1000, ArcaneOrb 15%, VIT 1000, MaxArcanePower 14, Gold 35% · poder naranja | 4249787902 |
| 4 | S | Firebird's Eye | sanctified | daño de fuego 20%, INT 1000, APoC 4, crítico 10%, MaxArcanePower 14, Experience 260 · poder naranja | 3320926730 |
| 5 | S | Firebird's Eye | sanctified | daño de fuego 20%, INT 1000, VIT 1000, Gold 35%, cegar al golpear 2.59% · huecos (cantidad no deducida) · poder naranja | 1860898501 |
| 6 | R | Firebird's Eye | normal | daño de fuego 16%, INT 674, Electrocute 13%, crítico 8%, MaxArcanePower 10, HealthGlobeBonus 28383 | 3980225107 |
| 7 | S | Firebird's Eye | sanctified | daño de fuego 20%, INT 1000, APoC 4, VIT 1000, MaxArcanePower 14, Thorns 3500 · poder naranja | 1518819116 |
| 8 | S | Firebird's Eye | sanctified | daño de fuego 20%, INT 1000, Familiar 15%, VIT 1000, MaxArcanePower 14, ralentizar/enfriar 2.59% · poder naranja | 1393485923 |
| 9 | R | Firebird's Eye | primal | daño de fuego 20%, INT 1000, APoC 4, crítico 10%, cegar al golpear 2.59%, MaxArcanePower 14 | 1318732109 |

## Ruta B — menos Forgotten Souls y contratos

**`SSSSSRCSCR` (10 operaciones desde los pantalones actuales)**. **2 Reforge**, **2 Convert Set**, **6 Crucibles**. **120 Forgotten Souls**, **20 Death's Breaths**, **10 contratos de cada acto**. Primal final: fuego20%, INT1000, APoC4, Hydra15% (este **cambiarlo por CHC10% con la Mística**), oro35% y poder arcano máximo14.

| Paso | Op. | Pieza esperada | Calidad | Valores numéricos predichos | Seed resultante inferida |
|---:|---|---|---|---|---:|
| 1 | S | Firebird's Down | sanctified | INT 650, Electrocute 15%, VIT 650, KillLife 7725 · huecos (cantidad no deducida) · poder naranja [secundario sustituido: PhysicalResist 210] | 3919047829 |
| 2 | S | Firebird's Down | sanctified | INT 650, DR 775, SpectralBlade 15%, GoldPickUpRadius 2 · huecos (cantidad no deducida) · poder naranja [secundario sustituido: Experience 260] | 3527826720 |
| 3 | S | Firebird's Down | sanctified | INT 650, VIT 650, Electrocute 15%, FireResist 210 · huecos (cantidad no deducida) · poder naranja [secundario sustituido: Thorns 3500] | 726119719 |
| 4 | S | Firebird's Down | sanctified | INT 650, MagicMissile 15%, VIT 650, Experience 260 · huecos (cantidad no deducida) · poder naranja [secundario sustituido: Thorns 3500] | 2555565315 |
| 5 | S | Firebird's Down | sanctified | INT 650, SpectralBlade 15%, VIT 650, ColdResist 210 · huecos (cantidad no deducida) · poder naranja [secundario sustituido: GoldPickUpRadius 2] | 1497632258 |
| 6 | R | Firebird's Down | normal | INT 472, MagicMissile 13%, Regen 4878, ArcaneResist 156, Gold 35% · huecos (cantidad no deducida) | 3862397836 |
| 7 | C | Firebird's Breast | normal | INT 425, VIT 430, ExplosiveBlast 15%, ArcaneResist 159, GoldPickUpRadius 1 · huecos (cantidad no deducida) | 419364182 |
| 8 | S | Firebird's Breast | sanctified | INT 650, VIT 650, Life 15%, Experience 260 · huecos (cantidad no deducida) · poder naranja [secundario sustituido: LightningResist 210] | 1992330858 |
| 9 | C | Firebird's Eye | normal | daño de fuego 18%, INT 721, APoC 3, ArcaneOrb 13%, Gold 33%, MaxArcanePower 13 | 3158653484 |
| 10 | R | Firebird's Eye | primal | daño de fuego 20%, INT 1000, APoC 4, Hydra 15%, Gold 35%, MaxArcanePower 14 | 1980719662 |

## Ruta C — menos Crucibles (alternativa)

**`CCCSSRCCSR`** (10 operaciones, 3 Crucibles, 5 Convert, 2 Reforge, 150 Forgotten Souls, 50 Death's Breaths, 10 materiales de cada acto). Primal final: INT1000, APoC4, Arcane Torrent15% (**Mística** a CHC10%), experiencia260, poder arcano máximo14, fuego20%.

## Verificaciones independientes

Los **9 pasos** de A, los **10 de B** y los **10 de C** fueron ejecutados tanto en **Nephalem Lab JS** como en **Rust original D3Recipes**, desde **Firebird's Down / seed 930643368**. Coincidieron **cada paso, identidad de pieza, calidad, seed y selección de afijos**. La transformación real de Eye original `4016194486` hacia Down `930643368` también coincidió.

[Verificación Rust completa](https://github.com/ironangelo/Nephalem-Lab/actions/runs/43615878705) · [Código de cálculo de rutas](https://github.com/ironangelo/Nephalem-Lab/blob/research/firebird-eye-kadala/research/firebird-eye-primal-soulstone.mjs).

**Advertencias para ejecutar:**

- Los símbolos son `R` Reforge, `C` Convert Set, `S` Sanctify (Angelic Crucible). Los costos se cuentan **desde los pantalones actuales**; los 10 Souls +10 Death's Breaths gastados en la conversión inicial ya ocurrieron y no se incluyen otra vez.
- Con `S` de una pieza de 6 afijos, el poder naranja ocupa el lugar del **último secundario**, marcado entre corchetes en la tabla (ese secundario NO aparece en el juego). La identidad del poder naranja no se puede predecir.
- Los sockets en pantalones / casco deben contrastarse visualmente, pero su **cantidad exacta no está implementada** en el motor. Que haya un afijo Sockets no certifica `2` o `3` huecos sin la fotografía.
- No existen fotos reales de los próximos pasos: **SON PREDICCIONES PENDIENTES DE VALIDACIÓN**. Si hay cualquier diferencia en el siguiente paso, **no avanzar**.
- La búsqueda de ruta fue limitada y optimizada con pesos de materiales; no prueba un mínimo universal para todas las cantidades de recursos o todas las semillas del juego. La ruta A fue la primera de longitud 9 hallada en búsqueda por amplitud; la B fue la menor ponderación de materiales entre los casos explorados.
- Preferir la ruta A si priman **menos operaciones y cero Mística**; preferir B si priman **menos Forgotten Souls/contratos**. La ruta C favorece **ahorro de Crucibles** pero usa muchos más Death's Breaths.

## VALIDACIÓN REAL POSTERIOR — ÉXITO DE LA RUTA ECONÓMICA (2026-11-14)

Después de elegir explícitamente **la ruta que ahorra Forgotten Souls `SSSSSRCSCR`**, el usuario compartió una fotografía de la **Firebird's Eye final** y escribió textualmente: **«Funciono!! E hice el reroll stat con mystic!!»**. La fotografía del juego muestra el marco rojo de Primal, el indicador azul de atributo modificado por la Mística al lado de CHC y los siguientes valores exactos:

| Atributo fotografiado | Valor real | Comparación |
| --- | ---: | --- |
| Daño de objeto base | +485–600 | Visible en captura, **no simulado** por el motor |
| Daño de habilidades de fuego | +20% | Predicho |
| Inteligencia | +1.000 | Predicho |
| Probabilidad de crítico | +10,0% **(reroll azul Mística)** | Predicho tras cambiar Hydra +15% |
| Poder arcano por crítico | +4 | Predicho |
| Oro de monstruos | +35% | Predicho |
| Poder arcano máximo | +14 | Predicho |

La **coincidencia de todos los afijos finales es exacta** con la ruta económica calculada por el motor JS y el Rust original; esto constituye una segunda **validación de resultado Primal en Switch 2** desde un objeto inicialmente obtenido como botín de Kadala, esta vez con seed recuperada a partir de **una sola conversión de conjunto**. El usuario confirma éxito y el reroll final; no tenemos fotografías individuales de cada uno de los diez pasos, así que su ejecución individual no está independientemente documentada. El objeto final se fotografía **después de la Mística**: no es una evidencia directa de la forma anterior con Hydra +15%, que sigue siendo el estado predicho por simulador.

- **Cadena inferida:** Eye de Kadala `4016194486` --Convert observado--> Down `930643368` --`SSSSSRCSCR` (usuario confirma resultado)--> Eye Primal modelo seed `1980719662` --Mística Hydra→CHC--> Eye Primal optimizado.
- **Fotografía:** `image-1794676452913.jpg`, SHA-256 `780fd785701d0f8d79f7f31c619e82faee6963c4cebf1b73f0fd362db290f51f`. El binario permanece en la conversación y **no está subido a GitHub**.
- **Costo de la ruta tras la conversión inicial:** 120 Forgotten Souls + 20 Death's Breaths + 10 contratos de cada acto + 6 Crucibles, más materiales variables de la Mística. Estos son costos de las operaciones calculadas, no gastos de inventario observados.
- **Importante:** la Firebird's Eye ya cumple su objetivo. **No volver a reforjar, santificar ni convertir esa pieza** para intentar mejorarla. Conservar este vector como caso de éxito experimental y seguir investigando la generación de drops originales por separado.
