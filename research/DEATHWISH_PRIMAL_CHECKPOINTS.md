# Deathwish — puntos de control reales calculados con Rust original

**ACTUALIZACIÓN REAL, 2026-11-14:** **EL PASO #1 DE LA RUTA ECONÓMICA DE RAYO YA SE HIZO**. El usuario confirmó «Exacto! Dio eso! Usemos la que recomienda 100% soulstone con el daño rayo» y fotografió Deathwish santificada, +1560–1940 **daño Sagrado**, +1000 INT, +1000 VIT, +10% CDR, 2,6% retroceso al golpear, poder legendario 325%, poder naranja Magic Missile dispara 10 proyectiles y adquiere Seeker, DPS visible 2842.0 (no modelado). Foto: `image-1794683016876.jpg`, SHA-256 `9c943d268215ab8301244c78d36ac1067874adc647747b26e75ca50cf4bb153b`. Los **22 pasos restantes todavía NO se realizaron**. **Ruta ELEGIDA: `SRRSSRSSSSSSSSSSSSSSSRR`**, 250 Souls, 18 Crucibles, 23 pasos desde la Deathwish post-Reforge. Próximo paso: **#2 R**, Deathwish **NORMAL**, 280% poder, daño Sagrado **1127–1360**, INT **629**, VIT **665**, **2,06% miedo al golpear** (puede aparecer como **2,1%**), hueco(s) no determinado. **Detenerse si los valores no coinciden.** El efecto naranja de Magic Missile en #1 es aleatorio y no fue simulado.

