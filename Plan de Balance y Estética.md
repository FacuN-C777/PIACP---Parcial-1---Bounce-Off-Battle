# Plan de Balance y Estética

## 1. Proposito de este documento

Este archivo es un **handoff entre sesiones** y la definicion del alcance del **paso 7 (ajustes de balance y esteticos)** del `Plan de Desarrollo.md`. Contiene los cambios determinados por el estudiante, transcritos tal cual fueron dictados, el estado verificado del codigo sobre el que se aplicaran y las preguntas de diseno a confirmar antes de implementar. No reemplaza a `Plan de Desarrollo.md`, `README.md`, `GDD.md`, `AGENTS.md` ni a `docs/`.

## 2. Reglas obligatorias (AGENTS.md)

Aplica todo lo declarado en `Plan de Desarrollo.md` seccion 3. En particular:

- No modificar parametros de balance o estetica sin que el estudiante defina valores especificos (los valores de este documento fueron dictados por el estudiante; las ambiguedades quedan en la seccion 7).
- No completar documentos con informacion inventada; solo registrar hechos verificados.
- No instalar dependencias, usar red, publicar cambios ni acceder a secretos sin autorizacion.
- Pagar la regla del paso 7: cambiar el ritmo no debe romper la regla de contacto ni el caso limite de la pelota atascada.

## 3. Estado verificado (codigo actual, base del cambio)

Fuente: `src/game/scenes/Partida.js`, `Menu.js`, `Victoria.js`, `src/game/main.js`.

### Balance (constantes en `Partida.js`)

| Parametro | Valor actual |
|---|---|
| `PADDLE_WIDTH` / `PADDLE_HEIGHT` | 20 x 130 |
| `PADDLE_SPEED` (velocidad de paleta jugador) | 420 |
| `BALL_RADIUS` | 10 |
| `BALL_SPEED` (velocidad inicial de pelota) | 340 |
| `CPU_SPEED` | `PADDLE_SPEED * 0.65` (273) |
| Bloques | 5 por lado, 26 x 140, gap 17, en `BLOCK_X_LEFT = 30` y `BLOCK_X_RIGHT = W - 30` |
| Regla de romper bloques | La pelota debe haber tocado la paleta del lado contrario (`haTocadoPalanca`) para romper; ante cada cruce del plano de bloques rompe el mas cercano (`encontrarBloque`) y rebota |
| Caso limite resuelto hoy | `encontrarBloque` impide que la pelota oscile en el hueco entre bloques (el espaciado es solo visual); al romper un bloque la velocidad se resetea a `BALL_SPEED` |

### Estetica

| Elemento | Estado actual |
|---|---|
| Fondo de escenas | `backgroundColor: '#028af8'` (azul) en `src/game/main.js` |
| Textos | Arial Black blanco `#ffffff` con delineado negro `#000000` |
| Botones | Rectangulo blanco `0xffffff` con texto azul `#028af8`; sin estados de hover ni de presion |
| Escenas | Menu, Partida, Victoria (misma estetica basica) |

## 4. Cambios de balance (determinados por el estudiante)

| # | Cambio | Regla determinada |
|---|---|---|
| B1 | Velocidad de pelota progresiva | Por cada rebote de la pelota que no destruya un bloque, su velocidad aumenta un **5%**, hasta alcanzar un **maximo del doble de su velocidad inicial** |
| B2 | Velocidad de CPU | Bajar la velocidad de la paleta del CPU al **50%** de la velocidad del jugador (reemplaza al factor 0.65 actual) |
| B3 | Paredes tras los bloques | Anadir paredes tras los bloques en cada extremo para que la pelota rebote contra ellas si golpea la posicion de un bloque ya destruido, y asi no recurrir a destruir el bloque mas cercano, cuya implementacion no resulta satisfactoria ni balanceada |

### Implicaciones previstas

- **B1**: `colisionarPaleta` hoy fuerza `vx = BALL_SPEED` en cada golpe; pasaria a usar una velocidad variable que se incrementa (factor que crece) y se capa en `BALL_SPEED * 2`. Define en la implementacion que rebotes cuentan y que pasa al romper un bloque (ver seccion 7).
- **B2**: cambio local de la constante `CPU_SPEED` en `src/game/scenes/Partida.js` (0.65 -> 0.50).
- **B3**: reemplaza la regla `encontrarBloque` (romper el mas cercano al cruzar el plano) por rebote contra una pared posterior. Es un cambio de diseno respecto de la decision documentada en `Plan de Desarrollo.md` secciones 5 y 10 y en `GDD.md`, que debera reflejarse si se aprueba.

## 5. Cambios esteticos (determinados por el estudiante)

