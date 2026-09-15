# Plan de Desarrollo

## 1. Proposito de este documento

Este archivo es un **handoff entre sesiones**. Las rondas anteriores ejecutaron la planificacion (documentacion) y la implementacion de la jugabilidad base (rondas 1-6 del plan). El juego base esta probado y funciona. Una sesion nueva del **paso 7 (ajustes de balance y esteticos)** debe partir de este documento: contiene contexto, hechos verificados, decisiones tomadas, el plan a ejecutar y las reglas de permiso que aplicar. No reemplaza a `README.md`, `GDD.md`, `AGENTS.md` ni a `docs/`, que siguen siendo la fuente de proceso.

## 2. Datos del proyecto

| Campo | Valor |
|---|---|
| Nombre del proyecto | Bounce-Off Battle |
| Estudiante | Facundo Castillo |
| Materia | PIACP (Programacion de Inteligencia Artificial y Patrones de Comportamiento), 3° anio - 2do cuatrimestre |
| Motor y version | Phaser 4.2.1 |
| Lenguaje | JavaScript (ESM) |
| Empaquetador | Vite (plantilla `phaserjs/template-vite`) |
| Despliegue | Vercel (enlace pendiente) |
| Estado declarado | Desarrollo completo: jugabilidad base y ajustes de balance y esteticos implementados y verificados (paso 7 ejecutado el 2026-09-15) |
| Rama de trabajo | `BalanceYEstetica` (creada desde `BaseFunctionality`, cuyo trabajo esta commiteado) |

## 3. Reglas obligatorias (AGENTS.md)

1. Antes de modificar, preguntar al estudiante: motor/version, nombre del proyecto, nombre y apellido, y problema de diseno a resolver.
2. Leer `README.md`, `GDD.md` y `docs/` y explorar la estructura real antes de tocar archivos.
3. No completar `GDD.md` ni documentos de `docs/` con informacion inventada; solo registrar hechos verificados.
4. No instalar dependencias, usar red, publicar cambios ni acceder a secretos sin autorizacion explicita.
5. No eliminar archivos ni modificar configuracion fuera del alcance aprobado.
6. Usar el `.gitignore` correspondiente al motor (ya contiene reglas Node/Vite/editor/OS).
7. Detenerse y consultar ante ambiguedades de diseno, permisos faltantes, cambios ajenos o validaciones fallidas sin causa comprendida.

Orden de trabajo documental (de `docs/README.md`): `auditoria-repositorio.md` → (`GDD.md`, `especificacion.md`, `plan.md`) → `matriz-permisos.md` → `registro-intervencion.md` → `evidencia-pruebas.md` → `informe-final.md`.

## 4. Hechos verificados

- **Version de Phaser fijada**: `package.json` y `package-lock.json` resuelven a **4.2.1** (`packages["node_modules/phaser"].version` = 4.2.1); modulo instalado en 4.2.1. Lockfile reproducible.
- **`npm audit fix`**: ejecutado por el estudiante para resolver las vulnerabilidades reportadas por `npm install` (declaracion del estudiante; el agente no lo verifico porque requeriria consultar el registro npm).
- **Juego implementado** (rondas 1-6): tres escenas propias en `src/game/scenes/Menu.js`, `Partida.js`, `Victoria.js`; config en `src/game/main.js` registra `[Menu, Partida, Victoria]`.
- **Mecanica de partida** (`Partida.js`): paletas en cada extremo, 5 bloques por lado (espaciado visual), pelota desde el centro con direccion aleatoria, regla `haTocadoPalanca` (para romper un bloque la pelota debe haber tocado la paleta del lado contrario; si no, traspasa la paleta y no rompe bloques), cronometro `MM:SS`, limites de camara estatica.
- **CPU (modo 1 jugador)**: sigue la pelota a velocidad limitada = `PADDLE_SPEED * 0.65`.
- **Caso limite corregido**: `encontrarBloque` elige el bloque mas cercano al cruzar el plano con `haTocadoPalanca=true`, de modo que la pelota no puede oscilar infinitamente por el hueco entre bloques (el espaciado es solo estetico). La pelota nunca queda atascada tras una paleta: la paleta solo rebota por el frente y tras los bloques esta el limite del mundo que devuelve la pelota.
- **Validacion automatica**: se simulo en Node el mismo modelo matematico de `Partida.js` (mismas constantes y formulas). Resultado: con un defensor que falla, la partida termina en victoria en ~27-30 s; los bloques solo se rompen con palanca tocada; sin estados de pelota atascada. Con dos "jugadores perfectos" el rally es infinito (solo se pierde al fallar, coherente con el diseno).
- **Compilacion**: `npm run build-nolog` compila OK (solo warning de tamano de chunk de Phaser, esperado).
- **Prueba manual**: el estudiante probo el juego completo (Menu → Partida 1J/2J → Victoria → Rejugar/Volver al Menu) y declaro que funciona perfecto.
- **Git**: el trabajo de las rondas 1-6 quedo commiteado en `BaseFunctionality` (ver `git log`). Se creo la rama `BalanceYEstetica` desde ahi para la sesion del paso 7. No se hizo push (prohibido; solo el usuario publica).
- **Limpieza**: `src/game/scenes/Game.js` (placeholder de la plantilla) fue eliminada con autorizacion del estudiante; no queda codigo muerto del template.
- **Telemetria del template**: `log.js` hace una peticion HTTPS a `gryzor.co`. Los scripts `dev` y `build` lo invocan; verificar siempre con `dev-nolog`/`build-nolog`.
- **Sin pruebas ni lint**: `package.json` scripts = `dev`, `build`, `dev-nolog`, `build-nolog`. La validacion es `build-nolog` + pruebas manuales + simulacion.

