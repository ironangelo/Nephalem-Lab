# Investigación: RNG de fabricación directa del herrero — Diablo III Switch 2 (17-11-2026)

> **ESTADO: REVERSE ENGINEERING PARCIAL + HIPÓTESIS COMPARABLES, NO EXISTE AÚN PREDICTOR VALIDADO DE N.º DE FABRICACIONES HASTA UN AUG HILD NATURAL PRIMAL.** NO se analizó binario ejecutable de Diablo III ni se obtuvieron saves actuales del usuario. Las reglas de RNG de Reforge/Kanai NO son automáticamente las del herrero. No asegurar semillas basadas en reloj sin evidencia.

## Problema

Fabricar directamente **Aughild's Power** / **Captain Crimson** en Blacksmith y obtener **Primal Ancient NATURAL** con afijos Soulstone (p.ej. para Aughild's Power: INT, CDR, RCR y VIT/Life/Armor; una posible línea intercambiable legalmente por Myriam). Si direct blacksmith produces different values after a true rollback to identical saved state, what RNG changes? User asks whether item outcome cycles each second and whether exact Primal can be forced with timing.

## Evidencia encontrada, de mayor a menor fuerza

1. **Código de formato de guardado de D3 decompiled protobuf:** `GoobyCorp/D3Edit/Research/decompiled/proto2/Items.proto`, estructura `D3.Items.Generator`: `required uint32 seed = 1`, `base_affixes`, `flags`, `item_quality_level`, `enchanted_affix_seed`, `item_unlock_timestamp`. Fuente: https://github.com/GoobyCorp/D3Edit/blob/master/Research/decompiled/proto2/Items.proto. Los objetos guardan una seed propia. Esto NO prueba cómo se elige una seed de nueva pieza.
2. **Código de formato de guardado de héroes**: `GoobyCorp/D3Edit/Research/decompiled/proto2/Hero.proto`, `ConsoleRandomVendorSeed` con `item_slot_key`, `random_item_seed`, `random_item_carry=666`; almacenado en `Hero.ConsoleData.random_item_vendor_seed_list`. Fuente: https://github.com/GoobyCorp/D3Edit/blob/master/Research/decompiled/proto2/Hero.proto. Excelente pista para vendedor aleatorio de consola, consistente con el carry 666 en D3Recipes; **NO identificar ni confundir esta estructura de vendedores con el RNG de Blacksmith sin ver el código que la consume**.
3. **Ingeniería inversa de Kanai por FNGarvin/d3recipes**: https://github.com/FNGarvin/d3recipes/blob/main/core/src/sim.rs. `Rng::new(seed)` inicializa estado con carry 666 y `MULT=0x6AC690C5`; modela Reforge, Upgrade Rare, Convert Set, Sanctify, Primalize; **NO contiene una función que demuestre creación directa de Aughild/Crimson por el herrero**. `Craft & upgrade` en README/plan.rs = herrero fabrica objeto RARO + Hope of Cain, distinto de forjar directamente SET LEGENDARIO. No transferir predictibilidad del primero al segundo.
4. **Simulador benstepp/d3sim**: https://github.com/benstepp/d3sim/blob/master/src/lib/crafting/craft-item.js y https://github.com/benstepp/d3sim/blob/master/src/lib/util/index.js. Simula craft con `Math.random()`, antiguo (solo Ancient/normal, sin Primal). **NO reverse engineering del binario D3 Switch**; no permite afirmar que el herrero use `Math.random`, un reloj, ni una seed por segundo.
5. **Testimonio comunitario directo, no fuente oficial**: u/Ambitious_Captain_36 afirma que desarrolladores no modificaron la generación directa de sets en Blacksmith y que Aughild/Guardian se pueden intentar de nuevo tras rollback sin guardar: https://www.reddit.com/r/diablo3/comments/1e2ts2q/console_players_recipe_for_cheap_primals_s32/. Usuario u/Wolfspyda9 distingue: los raros + Cube siguen secuencia fija, la fabricación directa de SETS *"is not fixed"*: https://www.reddit.com/r/diablo3/comments/1uu1cpx/any_cheap_primal_recipes_for_console/. Reddit 2019 también destaca blacksmith como excepción: https://www.reddit.com/r/diablo3/comments/bwe1mo/. **Contradicción:** algunos comentarios en Blizzard Forums dicen Blacksmith también da idénticos resultados al reiniciar: https://us.forums.blizzard.com/en/d3/t/proof-that-drops-are-not-rng-but-are-somehow-pre-determined/64613?page=2. Puede ser confusión entre fabricar raros, mejorar raros y sets. No está universalmente resuelto.
6. **Blizzard oficial**: https://news.blizzard.com/en-us/article/22989464/legendary-an-ancient-primal-guide. Ancestrales pueden proceder de Blacksmith; Primals de cualquier fuente de Legendarios después de GR70 solo. No explica algoritmo/seed/tiempo.
7. **Blizzard 2014 cita Lylirra** (época anterior a cambios de consolas): https://www.purediablo.com/diablo-3-rng-when-and-how-are-item-stats-determined. Se calculan al generar cada objeto, no implica que haya un objeto precalculado por cada segundo. **No extrapolar sin cuidado a consola actual 2026**.
8. **Precedente en el proyecto**: https://github.com/ironangelo/Nephalem-Lab/blob/main/research/AUGHILD_BLACKSMITH_CRAFT_SEED_EXPERIMENT_2026-11-15.md. Usuario ya obtuvo un Aughild's Power NATURAL PRIMAL del herrero, con INT650/VIT650/AreaDamage20%/ExplosiveBlast15%, PhysRes210, Gold35%, no todos los stats exactos de Soulstone (RCR y CDR faltan). Otros normales fabricados. CONFIRMADO que se puede lograr Primal natural directamente, pero no se conoce ruta de N intentos.

