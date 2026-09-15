# Especificacion

## Problema

El proyecto Bounce-Off Battle necesita un flujo de partida completo (escenas Menú de Inicio → Partida → Menú de Victoria) para que dos jugadores, o un jugador contra la CPU, reflejen una pelota y destruyan los bloques del lado contrario. Hoy solo existe la escena placeholder de la plantilla, sin comportamiento de juego.

## Resultado esperado

Transitar el flujo completo: desde el Menú se elige la cantidad de jugadores (1 o 2) y se inicia la Partida; en la Partida se mueven las paletas con A/D (jugador 1) y Flechas Izquierda/Derecha (jugador 2 o CPU); cuando un bando destruye toda la línea de 5 bloques del lado contrario, se pasa al Menú de Victoria con el texto "Ha ganado (Ganador) tras (Min:Seg)" (formato MM:SS) y los botones "Rejugar" y "Volver al Menú".

## Alcance

- Incluye:
  - Escena Menú de Inicio con título "Bounce-Off Battle", botón "Cantidad de Jugadores" (intercala 1J/2J) y botón "Iniciar Partida".
  - Escena Partida: paletas blancas en cada extremo (J1 izquierda, J2/CPU derecha), pelota desde el centro hacia un lado aleatorio, línea de 5 bloques blancos al fondo de cada lado, cronómetro.
  - Regla clave: la pelota debe haber tocado la paleta del lado contrario para poder romper bloques; si no, traspasa la paleta y no rompe bloques. La pelota no puede quedar atascada tras una paleta.
  - Escena Menú de Victoria con "Rejugar" (reparte la partida) y "Volver al Menú".
  - Modo 1 jugador: la CPU sigue la pelota a velocidad limitada (factor 0.65x la del jugador).
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
| Controles y límites | Partida en curso | Se mueve J1 con A/D y J2/CPU con Flechas Izquierda/Derecha | Las paletas suben y bajan dentro de los bordes de la cámara; en 1J los controles de J2 están deshabilitados y la CPU sigue la pelota a 0.65x | Prueba manual de ambos modos |
| Tiempo de partida | Termina una partida | Se consulta el texto de Victoria | El tiempo aparece como MM:SS (ej. "01:23") desde el inicio de Partida hasta la victoria | Prueba manual |
| Regla de bloque y contacto | Pelota con `HaTocadoPalanca = falso` | La pelota llega al lado contrario sin tocar la paleta | Traspasa la paleta, NO rompe bloques y continúa | Prueba manual / revisión de código |
| Caso limite | Pelota tras una paleta | La pelota queda entre la paleta y su línea de bloques | No queda atascada indefinidamente: continúa el movimiento hasta volver a la zona jugable | Prueba manual del caso limite |
| Error | Partida en modo 2J | Se presiona una tecla no asignada | No hay movimiento; la partida continúa sin excepciones | Revisión de código |

## Invariantes

- La cámara es estática: sus límites son los del mundo de juego y no se mueve en ningún momento.
- Las paletas solo se desplazan arriba/abajo dentro de los bordes de la cámara y no cambian de posición por el contacto con la pelota.
- La pelota no queda atascada por tiempo indefinido detrás de una paleta.
- Un bloque solo se rompe si la pelota hizo contacto con la paleta del lado contrario antes de llegar a las bloques.
- `modoDeJuego` vale `1Jugador` o `2Jugadores`; `ganador` vale `Jugador 1`, `Jugador 2` o `CPU`.

## Preguntas abiertas

- Todas las preguntas de diseño (formato del cronómetro, parámetros de traspaso, velocidad de CPU) quedaron resueltas en esta ronda.
- Pendiente no bloqueante: enlace de compilación/publicación para `README.md`, a completar cuando el estudiante despliegue en Vercel.