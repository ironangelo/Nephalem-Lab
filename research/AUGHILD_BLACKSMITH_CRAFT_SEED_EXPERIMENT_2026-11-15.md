# Aughild's Power — herrero, fabricación directa y límite de recuperación de seeds (15-11-2026)

## Estado observado en Nintendo Switch 2 (Wizard Firebird Twister)
- El usuario tiene unas Aughild's Power anteriores **fabricadas por el Necromancer**, equipadas en el Wizard (foto anterior): armor 643, INT563, VIT555, Life15%, resistencia arcana181, Pickup radius1 y Bone Armor damage11% (Necromancer Only).
- El usuario fabricó **una Aughild's Power nueva con el herrero usando el Wizard** (foto nueva `image-1794798252531.jpg`):
  - Calidad normal (set verde, sin marco Ancient), armor **593**.
  - Primarios: **INT641, VIT567, All Resist114, Familiar Damage +11% (Wizard Only)**.
  - Secundarios: Thorns +7905, Pickup Radius +1 yard.
  - Se origina en **Craft Item del herrero**, NO en Reforge del Cubo.
- El objetivo Soulstone Firebird Twister para hombros (fuente https://www.soulstone.gg/firebird-twister-wizard): **INT / CDR / RCR / (Life%, VIT o Armor)**, secundario preferible alguna resistencia. Mystic puede sustituir un único primario (p. ej. skill damage o otro primario no prioritario).
- Esta nueva pieza **NO tiene CDR ni RCR**, por lo que con una sola Mística no puede llegar a ambos. No gastar Mística ni Caldesann en ella por ahora.

## Restricciones confirmadas antes de experimentar
- [Blizzard PTR 2.7.4](https://news.blizzard.com/en-us/article/23826543/diablo-iii-ptr-2-7-4-has-concluded): **crafted items cannot be Sanctified**.
- [Discusión de Switch en Blizzard Forums](https://us.forums.blizzard.com/en/d3/t/crafted-items-cannot-be-used/21033): **blacksmith-crafted items no se pueden Convert Set Item ni Reforge Legendary**.
- No confundir con el **"Craft & upgrade"** que menciona [FNGarvin/d3recipes](https://github.com/FNGarvin/d3recipes): ahí **se fabrica un objeto RARO y se mejora con Hope of Cain**. El simulador de cubo tiene raíces deterministas para ese proceso, pero **NO incluye una transición comprobada "herrero → siguiente Aughild's Power"**, ni un optimizador de series de fabricación de sets del herrero.
- Nuestro motor `src/universal-engine.js` modela item seeds y pasos **R/S/P/C** dentro del Cubo; los valores de los afijos de la pieza fabricada podrían acotar semillas de **su propia generación**, pero **no demuestran qué semilla/cantidad de draws usa la próxima fabricación del herrero**, una corriente posiblemente independiente.
- No está demostrado que los stats visibles de una pieza permitan predecir la siguiente fabricación, la distancia hasta un natural Primal, ni una ruta óptima en materiales. No presentar semilla o recuento de fabricaciones inventado.

## Costos y enfoque económico real
- [Blizzard Aughild's Power](https://eu.diablo3.blizzard.com/en-gb/artisan/blacksmith/recipe/aughilds-power): **30 Reusable Parts + 30 Arcane Dust + 50 Veiled Crystals + un material de cada uno de dos tipos exigidos por la receta + 72.000 oro** por intento; comprobar valores en la Switch si varían.
- **0 Forgotten Souls, 0 Angelic Crucibles** por nueva fabricación directa.
- El Primal natural puede salir directamente del herrero una vez desbloqueada la elegibilidad; ninguna secuencia calculada hasta ahora.
- No sacrificar el Aughild anterior mientras sea útil. No modificar esta pieza nueva para "reseed" sin pruebas.
- Plan de investigación opcional y de bajo costo: si se desea estudiar RNG de herrero, **registrar consecutivamente** las siguientes 2–3 piezas fabricadas por Wizard sin operaciones de Cubo entre ellas; anotar orden, primarios, secundarios, calidad, armor y origen. **Eso no bastará necesariamente para reconstruir un predictor**, pero es un dataset reproducible inicial. Si las Souls o materiales de contratos escasean, detener el experimento y priorizar equipo Ancient jugable.
- En la práctica buscar primero Ancient/Primal con **al menos tres de los cuatro afijos primarios requeridos**, dejando el cuarto para Mística (si Mystic permite legalmente esa sustitución), en vez de cientos de crafts especulativos.
- **ESTADO ACTUAL: un nuevo Aughild de Wizard fabricado y documentado; no existe todavía receta Primal con número de crafts predicho.**

## Investigación comunitaria nueva: ¿existen recetas automáticas para Aughild/Crimson? (16-11-2026)

**Resultado importante: sí se pueden crear Primals naturales directamente con herrero, pero no se ha demostrado receta predictiva de tipo "fabrica N Aughild's Power y el siguiente es Primal con estos afijos" para un Wizard existente.** Blizzard confirma que los Ancients pueden proceder del herrero y que Primals pueden surgir de fuentes legendarias (https://news.blizzard.com/en-us/article/22989464/legendary-an-ancient-primal-guide), y jugadores confirman Crimson Primals de herrero (https://us.forums.blizzard.com/en/d3/t/can-you-craft-primal/16349).

**Hallazgo comunitario decisivo:** Captain/Freddit, jugador que publica recetas de Primals de consola, afirma explícitamente que los conjuntos Aughild y Guardian se pueden producir con el herrero, y que los resultados de *esa* fabricación se pueden volver a probar mediante save scumming hasta obtener Primal: https://www.reddit.com/r/diablo3/comments/1e2ts2q/. En otra conversación distingue las recetas deterministas de Kanai de las **piezas directamente fabricadas por herrero y cofres**, las que considera una fuente de RNG no fijo, y dice que Aughild/Crimson pueden dar resultados diferentes al restaurar una partida: https://www.reddit.com/r/diablo3/comments/1asrivq. Otro hilo de 2019 señala igualmente la fabricación directa del herrero como excepción al patrón fijo de Cube: https://www.reddit.com/r/diablo3/comments/bwe1mo/.

**NO confundir dos mecánicas:**
1. **D3Recipes y recetas para personajes estacionales nivel 1**: fabrican objetos raros baratos y aplican *Upgrade Rare Item* en Kanai. La acción "Craft & upgrade" NO es la fabricación directa del set Aughild.
2. **Blacksmith directo (Aughild's Power)**: los testimonios comunitarios describen probabilidad/RNG de fabricar un natural Primal y métodos de repetir pruebas con restauración del guardado. **NO encontramos herramienta probada que prediga la siguiente fabricación desde la seed de una pieza Aughild previa**. No afirmar que el proceso es perfectamente aleatorio criptográfico ni que es imposible modelarlo; solo falta evidencia/modelo verificable para pronosticarlo.

**Precaución para Switch 2:** los procedimientos de guardado/rollback difieren por sistema y pueden arriesgar progresos. NO garantizar que el método de cerrar el juego sin guardar funcione igual que en PS4/PS5, ni recomendar manipular nube/copia de partidas sin antes verificar específico para la consola.

**Consejo económico:** fabricar en herrero naturalmente, conservar Primals y Ancients con los afijos idóneos, y usar Mística para un solo afijo. Consumo de Souls y Crucibles = **0** por intento; no hay ruta validada de N pasos que garantice el objetivo exacto desde foto de la primera fabricación.


## Segunda verificación exhaustiva de exploits (16-11-2026)

**Nueva evidencia directa, publicada 12 julio 2026**: https://www.reddit.com/r/diablo3/comments/1uu1cpx/any_cheap_primal_recipes_for_console/ — el comentario de u/Wolfspyda9 aclara que *las secuencias fijas afectan a objetos raros fabricados que se MEJORAN con Kanai*, mientras que **"Crafting set pieces is not fixed though"**. La discusión diferencia expresamente este caso de recetas de nivel 1 que dan un Primal en un número fijo de mejoras.

**Exploit confirmado comunitariamente, específico para Aughild/Guardian**: https://www.reddit.com/r/diablo3/comments/1e2ts2q/console_players_recipe_for_cheap_primals_s32/ — u/ambitious_captain afirma que no se cambió el RNG del herrero y que Aughild / Guardian permiten *savescum* hasta Primal. Alguien pide específicamente Aughild; respuesta 04-08-2024: cerrar juego mediante menú de consola **antes de salir de pantalla de fabricación**, para evitar guardar; confirman Switch entre consolas pero **NO verifican específicamente Switch 2**. Esta es una declaración de jugadores, no una garantía/soporte oficial. Otras experiencias documentadas: https://www.reddit.com/r/diablo3/comments/16cvita/lost_primal_item_after_exiting_game/ — hubo pérdida accidental de Primal y progresos por cierre sin guardar. Se debe destacar la advertencia de pérdida y diferencias por autosave. No recomendarlo sobre sesión con los Primals recién obtenidos sin guardarlos de forma segura primero.

**Foros de Blizzard corroboran otras formas, no una receta secreta de Aughild**:
- https://us.forums.blizzard.com/en/d3/t/console-play-hacked-weapons/20214 menciona exploits de fabricación Aughild/Crimson y mats, pero NO especifica procedimiento distinto del rollback de guardado ni permite afirmar predictibilidad.
- https://us.forums.blizzard.com/en/d3/t/cheating-on-consoles-ruining-seasonal-play/121 documenta el abuso de guardados para objetos fabricados y cofres.
- https://us.forums.blizzard.com/en/d3/t/reforging-set-to-primal/12798 y https://diablobytes.com/diablo-iii/guides/kanais-cube/ señalan que Aughild creado únicamente por Blacksmith no admite Reforge/Convert Set Item; https://news.blizzard.com/en-us/article/23897180/season-28-rites-of-sanctuary-has-ended exige **non-crafted legendary** para Primal de 100 ashes.
- https://www.reddit.com/r/diablo3/comments/1enzcs7/is_there_a_way_to_get_a_primal_for_the_crafted/ — usuarios señalan fabricar directamente una y otra vez. Primal usual ~0.25% entre producciones elegibles (aprox. 1 de 400 en promedio), sin garantía de buen roll de afijos.

**Conclusión revisada y honesta:** existen al menos (1) fabricaciones normales a la suerte; (2) *savescumming* / reutilización temporal de los mismos materiales; (3) editores/manipulación externa de partida (no se recomienda como juego normal y tampoco es predictor del herrero). NO se encontró una receta reproducible documentada de número fijo de Aughild directos hasta primal. No se puede descartar un exploit futuro o método no publicado; no afirmar que no existe. La evidencia de julio de 2026 contradice la hipótesis de que una secuencia fija tipo D3Recipes aplique a Aughild directo. Considerar prueba controlada solamente tras respaldar y confirmar guardado de avances y sin prometer que Switch 2 preserve/rollback del mismo modo.
