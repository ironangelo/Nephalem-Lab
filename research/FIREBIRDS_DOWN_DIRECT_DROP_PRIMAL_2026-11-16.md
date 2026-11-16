# Firebird's Down — recuperación DIRECTA del drop original y búsqueda Primal Soulstone (16-11-2026)

> **ESTADO REAL: PANTALONES ORIGINALES, NINGÚN REFORGE/SANCTIFY/CONVERT APLICADO.** Esta investigación es una simulación todavía sin checkpoint de consola sobre esta misma pieza. NO dar instrucciones de ruta larga sin identificar seed única.

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

La búsqueda es heurística acotada, no garantiza mínimo absoluto ni valida en Switch los pasos propuestos. [Búsqueda preliminar para 31 semillas](https://github.com/ironangelo/Nephalem-Lab/actions/runs/43918620963).

## Estado en consola pendiente

**NO se ha usado ni un Crucible ni una Reforge en estos pantalones desde la captura del usuario.** Próxima acción recomendada: **1 Sanctify del mismo pantalón, fotografía completa, NO Mística**. Después identificar seed por comparación de firmas y calcular/verificar ruta concreta (y afijos de cada paso), antes de más gastos.