## 5. Decisiones de diseño ya tomadas

| Tema | Decision |
|---|---|
| Problema de diseño a declarar para la catedra | Flujo de partida completo (escenas Menu → Partida → Victoria, 1 jugador vs CPU o 2 jugadores) |
| Version de Phaser | 4.2.1 (fijada en `package.json` y lockfile) |
| Formato del cronometro | `MM:SS` (ej. "01:23") en el texto de victoria |
| Traspaso entre escenas | `scene.start(clave, data)` con claves `modoDeJuego` (Menu → Partida) y `ganador` (Partida → Victoria) |
| Velocidad de CPU (1 jugador) | La paleta CPU sigue la pelota a velocidad limitada = `PADDLE_SPEED * 0.65` |
| Regla de romper bloques | Un cruce del plano de bloques con `haTocadoPalanca=true` rompe el bloque mas cercano; el espaciado entre bloques es solo visual |
| Alcance de la ronda actual | Jugabilidad base completada y probada; la ronda siguiente (paso 7) son ajustes de balance y esteticos |
| Publicar cambios | Prohibido para el agente (accion solo del usuario) |
| Red | Prohibida salvo autorizacion explicita (rondas anteriores solo el `npm install` de sincronizacion) |

## 6. Plan de implementacion

| # | Cambio minimo | Archivos previstos | Verificacion | Riesgo | Condicion de detencion |
|---|---|---|---|---|---|
| 1 | Fijar Phaser en 4.2.1 y regenerar el lock | `package.json`, `package-lock.json` | Lock resuelve a 4.2.1 | — | El lock no resuelve a 4.2.1 |
| 2 | Completar la auditoria | `docs/auditoria-repositorio.md` | Hechos verificados | — | Afirmar algo no verificado |
| 3 | Reflejar decisiones en la documentacion | `GDD.md`, `docs/especificacion.md`, `docs/plan.md` | Revision humana | — | Duda sobre un dato del juego |
| 4 | Ajustar matriz de permisos | `docs/matriz-permisos.md` | Revision humana | — | Discrepancia sobre una accion |
| 5 | Registrar la intervencion | `docs/registro-intervencion.md` | Registro de cada ciclo | — | — |
| 6 | Implementar el juego | `src/game/scenes/Menu.js`, `Partida.js`, `Victoria.js`; config en `src/game/main.js` | `npm run build-nolog` + simulacion en Node + pruebas manuales | — | Decision de diseno sin definir |
| 7 | **Ajustes de balance y esteticos** (ejecutado 2026-09-15) | `src/game/scenes/Partida.js`, `Menu.js`, `Victoria.js`, `src/game/main.js`; detalle y valores en `Plan de Balance y Estética.md` | `npm run build-nolog` + simulacion Node + prueba manual | — | — |

Orden logico de las rondas ya ejecutadas: 1 → 2 → 3 → 4 → 5 → 6. El paso 7 es una nueva ronda que **debe partir preguntando al estudiante el alcance exacto** (que parametros de balance y que cambios esteticos), sin asumir valores.

## 7. Comandos

