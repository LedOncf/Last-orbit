import { DebrisShooter } from './DebrisShooter.js';
import { Calibration } from './Calibration.js';
import { SignalMemory } from './SignalMemory.js';
import { AsteroidDodge } from './AsteroidDodge.js';
import { Tracking } from './Tracking.js';

// Un minijuego por hoja. Para cambiar uno, cambia la clase aquí.
const REGISTRY = { 1: DebrisShooter, 2: Calibration, 3: SignalMemory, 4: AsteroidDodge, 5: Tracking };
let current = null;

export const MinigameManager = {
    start(page, onFinish) {
        this.stop();
        const canvas = document.querySelector(`.minigame-canvas[data-minigame="${page}"]`);
        const Cls = REGISTRY[page];
        if (!canvas || !Cls) return onFinish(0);
        current = new Cls(canvas, { onFinish });
        current.start();
    },
    stop() { current?.stop(); current = null; }
};
