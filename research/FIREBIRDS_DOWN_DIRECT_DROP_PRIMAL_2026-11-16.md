# Firebird's Down — recuperación DIRECTA del drop original y búsqueda Primal Soulstone (16-11-2026)

> **ESTADO REAL ACTUAL: 1 SANCTIFY EJECUTADO, FIREBIRD'S DOWN SANTIFICADO PERFECTO CONFIRMADO EN FOTO.** No ejecutar otra operación sobre esta pieza. **El primer checkpoint de la simulación NO coincidió con ninguna de las 31 seeds hipotéticas**: nunca se identificó una seed única; invalidar la aplicabilidad de las rutas preliminares.


## RESULTADO REAL DESPUÉS DE PRIMER SANCTIFY (16-11-2026)

Foto `image-1794850782626.jpg` de Switch 2:

- Firebird's Down **SANTIFICADO** con **1534 Armor total**.
- **INT +650**, **VIT +650**, **Armor adicional +775**, **Sockets (2)**, secundario **Arcane Resistance +210**.
- Poder estacional Storm Armor (carga durante 30 s; descarga relámpago).
- Estas cinco líneas ya cumplen **TODOS** los objetivos de Soulstone para pantalones. **NO Myriam, NO Reforge, NO más Sanctify.** Costó **1 Crucible**, cero Souls. Otros objetos del usuario son Primal naturales; este puede ocupar el único slot sanctified si no hay otro.
- **FALLO EXPLÍCITO DE MODELO:** ninguna de las 31 candidatos hipotéticos del original produce la combinación de DR775 + VIT650 + ArcaneResist210 tras primer S. Las 31 seeds procedían de invertir `values()` sobre el drop normal y reproducían sus números, pero no fueron verificadas con transición real. Esta observación refuta su utilización como estado real para recetas futuras; **NO hay seed actual conocida** y **NO puede elegirse una de las rutas de 50–120 Forgotten Souls**. Posible diferencia entre generación loot original y entrada al Cubo; investigar antes de gastar.
- **Interpretación:** se consiguió resultado funcional de equipo perfecto, pero **NO Primal natural** y el conocimiento de seed NO quedó validado. El intento de invertir drop por stats no puede presentarse como método fiable.
- Para persistencia de equipo al terminar temporada, objetos santificados no se trasladan; natural Primal sí. Priorizar farming de material antes de volver a trabajar en este objeto.

## Observación del usuario — Nintendo Switch 2, Wizard

Fotografía `image-1794849333409.jpg`:
- **Firebird's Down (Legs, normal, 713 Armor)** sin encantamientos visibles.
- Inteligencia **+431**.
- Vida por segundo **+4.856** (afijo técnico `Regen`).
- Daño de Electrocute **+11%** (`Skill_Wizard_Electrocute`).
- Resistencia fuego **+147** (secundario `FireResist`).
- Experiencia por muerte **+195** (`Experience`).
- **Sockets (2)**, afijo fijo junto con INT.

## Objetivo exacto Soulstone

https://www.soulstone.gg/firebird-twister-wizard
- Primarios: **INT, dos sockets, Armor, Vitality**.
- Secundario deseado: **cualquier resistencia**.
- En Primal natural ideal: **INT650, sockets2, bonus Armor775, Vitality650**, más alguna resistencia. Permitir una corrección de Mística sobre primario aleatorio si hay un solo afijo insuficiente.
- El valor de armadura base **713** NO es lo mismo que el afijo de Armor adicional `DR` y no se debe asumir que el motor de D3Recipes predice el valor de la armadura base.

## Descubrimiento: recuperación sin pagar una Reforge

El modelo oficial de afijos de D3Recipes (`FNGarvin/d3recipes` portado a `src/universal-engine.js`) establece exactamente:
- Dos grupos fijos, `Int` y `Sockets`;
- Dos primarios adicionales, observados `Regen` y `Skill_Wizard_Electrocute`;
- Dos secundarios, `FireResist` y `Experience`.
- Las variantes normales que corresponden a los cinco valores son únicas según el muestreo de 90.000 semillas sintéticas del motor.

La inversión de fórmulas produjo **4 hipótesis de orden interno**, y verificó **cada una de las 4.294.967.296 seeds almacenadas posibles** usando generador Multiply With Carry de 32 bits; quedaron **31 seeds compatibles** con los cinco valores de la foto, validadas por reproducción exacta de valores con JavaScript (NO son todavía una seed única).

