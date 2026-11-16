# Firebird's Down — segundo drop, plan de diagnóstico económico sin repetir fallo (16-11-2026)

> **ESTADO REAL:** nueva pieza Firebird's Down NORMAL drop sin transmutaciones (foto `image-1794851878566.jpg`). **NO USAR la seed hipotética del drop**. Pieza santificada anterior con stats perfectos conservada, no intervenir.

## Foto real de este segundo drop

- Firebird's Down, armadura base **685**, set normal.
- Primarios **+422 Inteligencia**, **+96 Resist All Elements**, **Sockets (2)**, **+15% Spectral Blade Damage (Wizard Only)**.
- Secundarios **Gold/Health Pickup +1 yard** y **Level Requirement Reduced by 28**.
- Solo INT y sockets coinciden con prioridades Soulstone; faltan VIT y Armor adicional. Un solo reroll Myriam no arregla ambos.
- Meta a largo plazo: **Primal natural** Firebird's Down con INT650, 2 sockets, Armor adicional775 y VIT650, secundario cualquier resistencia (o un primario suplible legalmente por Myriam).

## Fallo anterior que NO se debe repetir

Primer drop normal Firebird's Down, foto anterior: INT431/Regen4856/Electrocute11/FireRes147/EXP195/2 sockets. Se hizo inversión de tooltip que generó **31 valores numéricos compatibles**; ninguna de las 31 seeds predijo el primer Sanctify real (**INT650, VIT650, DR775, ArcaneRes210**). El motor de valores normales no permite identificar automáticamente el seed guardado en un DROP original. Por tanto:
- No afirmar que nueva foto de drop normal identifica una seed ni número de pasos Primal.
- No recomendar Sanctify como *garantía* de recuperación, especialmente con pocos Crucibles.
- No reciclar ninguna de las 31 rutas previas de 50–120 Souls: **invalidadas para ese drop y no transferibles a este**.

## Opciones reales y costos incrementales

| Primera operación | Costo | Ventaja | Problema |
|---|---|---|---|
| Ninguna | 0 | Ahorrar todo; usar pantalones Santificados perfectos | No genera Primal natural nuevo |
| **C = Convert Set Item** | **10 Forgotten Souls + 10 Death's Breaths** | Diagnóstico posiblemente barato y nueva seed de objeto NORMAL del Cubo; múltiples valores observables para invertir; el tipo de pieza convertida añade información | **Pantalones se vuelven OTRA pieza Firebird** (siempre normal; no Primal), no está validado aún en consola que la inversión funcione; podrían requerirse más conversiones/observaciones |
| **R = Reforge Legendary** | **50 Forgotten Souls +5 de cada material de acto** | Transformación usada y validada en Squirt/Zodiac; puede generar Primal por sí misma | Muy cara con Souls escasos, puede necesitar siguiente prueba por baja información del tooltip |
| S = Sanctify | 1 Angelic Crucible, 0 Souls | Posibilidad de obtener otra pieza perfecta temporal | La pieza anterior ya está perfecta y es santificada; **no predice necesariamente seed**; consume Crucible limitado |
| 100 Primordial Ashes | 100 Ashes, otros costos 0 | Primal forzado no natural, 1 cupo de crafted-primal | NO es Primal natural y limita 1 pieza así equipada |

**Hecho:** Convert Set Item requiere 10 Death's Breaths +10 Souls, entrega otra pieza del mismo conjunto pero NUNCA Ancient ni Primal. Fuentes: https://www.icy-veins.com/d3/kanais-cube-guide y https://www.diablobytes.com/diablo-iii/guides/kanais-cube/.

**Si elegimos C primero**, el costo teórico absolutamente mínimo para volver a terminar en pantalones Primal es **al menos C + C + R = 10+10+50 = 70 Souls**, 20 Death's Breaths, 5 bounty materials por acto, porque la primera C obligatoriamente crea otra pieza y hay que volver a pantalones antes de la R final. Es un mínimo de operaciones físicamente posibles, **NO predicción de que pueda hacerse en 70 Souls ni de que haya ruta corta**. Podría requerir más C/R/S.

## Validación del plan C SIN gastar materiales del usuario

Se escribió y ejecutó `research/firebirds-down-second-drop-convert-diagnostic.mjs` sobre **8 conversiones SINTÉTICAS**; para piezas distintas Firebird Plume/Pinions/Talons/Tarsi la inversión normal encontró al menos una combinación de IDs/valores que reproduce la seed simulada. Para Firebird's Eye el inversor actual falla al manejar valores base NULL/constantes del offhand; **no es universal**, requiere ampliar lógica.

Prueba exhaustiva de una conversión sintética concreta:
- Source Firebird's Down seed hipotética `1` → Convert Set Item → **Firebird's Plume**, seed hija real simulada `1791398751`.
- A partir de cinco números resultantes, la búsqueda completa de **2^32 seeds** dio **2 valores**: `1791398751` y `3625671746`.
- Al incorporar la identidad de la pieza convertida, solo `1791398751` se corresponde con Firebird's Plume; el segundo produciría Firebird's Breast en el modelo.
- Fuente: [test JS](https://github.com/ironangelo/Nephalem-Lab/actions/runs/43925375705), [barrido 2^32](https://github.com/ironangelo/Nephalem-Lab/actions/runs/43925028640).
- **Rust independiente COMPLETADO:** [GitHub Actions Rust](https://github.com/ironangelo/Nephalem-Lab/actions/runs/43925678388): las **8 conversiones sintéticas** de Firebird's Down obtuvieron **exactamente la misma pieza, seed hija, afijos y números** en el código original D3Recipes Rust que en nuestro JS. Aún NO es prueba del estado del segundo drop real en Switch.
- **Nada de esto valida todavía un Convert real en Switch 2**. El motor modela C, pero el análogo anterior de drop falló; exigir primer checkpoint real antes de afirmar seed o ejecutar ruta larga.

## Propuesta condicionada por recursos

- **Si hay muy pocos Souls (<70 o insuficientes para tolerar un experimento fallido), no tocar la nueva pieza**: conservarla y seguir usando los pantalones santificados perfectos. No gastar Crucibles.
- Si se desean probar rutas y se acepta sacrificar temporalmente el tipo de pieza y consumir 10 Souls sin garantía de éxito: **una sola C** sobre el SEGUNDO DROP de la foto actual. No usar la pieza perfecta santificada.
- Pedir fotografía COMPLETA del resultado: nombre exacto de la pieza Firebird convertida, todos primarios, secundarios, sockets, si hay poder base y calidad; **detenerse tras esa operación**.
- Luego enumerar candidatas desde resultado de C y tipo de set; verificar si el modelo reproduce transición C con exactitud. Si no hay seed única o no coincide, no gastar otra operación sin análisis adicional; no fabricar receta larga.
- Solo entonces calcular ruta natural con máximo un reroll legal de Myriam, mínimo material y validación Rust + checkpoints.

**Importante:** no se hizo ninguna operación de Cubo al segundo drop nuevo en el momento de guardar este documento. El usuario expresó necesidad de ahorrar Souls/Crucibles y no repetir la promesa errónea de identificar seed desde un original drop tras 1 S.