**2026-11-14.** Motor: FNGarvin/d3recipes, revisión fija 49fe28467db9ebbd096694d1408528b2c9ce5ea3. Simulaciones verificadas con [GitHub Actions](https://github.com/ironangelo/Nephalem-Lab/actions/runs/43629310015). **Salvo el paso #1, validado por fotografía real, los pasos siguientes siguen sin ejecutarse en Switch 2**; no confundir las predicciones posteriores con observaciones reales. El usuario realizó el Reforge diagnóstico inicial y el primer Crucible real de esta ruta: Drop seed inferida 1184690904 → Reforge normal seed 46826983 (253%) → Crucible santificado, seed inferida 2773532829 (325%).

**Leyenda:** R = Reforge Legendary; S = Angelic Crucible (santificar). Calidad *primal* solo cuando último R la produce. En los pasos S aparece además **un poder naranja aleatorio no predecible**; la selección tiene cinco afijos para esta arma, por lo que no se elimina automáticamente el último secundario como ocurrió en la pechera de seis afijos. No predecimos DPS total, y los porcentajes de estados internos como 2,59% pueden verse redondeados (2,6%) en la Switch.

## Ruta económica, daño de RAYO y todos los atributos Soulstone

**Secuencia SRRSSRSSSSSSSSSSSSSSSRR**: 23 operaciones = 5 R + 18 S. Costo desde el Deathwish actual: **250 Forgotten Souls**, **25 materiales de contratos de cada acto**, **18 Angelic Crucibles**, más una Mística (y Ramaladni si deseas hueco). Objetivo final: primal natural 325% poder, Rayo +1560–1940, +10% daño arma, +10% CDR, +1000 INT para cambiar a +8% daño contra élites, secundario ralentizar al golpear.

| Paso | Acción | Calidad | Poder legendario | Atributos modelados | Seed interna resultante inferida |
| ---: | --- | --- | ---: | --- | ---: |
| 1 | Crucible | sanctified | 325% | INT 1000; Daño sagrado +1560–1940; CDR 10%; VIT 1000; Retroceso 2.59% | 2773532829 |
| 2 | Reforge | normal | 280% | INT 629; Daño sagrado +1127–1360; VIT 665; Miedo 2.06%; Hueco(s): cantidad no calculada | 1237898586 |
| 3 | Reforge | ancient | 275% | INT 827; Daño veneno +1497–1877; Daño área 18%; EXP/muerte 249; Hueco(s): cantidad no calculada | 328037185 |
| 4 | Crucible | sanctified | 325% | INT 1000; Daño veneno +1560–1940; RCR 10%; Daño arma 10%; Vida por muerte 11590 | 1176417647 |
| 5 | Crucible | sanctified | 325% | INT 1000; Daño fuego +1560–1940; Vida por golpe 23950; VIT 1000; Retroceso 2.59% | 4169339848 |
| 6 | Reforge | ancient | 312% | INT 942; Daño sagrado +1429–1786; VIT 891; Daño área 19%; Indestructible 1 | 4141283498 |
| 7 | Crucible | sanctified | 325% | INT 1000; Daño sagrado +1560–1940; VIT 1000; CDR 10%; Retroceso 2.59% | 1888109819 |
| 8 | Crucible | sanctified | 325% | INT 1000; Daño fuego +1560–1940; RCR 10%; VIT 1000; EXP/muerte 260 | 3148084397 |
| 9 | Crucible | sanctified | 325% | INT 1000; Daño rayo +1560–1940; Daño arma 10%; CDR 10%; Vida por muerte 11590 | 3199899328 |
| 10 | Crucible | sanctified | 325% | INT 1000; Daño arcano +1560–1940; VIT 1000; RCR 10%; Vida por muerte 11590 | 2831136364 |
| 11 | Crucible | sanctified | 325% | INT 1000; Daño sagrado +1560–1940; Velocidad ataque 7%; Daño área 24%; Vida por muerte 11590 | 1261950146 |
| 12 | Crucible | sanctified | 325% | INT 1000; Daño fuego +1560–1940; VIT 1000; Daño área 24%; Vida por muerte 11590 | 3781962455 |
| 13 | Crucible | sanctified | 325% | INT 1000; Daño frío +1560–1940; Daño área 24%; Velocidad ataque 7%; EXP/muerte 260 | 1201198434 |
| 14 | Crucible | sanctified | 325% | INT 1000; Daño fuego +1560–1940; VIT 1000; Velocidad ataque 7%; EXP/muerte 260 | 2396431728 |
| 15 | Crucible | sanctified | 325% | INT 1000; Daño veneno +1560–1940; Velocidad ataque 7%; Daño arma 10%; Ralentizar 2.59% | 1808843628 |
| 16 | Crucible | sanctified | 325% | INT 1000; Daño fuego +1560–1940; Daño área 24%; Velocidad ataque 7%; Vida por muerte 11590 | 2846880183 |
| 17 | Crucible | sanctified | 325% | INT 1000; Daño rayo +1560–1940; VIT 1000; RCR 10%; Cegar 2.59% | 3261955117 |
| 18 | Crucible | sanctified | 325% | INT 1000; Daño veneno +1560–1940; Daño arma 10%; VIT 1000; EXP/muerte 260 | 4051673056 |
| 19 | Crucible | sanctified | 325% | INT 1000; Daño sagrado +1560–1940; Daño área 24%; RCR 10%; Vida por muerte 11590 | 2319537348 |
| 20 | Crucible | sanctified | 325% | INT 1000; Daño físico +1560–1940; VIT 1000; RCR 10%; Reducción requisito nivel 40 | 1277389067 |
| 21 | Crucible | sanctified | 325% | INT 1000; Daño fuego +1560–1940; VIT 1000; Velocidad ataque 7%; Enfriar 2.59% | 1592552797 |
| 22 | Reforge | normal | 305% | INT 627; Daño fuego +1063–1259; VIT 668; Daño arma 7%; Vida por muerte 6619 | 2005740531 |
| 23 | Reforge | primal | 325% | INT 1000; Daño rayo +1560–1940; Daño arma 10%; CDR 10%; Ralentizar 2.59% | 1326569675 |

## Ruta más corta con menos Crucibles, daño de FRÍO

**Secuencia SRRSRRSSSSSSSSSRRR**: 18 operaciones = 7 R + 11 S. Costo: **350 Forgotten Souls**, **35 materiales de cada acto**, **11 Crucibles**. Primal final 325% poder, Frío +1560–1940, +10% daño del arma, +8% daño contra élites, +1000 INT para cambiar a **+10% CDR**, secundario indestructible.

| Paso | Acción | Calidad | Poder legendario | Atributos modelados | Seed interna resultante inferida |
| ---: | --- | --- | ---: | --- | ---: |
| 1 | Crucible | sanctified | 325% | INT 1000; Daño sagrado +1560–1940; CDR 10%; VIT 1000; Retroceso 2.59% | 2773532829 |
| 2 | Reforge | normal | 280% | INT 629; Daño sagrado +1127–1360; VIT 665; Miedo 2.06%; Hueco(s): cantidad no calculada | 1237898586 |
| 3 | Reforge | ancient | 275% | INT 827; Daño veneno +1497–1877; Daño área 18%; EXP/muerte 249; Hueco(s): cantidad no calculada | 328037185 |
| 4 | Crucible | sanctified | 325% | INT 1000; Daño veneno +1560–1940; RCR 10%; Daño arma 10%; Vida por muerte 11590 | 1176417647 |
| 5 | Reforge | normal | 320% | INT 747; Daño fuego +1017–1230; Daño área 24%; VIT 750; Vida por muerte 7314 | 1248993090 |
| 6 | Reforge | normal | 307% | INT 667; Daño físico +1192–1408; VIT 632; Velocidad ataque 6%; Vida por muerte 8811 | 3612315657 |
| 7 | Crucible | sanctified | 325% | INT 1000; Daño frío +1560–1940; VIT 1000; RCR 10%; Vida por muerte 11590 | 396855170 |
| 8 | Crucible | sanctified | 325% | INT 1000; Daño rayo +1560–1940; VIT 1000; RCR 10%; EXP/muerte 260 | 1154335337 |
| 9 | Crucible | sanctified | 325% | INT 1000; Daño arcano +1560–1940; Velocidad ataque 7%; VIT 1000; Vida por muerte 11590 | 2028414133 |
| 10 | Crucible | sanctified | 325% | INT 1000; Daño fuego +1560–1940; VIT 1000; Daño arma 10%; EXP/muerte 260 | 4007729048 |
| 11 | Crucible | sanctified | 325% | INT 1000; Daño rayo +1560–1940; Daño arma 10%; VIT 1000; Aturdir 2.59% | 2501075953 |
| 12 | Crucible | sanctified | 325% | INT 1000; Daño sagrado +1560–1940; Daño arma 10%; Velocidad ataque 7%; EXP/muerte 260 | 2736845113 |
| 13 | Crucible | sanctified | 325% | INT 1000; Daño arcano +1560–1940; Daño arma 10%; VIT 1000; EXP/muerte 260 | 849691716 |
| 14 | Crucible | sanctified | 325% | INT 1000; Daño rayo +1560–1940; Daño área 24%; VIT 1000; EXP/muerte 260 | 1977361904 |
| 15 | Crucible | sanctified | 325% | INT 1000; Daño arcano +1560–1940; VIT 1000; Daño arma 10%; Vida por muerte 11590 | 4253346016 |
| 16 | Reforge | normal | 285% | INT 633; Daño arcano +996–1196; Velocidad ataque 5%; EXP/muerte 164; Hueco(s): cantidad no calculada | 1115188467 |
| 17 | Reforge | normal | 293% | INT 713; Daño veneno +1090–1344; RCR 9%; Daño arma 10%; Aturdir 1.57% | 3935867931 |
| 18 | Reforge | primal | 325% | INT 1000; Daño frío +1560–1940; Daño arma 10%; Daño élites 8%; Indestructible 1 | 170084482 |

## Reglas para usar las tablas

1. El usuario **ya eligió la ruta de RAYO y 250 almas** (`SRRSSRSSSSSSSSSSSSSSSRR`). Ambos caminos comparten inicialmente `SRRS`, pero no cambiar de itinerario sin indicarlo. El primer Crucible ya está realizado y fotografiado; seguir con el paso #2 Reforge.
2. **Primer resultado esperado en ambos:** santificado, 325% poder legendario, daño Sagrado +1560–1940, INT1000, VIT1000, CDR10%, 2,59% probabilidad de retroceso al golpear (posible 2,6% en pantalla), poder naranja estacional aleatorio, seed modelada 2773532829.
3. Tener temporalmente *retroceso* o *miedo* es normal en pasos intermedios; **el Primal final de ambos caminos no tiene esos afijos**.
4. Si alguna fotografía no coincide con la fila correspondiente (salvo redondeo de porcentajes o poder naranja aleatorio), detenerse sin hacer la siguiente operación.
5. No encantar con Mística durante la ruta: afecta la interpretación del objeto y gasta recursos. Al final, el cambio en la ruta económica es **INT→Daño élites 8%**, y en la ruta corta **INT→CDR 10%**. El regalo de Ramaladni se puede usar *después* del Primal para obtener hueco sin sacrificar un primario.
6. Los modelos de D3Recipes no reconstruyen directamente el rango de DPS total visible ni garantizan que la seed interna sea leída de memoria. La trayectoria parte de una seed **inferida y contrastada por el Reforge real**.
