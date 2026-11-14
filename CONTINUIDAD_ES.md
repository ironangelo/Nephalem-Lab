# CONTINUIDAD — Investigación de seeds de Diablo III (Switch 2)

**Última actualización: 14 de noviembre de 2026.**  
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

**Tu fotografía más reciente coincide exactamente con todos esos atributos visibles** (y muestra **759 Armor**), y dijiste que funcionó. Es un resultado visual muy fuerte. No debemos afirmar que conocemos la seed directamente, ni inventar los pasos intermedios que todavía no quedaron documentados individualmente; la foto recortada no muestra una etiqueta textual completa de calidad Primal. [Verificación del camino con el Rust original](https://github.com/ironangelo/Nephalem-Lab/actions/runs/43608386485).

Para comparar **todos los afijos visibles de cada paso, incluidos los secundarios reemplazados** abre [FIREBIRD_SOULSTONE_ROUTE.md](research/FIREBIRD_SOULSTONE_ROUTE.md).

## Archivos del repositorio para continuar

- [CONTINUITY.md](CONTINUITY.md) — registro técnico principal y fuentes.
- [COE_AND_FIREBIRD_EXPERIMENTS.md](research/COE_AND_FIREBIRD_EXPERIMENTS.md) — crónica detallada de ambos experimentos.
- [SEED_MODEL_AND_DROP_RECOVERY.md](research/SEED_MODEL_AND_DROP_RECOVERY.md) — teoría, fórmula, escáneres completos, diferencias entre drop/R/S/C.
- [FIREBIRD_SOULSTONE_ROUTE.md](research/FIREBIRD_SOULSTONE_ROUTE.md) — receta completa y números de cada estado.
- [EXPERIMENT_VECTORS_2026-11-14.json](research/EXPERIMENT_VECTORS_2026-11-14.json) — datos estructurados para futuras pruebas automáticas, incluidos SHA-256 de las dos fotos más recientes.
- [Ramas de investigación](https://github.com/ironangelo/Nephalem-Lab/branches) — los algoritmos experimentales están separados del APK y de \`main\`.

**Fotos:** los valores están transcritos en estos registros; los archivos binarios de las fotos originales de la conversación **todavía no están subidos al repositorio**. No confundir un hash de imagen documentado con una copia de imagen archivada.

## Qué investigar después

1. **Validar otro tipo de pieza** con una sola transformación conocida para comprobar si la recuperación 24 → 25 → 1 también se repite.
2. Investigar la **seed original de drops/Kadala** desde foto sin operación: todavía requiere descubrir la relación exacta entre estado de 64 bits, selección de afijos y seed interna persistente.
3. Modelar la **armadura base visible** como restricción adicional; hasta ahora no se calculó matemáticamente.
4. No tocar nuevamente una pieza que ya cumpla el objetivo. Verificar siempre la **calidad real en el juego** y la posible modificación final con la Mística.
5. Conservar resultados contradictorios como pruebas para mejorar el modelo. No borrarlos ni inventar resultados por conveniencia.

**Sin nuevas operaciones, sin APK y sin gastar materiales para escribir esta continuidad.**
