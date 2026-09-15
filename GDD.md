# GDD simplificado

## Juego y experiencia

- Genero y situacion de juego: Arcade; en Planificación.
- Rol del jugador: Control de paleta Izquierda (Jugador 1) o Derecha (Jugador2).
- Experiencia buscada: Partidas de 1-2 minutos para una experiencia rápida pero divertida, con rejugabilidad.

## Pasos que debe seguir la experiencia del jugador promedio

1.Experiencia comienza en Menú de Inicio, que posee el título de juego (Bounce-Off Battle) y dos botones: Iniciar Partida y Cantidad de Jugadores.
2.Se decide cantidad de jugadores con un click en el botón correspondiente y se Clickea en el botón superior a este para comenzar Partida.
3.Se juega una Partida reflejando una pelota, que comienza en el medio de la pantalla y se dirige a uno de los lados (izquierda o derecha) de manera aleatoria al principio de esta, con el control de dos paletas (rectángulos blancos) ubicados c/u en un extremo distinto de la pantalla hacia arriba o abajo con el objetivo de evitar que la pelota destruya uno de los bloques (linea de 5 cuadrados blancos tras las palancas en su respectivo extremo que ocupan todo el alto de la pantalla, salvo por un pequeño espaciado entre ellos) tras de sí.
4.Quien destruye todos los bloques del lado contrario al suyo primero se lo registra bajo el parámetro Ganador, y se pasa a la escena de Menú de Victoria.
5.Aquí, hay un texto que dice "Ha ganado (Ganador) tras (TiempoDeJuego) minutos" (siendo Ganador reemplazado por el parámetro establecido en la escena anterior y TiempoDeJuego el tiempo que ha durado la Partida, contado en el formato '"Minutos":"Tiempo"') y dos botones abajo de este texto que sean "Rejugar" y "Volver al Menú".

## Comportamiento a resolver

- Entidad: Paletas no codificadas
- Problema actual: Actualmente el proyecto se encuentra en estado de planificaión y, por lo tanto, no posee programación todavía.
- Comportamiento esperado: -.

## Reglas

- Estados, condiciones o eventos relevantes: °ObjetoPelota: HaTocadoPalanca(Verdadero/Falso); En caso de falso no puede romper bloques o tocar palancas por atrás; se resetea al romper un bloque.
°EscenaMenúInicio: ModoDeJuego(1Jugador/2Jugadores); Botón que intercala entre un modo u otro; en base a él, se bloquea o habilita los controles de jugador 2 en Partida.
°EscenaPartida: Jugadores(1Jugador/2Jugadores); Traspaso de MenúInicio(ModoDeJuego). Ganador(Jugador1/Jugador2/CPU); Decidido al final de Partida, antes de pase de escena.
°EscenaMenúVictoria: GanadorPartida(Jugador1/Jugador2/CPU); Traspaso de Partida
- Accion del jugador o del entorno: Este posee únicamente control de su paleta hacia arriba y abajo, con los límites establecidos por la escena y/o cámara, con el fín de rebotar la pelota entre él y su adversario.
- Resultado esperado: Experiencia de juego fluída.
- Caso limite: Pelota queda atascada tras una Palanca indefinidamente.

## Limites

- Fuera de alcance: 1. La camara es estática y sus limites son los mismos que los del mundo de juego; no debe moverse en ningún momento.
2. Las palancas de los jugadores se deben mover únicamente arriba y abajo, con sus límites siendo los bordes de la cámara; no se vén afectados en su posición por el contacto con la pelota.
3. La pelota no debe poder quedar atascada detras de una paleta (entre esta y su línea de bloques); para poder romper un bloque, debe haber hecho contacto con la paleta del lado contrario anteriormente. Si no hay contacto, la pelota no rompe bloques y traspasa la palanca del lado contrario.
- Restricciones tecnicas: Motor de desarrollo Phaser, lanzamiento controlado por plataforma Vercel.
- Criterios de aceptacion: Flujo de escenas correcto (Menú de Inicio, Partida, Menú de Victoria, re-jugar Partida o Menú de Inicio); correcta nombración del ganador (Jugador 1, jugador 2, CPU); Funcionamiento correcto de movimientos (A-D/ Flechas Izquierda-Derecha); correcto seguimiento de tiempo pasado en Partida.
