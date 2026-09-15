# Especificacion

## Problema

El proyecto Bounce-Off Battle necesitaba un flujo de partida completo (escenas Menú de Inicio → Partida → Menú de Victoria) para que dos jugadores, o un jugador contra la CPU, reflejen una pelota y destruyan los bloques del lado contrario. El flujo base quedó implementado y esta especificación cubre también los ajustes de balance y estéticos del paso 7.

## Resultado esperado

Transitar el flujo completo: desde el Menú se elige la cantidad de jugadores (1 o 2) y se inicia la Partida; en la Partida se mueven las paletas con A/D (jugador 1) y Flechas Izquierda/Derecha (jugador 2 o CPU); cuando un bando destruye toda la línea de 5 bloques del lado contrario, se pasa al Menú de Victoria con el texto "Ha ganado (Ganador) tras (Min:Seg)" (formato MM:SS) y los botones "Rejugar" y "Volver al Menú".

## Alcance

- Incluye:
  - Escena Menú de Inicio con título "Bounce-Off Battle", botón "Cantidad de Jugadores" (intercala 1J/2J) y botón "Iniciar Partida".
  - Escena Partida: paletas blancas en cada extremo (J1 izquierda, J2/CPU derecha), pelota desde el centro hacia un lado aleatorio, línea de 5 bloques blancos al fondo de cada lado, cronómetro.
  - Regla clave: la pelota debe haber tocado la paleta del lado contrario para poder romper bloques; si no, traspasa la paleta y no rompe bloques. La pelota no puede quedar atascada tras una paleta.
  - Escena Menú de Victoria con "Rejugar" (reparte la partida) y "Volver al Menú".
  - Modo 1 jugador: la CPU sigue la pelota a velocidad limitada (factor 0.50x la del jugador).
  - Balance (paso 7): la pelota aumenta un 5% de velocidad por cada rebote contra una paleta que no destruye bloque (multiplicador x1.05 acumulativo, tope en el doble de la velocidad inicial, se resetea a la inicial al destruir un bloque); paredes tras los bloques que hacen rebotar la pelota si golpea la posición de un bloque ya destruido (ya no se destruye el bloque más cercano); CPU a 0.50x la velocidad del jugador.
  - Estética (paso 7): fondo negro en todas las escenas; texto de botones con delineado amarillo pastel (#FFF59D); estados hover (celeste claro) y de presión (azul oscuro) en los botones; pelota gris claro (#BFBFBF) al 60% de opacidad cuando `haTocadoPalanca` es falso.
  - Traspaso entre escenas con `scene.start(clave, data)` y las claves `modoDeJuego` y `ganador`.
- No incluye:
  - Sonido, efectos de partícula ni assets externos (se usan objetos y tipografía base de Phaser).
  - Modo online, multijugador en red ni persistencia de puntajes.
  - Movimiento de cámara (estática, límites del mundo).
  - Despliegue en Vercel (enlace pendiente, lo realiza el estudiante).

## Restricciones

- Tecnicas: Motor:Phaser, Lenguaje:Javascript, Arquitectura:Packager-Vite;Despliegue-Vercel.
- Operativas: Edición a archivos existentes, creación de nuevos archivos, análisis de archivos fuera de contexto actual del prompt.
- De calidad: Límite de 2-3 pruebas de funcionalidad para análisis de resultado.
- De version: Phaser 4.2.1 fijado en `package.json` y `package-lock.json`.

## Casos y criterios de aceptacion

| Caso             | Dado       | Cuando   | Entonces                | Evidencia            |
| ---------------- | ---------- | -------- | ----------------------- | -------------------- |
| Flujo de escenas | Escena Menú de Inicio abierta | Se elige cantidad de jugadores y se presiona "Iniciar Partida" | Se transita a Partida; al destruir todos los bloques de un bando se pasa a Victoria; "Rejugar" vuelve a Partida y "Volver al Menú" al Menú de Inicio | Prueba manual de recorrido completo + `npm run build-nolog` |
| Nombre del ganador | Termina una partida | Un bando destruye todos sus bloques | El texto muestra "Jugador 1", "Jugador 2" o "CPU" según corresponda | Prueba manual con 1J (CPU) y con 2J |
| Controles y límites | Partida en curso | Se mueve J1 con A/D y J2/CPU con Flechas Izquierda/Derecha | Las paletas suben y bajan dentro de los bordes de la cámara; en 1J los controles de J2 están deshabilitados y la CPU sigue la pelota a 0.50x | Prueba manual de ambos modos |
| Tiempo de partida | Termina una partida | Se consulta el texto de Victoria | El tiempo aparece como MM:SS (ej. "01:23") desde el inicio de Partida hasta la victoria | Prueba manual |
| Regla de bloque y contacto | Pelota con `HaTocadoPalanca = falso` | La pelota llega al lado contrario sin tocar la paleta | Traspasa la paleta, NO rompe bloques y continúa | Prueba manual / revisión de código |
| Caso limite | Pelota tras una paleta | La pelota queda entre la paleta y su línea de bloques | No queda atascada indefinidamente: continúa el movimiento hasta volver a la zona jugable | Prueba manual del caso limite |
| Velocidad progresiva | Partida en curso | La pelota rebota en una paleta sin destruir bloque | La velocidad aumenta 5% acumulativo (tope 2x de la inicial); se resetea al destruir un bloque | Simulación Node + revisión de código |
| Pared tras bloques | Pelota con palanca tocada | Cruza el plano por la posición de un bloque ya destruido | Rebota contra la pared en el mismo plano; no destruye el bloque más cercano | Simulación Node + prueba manual |
| Estética | Cada escena abierta | Se inspeccionan fondo, botones y pelota | Fondo negro; delineado amarillo pastel; hover/pressed; pelota gris al 60% con palanca falsa | Revisión de código + prueba manual |
| Error | Partida en modo 2J | Se presiona una tecla no asignada | No hay movimiento; la partida continúa sin excepciones | Revisión de código |

## Invariantes

- La cámara es estática: sus límites son los del mundo de juego y no se mueve en ningún momento.
- Las paletas solo se desplazan arriba/abajo dentro de los bordes de la cámara y no cambian de posición por el contacto con la pelota.
- La pelota no queda atascada por tiempo indefinido detrás de una paleta.
- Un bloque solo se rompe si la pelota hizo contacto con la paleta del lado contrario antes de llegar a las bloques.
- `modoDeJuego` vale `1Jugador` o `2Jugadores`; `ganador` vale `Jugador 1`, `Jugador 2` o `CPU`.

## Preguntas abiertas

- Las preguntas de diseño de la jugabilidad base quedaron resueltas en las rondas anteriores (cronómetro MM:SS, claves `modoDeJuego` y `ganador`, CPU con factor de velocidad). Las del paso 7 (balance y estética) se resolvieron el 2026-09-15; los valores adoptados están en `Plan de Balance y Estética.md`.
- Pendiente no bloqueante: enlace de compilación/publicación para `README.md`, a completar cuando el estudiante despliegue en Vercel.