## Lo que NO implica el comportamiento variable

- NO se puede inferir que *cada segundo exista un objeto predestinado distinto*. Lo normal en PRNG es consumir números **cuando ocurre el evento de fabricación**. El reloj puede servir para inicializar el PRNG al iniciar sesión, pero también pueden intervenir estado en RAM, generación de entropía, thread scheduling, contador interno, actividad previa o fuentes externas. **No hay evidencia que fije resolución de tiempo 1s**.
- Si el mismo estado guardado restaurado produce resultados distintos, refuta solo un *modelo completamente determinista desde esa foto de partida*. No prueba por sí mismo `seed = UnixSeconds` ni `seed = timestamp al tocar craft`.
- Puede haber **dos capas de RNG**: (A) selección de seed/quality del nuevo objeto; (B) estadística/afijos generados desde esa seed. Conocer la regla (B) no predice (A).

## Experimento controlado de mínimo coste: distinguir 4 modelos

**PREREQUISITO CRÍTICO: asegurar guardado y preservación de TODAS las piezas Primal reales antes de explorar rollback.** Nintendo indica que las restauraciones de copias guardadas sobrescriben y no pueden revertirse; no usar sesión actual sin confirmación de seguridad; tampoco garantizar Switch2 mismo comportamiento que PS4. Referencias: https://en-americas-support.nintendo.com/app/answers/detail/a_id/41206 y https://en-americas-support.nintendo.com/app/answers/detail/a_id/68364.

Definir `F(orden, receta, quality, stats, segundos)` como huella visual de cada pieza: nombre, clase, base Armor, TODOS primarios y secundarios, sockets, calidad, tiempo exacto, operación previa y orden de fabricación.

### Ensayo A: persistencia vs semilla de sesión
Mismo estado guardado **S0** (con backups validados), misma clase/receta/materiales:
- A1: fabricar exactamente 2 Aughild's Power consecutivos, anotar huellas completas.
- Restaurar de verdad S0 sin arriesgar progreso.
- A2: repetir exactamente 2, mismo orden, sin otras acciones aleatorias.
- A3: repetir con pausa de 60 segundos ANTES del primer craft.
- A4: repetir después de una fabricación barata de objeto raro como perturbación del RNG.

Interpretación:
- Misma serie de 2 huellas completas en A1, A2 y A3 → fuerte evidencia de secuencia persistente indexada al save (pero no prueba globalidad).
- A1 ≠ A2 con idéntico save y acciones → descarta esa hipótesis estricta; es compatible con semilla de sesión/tiempo o fuente fresca.
- A1 = A2 pero A3 ≠ A1 → sugiere dependencia del tiempo *o* variación de sesión, no prueba precisión por segundo.
- A1 = A2 y A4 ≠ A1 → sugiere RNG compartido/contador de fabricación.
- Variaciones independientes en A1 y A2 → buscar correlaciones/valores de seed, más muestras antes de atribuirlo al reloj.

### Ensayo B: tiempo real
Solo SI A demuestra variabilidad, y con rollback controlado seguro: comparar resultados de fabricación inmediata vs espera 1 min vs espera 5 min, repetir varias veces cada condición; no controlar el horario únicamente por observar una correlación en una o dos piezas. Registro de timecode y capturas (sin automatizar hacks ni lectura de memoria).

### Ensayo C: ¿el RNG del SET comparte estado con fabricación RARA?
Desde S0: fabricar primero un raro barato y después Aughild vs fabricar Aughild primero. Si cambiar el orden modifica el primer Aughild, podría existir una corriente compartida; si no, corrientes separadas o coincidencia. Controlar guardado, clase, inventario, resto de actividades.

**Decisión de modelo:** no implementar predicción de próximos Primals hasta que una hipótesis pase predicción ciega contra nuevas sesiones. Con dos observaciones solo NO alcanza.

## ¿Cómo conseguir siempre un Primal perfecto?

- Si las fabricaciones directas son verdaderamente variables tras rollback y el rollback conserva materiales, **sí se puede repetir el intento** hasta obtener un Primal con los afijos requeridos, dejando una sola Mística legal; pero **ningún número finito asegura 100%** si la fuente es aleatoria.
- Aproximación común de Primal `p≈1/400` por creación elegible (NO garantizado en Blacksmith Switch2 por Blizzard): P(al menos un Primal entre n intentos independientes)=`1-(1-p)^n`. Un Primal con afijos correctos tiene probabilidad menor. No confundir predicción exacta con alto volumen de pruebas.
- Si se descubre una semilla/control RNG reproducible, podría buscarse **un disparador garantizado condicionado a un estado verificable**, diferente de prometer un Primal en una hora universal del reloj. Falta observación y código.
- No recomendar guardar/editar items con editor: no es fabricación Primal NATURAL en términos de juego limpio y no entrega el algoritmo pedido.

## Próximo requisito de datos del usuario

Para la siguiente etapa se necesita **una secuencia REAL mínima de dos fabricaciones de Aughild's Power con fotos completas, orden y si el estado se restauró exactamente o no**. No empezar por cambiar reloj ni gastar Souls/Crucibles. Conservar los Primals naturales ya creados. Una prueba sin rollback puede ayudar a registrar huellas, pero **no distingue si el rollback cambia RNG**, por eso un experimento A realmente controlado solo se hace cuando sea seguro recuperar la misma base.