| # | Cambio | Regla determinada |
|---|---|---|
| E1 | Fondo de escenas | El fondo de **todas** las escenas sera de color **negro o gris oscuro** |
| E2 | Texto de botones | El texto de los botones tendra un **delineado amarillo pastel** |
| E3 | Estados de boton | Si es posible, anadir un detalle de **oscurecer un boton al clickearlo o mantenerlo clickeado**, y un **ligero resaltado al pasar el cursor** sobre estos |
| E4 | Aspecto de la pelota | Cuando `haTocadoPalanca` es falso, la pelota se ve **gris claro (#BFBFBF) al 60% de opacidad**; al tocar una palanca vuelve al blanco solido |

## 6. Archivos previstos y verificacion

| Cambio | Archivos previstos |
|---|---|
| B1, B2, B3 | `src/game/scenes/Partida.js` |
| E1 | `src/game/main.js` (backgroundColor) y, si se usa un fondo de escena, las tres escenas |
| E2, E3 | `src/game/scenes/Menu.js`, `Victoria.js` (y `Partida.js` si aplica a elementos compartidos de boton) |
| E4 | `src/game/scenes/Partida.js` (`actualizarAspectoPelota`) |

Verificacion (mismas reglas del paso 7):

```powershell
node -e "const p=JSON.parse(require('fs').readFileSync('package-lock.json','utf8')); console.log(p.packages['node_modules/phaser'].version)"
npm.cmd run build-nolog
```

Ademas: prueba manual del flujo completo (Menu -> Partida 1J/2J -> Victoria -> Rejugar/Volver al Menu) y re-simulacion del modelo de partida en Node si B1 o B3 alteran la regla de contacto o el caso limite de pelota atascada.

## 7. Preguntas abiertas resueltas antes de implementar

Consultas al estudiante (2026-09-15) y decisión adoptada:

| Pregunta | Decisión adoptada |
|---|---|
| B1 acumulación y reset | x1.05 acumulativo sobre la velocidad actual; tope en el doble de la inicial; al romper un bloque se resetea a velocidad inicial |
| B1 qué rebotes cuentan | Solo golpes contra paletas; paredes no aceleran |
| B3 geometría y regla | Pared en el plano de bloques: al cruzar con palanca tocada, bloque presente se destruye y hueco rebota en la pared; sin palanca tocada la pelota sigue hasta el fondo (regla intacta); se elimina `encontrarBloque` |
| E1 color del fondo | Negro `#000000` |
| E2 delineado | Amarillo pastel `#FFF59D` (stroke de 3px en el texto de botones) |
| E3 estados de botón | Hover celeste claro `0x66B8FF`; click/mantener azul oscuro `0x0D5A8A`; aplica a los botones de Menu y Victoria |
| E4 aspecto de la pelota | Con `haTocadoPalanca=false`: gris claro `#BFBFBF` con alpha 0.6; al tocar palanca vuelve al blanco sólido |

## 8. Verificación ejecutada (2026-09-15)

- `npm run build-nolog`: compila OK (solo warning de chunk de Phaser, esperado).
- Simulación en Node del modelo nuevo (mismas constantes y fórmulas de `Partida.js`):
  - La pelota nunca sale de los límites ni se congela; el multiplicador se capa en 2x (maxVel ≈ 680, tope = 2x340).
  - Con dos paletas "perfectas" el rally es infinito (coherente con el diseño; solo se pierde al fallar).
  - **Cambio de comportamiento buscado**: las paredes hacen que una pelota que cruza el plano por un hueco rebote en vez de destruir el bloque más cercano. Consecuencia verificada: con un defensor ocioso que devuelve rebotes casi horizontales, la partida puede volverse un intercambio largo; la victoria ahora exige que el jugador desvíe la pelota con ángulo para apuntar a los bloques. Es el efecto que motivó el cambio B3 (ya no se fuerza la destrucción del más cercano).
- Prueba manual: declarada completa por el estudiante el 2026-09-15 (flujo Menu → Partida 1J/2J → Victoria → Rejugar/Volver al Menu y percepción del ritmo/estética). Desarrollo oficialmente completo; enlace de Vercel pendiente (acción del estudiante).

## 9. Permisos

Reutiliza la tabla de permisos del paso 7 de `Plan de Desarrollo.md` seccion 8, con los archivos previstos de la seccion 6 de este documento. Archivos fuera de esa lista requieren consulta previa.

## 10. Condiciones de detencion y consulta

- Antes de implementar un cambio sin cubrir una nueva pregunta de diseno.
- Antes de cualquier accion de red, instalacion o publicacion fuera de lo autorizado.
- Si una futura variacion de B1 o B3 rompe la regla de contacto (`haTocadoPalanca`) o el caso limite de pelota atascada en la simulacion.
- Si el estudiante cambia el alcance o la version declarada.