# CONTINUIDAD — Investigación de seeds de Diablo III (Switch 2)

**Última actualización: 14 de noviembre de 2026 — ruta Primal completa confirmada en Switch 2 por el usuario.**  
**Repositorio:** \`ironangelo/Nephalem-Lab\` · **Personaje de los experimentos:** Wizard.  
**Esta es la bitácora para retomar el proyecto sin perder descubrimientos. No modifica el APK.**

> **Regla fundamental:** separar siempre *lo observado realmente en la Switch 2*, *lo reproducido por simulación*, *la seed inferida* y *lo que todavía no sabemos*. Ningún resultado calculado debe presentarse como garantía en el juego sin contrastarlo.

## Lo más importante que descubrimos

**1. CoE: primera prueba real de predicción.** El anillo Convention of Elements tenía inicialmente poder **190%** (+455 Fuerza, 5% probabilidad de crítico, 8% CDR natural, 151 resistencia veneno, un hueco). Un Reforge real produjo **156%** (+423 Inteligencia, 4,5% crítico, 5% velocidad ataque, 142 resistencia fuego, hueco). El siguiente Reforge real produjo **165%** (+433 Inteligencia, +425 Vitalidad, 4,5% crítico, 144 resistencia rayo, hueco). La fórmula simulada produjo la transición:

    CoE con 156%: seed 3035692732
        -- Reforge Legendary -->
    CoE con 165%: seed 4015360194

También se calculó una continuación de **11 operaciones \`RSSRSSSSSRR\`** hasta un Primal natural (poder 200%, seed final \`2122496372\`), pero esa continuación está guardada como **simulación**, no como una secuencia completa confirmada en Switch. La prueba automatizada está en [tests/engine.test.mjs](tests/engine.test.mjs).

**2. Firebird's Breast: tres fotografías, dos Reforges reales.**

| Estado | Armadura visible | Valores en pantalla | Origen |
| --- | ---: | --- | --- |
| **A** | **668** | **416 INT**, Vida **10%**, experiencia por muerte **198**, radio recogida **+2**, Explosive Blast **11%**, **3 huecos** | Drop / Kadala / GR / Nephalem Rift (no se sabe cuál exactamente) |
| **B** | **752** | **456 INT**, **484 VIT**, resistencia rayo **149**, espinas **5366**, Explosive Blast **13%**, **3 huecos** | Un Reforge desde A |
| **C** | **738** | **443 INT**, **476 VIT**, Vida **11%**, resistencia veneno **149**, radio recogida **+1**, **3 huecos** | Un Reforge desde B |

La cadena matemática inferida y reproducida **con el código Rust original de D3Recipes** es:

    A: 3525123180
        -- R --> B: 2645309652
        -- R --> C: 3835143639

Las seeds se **dedujeron**: no las extrajimos directamente de la memoria de la consola. El modelo generó exactamente los valores y las familias de afijos de B y C. [Prueba Rust original](https://github.com/ironangelo/Nephalem-Lab/actions/runs/43560278798).

**3. Identificamos un error conceptual de recuperación.** Los atributos que tenía A cuando cayó no se explican usando directamente la función de valores de un Reforge con su seed precursora. Inicialmente salieron **36.435** candidatas; ampliando órdenes internos, **145.668**, pero ninguna reproducía correctamente A → B. **No era un error de transcripción:** tenemos la fotografía original.

**4. ¡Encontramos una forma de recuperar la seed de un drop usando un solo Reforge!** Partimos únicamente de los atributos que tenía **B** después del primer Reforge. El proceso fue:

    Foto del resultado B
      → 24 seeds compatibles con sus valores
      → invertir las 6 tiradas RNG: 25 seeds precursoras
      → simular los Reforges completos y filtrar calidad/afijos/valores
      → UNA sola seed compatible: 3525123180

Por eso recuperamos la seed precursora de A **sin requerir sus atributos originales**. Lo comprobamos de forma exhaustiva para este caso; no está demostrado todavía para todos los objetos de Diablo III. [Prueba reproducible](https://github.com/ironangelo/Nephalem-Lab/actions/runs/43563886534).

**5. La fórmula que sí reprodujimos:**

    x0 = (666 × 2^32) + seed_actual
    x_siguiente = (x_actual mod 2^32) × 0x6AC690C5 + floor(x_actual / 2^32)
    seed_nueva = x_final mod 2^32

El número de avances depende de la operación y de los afijos. En los dos Reforges normales de la pechera fueron **6 avances**; en el CoE normal estudiado fueron **4**. NO generalizar ese número.

**6. La fórmula universal del drop sigue siendo desconocida.** D3Recipes contempla estados RNG de **64 bits** para ciertas creaciones de objeto (\`drop_item\`) y seeds de **32 bits** para Reforge. Probamos los 2³² valores de la mitad superior del estado con siete modelos y encontramos **múltiples** estados compatibles con los atributos originales de A. No conseguimos identificar una **única** fórmula real para drops de monstruos o Kadala. [Pruebas de 64 bits](https://github.com/ironangelo/Nephalem-Lab/actions/runs/43563626496).

## Ruta Soulstone hasta Firebird's Breast Primal

Punto de partida: **pechera C, 443 INT**, seed inferida **3835143639**.

La mejor ruta encontrada según el **costo relativo ponderado** utilizado:

    SSSSCSSCCSSR

- **S:** Sanctify con Angelic Crucible (8 veces).
- **C:** Convert Set Item (3 veces; cambia la pieza del conjunto).
- **R:** Reforge Legendary (1 vez, al final).

Costo calculado: **80 Forgotten Souls + 30 Death's Breaths + 5 materiales de cada acto + 8 Angelic Crucibles**. El objetivo es un **Primal natural**, no una pieza santificada. El algoritmo también encontró rutas de **11 operaciones**, pero requerían **6 Reforges** (300 o 330 Forgotten Souls más materiales), así que la ruta de 12 operaciones ahorra muchos materiales. [Búsqueda de rutas](https://github.com/ironangelo/Nephalem-Lab/actions/runs/43608812537).

**Secuencia y piezas:**

| Paso | Acción | Resultado esperado | Seed siguiente inferida |
| ---: | --- | --- | ---: |
| 1 | S | Pechera santificada | 2170510334 |
| 2 | S | Pechera santificada | 4278534881 |
| 3 | S | Pechera santificada | 2162753457 |
| 4 | S | Pechera santificada | 4081551520 |
| 5 | C | **Firebird's Down (pantalones)** | 1587946938 |
| 6 | S | Pantalones santificados | 532024587 |
| 7 | S | Pantalones santificados | 2513811997 |
| 8 | C | **Firebird's Plume (casco)** | 2056686315 |
| 9 | C | **Firebird's Breast (pechera)** | 3284081009 |
| 10 | S | Pechera santificada | 1985892588 |
| 11 | S | Pechera santificada | 3027404123 |
| 12 | R | **Pechera Primal natural** | **1415768159** |

**Crucial para verificar los pasos S:** cuando Sanctify genera seis afijos, el **poder naranja reemplaza al último secundario**. Por eso no hay que esperar que aparezca en pantalla. La seed siguiente se calcula una tirada antes, y **no se rompe la receta**. Lo comprobamos en el paso 1 real: salió +650 INT, +650 VIT, +15% Blizzard, +210 resistencia veneno, tres huecos y el poder naranja de Arcane Orb; el bonus +260 experiencia no aparecía porque fue reemplazado.

El Primal final predicho tiene:

- **650 INT; 650 VIT; +15% Vida; 3 huecos; +210 resistencia fuego; +38.625 vida de pociones/esferas.**
- En la **Mística**, cambiar +38.625 vida de esferas por **hasta 7% de reducción de daño cuerpo a cuerpo**, dejando todo lo demás intacto.

**CONFIRMACIÓN POSTERIOR DEL USUARIO (2026-11-14):** al preguntarle expresamente si la última fotografía se obtuvo **justo después de completar las 12 operaciones `SSSSCSSCCSSR`**, respondió: **«Sí, exactamente al terminar el último paso»**. Por tanto, la ruta completa se ejecutó realmente en la Switch 2 en ese orden y el objeto final fotografiado coincide **en todos los afijos visibles** con el Primal natural predicho (también muestra **759 Armor**, que el simulador NO calcula). **Este es un éxito real de predicción de extremo a extremo**, respaldado por el testimonio sobre las 12 operaciones y las fotografías del primer Sanctify y resultado final. No significa que hayamos leído las seeds internas ni que cada uno de los once estados intermedios haya sido fotografiado por separado. La calidad Primal de la operación R final está respaldada por el relato de la ruta; la foto recortada no presenta una etiqueta textual completa de calidad. [Verificación del camino con el Rust original](https://github.com/ironangelo/Nephalem-Lab/actions/runs/43608386485).

Para comparar **todos los afijos visibles de cada paso, incluidos los secundarios reemplazados** abre [FIREBIRD_SOULSTONE_ROUTE.md](research/FIREBIRD_SOULSTONE_ROUTE.md).

## Archivos del repositorio para continuar

- [CONTINUITY.md](CONTINUITY.md) — registro técnico principal y fuentes.
- [COE_AND_FIREBIRD_EXPERIMENTS.md](research/COE_AND_FIREBIRD_EXPERIMENTS.md) — crónica detallada de ambos experimentos.
- [SEED_MODEL_AND_DROP_RECOVERY.md](research/SEED_MODEL_AND_DROP_RECOVERY.md) — teoría, fórmula, escáneres completos, diferencias entre drop/R/S/C.
- [FIREBIRD_SOULSTONE_ROUTE.md](research/FIREBIRD_SOULSTONE_ROUTE.md) — receta completa y números de cada estado.
- [EXPERIMENT_VECTORS_2026-11-14.json](research/EXPERIMENT_VECTORS_2026-11-14.json) — datos estructurados para futuras pruebas automáticas, incluidos los SHA-256 de las seis fotografías relevantes de Firebird.
- [Ramas de investigación](https://github.com/ironangelo/Nephalem-Lab/branches) — los algoritmos experimentales están separados del APK y de \`main\`.

**Fotos:** los valores están transcritos en estos registros; los archivos binarios de las fotos originales de la conversación **todavía no están subidos al repositorio**. No confundir un hash de imagen documentado con una copia de imagen archivada.

## Qué investigar después

1. **Validar otro tipo de pieza** con una sola transformación conocida para comprobar si la recuperación 24 → 25 → 1 también se repite.
2. Investigar la **seed original de drops/Kadala** desde foto sin operación: todavía requiere descubrir la relación exacta entre estado de 64 bits, selección de afijos y seed interna persistente.
3. Modelar la **armadura base visible** como restricción adicional; hasta ahora no se calculó matemáticamente.
4. **El usuario confirmó haber terminado ya las 12 operaciones**: no proponer repetir S/S/C/R. Conservar la pieza final, comprobar la etiqueta de calidad si hace falta y, solo si corresponde, hacer el cambio opcional con la Mística.
5. Conservar resultados contradictorios como pruebas para mejorar el modelo. No borrarlos ni inventar resultados por conveniencia.

**Sin nuevas operaciones, sin APK y sin gastar materiales para escribir esta continuidad.**


## Nuevo caso (2026-11-14): Firebird's Eye de Kadala — Convert real confirmado, seed recuperada

**Evidencia inicial (fotografía real):** fuente arcana `Firebird's Eye`, obtenida de Kadala, **nunca reforjada ni santificada**, con daño 346–425, +19% daño de habilidades de fuego, +705 INT, +686 VIT, +152 experiencia por muerte, +11 poder arcano máximo y +10% daño Magic Missile. La calidad exacta (normal/Ancient) no está establecida por la etiqueta visible. La seed interna de este drop **NO fue recuperada** desde la foto.

