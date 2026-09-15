import { Scene } from 'phaser';

const W = 1024;
const H = 768;

const PADDLE_WIDTH = 20;
const PADDLE_HEIGHT = 130;
const PADDLE_SPEED = 420;
const PADDLE_Y_MIN = PADDLE_HEIGHT / 2 + 10;
const PADDLE_Y_MAX = H - PADDLE_HEIGHT / 2 - 10;

const BALL_RADIUS = 10;
const BALL_SPEED = 340;

const BLOCK_WIDTH = 26;
const BLOCK_HEIGHT = 140;
const BLOCK_GAP = 17;
const BLOCK_X_LEFT = 30;
const BLOCK_X_RIGHT = W - 30;

const CPU_SPEED = PADDLE_SPEED * 0.50;

const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

const formatoTiempo = (segundos) =>
{
    const s = Math.max(0, Math.floor(segundos));
    const mm = String(Math.floor(s / 60)).padStart(2, '0');
    const ss = String(s % 60).padStart(2, '0');
    return `${mm}:${ss}`;
};

export class Partida extends Scene
{
    constructor ()
    {
        super('Partida');
    }

    init (data)
    {
        this.modoDeJuego = data.modoDeJuego === '2Jugadores' ? '2Jugadores' : '1Jugador';
    }

    create ()
    {
        this.crearBloques();
        this.crearPaletas();
        this.crearPelota();

        this.haTocadoPalanca = false;
        this.velocidadMulti = 1;
        this.actualizarAspectoPelota();
        this.tiempoInicio = this.time.now;

        this.textoTiempo = this.add.text(W / 2, 24, '00:00', {
            fontFamily: 'Arial Black', fontSize: 28, color: '#ffffff',
            stroke: '#000000', strokeThickness: 6
        }).setOrigin(0.5);

        this.marcos = [
            this.add.rectangle(W / 2, 2, W, 4, 0xffffff),
            this.add.rectangle(W / 2, H - 2, W, 4, 0xffffff)
        ];

        this.teclas = this.input.keyboard.addKeys('A,D,LEFT,RIGHT');
    }

    crearBloques ()
    {
        this.bloquesIzq = [];
        this.bloquesDer = [];
        for (let i = 0; i < 5; i++)
        {
            const y = BLOCK_HEIGHT / 2 + i * (BLOCK_HEIGHT + BLOCK_GAP);
            this.bloquesIzq.push(this.add.rectangle(BLOCK_X_LEFT, y, BLOCK_WIDTH, BLOCK_HEIGHT, 0xffffff));
            this.bloquesDer.push(this.add.rectangle(BLOCK_X_RIGHT, y, BLOCK_WIDTH, BLOCK_HEIGHT, 0xffffff));
        }
    }

    crearPaletas ()
    {
        this.paletaJ1 = this.add.rectangle(70, H / 2, PADDLE_WIDTH, PADDLE_HEIGHT, 0xffffff);
        this.paletaJ2 = this.add.rectangle(W - 70, H / 2, PADDLE_WIDTH, PADDLE_HEIGHT, 0xffffff);
    }

    crearPelota ()
    {
        this.pelota = this.add.circle(W / 2, H / 2, BALL_RADIUS, 0xffffff);
        this.vx = BALL_SPEED * (Math.random() < 0.5 ? -1 : 1);
        this.vy = (Math.random() * 2 - 1) * 80;
    }

    update (time, delta)
    {
        const dt = delta / 1000;

        this.moverPaleta1(dt);
        this.moverPaleta2(dt);

        const prevX = this.pelota.x;

        this.pelota.x += this.vx * dt;
        this.pelota.y += this.vy * dt;

        if (this.pelota.y <= BALL_RADIUS)
        {
            this.pelota.y = BALL_RADIUS;
            this.vy = Math.abs(this.vy);
        }
        if (this.pelota.y >= H - BALL_RADIUS)
        {
            this.pelota.y = H - BALL_RADIUS;
            this.vy = -Math.abs(this.vy);
        }

        this.colisionarPaleta(this.paletaJ1, true, prevX);
        this.colisionarPaleta(this.paletaJ2, false, prevX);

        this.colisionarBloques(prevX);

        if (this.pelota.x <= BALL_RADIUS)
        {
            this.pelota.x = BALL_RADIUS;
            this.vx = Math.abs(this.vx);
        }
        if (this.pelota.x >= W - BALL_RADIUS)
        {
            this.pelota.x = W - BALL_RADIUS;
            this.vx = -Math.abs(this.vx);
        }

        this.textoTiempo.setText(formatoTiempo((this.time.now - this.tiempoInicio) / 1000));
    }

    moverPaleta1 (dt)
    {
        if (this.teclas.A.isDown) this.paletaJ1.y -= PADDLE_SPEED * dt;
        else if (this.teclas.D.isDown) this.paletaJ1.y += PADDLE_SPEED * dt;
        this.paletaJ1.y = clamp(this.paletaJ1.y, PADDLE_Y_MIN, PADDLE_Y_MAX);
    }