- [Cálculo de 2^32 estados en GitHub Actions](https://github.com/ironangelo/Nephalem-Lab/actions/runs/43917545639)
- [Las 31 seeds candidatas y resultados previstos de primera S/R](https://github.com/ironangelo/Nephalem-Lab/blob/research/firebirds-down-drop-seed-2026-11-16/research/firebirds-down-original-31-seeds.json)
- [29 huellas visuales para primera S](https://github.com/ironangelo/Nephalem-Lab/blob/research/firebirds-down-drop-seed-2026-11-16/research/firebirds-down-first-sanctify-29-signatures.json)

**Estrategia de desambiguación económica: aplicar UNA S (Angelic Crucible) al Firebird's Down original, SIN MÍSTICA**, fotografiar resultado COMPLETO. Todas las candidatas predicen INT650 y sockets2, pero varían en las otras líneas. La primera S da **29 posibles resultados visibles** entre las 31 seeds:
- **27 firmas únicas**: permitirían reconocer seed única.
- Dos parejas indistinguibles en la primera foto: seeds `1029273403/2891951512` o `3903720956/4245989982` (la última línea secundaria puede reemplazarse por poder naranja de S).
- Si sale una de las parejas, usar segundo checkpoint del mismo objeto, preferiblemente otra S, solo después de evaluar sus resultados.
- Costo de primer diagnóstico: **1 Angelic Crucible, 0 Forgotten Souls, 0 materiales de contratos**.
- En Sanctify, el último secundario puede quedar oculto/reemplazado por poder estacional naranja; no interpretar ausencia de último secundario como falla.
- Si la primera S NO coincide con ninguna firma predicha, **DETENER**. Puede significar que el drop original no comparte el estado almacenado inferido por valor-roll o que falta otra mecánica del juego. No continuar a ciegas.

**Importante:** los 31 casos corresponden a seeds compatibles con los valores originales; la igualdad de `values()` sola NO prueba que el mismo seed sea el guardado de origen. Las predicciones de transición deberán cotejarse con la primera S real.

## Búsqueda de receta

Se preparó motor `research/firebirds-down-31-candidate-route-search.mjs`, usando nodos `(item,seed)`:
- `S` = Sanctify, consume 1 Crucible, 0 Souls.
- `R` = Reforge Legendary, consume 50 Forgotten Souls +5 materiales de bounties **de cada acto**; única operación válida como etapa final para Primal natural.
- `C` = Convert Set Item, consume 10 Forgotten Souls +10 Death's Breaths y CAMBIA a una pieza diferente del conjunto Firebird temporalmente.
- Objetivo: terminar en **Firebird's Down Primal NATURAL**, con INT/Sockets fijos y DR/Vit ya naturales o con uno sustituible en Mística, preferiblemente resistencia como secundario.

**Resultados preliminares del buscador:** analizó hasta 30.000 estados por seed, pasos S/R/C y longitud máxima 21. Encontró al menos una ruta válida según modelo en **las 31 candidatas**. Entre las rutas más económicas encontradas para cada candidata, Forgotten Souls incrementales entre **50 y 120** (distribución: 1×50, 8×70, 8×80, 8×90, 5×100, 1×120). Los Crucibles y conversiones varían según seed; estas rutas todavía NO están verificadas por Rust ni Nintendo Switch y NO son óptimos matemáticos probados. **No se puede seleccionar ninguna ruta antes de identificar la seed con la primera S real.** [Búsqueda preliminar](https://github.com/ironangelo/Nephalem-Lab/actions/runs/43918620963). [Todos los resultados JSON](https://github.com/ironangelo/Nephalem-Lab/blob/research/firebirds-down-drop-seed-2026-11-16/research/firebirds-down-31-preliminary-route-results.json).

## Estado en consola pendiente

**SÍ SE UTILIZÓ UN ANGELIC CRUCIBLE y salió SANTIFICADO PERFECTO.** No continuar con ningún paso R/S/C ni Mística: resultado funcional final logrado. La primera transición real NO coincide con ninguna de las firmas modeladas; todas las rutas de seed de este documento son simulaciones históricas invalidadas para este objeto en su estado actual.
