# Plan de intervencion

## Objetivo del plan

Completar la ronda de documentación (fijar Phaser 4.2.1, auditoría, GDD, especificación, plan, matriz de permisos y registro de intervención) y, en una ronda posterior con aprobación humana, implementar el flujo de partida completo (Menú → Partida → Victoria) para satisfacer los criterios de aceptación del GDD sin ampliar el alcance.

## Cambios propuestos

| Paso | Cambio minimo | Archivos previstos | Verificacion | Riesgo | Condicion de detencion |
|---:|---|---|---|---|---|
| 1 | Fijar Phaser en 4.2.1 y regenerar el lock | `package.json` ("phaser": "4.2.1"), `package-lock.json` | `npm install` y confirmar en `package-lock.json` que `packages["node_modules/phaser"].version` = 4.2.1 | El registro puede fallar o arrastrar cambios colaterales | El lock no resuelve a 4.2.1, o `npm install` falla sin causa clara |
| 2 | Completar la auditoria | `docs/auditoria-repositorio.md` | Recorrer cada ruta/simbolo; solo escribir lo verificado | Registrar afirmaciones no comprobadas | Necesitar afirmar algo no verificado |
| 3 | Reflejar decisiones en la documentacion | `GDD.md`, `docs/especificacion.md`, `docs/plan.md` | Revision humana | Inventar contenido | Duda sobre un dato del juego |
| 4 | Ajustar matriz de permisos | `docs/matriz-permisos.md` | Revision humana | Dejar permisos ambiguos | Discrepancia sobre una accion |
| 5 | Registrar la intervencion | `docs/registro-intervencion.md` | Registro de cada ciclo relevante | — | — |
| 6 | (Ronda siguiente) Implementar el juego | `src/game/scenes/*.js` (Menu, Partida, Victoria), config en `src/game/main.js` | `npm run build-nolog` + pruebas manuales | Cambios de API entre Phaser 3/4 | Cualquier decision de diseno sin definir |

## Orden de implementacion

Se documenta primero (pasos 1-5) de forma verificable, en el orden indicado por `docs/README.md` (auditoria → GDD/especificacion/plan → matriz → registro). La ronda de código (paso 6) solo se abre tras aprobación humana, resolviendo las preguntas de diseño pendientes (resueltas: cronómetro MM:SS, claves `ganador`/`modoDeJuego`, CPU 0.65x).

## Fuera de alcance

- Despliegue y publicación en Vercel (acción exclusiva del estudiante; enlace pendiente en `README.md`).
- Tests automatizados, lint y typecheck (el proyecto no los define; validación con `npm run build-nolog` y pruebas manuales).