    moverPaleta2 (dt)
    {
        if (this.modoDeJuego === '2Jugadores')
        {
            if (this.teclas.LEFT.isDown) this.paletaJ2.y -= PADDLE_SPEED * dt;
            else if (this.teclas.RIGHT.isDown) this.paletaJ2.y += PADDLE_SPEED * dt;
        }
        else
        {
            const paso = CPU_SPEED * dt;
            const diff = this.pelota.y - this.paletaJ2.y;
            if (diff > paso) this.paletaJ2.y += paso;
            else if (diff < -paso) this.paletaJ2.y -= paso;
            else this.paletaJ2.y += diff;
        }
        this.paletaJ2.y = clamp(this.paletaJ2.y, PADDLE_Y_MIN, PADDLE_Y_MAX);
    }

    colisionarPaleta (paleta, esIzquierda, prevX)
    {
        const frente = esIzquierda
            ? paleta.x + PADDLE_WIDTH / 2 + BALL_RADIUS
            : paleta.x - PADDLE_WIDTH / 2 - BALL_RADIUS;
        const haciaPaleta = esIzquierda ? this.vx < 0 : this.vx > 0;
        if (!haciaPaleta) return;

        const cruza = esIzquierda
            ? (prevX >= frente && this.pelota.x <= frente)
            : (prevX <= frente && this.pelota.x >= frente);
        if (!cruza) return;

        const enRango = this.pelota.y >= paleta.y - PADDLE_HEIGHT / 2 - BALL_RADIUS
            && this.pelota.y <= paleta.y + PADDLE_HEIGHT / 2 + BALL_RADIUS;
        if (!enRango) return;

        this.velocidadMulti = Math.min(2, this.velocidadMulti * 1.05);
        const velocidad = BALL_SPEED * this.velocidadMulti;
        this.vx = (esIzquierda ? 1 : -1) * velocidad;
        const rel = (this.pelota.y - paleta.y) / (PADDLE_HEIGHT / 2);
        this.vy = clamp(rel, -1, 1) * 300 * this.velocidadMulti;
        this.haTocadoPalanca = true;
        this.actualizarAspectoPelota();
    }

    colisionarBloques (prevX)
    {
        if (!this.haTocadoPalanca) return;

        if (this.vx < 0)
        {
            const planoIzq = BLOCK_X_LEFT + BLOCK_WIDTH / 2 + BALL_RADIUS;
            if (prevX >= planoIzq && this.pelota.x <= planoIzq)
            {
                const idx = this.encontrarBloqueEnY(this.bloquesIzq, this.pelota.y);
                if (idx >= 0)
                {
                    this.destruirBloque(this.bloquesIzq, idx);
                    this.vx = BALL_SPEED;
                    if (this.bloquesIzq.length === 0)
                    {
                        this.terminar(this.modoDeJuego === '2Jugadores' ? 'Jugador 2' : 'CPU');
                    }
                }
                else
                {
                    this.pelota.x = planoIzq;
                    this.vx = Math.abs(this.vx);
                }
            }
        }
        else if (this.vx > 0)
        {
            const planoDer = BLOCK_X_RIGHT - BLOCK_WIDTH / 2 - BALL_RADIUS;
            if (prevX <= planoDer && this.pelota.x >= planoDer)
            {
                const idx = this.encontrarBloqueEnY(this.bloquesDer, this.pelota.y);
                if (idx >= 0)
                {
                    this.destruirBloque(this.bloquesDer, idx);
                    this.vx = -BALL_SPEED;
                    if (this.bloquesDer.length === 0)
                    {
                        this.terminar('Jugador 1');
                    }
                }
                else
                {
                    this.pelota.x = planoDer;
                    this.vx = -Math.abs(this.vx);
                }
            }
        }
    }

    destruirBloque (bloques, idx)
    {
        bloques[idx].destroy();
        bloques.splice(idx, 1);
        this.haTocadoPalanca = false;
        this.velocidadMulti = 1;
        this.actualizarAspectoPelota();
    }

    actualizarAspectoPelota ()
    {
        if (this.haTocadoPalanca)
        {
            this.pelota.setFillStyle(0xffffff);
            this.pelota.setAlpha(1);
        }
        else
        {
            this.pelota.setFillStyle(0xbfbfbf);
            this.pelota.setAlpha(0.6);
        }
    }

    encontrarBloqueEnY (bloques, y)
    {
        for (let i = 0; i < bloques.length; i++)
        {
            const bloque = bloques[i];
            if (y >= bloque.y - BLOCK_HEIGHT / 2 && y <= bloque.y + BLOCK_HEIGHT / 2)
            {
                return i;
            }
        }
        return -1;
    }

    terminar (ganador)
    {
        const tiempo = (this.time.now - this.tiempoInicio) / 1000;
        this.scene.start('Victoria', { ganador, modoDeJuego: this.modoDeJuego, tiempo });
    }
}