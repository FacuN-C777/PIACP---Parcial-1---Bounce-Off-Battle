import { Scene } from 'phaser';

const W = 1024;
const H = 768;

export class Menu extends Scene
{
    constructor ()
    {
        super('Menu');
    }

    create ()
    {
        this.modoDeJuego = '1Jugador';

        this.add.text(W / 2, 180, 'Bounce-Off Battle', {
            fontFamily: 'Arial Black', fontSize: 72, color: '#ffffff',
            stroke: '#000000', strokeThickness: 10
        }).setOrigin(0.5);

        this.crearBoton('Cantidad de Jugadores', W / 2, 400, () => {
            this.modoDeJuego = this.modoDeJuego === '1Jugador' ? '2Jugadores' : '1Jugador';
            this.textoModo.setText(this.modoDeJuego === '1Jugador' ? 'Modo: 1 Jugador' : 'Modo: 2 Jugadores');
        });

        this.textoModo = this.add.text(W / 2, 470, 'Modo: 1 Jugador', {
            fontFamily: 'Arial Black', fontSize: 30, color: '#ffffff',
            stroke: '#000000', strokeThickness: 6
        }).setOrigin(0.5);

        this.crearBoton('Iniciar Partida', W / 2, 560, () => {
            this.scene.start('Partida', { modoDeJuego: this.modoDeJuego });
        });

        this.add.text(W / 2, 700, 'J1: A / D    J2 o CPU: Flechas Izquierda / Derecha', {
            fontFamily: 'Arial Black', fontSize: 20, color: '#ffffff',
            stroke: '#000000', strokeThickness: 4
        }).setOrigin(0.5);
    }

    crearBoton (label, x, y, onClick)
    {
        const boton = this.add.rectangle(x, y, 360, 72, 0xffffff).setInteractive({ useHandCursor: true });
        this.add.text(x, y, label, {
            fontFamily: 'Arial Black', fontSize: 30, color: '#028af8',
            stroke: '#FFF59D', strokeThickness: 3
        }).setOrigin(0.5);
        boton.on('pointerover', () => boton.setFillStyle(0x66B8FF));
        boton.on('pointerout', () => boton.setFillStyle(0xffffff));
        boton.on('pointerdown', () => boton.setFillStyle(0x0D5A8A));
        boton.on('pointerup', () => boton.setFillStyle(0x66B8FF));
        boton.on('pointerdown', () => onClick());
        return boton;
    }
}