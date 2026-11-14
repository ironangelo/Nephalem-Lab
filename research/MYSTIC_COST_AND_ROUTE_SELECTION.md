# Mística, costo real de las rutas y reversibilidad — lecciones del Deathwish

**Fecha: 2026-11-14.** Registro técnico para no repetir el problema con el afijo **+8% Damage to Elite enemies**. Esta es una **especificación pendiente de implementar**, no una función ya integrada en Nephalem Lab ni en el APK.

## Incidente real, con evidencia de la Switch 2

1. Deathwish original de drop (250%) → **1 Reforge real** (253%). Se recuperaron seeds inferidas **1184690904** (origen) y **46826983** (después de R); la simulación recuperó exactamente la foto.
2. Se buscaron rutas **R/S** hacia Deathwish **Primal natural**, poder325%, daño de frío/rayo, daño arma10%, CDR10% y daño élites8%, con **como máximo un atributo para Mística**.
3. Se eligió la ruta **SRRSSRSSSSSSSSSSSSSSSRR** desde la seed 46826983: **23 operaciones = 5 R + 18 S**, **250 Forgotten Souls**, **25 materiales de contratos de cada acto**, 18 Crucibles; fuente de rayo +1560–1940 y afijos naturales Damage10% + CDR10%, INT1000.
4. El paso 9 generó una Deathwish **santificada** de rayo con las estadísticas ofensivas completas salvo élites. Era tentador quedarse ahí; se optó por Primal **natural** para no ocupar el slot estacional de santificados.
5. El usuario completó **23/23 operaciones** y mostró foto de la Deathwish **Primal natural** con poder325%, rayo1560–1940, daño arma10%, INT1000, CDR10% y ralentizar2,6%, como predijo D3Recipes. **DPS visible3126.2**, no calculado por el motor.
6. En la Mística, el usuario eligió **+1000 INT** como afijo para encantar; la foto muestra la lista «Possible Replacement Properties for +1000 Intelligence», donde **+8% Damage to Elite enemies aparece como reemplazo legal**. Tras **30 Forgotten Souls gastadas**, el usuario confirmó que aún **no había obtenido** ese afijo. **No confundir 30 Souls con 30 tiradas** ni afirmar que exista bloqueo o una probabilidad concreta.
7. El indicador de la Mística aparece junto al INT y este es el afijo que se puede volver a encantar. La pieza conserva +1000 INT por ahora. **No está completada al 100% según Soulstone por falta del +8% élites.**

## Alternativas modeladas desde la MISMA seed antigua, ahora inalcanzables sin resetear

| Ruta | Primal | Total operaciones | Forgotten Souls fijas | Crucibles | Mística pendiente |
| --- | --- | ---: | ---: | ---: | --- |
| **SRRSSRSSSSSSSSSSSSSSSRR (ejecutada)** | **Rayo, daño10%, CDR10%, INT1000** | 23 | 250 | 18 | **INT → élites8%**, poco frecuente |
| **RRSRRRSRSSRSRSSR** | **Rayo, daño10%, élites8%, INT1000** | **16** | 450 | **7** | **INT → CDR10%**, evita el raro élites |
| **SRRSRRSSSSSSSSSRRR** | **Frío, daño10%, élites8%, INT1000** | 18 | 350 | 11 | INT → CDR10% |
| **SSSSSSSSRSSSSSSSSRSSRSR** | Sagrado, daño10%, CDR10%, INT1000 | 23 | 200 | 19 | INT → élites8%, no da elemento preferido |

**La ruta de 16 operaciones sí conservaba RAYO y daba el +8% daño a élites NATURAL**. No debe omitirse en futuras comparaciones por el mero hecho de costar 200 Souls iniciales adicionales. No se ha establecido si su costo esperado total habría sido menor o mayor; faltan **tasas/ponderaciones fiables de la Mística y costos por intento**.