**Objetivo Soulstone Firebird Twister:** fuente arcana *Primal natural*, priorizar `ArcanePowerOnCrit = 4`, probabilidad de golpe crítico y después INT / CDR / RCR / daño a élites; evitar secundarios de miedo/retroceso. Referencia: https://www.soulstone.gg/firebird-twister-wizard. El objeto actual no muestra ni APoC ni CHC, por lo que la Mística sola no lo perfecciona.

**Nueva herramienta matemática probada en investigación:** `Convert Set Item` del Eye por un Wizard de su misma clase usa un paso RNG antes de elegir el objetivo y permite invertir directamente la seed de origen **si** conocemos la seed del objeto convertido:

    seed_convertida = (1791398085 * seed_original + 666) mod 2^32
    seed_original   = ((seed_convertida - 666) * 2319347213) mod 2^32

El multiplicador `2319347213 = 0x8A3E6E0D` es el inverso multiplicativo de `0x6AC690C5` módulo 2³². La conversión cuesta **10 Forgotten Souls y 10 Death's Breaths**, cambia Eye a *otra* pieza Firebird y da calidad normal, no Ancient/Primal. **No es una receta Primal final**.

**Prueba computacional separada:** se hizo un Convert sintético de Firebird's Eye con una seed temporal conocida y luego se ocultó esa seed; se recuperaron **24** posibles seeds del resultado por su descripción numérica y **una sola precursora exacta** al invertir C y verificar todos los afijos y valores. Caso sintético `3525123180 --C--> Firebird's Breast 3286999478` con regreso correcto a `3525123180`. **¡La prueba NO identifica la seed de la Eye real del usuario!** Ver https://github.com/ironangelo/Nephalem-Lab/actions/runs/43613931345 y código en https://github.com/ironangelo/Nephalem-Lab/tree/research/firebird-eye-kadala.

**ACTUALIZACIÓN — CONVERSIÓN REAL EJECUTADA Y FOTOGRAFIADA:** `Firebird's Eye` de Kadala se convirtió UNA VEZ en **Firebird's Down**, 704 Armor, 425 INT, 490 VIT, 148 resistencia al fuego, 2621 espinas, 2 huecos y +10% Magic Missile. Invertimos exhaustivamente las 2³² seeds: **12 hipótesis de orden de afijos, 123 seeds numéricamente compatibles, una sola precursora al reproducir completa la conversión**. Seeds INFERIDAS: **Eye origen 4016194486 → C → Down actual 930643368**. Test real: https://github.com/ironangelo/Nephalem-Lab/actions/runs/43615140781. Rust original verificó el mismo estado y **las rutas siguientes**: https://github.com/ironangelo/Nephalem-Lab/actions/runs/43615878705.

