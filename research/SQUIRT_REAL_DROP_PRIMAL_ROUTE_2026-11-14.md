# Squirt's Necklace: Drop n.º 2, seed recuperada, rutas Primal — 14-11-2026

> **ESTADO VIGENTE: ¡RUTA ECONÓMICA DE 20 PASOS COMPLETADA! PRIMAL ANCIENT NATURAL CONFIRMADO EN SWITCH 2 (14-11-2026).** Se confirmó en foto el paso #1 S y el resultado final #20 R. No se aportaron fotos independientes de cada operación intermedia: no darlas por observadas. **PENDIENTE ÚNICAMENTE Myriam: INT 1000 → CHC 10%. NO volver a reforjar ni santificar esta pieza.**

## Evidencia real

- Personaje: Wizard, Nintendo Switch 2.
- Dos Squirt originales sin encantamiento previo, procedentes de Kadala o GR (origen exacto incierto).
- Drop n.º 1 conservado: INT630, Vida15%, CHD55%, oro74%, reducción duración control34%, socket1. **No tocar sin motivo.**
- Drop n.º 2 seleccionado: daño +80–146, frío20%, INT711, CHD60%, oro79%, EXP200. **Una sola Reforge real** produjo:
  - Daño habilidades frío19%, INT641, velocidad ataque7%, CHD81%, oro74%, EXP168; calidad normal, ningún socket visible.