Las rutas eran válidas como simulaciones para el estado antiguo seed **46826983**; **NO** son una marcha atrás desde la espada actual (modelo Primal final seed **1326569675**). Reforjar la espada actual destruiría su combinación conseguida. Santificarla también la cambiaría. No recomendar otro R/S/P para "arreglar" el encantamiento.

## Especificación del planificador futuro

Al buscar un objeto final, construir candidatos con:
- Estado inicial **confirmado y semilla inferida**.
- Operaciones exactas y resultado **Primal natural / santificado**, con identificación final de pieza.
- Poder legendario y su roll numérico; valores calculables y valores desconocidos (base DPS/Armor) claramente separados.
- **Afijos primarios y secundarios naturales** que tendrá cada candidato.
- **Afijo específico que falta** y **atributo que sería reemplazado por la Mística**, comprobando legalidad (tipo de ranura, exclusiones, variantes).
- Comprobación de si hay otro atributo ya encantado (en tal caso está **bloqueada la elección de ranura**).
- Elemento de daño y compatibilidad con *Elemental Exposure* y objetivo concreto de Soulstone.
- Riesgo cualitativo y, solo con fuentes de datos verificables, **probabilidad de obtener el afijo deseado** con la Mística.
- Materiales de Cubo separados de coste esperado de encantamiento: Souls, contratos, DB, Crucibles, oro, materiales adicionales y Ramaladni.
- Número de operaciones, dependencia estacional de Crucibles, permanencia del Primal y ocupación del cupo santificado.
- Estado actual de la partida y si la siguiente acción es **reversible**.

**Optimización multicriterio**, no una única puntuación arbitraria:
1. Menor Souls de Cubo.
2. Menor costo esperado total (Cubo + Mística), solo si se pueden estimar tasas y costos con respaldo.
3. Menos pasos.
4. Menos Crucibles.
5. Menor riesgo de afijo raro pendiente para la Mística.
6. Coincidencia estricta con los afijos Soulstone y restricciones de elemento.
7. Rutas que preservan la opción de detenerse en un resultado santificado para uso estacional (aunque no equivalga a Primal natural).

**Antes de recomendar una ruta**, una advertencia destacada pero sobria debe indicar:

> «Esta opción cuesta X Souls menos en el Cubo, pero deja daño contra élites pendiente para la Mística. Hay otra ruta con élites natural que cuesta Y Souls adicionales y cambia CDR con Myriam. El costo de la Mística es variable; por ahora no tenemos una probabilidad suficientemente verificada.»

**En el código:** no falsear un peso/porcentaje de reroll si no existe evidencia; un parámetro de preferencia del usuario puede representar *aversión al riesgo de la Mística*, pero debe etiquetarse como heurístico. Introducir tests sobre Deathwish 250-Souls vs alternativas 450-Souls/350-Souls, verificando que el comparador **muestre la diferencia del afijo pendiente**; no es necesario que elija automáticamente una ruta sin conocer tasas.

## Status y evidencia

- **Implementado en herramientas de investigación:** modelado de afijos, búsqueda R/S, verificación de Mística legal y simulación Rust. Código en rama [research/deathwish-kadala-drop](https://github.com/ironangelo/Nephalem-Lab/tree/research/deathwish-kadala-drop).
- **Pendiente:** integración de comparación basada en riesgo/costo de Mística al planificador/app; ninguna modificación de APK como parte de esta documentación.
- **Fotos reales:** Deathwish del drop, Reforge a 253%, S #1, Primal final y pantalla Mística con INT+1000 y élites8% listado. Las imágenes originales permanecen en la conversación; **el repositorio solo conserva su transcripción y hashes disponibles**.
- **Fuente paso a paso:** [DEATHWISH_PRIMAL_CHECKPOINTS.md](DEATHWISH_PRIMAL_CHECKPOINTS.md).
- **Registro actual:** [ESTADO_ACTUAL.md](../ESTADO_ACTUAL.md).