**Rutas Primal NATURAL CALCULADAS, todavía NO ejecutadas por el usuario:**
- **Menos pasos, sin Mística:** `RCSSSRSSR`, 9 operaciones desde **Down actual**: 3 R, 1 C, 5 S = 160 Forgotten Souls, 10 Death's Breaths, 15 materiales de cada acto, 5 Crucibles. Firebird's Eye Primal final modelada: **1000 INT / 4 APoC / 10% CHC / 20% Fuego / 14 máximo arcano / 2,59% prob. cegar al golpear**, sin miedo ni retroceso. Seed final inferida **1318732109**.
- **Menos Souls y contratos (un paso más y requiere Mística):** `SSSSSRCSCR`, 10 operaciones: 2 R, 2 C, 6 S = 120 Souls, 20 DB, 10 materiales de cada acto, 6 Crucibles. Primal final **1000 INT / 4 APoC / 20% Fuego / 14 máximo arcano / 15% Hydra / 35% oro**; cambiar Hydra → **10% CHC** con Mística. Seed final inferida **1980719662**.
- **Menos Crucibles:** `CCCSSRCCSR`, 10 operaciones, 3 Crucibles, 2 R, 5 C, 150 Souls, 50 DB y 10 materiales de cada acto; Mystic de Arcane Torrent → CHC.

