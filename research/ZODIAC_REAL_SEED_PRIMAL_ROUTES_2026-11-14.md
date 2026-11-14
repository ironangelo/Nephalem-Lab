# Obsidian Ring of the Zodiac — seed real y rutas Primal naturales, 14-11-2026

> **ESTADO REAL: DOS REFORGES DIAGNÓSTICAS HECHAS, NINGUNA SANCTIFY, NINGUNA MÍSTICA.** Las recetas Primal de abajo están **calculadas y reproducidas en simulador JS y Rust, NO EJECUTADAS EN SWITCH**. La próxima operación sugerida es la **primera S** desde la seed actual inferida `1805687870`. **No repetir las dos R diagnósticas.**

## Fotos y recuperación real

1. Drop Zodiac normal original, sin cambios: Attack Speed7%, CriticalChance4,5%, CooldownReduction7%, ResourceCostReduction5%, +144 resistencia arcana, Ignore Durability Loss.
2. Primera R diagnóstica: usuario confirmó **Ancient**, Haste6%, CHC5,5%, CDR5%, RCR6%, resistencia rayo206; código dedujo 5.331 seeds compatibles tras dos barridos de 2^32 y reproducción exacta.
3. Segunda R diagnóstica: foto `image-1794699206969.jpg`, Haste7%, CHC5,5%, CDR7%, RCR7%, +147 resistencia veneno; Ignore Durability Loss; **normal inferido** por simulador (la línea de calidad queda fuera del recorte). De 5.331 seeds candidatas hay **una única coincidencia matemática**, confirmada independientemente por Rust:
  - **Seed del drop ANTES de R1 (inferida):** `2279251711`.
  - **Seed después R1 Ancient (inferida):** `1290971892`.
  - **Seed ACTUAL después R2 normal (inferida):** `1805687870`.
  - [Job de match exacto](https://github.com/ironangelo/Nephalem-Lab/actions/runs/43653920818) / [Verificación Rust](https://github.com/ironangelo/Nephalem-Lab/actions/runs/43654177004).

Las seeds se infirieron matemáticamente desde fotos de Switch, **nunca se leyeron de memoria**.

## Objetivo exacto Soulstone Firebird Twister

**Primal natural** (no santificado): CDR **8% natural**, RCR **8% natural**, CHC **6% natural**, Haste **7% natural**, secundario óptimo **40% reducción de duración de control NATURAL**. Después sustituir **Haste 7% → Socket 1** con Myriam (sin cambiar CDR, RCR ni CHC).

## Comparación de rutas encontradas desde la seed actual 1805687870

| Criterio | Secuencia | Pasos | R | S | Souls | Bounty/acto | Crucibles | Secundario primal final |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| **Recomendada: 100% afijos Soulstone** | `SRSSRSSRSSR` | **11** | 4 | 7 | 200 | 20 | 7 | **CCReduction40%** |
| Económica en Souls (no secundario ideal) | `SRSSSRSSSSR` | 11 | 3 | 8 | **150** | 15 | 8 | FireResist210 |
| Menos pasos (no secundario ideal) | `SSRSRRSRSR` | **10** | 5 | 5 | 250 | 25 | 5 | FireResist210 |
| Ahorro Souls extremo, no ideal | `SSSSSSSSSSSSSSSSRSSSSSSSSR` | 26 | 2 | 24 | **100** | 10 | 24 | HealthGlobeBonus38625 |
| Ahorro Souls extremo, secundario ideal | `SSSSSRSSSSSSSSSSRSSSSSSSSSR` | 27 | 3 | 24 | 150 | 15 | 24 | **CCReduction40%** |

**Costos INCREMENTALES** desde la fotografía actual; no incluyen las dos R diagnósticas (100 Souls +10 materiales por acto ya gastados) ni costos variables de Myriam. Las 4 búsquedas fueron acotadas/puntuadas por prioridades; no se garantiza óptimo global. [Búsquedas](https://github.com/ironangelo/Nephalem-Lab/actions/runs/43654059863), [Rust 5 rutas](https://github.com/ironangelo/Nephalem-Lab/actions/runs/43654177004).

## CHECKLIST ruta exacta Soulstone `SRSSRSSRSSR`

**S = Angelic Crucible; R = Reforge Legendary**. Los 4 primarios de toda S: AS7%, CHC6%, CDR8%, RCR8%. Poder naranja santificado variable, no predecible. Para R normales y Ancient, los cuatro primarios cambian; los checkpoints se deben contrastar.

| Paso | Operación | Calidad | Seed hija inferida | Atributos (motor JS; Rust confirmado) |
| ---: | :---: | --- | ---: | --- |
| 1 | S | sanctified | `2069057367` | CDR 8%; AS 7.0%; CHC 6%; RCR 8%; Res. arcana +210 |
| 2 | R | normal | `672318302` | CDR 7.0%; AS 7.0%; CHC 5%; RCR 7.0%; EXP/muerte +165 |
| 3 | S | sanctified | `3473371073` | CDR 8%; AS 7.0%; CHC 6%; RCR 8%; Res. física +210 |
| 4 | S | sanctified | `2474412788` | CDR 8%; AS 7.0%; CHC 6%; RCR 8%; EXP/muerte +260 |
| 5 | R | ancient | `1098800678` | CDR 7.0%; AS 5%; CHC 4.5%; RCR 8%; Espinas +2.986 |
| 6 | S | sanctified | `4118949626` | CDR 8%; AS 7.0%; CHC 6%; RCR 8%; Control 40% |
| 7 | S | sanctified | `3225730790` | CDR 8%; AS 7.0%; CHC 6%; RCR 8%; Globo vida +38.625 |
| 8 | R | normal | `211497892` | CDR 5%; AS 7.0%; CHC 4.5%; RCR 6%; Res. fuego +146 |
| 9 | S | sanctified | `391693330` | CDR 8%; AS 7.0%; CHC 6%; RCR 8%; Res. rayo +210 |
| 10 | S | sanctified | `4149381710` | CDR 8%; AS 7.0%; CHC 6%; RCR 8%; Res. frío +210 |
| 11 | R | primal | `548457781` | CDR 8%; AS 7.0%; CHC 6%; RCR 8%; Control 40% |

**Primer checkpoint: S sobre Zodiac de la foto R2** → Obsidian santificado, **AS7%, CHC6%, CDR8%, RCR8%**, +210 resistencia arcana secundaria y poder naranja estacional aleatorio. **Seed hija inferida `2069057367`**. El secundario no es el ideal en esta etapa; **no usar Myriam todavía** si se continuará hacia Primal natural.

**Último checkpoint #11 R** → Primal natural, 8% CDR, 7% AS, 6% CHC, 8% RCR, **40% reducción de efectos de control**, seed hija inferida `548457781`. Después: Myriam AS7% → socket1.

### Atención al elegir opción santificada

Si se quiere abandonar la investigación natural y equipar uno santificado económico: **solo #1 S** ya produce todos los primarios máximos, pero requiere Mística AS→socket y no garantiza 40% control. Ocupa el único cupo santificado. Si el usuario quiere la ruta natural más tarde sobre ese mismo anillo **NO ENCANTAR** anticipadamente, para evitar comprometer el estado o los afijos elegibles.

**NINGÚN PASO DEL CHECKLIST SE HA HECHO EN LA CONSOLA TODAVÍA.** La segunda R diagnóstica sí está hecha. Confirmar foto del primer S antes de pasar al #2.
