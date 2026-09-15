# Informe final

## Resultado

Bounce-Off Battle quedó completo. El juego transita Menú de Inicio → Partida → Menú de Victoria en modos 1 jugador (vs CPU) y 2 jugadores, con la regla de contacto `haTocadoPalanca`, bloques a destruir en cada extremo y cronómetro `MM:SS`. Sobre la jugabilidad base se ejecutaron los ajustes de balance (velocidad progresiva de la pelota con tope en 2x, CPU al 0.50x, paredes tras los bloques) y estéticos (fondo negro, botones con delineado amarillo pastel y estados hover/pressed, pelota gris al 60% cuando la palanca no está tocada). El bundle compila con `npm run build-nolog`, el modelo de partida está validado por simulación en Node y el recorrido manual fue declarado correcto por el estudiante.

## Cambios y decisiones

- Cambios realizados:
  - Rondas 1-6: documentación del proceso (auditoría, GDD, especificación, plan, matriz de permisos, registro) y jugabilidad base (escenas Menu/Partida/Victoria, Phaser 4.2.1, traspaso con `modoDeJuego` y `ganador`, cronómetro MM:SS).
  - Paso 7 (ronda de balance y estética): B1 velocidad +5% por rebote de paleta sin destruir bloque (tope 2x, reset al destruir); B2 CPU 0.50x; B3 paredes tras bloques con `encontrarBloqueEnY` (se elimina `encontrarBloque`); E1 fondo negro; E2 delineado amarillo pastel; E3 hover/pressed en botones; E4 pelota gris `#BFBFBF` al 60% con palanca falsa.
- Decisiones humanas relevantes: las consignadas en `Plan de Balance y Estética.md` (secciones 7 y 8): acumulación x1.05 con reset al romper; solo rebotes de paleta cuentan; pared en el plano de bloques sin modificar la regla de traspaso; colores `#000000`, `#FFF59D`, `0x66B8FF`, `0x0D5A8A`, `#BFBFBF`+0.6.
- Acciones del agente aceptadas, rechazadas o corregidas: aceptadas todas las detalladas en `docs/registro-intervencion.md`; no hubo acciones rechazadas.

## Validacion

- Camino principal: `npm run build-nolog` compila OK (solo warning esperado de tamaño de chunk de Phaser); recorrido manual completo (Menu → Partida 1J/2J → Victoria → Rejugar/Volver al Menu) declarado correcto por el estudiante.
- Caso limite: simulación en Node del modelo de `Partida.js` (mismas constantes y fórmulas): la pelota no se congela ni sale de los límites; la velocidad se capa en 2x (680); el rally de dos paletas perfectas es infinito. Con las paredes, un defensor ocioso ya no es destruido por el bloque más cercano; la victoria exige apuntar con ángulo (efecto buscado del cambio B3).
- Version validada: rama `BalanceYEstetica` (los cambios de la sesión no están commiteados; el commit queda a decisión del estudiante). No se realizó push (prohibido).

## Limites y riesgos pendientes

- Publicación/despliegue en Vercel y enlace en `README.md`: acción exclusiva del estudiante; pendiente no bloqueante.
- Con rebotes de paleta casi horizontales (defensor ocioso), las paredes B3 pueden sostener intercambios prolongados; el ritmo depende de la puntería. Es la consecuencia aceptada de no forzar la destrucción del bloque más cercano; a seguir de cerca en la percepción visual.
- No hay tests automatizados ni lint; la validación se apoya en `build-nolog`, simulación en Node y prueba manual.