La documentación completa y todos los checkpoints están en [FIREBIRD_EYE_KADALA_SEED_AND_ROUTES.md](research/FIREBIRD_EYE_KADALA_SEED_AND_ROUTES.md). Los costos parten de los **pantalones actuales**: no cuentan los 10 Souls +10 DB gastados en la única conversión REAL anterior. La regla de Sanctify de último secundario reemplazado se aplica a pantalones santificados de seis afijos. No se predice la identidad del poder naranja ni el daño base de la fuente Eye.

**Estado de ejecución:** la conversión inicial sí ocurrió en la Switch 2. **No hay todavía ninguna operación real posterior sobre esos pantalones.**

**Selección explícita posterior del usuario:** prefiere la ruta que ahorra **Forgotten Souls**, por tanto queda elegida **`SSSSSRCSCR`** (10 operaciones desde Firebird's Down seed inferida `930643368`, 120 Forgotten Souls, 20 Death's Breaths, 10 materiales por acto, 6 Crucibles y Mística final Hydra → CHC). Solicitó el formato de lista interactiva marcable para seguir cada paso. **Todavía no ha confirmado la primera santificación de esta ruta**; no marcar operaciones realizadas ni confundir la conversión anterior con el paso 1. El próximo paso dependerá de si el usuario elige la ruta corta (R) o la ahorradora de Souls (S); verificar la siguiente fotografía antes de avanzar.

## SEGUNDO ÉXITO REAL — Firebird's Eye de Kadala Primal (2026-11-14)

**¡Funciona también la ruta que ahorra Forgotten Souls!** Tras elegir explícitamente la secuencia `SSSSSRCSCR` desde Firebird's Down (seed inferida 930643368), el usuario informó **«Funciono!! E hice el reroll stat con mystic!!»** y compartió una foto de su Firebird's Eye con borde Primal rojo y el símbolo azul de atributo cambiado por la Mística al lado de CHC.