| Comando | Proposito | Notas |
|---|---|---|
| `npm run build-nolog` | Validar que el bundle compila | Sin telemetria (`log.js`) |
| `npm run dev-nolog` | Servidor local en puerto 8080 | Sin telemetria |
| `npm run dev` / `npm run build` | Variantes con telemetria (`log.js`) | Evitar salvo autorizacion explicita |

Verificacion del paso 7 (ejemplo):
```powershell
node -e "const p=JSON.parse(require('fs').readFileSync('package-lock.json','utf8')); console.log(p.packages['node_modules/phaser'].version)"
npm.cmd run build-nolog
```

## 8. Permisos para la sesion del paso 7

| Accion | Estado | Alcance |
|---|---|---|
| Leer archivos del proyecto | Permitida | Todo el repo |
| Buscar rutas y simbolos | Permitida | Todo el repo |
| Editar archivos previstos | Permitida | `src/game/scenes/*.js`, `src/game/main.js`, `public/` (solo assets del juego), `GDD.md`, `docs/*` y `README.md` previa confirmacion del cambio a documentar |
| Ejecutar scripts documentados | Permitida | Solo `npm run build-nolog`, `npm run dev-nolog` |
| Instalar dependencias | Prohibida | Consultar antes; no hay instalaciones previstas |
| Usar red | Prohibida | Consultar antes; NO correr `log.js` |
| Publicar o subir cambios | Prohibida | Accion puramente del usuario (git push y despliegue Vercel) |
| Acceder a secretos o credenciales | Prohibida | No corresponde |
| Acciones no declaradas | Prohibida | Consultar antes |

Cualquier archivo fuera de la lista de "Editar archivos previstos" requiere consulta previa.

## 9. Flujo de juego implementado

- Canvas 1024x768, escala FIT, fondo `#028af8`.
- **Menu de Inicio**: titulo "Bounce-Off Battle", boton "Cantidad de Jugadores" (intercala 1J/2J), boton "Iniciar Partida", leyenda de controles.
- **Partida**: paletas blancas en cada extremo (J1 izquierda, J2/CPU derecha); pelota desde el centro hacia un lado aleatorio; linea de 5 bloques blancos al fondo de cada lado (espaciado visual); cronometro `MM:SS`.
- **Regla clave**: la pelota debe haber tocado la paleta del lado contrario para poder romper bloques; si no, traspasa la paleta y no rompe bloques. La pelota no puede quedar atascada tras una paleta o en un hueco entre bloques.
- **Victoria**: quien destruya todos los bloques del lado contrario primero. **Menu de Victoria**: texto "Ha ganado (Ganador) tras (Min:Seg)" con botones "Rejugar" y "Volver al Menu".
- **Controles**: J1 = A/D (arriba/abajo); J2 o CPU = Flecha Izquierda/Derecha (arriba/abajo). Limites de paletas = bordes de la camara.
- **Restricciones**: camara estatica; paletas no se mueven por el contacto con la pelota; en modo 1 jugador la CPU sigue la pelota a velocidad limitada (0.65x).

## 10. Preguntas abiertas

Resueltas en rondas anteriores:
- Formato del cronometro: `MM:SS`.
- Nombre de parametros de traspaso: `modoDeJuego`, `ganador` via `scene.start` data.
- Velocidad limitada de CPU: factor 0.65x.

Pendientes para el paso 7 (definir con el estudiante antes de modificar):
- Valores de balance a ajustar (velocidad de paletas, velocidad de pelota, factor de CPU, tamanos de paleta/pelota/bloques, etc.).
- Cambios esteticos deseados (colores, tipografias, fondos, estilo de botones, cronometro, etc.).
- Enlace de compilacion/publicacion para `README.md` (depende del despliegue en Vercel, accion del estudiante).

Una vez ejecutado (2026-09-15), estos pendientes se resolvieron en `Plan de Balance y Estética.md`: velocidad progresiva de pelota (tope 2x, reset al romper), CPU 0.50x, paredes tras los bloques, fondo negro, delineado amarillo pastel, estados de boton y aspecto de la pelota segun `haTocadoPalanca`.

## 11. Condiciones de detencion y consulta

- Antes de cualquier accion de red, instalacion o publicacion fuera de lo autorizado.
- Antes de modificar parametros de balance o estetica sin que el estudiante defina valores especificos.
- Si aparece una decision de diseno del juego sin definir (ver seccion 10).
- Si hay archivos ajenos modificados o validaciones fallidas sin causa comprendida.
- Si el estudiante cambia el alcance o la version declarada.