import { Scene } from 'phaser';

const W = 1024;
const H = 768;

const formatoTiempo = (segundos) =>
{
    const s = Math.max(0, Math.floor(segundos));
    const mm = String(Math.floor(s / 60)).padStart(2, '0');
    const ss = String(s % 60).padStart(2, '0');
    return `${mm}:${ss}`;
};

export class Victoria extends Scene
{
    constructor ()
    {
        super('Victoria');
    }

    init (data)
    {
        this.ganador = data.ganador || 'Jugador 1';
        this.modoDeJuego = data.modoDeJuego === '2Jugadores' ? '2Jugadores' : '1Jugador';
        this.tiempo = data.tiempo || 0;
    }

    create ()
    {
        this.add.text(W / 2, 260, `Ha ganado ${this.ganador} tras ${formatoTiempo(this.tiempo)}`, {
            fontFamily: 'Arial Black', fontSize: 48, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8, align: 'center'
        }).setOrigin(0.5);

        this.crearBoton('Rejugar', W / 2, 440, () => {
            this.scene.start('Partida', { modoDeJuego: this.modoDeJuego });
        });

        this.crearBoton('Volver al Menú', W / 2, 540, () => {
            this.scene.start('Menu');
        });
    }

    crearBoton (label, x, y, onClick)
    {
        const boton = this.add.rectangle(x, y, 360, 72, 0xffffff).setInteractive({ useHandCursor: true });
        this.add.text(x, y, label, {
            fontFamily: 'Arial Black', fontSize: 30, color: '#028af8'
        }).setOrigin(0.5);
        boton.on('pointerdown', () => onClick());
        return boton;
    }
}