Valores visibles de la foto, todos coincidentes con la predicción: **+485–600 daño** (daño base observado, NO simulado); **+20% daño de fuego**; **+1000 Inteligencia**; **+10,0% probabilidad de crítico** (reroll); **críticos otorgan 4 poder arcano**; **+35% oro de monstruos**; **+14 poder arcano máximo**. Resultado **Primal alcanzado y Mística completada**. La predicción previa a la Mística era +15% daño de Hydra, cambiado por +10% CHC; no existe fotografía individual del estado previo a la Mística. La seed final modelo sigue siendo **1980719662**, no leída directamente de la Switch.

**Evidencia:** foto `image-1794676452913.jpg`, SHA-256 `780fd785701d0f8d79f7f31c619e82faee6963c4cebf1b73f0fd362db290f51f` (el binario no se ha cargado a GitHub). Ver [bitácora de Firebird's Eye actualizada](research/FIREBIRD_EYE_KADALA_SEED_AND_ROUTES.md) y [vectores del experimento](research/EXPERIMENT_VECTORS_2026-11-14.json).

**ESTADO AL RETOMAR:** la Firebird's Eye de Kadala ya llegó a Primal con todos los afijos recomendados y el reroll realizado. **No sugerir más R, S, C ni otro reroll sobre esta pieza.** Es el segundo caso real exitoso del método junto con la pechera Firebird's Breast. Sigue pendiente descubrir la fórmula general de drop directo desde una foto sin transmutación conocida.


## NUEVO DESAFÍO — Deathwish de drop (2026-11-14) — AÚN SIN OPERACIONES

Nueva espada legendaria **Deathwish** que el usuario obtuvo como drop (no recuerda si GR o Kadala). Foto de la Switch 2, **2.306,1 DPS**, daño adicional **+1.166–1.382**, **652 INT**, **726 VIT**, **+6% velocidad de ataque**, **+7.904 vida por muerte** y **poder legendario 250%**. Origen exacto no confirmado, sin operación de Cubo realizada todavía.

**Objetivo Soulstone Firebird Twister:** Deathwish Primal natural con poder legendario **325%** máximo, daño base alto, **+10% daño del arma, +10% CDR, daño contra élites**, preferiblemente daño elemental de **frío o rayo** (Elemental Exposure), sin miedo ni retroceso al golpear. El esquema de atributos obliga a considerar **un cambio legal final con la Mística**, probablemente INT→% daño a élites si ya aparecen Damage% y CDR.

**Descubrimiento técnico importante:** el modelo genérico de recuperación no agrupaba los **dos valores de daño físico/elemental de la espada** dentro de un único afijo, por eso sus hipótesis fallaban con armas incluso en escenarios sintéticos. Nuevo recuperador experimental \`research/deathwish-weapon-inversion.mjs\` en la rama \`research/deathwish-kadala-drop\`: **8 Deathwish simuladas de calidad normal recuperaron correctamente las hipótesis de valores verdaderas** ([CI](https://github.com/ironangelo/Nephalem-Lab/actions/runs/43621783913)). **No se modificó APK ni motor de producción.**

**Prueba exhaustiva desde la foto del drop, sin transmutación:** 8 hipótesis del orden/afijos; se probaron las **2³² seeds** y **cero** reprodujeron todos los siete valores bajo \`values(item,seed)\` del modelo Reforge ([CI](https://github.com/ironangelo/Nephalem-Lab/actions/runs/43621890671)). Como con Firebird's Breast original, no se puede inferir la seed persistente desde la fotografía con ese modelo; NO significa que la foto esté mal.

**Comparación de materiales:** no permite Convert Set Item porque Deathwish no pertenece a un set. **Sanctify sola es ambigua**, ya que maximiza números: 120.000 pruebas de seeds distintas dieron solo 4.805 combinaciones de familias de afijos visibles. Una prueba completa con un **Reforge normal sintético** (seed fuente 8, resultado numérico seed 302004969) logró recuperarla desde el resultado observado en dos búsquedas exhaustivas 2³²: **1 resultado y 1 precursor, seed 8 original** ([CI](https://github.com/ironangelo/Nephalem-Lab/actions/runs/43622045160)). NO se ha probado con Deathwish real aún.

**Próximo experimento sugerido, todavía NO realizado:** un solo **Reforge Legendary** sobre la espada original sin modificar (50 Forgotten Souls y 5 materiales de cada acto), fotografiar resultado completo, detenerse. Desde esa observación buscar una seed única; con la seed actual resultante optimizar rutas usando R/S hacia un Primal natural Soulstone, haciendo énfasis en costo, pocos pasos y un único cambio de Mística. El resultado puede ser normal/Ancient/Primal y necesitar otro modelo si sale Ancient. **NO inventar seed ni receta final sin haber visto esa fotografía.**

**Informe técnico:** [DEATHWISH_DROP_SEED_AND_PRIMAL_PLAN.md](research/DEATHWISH_DROP_SEED_AND_PRIMAL_PLAN.md). **Estado al retomar:** Deathwish todavía no reforjada, no santificada y sin seed identificada.


### Deathwish: Reforge REAL completado, seed recuperada y alternativas Primal (2026-11-14)

**Actualización de la sección de Deathwish anterior:** el usuario **ya efectuó el Reforge diagnóstico una sola vez**. Foto real de Kanai: Deathwish normal con **253% poder legendario**, +1096–1361 **Fuego**, 715 INT, 701 VIT, 18% daño de área y 1,6% probabilidad de aturdir; 2111,9 DPS. **NO pedir otro Reforge diagnóstico.**

**Descubrimiento matemático del redondeo:** el atributo mostrado como **1,6% aturdir** representa una tirada interna **1,56%**; usar 1,60% exacto hacía fallar el escáner. Corregido el redondeo, los dos barridos exhaustivos de 2³² seeds dieron una única pareja que reproduce exactamente todos los valores, afijos, calidad y transición:

- **Drop original: seed inferida 1184690904.**
- **Deathwish ACTUAL después de ese Reforge real: seed inferida 46826983.**
- [Análisis completo con inversor corregido](https://github.com/ironangelo/Nephalem-Lab/actions/runs/43628361826); [reproducción independiente con Rust original](https://github.com/ironangelo/Nephalem-Lab/actions/runs/43629140525). Las seeds siguen siendo inferidas, no extraídas de memoria.

**Búsqueda de rutas Primal NATURAL desde la espada actual (aún NO ejecutadas):**

| Objetivo | Secuencia | Operaciones | Almas olvidadas | Crucibles |
| --- | --- | ---: | ---: | ---: |
| Mínimo de Souls encontrado, fuego/frío/rayo no estricto | SSSSSSSSRSSSSSSSSRSSRSR | 23 | **200** | 19 |
| **Daño de RAYO, todos los requisitos de Soulstone, mejor ahorro Souls** | **SRRSSRSSSSSSSSSSSSSSSRR** | **23** | **250** | **18** |
| Daño de FRÍO, menos pasos | SRRSRRSSSSSSSSSRRR | 18 | 350 | 11 |
| Daño de RAYO | RSRRSSSRRSSSRRSSR | 17 | 400 | 9 |
| Daño de RAYO, mínimo de pasos encontrado | RRSRRRSRSSRSRSSR | 16 | 450 | 7 |

Las cantidades de materiales de contratos son 5 por acto por cada R. En la ruta de 23 pasos/250 Souls, el resultado final simulado y validado por Rust original es: Primal Deathwish, **325% poder**, daño **+1560–1940 Rayo** (tiradas internas 1560 y 380), **+1000 INT** (para cambiar con Mística a **+8% daño a élites**), **+10% daño del arma**, **+10% CDR**, secundario **2,59% ralentizar al golpear**. Semilla final inferida **1326569675**. Añadir hueco con regalo de Ramaladni si corresponde. [Comparación exhaustiva por presupuestos](https://github.com/ironangelo/Nephalem-Lab/actions/runs/43628886291).

La opción de **200 Souls** da daño **Sagrado**, no el Frío/Rayo opcional de Soulstone; este último añade una acumulación de Elemental Exposure (aprox. +5% daño). **No hay una receta globalmente única más barata en recursos incomparables**: 250 Souls/18 Crucibles vs 350 Souls/11 Crucibles es una decisión. La búsqueda solo demuestra óptimos dentro de los límites explorados.

**ESTADO ACTUAL:** la espada es la Deathwish **normal de 253% y seed inferida 46826983**. La próxima operación de la ruta final **todavía no está hecha**. **No empezar ninguna secuencia diferente ni realizar la Mística hasta escoger una ruta y comprobar cada paso.** [Documento completo](research/DEATHWISH_DROP_SEED_AND_PRIMAL_PLAN.md).