- Fotografía real: `image-1794693475498.jpg`, SHA-256 `26bdc45e945ba561122ce1cd2747a75f46ff31777c43705d244ca141cea60d03`. Foto solo en conversación, no binario de GitHub.
- Recuperación desde seis valores numéricos observados y seis familias de afijos: **2^32 child seeds examinadas**, 164 posibilidades numéricas; **2^32 parents examinadas**, 163 preimágenes con cinco draws; **1 transición completa coincidente**.
  - Seed precursora del drop inferida: `3668729561`.
  - **Seed actual después de 1 Reforge: `800657787`.**
  - Validación exacta en JS y en **D3Recipes Rust de referencia**, no lectura directa de memoria.
  - [Recovery job](https://github.com/ironangelo/Nephalem-Lab/actions/runs/43646271445) y [Rust job](https://github.com/ironangelo/Nephalem-Lab/actions/runs/43646458509).

## Soulstone Firebird Twister (meta)

Fuente: https://www.soulstone.gg/firebird-twister-wizard

- Primarios: socket, CHC10%, CHD100%, Fuego20%; secundario deseado: reducción de duración de efectos de control.
- El modelo genera base fija en Squirt: oro, Inteligencia y daño crítico. Al llegar a Primal, el socket también se obtiene de forma natural.
- Se requiere **Fuego20% NATURAL** o **CHC10% NATURAL**, cambiando INT por el restante mediante la Mística; se comprobó legalidad con selector de afijos. Elegimos priorizar Fuego natural y Mística a CHC, para evitar depender del afijo de daño elemental en Myriam.
- El secundario de control es deseable; no sacrificar los cuatro primarios por él.

## Rutas candidatas reales desde la seed actual inferida 800657787

| Ruta | Pasos | Reforges | Crucibles | Forgotten Souls | Materiales de cada acto | Secundario natural |
|---|---:|---:|---:|---:|---:|---|
| Rápida | 10 | 5 | 5 | 250 | 25 | Resistencia física210 |
| **Menos Souls hallada (priorizar si sobran Crucibles)** | 20 | 4 | 16 | **200** | **20** | Vida por muerte11590 |
| Con secundario de control | 26 | 5 | 21 | 250 | 25 | Reducción control40% |

Nota: no garantizamos óptimo global; búsqueda limitada y ponderada en 1.200.000 estados por modalidad, máximo 28 pasos, 9 R y 29 S. No se computaron tasas de Mística. Las búsquedas simuladas están en [CI](https://github.com/ironangelo/Nephalem-Lab/actions/runs/43646358477) y la comprobación independiente Rust con las cuatro rutas principales en [CI](https://github.com/ironangelo/Nephalem-Lab/actions/runs/43646726072).

**IMPORTANTE** en S: cuando se generan seis afijos, el poder naranja santificado reemplaza al último secundario visible; NO esperar que aparezca necesariamente en la foto aunque esté en las tablas del modelo. Los cinco restantes y la secuencia de child seeds se mantienen. En los R normales puede aparecer un socket no numerado. Los valores de potencia naranja santificada y DPS base no se predicen.


## Ruta rápida 10 pasos

**Secuencia:** `RSSRSRRSSR`.

5 R + 5 S, 250 Souls, 25 materiales de cada acto y 5 Crucibles. Primal fuego20% natural, crítico100%, socket, secundario resistencia física 210. Mística INT→CHC10%.

| Paso | Acción | Calidad | Seed inferida siguiente | Stats numéricos previstos (modelo) |
| ---: | :---: | --- | ---: | --- |
| 1 | R | normal | `4119545052` | Socket (no numérico); Gold 0.77; Int 666; CriticalD 0.93; Haste 0.07; ColdResist 143 |
| 2 | S | sanctified | `2671534746` | Socket (no numérico); Gold 0.8; Int 1000; CriticalD 1; Vit 1000; Thorns 9500 |
| 3 | S | sanctified | `3799760889` | Socket (no numérico); Gold 0.8; Int 1000; CriticalD 1; DamageBonusLightning 0.2; ColdResist 210 |
| 4 | R | normal | `3076734411` | Gold 0.76; Int 671; CriticalD 0.81; DamageBonusLightning 0.19; HitLife 16570; Experience 185 |
| 5 | S | sanctified | `3213915474` | Socket (no numérico); Gold 0.8; Int 1000; CriticalD 1; MinMaxDam 105; MinMaxDam 105; FireResist 210 |
| 6 | R | normal | `454797486` | Gold 0.71; Int 639; CriticalD 0.54; CriticalChance 0.09; SplashDamage 0.2; FireResist 151 |
| 7 | R | normal | `621689573` | Gold 0.78; Int 639; CriticalD 0.84; DR 564; CooldownReduction 0.06; CCReduction 0.3 |
| 8 | S | sanctified | `1075808230` | Socket (no numérico); Gold 0.8; Int 1000; CriticalD 1; DR 775; FireResist 210 |
| 9 | S | sanctified | `4292473218` | Socket (no numérico); Gold 0.8; Int 1000; CriticalD 1; Vit 1000; KillLife 11590 |
| 10 | R | primal | `3229700730` | Socket (no numérico); Gold 0.8; Int 1000; CriticalD 1; DamageBonusFire 0.2; PhysicalResist 210 |

## Ruta menor consumo de Forgotten Souls 20 pasos

**Secuencia:** `SSSSSRSSRSSSSSSRSSSR`.

4 R + 16 S, 200 Souls, 20 materiales de cada acto y 16 Crucibles. Primal fuego20% natural, crítico100%, socket, secundario vida por muerte 11590. Mística INT→CHC10%.

| Paso | Acción | Calidad | Seed inferida siguiente | Stats numéricos previstos (modelo) |
| ---: | :---: | --- | ---: | --- |
| 1 | S | sanctified | `398322324` | Socket (no numérico); Gold 0.8; Int 1000; CriticalD 1; Vit 1000; ColdResist 210 |
| 2 | S | sanctified | `3763178701` | Socket (no numérico); Gold 0.8; Int 1000; CriticalD 1; DamageBonusLightning 0.2; Experience 260 |
| 3 | S | sanctified | `3564296171` | Socket (no numérico); Gold 0.8; Int 1000; CriticalD 1; CriticalChance 0.1; LightningResist 210 |
| 4 | S | sanctified | `1130703597` | Socket (no numérico); Gold 0.8; Int 1000; CriticalD 1; Vit 1000; KillLife 11590 |
| 5 | S | sanctified | `1114195853` | Socket (no numérico); Gold 0.8; Int 1000; CriticalD 1; Life 0.18; ArcaneResist 210 |
| 6 | R | ancient | `2100818138` | Gold 0.73; Int 924; CriticalD 0.59; CriticalChance 0.095; Vit 912; PoisonResist 184 |
| 7 | S | sanctified | `3218414999` | Socket (no numérico); Gold 0.8; Int 1000; CriticalD 1; ResistAll 130; HealthGlobeBonus 38625 |
| 8 | S | sanctified | `2701418883` | Socket (no numérico); Gold 0.8; Int 1000; CriticalD 1; Haste 0.07; FireResist 210 |
| 9 | R | ancient | `916072833` | Gold 0.8; Int 868; CriticalD 0.82; DamageBonusLightning 0.2; Regen 8496; PhysicalResist 190 |
| 10 | S | sanctified | `852389605` | Socket (no numérico); Gold 0.8; Int 1000; CriticalD 1; Haste 0.07; FireResist 210 |
| 11 | S | sanctified | `917222714` | Socket (no numérico); Gold 0.8; Int 1000; CriticalD 1; Regen 10000; DefenseMissile 0.07 |
| 12 | S | sanctified | `3077917607` | Socket (no numérico); Gold 0.8; Int 1000; CriticalD 1; ResistAll 130; DefenseMissile 0.07 |
| 13 | S | sanctified | `3825257127` | Socket (no numérico); Gold 0.8; Int 1000; CriticalD 1; DamageBonusCold 0.2; ColdResist 210 |
| 14 | S | sanctified | `1414959321` | Socket (no numérico); Gold 0.8; Int 1000; CriticalD 1; DamageBonusCold 0.2; HealthGlobeBonus 38625 |
| 15 | S | sanctified | `3984543294` | Socket (no numérico); Gold 0.8; Int 1000; CriticalD 1; SplashDamage 0.2; ArcaneResist 210 |
| 16 | R | normal | `2895903794` | Gold 0.71; Int 741; CriticalD 0.9; HitLife 18210; MinMaxDam 63; MinMaxDam 72; Experience 147 |
| 17 | S | sanctified | `3016129270` | Socket (no numérico); Gold 0.8; Int 1000; CriticalD 1; Haste 0.07; ArcaneResist 210 |
| 18 | S | sanctified | `3083597863` | Socket (no numérico); Gold 0.8; Int 1000; CriticalD 1; MinMaxDam 105; MinMaxDam 105; LightningResist 210 |
| 19 | S | sanctified | `1953696153` | Socket (no numérico); Gold 0.8; Int 1000; CriticalD 1; SplashDamage 0.2; FireResist 210 |
| 20 | R | primal | `142853246` | Socket (no numérico); Gold 0.8; Int 1000; CriticalD 1; DamageBonusFire 0.2; KillLife 11590 |

## Ruta con secundario Soulstone 26 pasos

**Secuencia:** `RSSSSSSSSSSSRSSSSSRSSSSSRR`.

5 R + 21 S, 250 Souls, 25 materiales de cada acto y 21 Crucibles. Primal fuego20% natural, crítico100%, socket, secundario 40% reducción duración control. Mística INT→CHC10%.

| Paso | Acción | Calidad | Seed inferida siguiente | Stats numéricos previstos (modelo) |
| ---: | :---: | --- | ---: | --- |
| 1 | R | normal | `4119545052` | Socket (no numérico); Gold 0.77; Int 666; CriticalD 0.93; Haste 0.07; ColdResist 143 |
| 2 | S | sanctified | `2671534746` | Socket (no numérico); Gold 0.8; Int 1000; CriticalD 1; Vit 1000; Thorns 9500 |
| 3 | S | sanctified | `3799760889` | Socket (no numérico); Gold 0.8; Int 1000; CriticalD 1; DamageBonusLightning 0.2; ColdResist 210 |
| 4 | S | sanctified | `3271831746` | Socket (no numérico); Gold 0.8; Int 1000; CriticalD 1; Life 0.18; LightningResist 210 |
| 5 | S | sanctified | `2675592117` | Socket (no numérico); Gold 0.8; Int 1000; CriticalD 1; Vit 1000; DefenseMelee 0.07 |
| 6 | S | sanctified | `521321330` | Socket (no numérico); Gold 0.8; Int 1000; CriticalD 1; CriticalChance 0.1; ColdResist 210 |
| 7 | S | sanctified | `1194691803` | Socket (no numérico); Gold 0.8; Int 1000; CriticalD 1; Life 0.18; PoisonResist 210 |
| 8 | S | sanctified | `2335273784` | Socket (no numérico); Gold 0.8; Int 1000; CriticalD 1; DamageBonusFire 0.2; HealthGlobeBonus 38625 |
| 9 | S | sanctified | `3105583842` | Socket (no numérico); Gold 0.8; Int 1000; CriticalD 1; Vit 1000; Experience 260 |
| 10 | S | sanctified | `115881060` | Socket (no numérico); Gold 0.8; Int 1000; CriticalD 1; DamageBonusFire 0.2; PhysicalResist 210 |
| 11 | S | sanctified | `3365874495` | Socket (no numérico); Gold 0.8; Int 1000; CriticalD 1; ResistAll 130; CCReduction 0.4 |
| 12 | S | sanctified | `3694214665` | Socket (no numérico); Gold 0.8; Int 1000; CriticalD 1; ResistAll 130; CCReduction 0.4 |
| 13 | R | normal | `2596818763` | Gold 0.72; Int 690; CriticalD 0.77; Vit 708; Regen 7518; ColdResist 153 |
| 14 | S | sanctified | `3821778145` | Socket (no numérico); Gold 0.8; Int 1000; CriticalD 1; DamageBonusFire 0.2; PoisonResist 210 |
| 15 | S | sanctified | `2992671577` | Socket (no numérico); Gold 0.8; Int 1000; CriticalD 1; HitLife 23950; ArcaneResist 210 |
| 16 | S | sanctified | `2738448506` | Socket (no numérico); Gold 0.8; Int 1000; CriticalD 1; Life 0.18; LightningResist 210 |
| 17 | S | sanctified | `1564244708` | Socket (no numérico); Gold 0.8; Int 1000; CriticalD 1; DR 775; KillLife 11590 |
| 18 | S | sanctified | `770894536` | Socket (no numérico); Gold 0.8; Int 1000; CriticalD 1; Regen 10000; PhysicalResist 210 |
| 19 | R | normal | `4141809568` | Gold 0.71; Int 705; CriticalD 0.91; HitLife 16237; Vit 634; ArcaneResist 159 |
| 20 | S | sanctified | `1179466045` | Socket (no numérico); Gold 0.8; Int 1000; CriticalD 1; CooldownReduction 0.08; PoisonResist 210 |
| 21 | S | sanctified | `3425650875` | Socket (no numérico); Gold 0.8; Int 1000; CriticalD 1; CriticalChance 0.1; LightningResist 210 |
| 22 | S | sanctified | `2318740144` | Socket (no numérico); Gold 0.8; Int 1000; CriticalD 1; Vit 1000; ColdResist 210 |
| 23 | S | sanctified | `1476906721` | Socket (no numérico); Gold 0.8; Int 1000; CriticalD 1; Vit 1000; CCReduction 0.4 |
| 24 | S | sanctified | `969995138` | Socket (no numérico); Gold 0.8; Int 1000; CriticalD 1; HitLife 23950; FireResist 210 |
| 25 | R | normal | `1692526671` | Gold 0.8; Int 731; CriticalD 0.65; Regen 7255; DR 579; HealthGlobeBonus 21553 |
| 26 | R | primal | `3185476752` | Socket (no numérico); Gold 0.8; Int 1000; CriticalD 1; DamageBonusFire 0.2; CCReduction 0.4 |


## VALIDACIÓN REAL FINAL: Squirt's Necklace Primal Ancient natural conseguido (14-11-2026)

**Fotografía del usuario en Switch 2:** `image-1794696009104.jpg` (conversación actual). Tooltip dice literalmente **"Primal Ancient Legendary Amulet"** (marco rojo, no santificado), tras la receta económica de 20 operaciones `SSSSSRSSRSSSSSSRSSSR`.

| Afijo o estado | Predicho por motor | Foto real final | Estado |
|---|---|---|---|
| Calidad | Primal Ancient natural | Primal Ancient Legendary Amulet | Coincide |
| Fuego habilidades | +20% | +20% Fire skill damage | Coincide |
| Inteligencia (disponible para Mística) | +1000 | +1000 | Coincide |
| Daño crítico | +100% | +100% | Coincide |
| Gold from Monsters | +80% | +80% | Coincide |
| Sockets | 1 | Sockets (1) | Coincide |
| Vida por muerte secundario | 11.590 | **11.584** | Diferencia de 6; registrar y revisar modelo de fórmula/precisión/atributos |

- **Seed final inferida del modelo:** `142853246`, NO leída desde Switch. El resultado real respalda clase Primal, familia de afijos y valores relevantes, con una diferencia pequeña de 6 unidades en vida por muerte (no ocultarla, ni declarar igualdad numérica perfecta).
- Previa identificación: drop #2 → 1 Reforge diagnóstico; seed actual inferida `800657787`; luego primera S confirmada, y foto final tras el resto de la receta.
- **Costo estimado de la ruta de 20 pasos ejecutada:** 4 Reforges (200 Forgotten Souls + 20 materiales de cada acto) y 16 Angelic Crucibles. Aparte, 1 Reforge diagnóstico (50 Forgotten Souls + 5 materiales de cada acto). No confundir estos totales.
- **Aún NO CONFIRMADA la Mística.** Próxima acción: sustituir INT 1000 por CHC 10% mediante Myriam. Puede necesitar varios intentos; conservar siempre 20% fuego y 100% CHD, socket, etc. Objetivo final primarios Fuego20% + CHC10% + CHD100% + socket1. El secundario es vida por muerte, NO reducción de efectos de control; no afirmar un 100% idéntico al óptimo de secundarios de Soulstone.
- **No recomendar volver a reforjar/santificar este Squirt.** Las otras rutas listadas aquí son experimentos alternativos históricos desde seed `800657787` y no se pueden iniciar desde el estado actual después de haber consumido esa seed.
- La foto #1 (primer Crucible) y esta foto final son observaciones; **los pasos #2 a #19 no tienen verificaciones fotográficas individuales almacenadas**. La confirmación del final es suficiente para registrar éxito de ruta, pero no prueba visual independiente de todos los checkpoints.

## VALIDACIÓN REAL: paso 1 de la ruta económica terminado (14-11-2026)

**Foto de usuario:** `image-1794694749540.jpg` (adjunta en conversación). Es **la misma pieza n.º 2** tras aplicar el primer Crucible, después del diagnóstico Reforge.

**Predicción vs resultado visible (coincidencia):**
- INT 1000 = 1000 (foto)
- VIT 1000 = 1000 (foto)
- Critical Hit Damage 100% = 100% (foto)
- Gold from Monsters 80% = 80% (foto)
- Sanctified Squirt (borde azul/blanco) = Sanctified en la foto
- Poder naranja aleatorio: **Arcane Orb** (spawn orbiting charges); no se predice ni afecta validación de afijos
- El socket está representado gráficamente en el icono, pero la línea de socket no aparece en la porción fotografiada; secundario de ColdResist210 predicho como reemplazable por el poder naranja no aparece, tal como admite la regla de seis afijos.

**Seed actual INFERIDA tras operación real #1:** `398322324`. No fue leída de memoria, sino derivada del modelo y respaldada por la coincidencia visual.

**HISTÓRICO, YA SUPERADO POR RESULTADO FINAL: #2 S (otro Angelic Crucible sobre el mismo Squirt santificado).** Debería generar:
- Squirt santificado.
- +80% Gold, +1000 INT, +100% CHD, **1 socket**, **+20% Lightning skill damage**.
- Power naranja aleatorio; Experience260 como último secundario calculado puede quedar reemplazado/oculto por dicho power.
- **Seed de salida inferida:** `3763178701`.
- Si no sale Lightning20 o difiere otro primario fijo, DETENER y analizar antes de ejecutar paso #3.

**Receta completa**: `SSSSSRSSRSSSSSSRSSSR`. Paso real #1 confirmado en foto; resultado final #20 **Primal confirmado en foto**; pasos intermedios sin imágenes individuales. **Costo originalmente restante tras el paso #1 (ya gastado para llegar al final):** 15 Crucibles, 4 Reforges, 200 Souls y 20 materiales por acto. Ahora solo pendiente Mística final INT→CHC10%.

## Si se usa la ruta económica de 20 pasos

- **Primer paso: S COMPLETADO REALMENTE**. La foto confirmó Squirt santificado, +80% oro, +1000 INT, +100% CHD, **1 socket**, +1000 VIT, más el poder naranja estacional; el secundario de +210 resistencia frío se simula internamente pero puede desaparecer de la pantalla al ser reemplazado por el poder naranja. **Seed child inferida: 398322324.**
- Si coincide (ignorando el poder naranja aleatorio y el último secundario oculto), continuar al segundo S. **Detener inmediatamente ante cualquier diferencia no explicable**.
- Paso final #20 es **R**: Primal natural, +80% oro, +1000 INT, +100% CHD, socket1, +20% fuego natural, +11590 vida por muerte. Seed final `142853246`.
- Solo después, encantar **INT1000 → CHC10%**. No gastar Mística antes del último paso.
- No confundir el Primal natural con objeto santificado; la última R deja libre el cupo estacional de santificados.
