# Obsidian Ring of the Zodiac: estrategia 1 Crucible + Mística (14 nov 2026)

## Estado actual confirmado

- Usuario en Nintendo Switch 2, Wizard Firebird Twister. **Ningún objeto actualmente santificado**, las demás piezas son Primal Ancient naturales.
- Usuario autoriza terminar este anillo como **Santificado** si es la forma más rápida y económica; no exigir Primal natural por principio.
- Drop original normal **SIN TRANSMUTAR / SIN MÍSTICA PREVIA**. Foto de conversación `image-1794696611360.jpg`.
- Primarios reales: Attack Speed +7.0%, Critical Hit Chance +4.5%, Cooldown Reduction +7.0%, Resource Cost Reduction +5.0%.
- Secundarios reales: +144 Arcane Resistance, Ignores Durability Loss.
- Meta Soulstone Firebird Twister: CHC6%, CDR8%, RCR8%, socket1; secundario opcional óptimo reducción duración control40%.
- Datos de `D3Recipes` / motor JS: `Obsidian Ring of the Zodiac`, `primary_pick_count=0`, `secondary_pick_count=1`, **cuatro fixed slot groups** para CDR, Haste, CriticalChance, ResourceCostReduction. Los modelos de Sanctify generan por construcción +8% CDR, +7% Haste, +6% CHC, +8% RCR, y secundario aleatorio; preservan el poder legendario. Obsidian no obtiene socket natural ni siquiera Primal, por sus cuatro primarios fijos.
- Fuentes oficiales: [Blizzard 2.7.4](https://news.blizzard.com/en-us/article/23826543/diablo-iii-ptr-2-7-4-has-concluded); [Icy Veins tema actual S40](https://www.icy-veins.com/d3/season-34-angelic-crucibles-effects-and-mechanics); [D3Recipes documento técnico](https://github.com/FNGarvin/d3recipes). Auditoría JS: [GitHub Actions](https://github.com/ironangelo/Nephalem-Lab/actions/runs/43650267186).

## Ruta recomendada por costo (AUTORIZADA, **NO EJECUTADA**)

1. **S (Sanctify) una vez con Angelic Crucible sobre ESTE Zodiac normal**, sin antes gastar 50 Souls en Reforge ni diagnosticar seed. Como los 4 afijos primarios son fijos y Sanctify los maximiza, NO necesitamos invertir la seed de drop para predecir los primarios. Esperar Zodiac santificado **Haste7%, CHC6%, CDR8%, RCR8%** (independiente de la seed); poder de mago aleatorio y secundario variable.
2. **Comparar pantalla de juego**. No afirmar resultado específico de secundario ni seed resultante. Si coincide y el usuario acepta un secundario distinto al ideal, **Myriam: escoger Haste7% → Socket(1)**, verificando en la lista de posibles reemplazos y sin encantar ningún otro afijo. Gastos variables de encantamiento no incluidos en 0 Forgotten Souls en Cubo.
3. Equiparlo como **único santificado** (máx. uno por personaje); las otras cuatro piezas Primal naturales no ocupan ese cupo. Si se necesita santificar otra pieza más tarde, evaluar entonces una ruta a Primal natural para Zodiac y no prometer uso simultáneo.

**Costo fijo de Cubo mínimo:** 1 Angelic Crucible, 0 Reforges, 0 Forgotten Souls de Cubo, 0 materiales de Bounties. **Mística tiene costo adicional variable**. Calidad final: **Sanctificado**, NO Primal natural; con stats equivalentes a primal en afijos primarios y poder extra de temporada.

**Si el usuario exige necesariamente secundario control40%:** se debe buscar y validar seed después de una observación diagnóstica con R o investigar sanctificaciones múltiples; la ruta única no garantiza ese secundario.

**Situación en consola al guardar esta nota:** ninguna operación sobre Zodiac confirmada aún. Pedir foto del primer Sanctify y comparar antes de recomendar encantamiento.

No ejecutar scripts exhaustivos ni costosas reforjas hasta que exista una razón concreta para preferir Primal natural al santificado.

## Comparación solicitada antes de gastar (14 nov 2026)

El usuario quiere **estimar una ruta Primal natural desde ESTE drop** y saber si una primera santificación permite recuperar seed; todavía **no se ha santificado el Zodiac**.

- **No existe cotización exacta de ruta Primal natural desde la fotografía original**, porque la stored seed 32-bit del drop no está recuperada. No inventar secuencias ni extrapolar costos exactos de Deathwish o Squirt.
- **Ruta S funcional**: 1 Crucible, cero Reforges y cero Souls/materiales de actos en Cubo. Después reemplazar +7% AS por socket con Myriam. Secundario ideal 40% control no garantizado.
- **Ruta natural mínima física**: 1 Reforge Legendary, 50 Souls + 5 materiales de cada acto, posibilidad sin garantía de Primal. La operación final debe ser Reforge (no Sanctify), porque S resulta santificado.
- Si primero se elige **S y luego se desea natural en el MISMO objeto**, mínimo físico **S+R**, 1 Crucible, 50 Souls y 5 materiales de cada acto, pero la R destruirá el estado santificado y no tiene garantía de Primal.
- **¿Una S recupera la seed por sí sola? NO de manera única conforme al método probado.** Los cuatro primarios fijos salen máximos independientemente de la seed; solo el secundario aleatorio/poder estacional aportan información, no suficientes para identificar inequívocamente el estado de 32 bits. Sí constituye una transición real útil y checkpoint, pero necesitaría observaciones posteriores para reconstrucción.
- **Para estimar el costo natural antes de elegir**, preferible una **R diagnóstica** sobre el drop original y capturar todos los afijos. A diferencia del Squirt, los 4 primarios fijos del Zodiac tienen poca variación numérica, así que una sola R puede dejar varias seeds candidatas; podrían hacer falta más R enlazadas. NO garantizar unicidad con un solo Reforge.
- Tasa aleatoria clásica de Primal ~1/400 por R: **400 R ×50 =20.000 Souls**, más **2.000 materiales por acto** en promedio si se busca a ciegas; esto **NO es** un presupuesto de Nephalem Lab, cuyo objetivo es optimizar desde seed recuperada y reducir drásticamente costo.
- Decisión práctica: si importa la economía y se acepta una pieza santificada, preferir S + Mística y detenerse; para explorar la opción natural sin perder una santificada funcional, preferir conservarla y experimentar después con otra copia.
