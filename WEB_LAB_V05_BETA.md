# Nephalem Lab v0.5 — Web Lab / sin APK

Esta **rama experimental** implementa un flujo de usuario ejecutable en navegador:

1. Elegir clase, objeto original y objetivo Primal.
2. Copiar los **afijos visibles del drop**. La app **NO** finge deducir su seed desde el drop.
3. Registrar el resultado **real** de **Reforge Legendary** (o **Convert Set Item**). Convert cambia a otra pieza del set.
4. Invertir primero las posibles **seeds hijas** (barrido completo de 2^32) y después las **seeds predecesoras** (otro barrido o inverso modular para Convert); reproducir la operación completa del Cubo y descartar coincidencias solo numéricas.
5. Si queda una sola seed, introducir presupuesto de Forgotten Souls, Crucibles, Death's Breaths y contratos por acto; buscar rutas **Primal natural** por R/S/C, y una única modificación **legal** de Myriam cuando corresponde.
6. Confirmar en la Switch los checkpoints antes de ejecutar el siguiente paso. Si la foto no coincide, **detenerse**.

## Ejecutar localmente la Web Lab (sin APK)

Desde la rama `feature/web-lab-v05-e2e`:

```bash
npm run build:wasm
python3 -m http.server 8080
```

Abrir http://localhost:8080/lab-v05.html en un navegador moderno. No abrir con `file://` porque la base de datos y los Web Workers necesitan HTTP. La App Web funciona en el navegador; no modifica la partida.

**Sitio público:** el intento de GitHub Pages mediante `.github/workflows/v05-pages-preview.yml` **no pudo crear el sitio**: permisos de la integración no permiten `Create Pages site` (error `Resource not accessible by integration`). No hay URL pública habilitada en este momento. El propietario del repositorio puede configurar **Settings → Pages → Source: GitHub Actions** y volver a ejecutar el workflow `V05 no-APK browser preview (GitHub Pages)`. No fusionar esta rama con `main` sin decidir antes el alcance beta.

## Resultados confirmados en automatización

- **Navegador Chromium real (no mocks):** ingresó la foto original Firebird's Down (INT422, ResistAll96, sockets2, Spectral Blade15%) y la única **Reforge real** (INT460, ResistAll93, Spectral14, oro33, espinas2748), SIN suministrar ninguna seed. Detectó **parent 2538758317**, **current 1745067528** y calculó **`CCRSCCSSCR`** en **1.554 nodos**, dentro de presupuesto 150 Souls / 3 Crucibles / 50 DB / 10 materiales por acto; final Primal y Mística Magic Missile→Armor. [Prueba integral que pasó](https://github.com/ironangelo/Nephalem-Lab/actions/runs/43998099041).
- **Reforge de Firebird's Breast**: browser recuperó seed `2645309652` desde INT456, Vit484, Explosive Blast13, LightningResist149, Thorns5366 y 3 sockets.
- **Reforge de Squirt's Necklace**: browser recuperó seed `800657787` desde Cold19, INT641, AttackSpeed7, CHD81, oro74, XP168 y el poder fijo del objeto.
- **Reforge de Deathwish**: browser recuperó `46826983` desde Power253, Fire Damage 1096–1361, INT715, VIT701, Area Damage18, **Stun1.6% mostrado (1.56% interno)**.
- **Seis recetas REALES** se reproducen de comienzo a fin por el motor actual, con las seeds finales exactas y calidad natural Primal: Firebird Breast, Eye, Deathwish, Squirt, Zodiac, Down. [Suite de seis éxitos](https://github.com/ironangelo/Nephalem-Lab/actions/runs/43998306127).
- **Cinco padres de Reforge reales**, con child seed y NÚMERO DE DRAWS exactos, pasan tests unitarios del nuevo WASM: Down, Breast, Squirt, Deathwish, Zodiac. [WASM inverse tests](https://github.com/ironangelo/Nephalem-Lab/actions/runs/43997804245).
- **Original Zodiac primera R Ancient**: requiere aceptar familias numéricas ambiguas y habitualmente una segunda R. El algoritmo conserva candidatas en vez de inventar una seed única. (Verificar el resultado de la prueba de navegador independiente antes de afirmar éxito).
- **Firebird Eye Kadala tras una C real**: se agregó inversión modular directa y se está verificando en navegador con los valores fotografiados; no declarar éxito hasta resultado de CI.
- **Primer Firebird Down S sin correlación**: sirve como caso NEGATIVO. La app no debe presentar las 31 seeds teóricas del drop como válidas; prefiere una Reforge o C real.

## Limitaciones aún conocidas

- Las seeds son **inferencias comprobadas contra transiciones visibles del juego**, no lecturas directas de RAM Switch.
- La investigación por navegador no consume recursos de Diablo; una primera Reforge o Convert real SÍ cuesta materiales.
- El planificador es **acotado al presupuesto/estados**; si alcanza límite debe mostrarlo. No demuestra mínimo global cuando la búsqueda se trunca.
- El poder naranja de Sanctify es aleatorio y no se predice. Un final Sanctified **no** es natural Primal.
- Myriam admite solo UN afijo cambiado; el coste aleatorio de obtener el sustituto correcto todavía no se predice.
- El UI v0.5 usa por ahora la transcripción manual de nombres técnicos y valores, no OCR.
- En algunas piezas un resultado normal o Ancient no contiene suficiente información. Debe solicitar más observaciones; NO fabricar coincidencias.
- La obtención de Primals directamente con el herrero (Aughild/Crimson) **no** está predicha por este motor.
- La UI nueva es beta separada de `universal.html` y de la APK; su integración final en la aplicación existente y el despliegue web público requieren pasos adicionales.

Esta rama se diseñó para probar flujo end-to-end desde fotos reales **sin hardcodear respuestas de seeds ni recetas en la app**. Solo los archivos de tests contienen las respuestas esperadas para detectar regresiones.
