# Auditoria del repositorio

## Objetivo

Registrar hechos verificables sobre la estructura, arquitectura y validacion del proyecto antes de proponer cambios.

## Rutas y simbolos relevantes

| Ruta o simbolo | Rol observado | Evidencia |
|---|---|---|
| `package.json` | Declara `"phaser": "4.2.1"` (exacta), `type: module`, scripts `dev`, `build`, `dev-nolog`, `build-nolog`. Sin tests ni lint. | Lectura directa del archivo. |
| `package-lock.json` | `packages["node_modules/phaser"].version` = `4.2.1`, coherente con `package.json`. | `node -e "..."` con la sentencia del plan; `node_modules/phaser/package.json` reporta 4.2.1. |
| `src/main.js` | Importa `StartGame` de `./game/main` y lo inicia en `#game-container` al `DOMContentLoaded`. | Lectura directa del archivo. |
| `src/game/main.js` | Exporta `StartGame(parent)` creando `new Game({ ...config, parent })`. Config: `AUTO`, 1024x768, fondo `#028af8`, escala `FIT`/`CENTER_BOTH`, escena `MainGame`. Imports: `MainGame` y `{ AUTO, Scale, Game }` desde `'phaser'` (API unificada de Phaser 4). | Lectura directa del archivo. |
| `src/game/scenes/Game.js` | Escena placeholder `'Game'`: `preload` carga `assets/bg.png` y `assets/logo.png` (`this.load.setPath('assets')`); `create` pinta fondo, logo y texto "Make something fun!". | Lectura directa del archivo. |
| `public/assets/bg.png`, `public/assets/logo.png`, `public/favicon.png`, `public/style.css` | Assets provistos por la plantilla. | `glob public/**/*`. |
| `vite/config.dev.mjs` | Config de desarrollo: `base: './'`, puerto 8080, chunk manual `phaser`. | Lectura directa del archivo. |
| `vite/config.prod.mjs` | Config de produccion: `base: './'`, minify terser, chunk manual `phaser`, plugin `phasermsg` (mensajes en stdout). | Lectura directa del archivo. |
| `index.html` | Monta `#game-container` y carga `src/main.js` como modulo ESM. | Lectura directa del archivo. |
| `log.js` | Telemetria de la plantilla: peticion HTTPS a `gryzor.co/v/{event}/{phaserVersion}/{name}`. La invocan `dev`/`build`. `dev-nolog`/`build-nolog` no la invocan. | Lectura directa del archivo. |
| `.gitignore` | Reglas Node, build (`dist/`), editor, OS y `.env`. | Lectura directa del archivo. |
| `screenshot.png`, `LICENSE` | Archivos de la plantilla sin comprometer al flujo del juego. | `git status` (untracked). |

## Flujo observado

`index.html` carga `src/main.js`; al dispararse `DOMContentLoaded`, `StartGame('game-container')` crea la instancia de `Game` de Phaser con la config de `src/game/main.js`. Phaser inicia la escena registrada (`Game`) en `src/game/scenes/Game.js`, que preacarga `assets/bg.png` y `assets/logo.png` desde `public/assets/` y dibuja la pantalla placeholder. No hay estructura de escenas de juego (Menu, Partida, Victoria); el juego no tiene comportamiento programado todavia.

## Pruebas y comandos disponibles

| Comando o prueba | Que verifica | Resultado inicial |
|---|---|---|
| `npm install` | Sincronizar dependencias para fijar Phaser 4.2.1 | OK: lock y modulo instalado en 4.2.1 (antes la raiz del lock decia `^3.88.2` y `package.json` declara `4.0.0`). |
| `npm run dev-nolog` | Servidor local Vite sin telemetria, puerto 8080 | No ejecutado en esta ronda (corresponde a pruebas funcionales de otra ronda). |
| `npm run build-nolog` | Compilar el bundle de produccion sin telemetria | No ejecutado en esta ronda (esta ronda es de documentacion). |
| No hay scripts de test, lint ni typecheck | — | `package.json` solo define `dev`, `build`, `dev-nolog`, `build-nolog`. |

## Hechos, supuestos y preguntas abiertas

- Hechos comprobados:
  - Motor instalado: Phaser 4.2.1; importa desde `'phaser'` (API unificada de Phaser 4).
  - Version sincronizada: `package.json` y `package-lock.json` resuelven a 4.2.1 (lockfile ahora reproducible).
  - Git: rama local `BaseFunctionality`, remota `origin` = `https://github.com/FacuN-C777/PIACP---Parcial-1---Bounce-Off-Battle.git`. Commits: `908c111` (initial), `7471328` (README), `92c5f3b` (GDD). Nada del juego commiteado; `package.json`, `package-lock.json`, `src/`, `public/`, `log.js`, `index.html`, `LICENSE`, `screenshot.png`, `Plan de Desarrollo.md` y `vite/` estan untracked; `.gitignore`, `docs/especificacion.md` y `docs/matriz-permisos.md` modificados sin stage.
  - Sin tests ni lint: los scripts disponibles son solo dev/build y variantes nolog.
  - Telemetria del template: `log.js` hace HTTPS a `gryzor.co`; los scripts `dev`/`build` lo invocan, los `*-nolog` no.
  - Contenido del juego: solo la escena placeholder del template; no hay escenas Menu/Partida/Victoria.
  - Assets: `public/assets/bg.png`, `public/assets/logo.png`, `public/favicon.png`.
- Supuestos por verificar:
  - El flag `requiredScore` o el estado inicial de la config no aportan comportamiento al juego; no se uso ninguna API de Phaser 4 mas alla de la placeholder.
  - El build de produccion se comporte igual que la plantilla original tras el cambio de version (verificar en la ronda de codigo con `npm run build-nolog`).
- Preguntas para consultar:
  - Formato del cronometro (resuelto: `MM:SS`).
  - Nombre de parametros de traspaso entre escenas (resuelto: `ganador`, `modoDeJuego`).
  - Factor numerico de velocidad de CPU (resuelto: 0.65x la del jugador).
  - Enlace de publicacion/compilacion para `README.md` (pendiente de despliegue en Vercel).