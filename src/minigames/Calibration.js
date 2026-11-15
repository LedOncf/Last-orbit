import { Minigame } from './Minigame.js';
const ATTEMPTS = 5;

export class Calibration extends Minigame {
    constructor(c, o) { super(c, { ...o, duration: 25000, title: 'Calibración' }); }
    init() { this.tries = 0; this.hits = 0; this.pos = 0; this.msg = ''; this.newZone(); }
    newZone() { this.zone = 0.15 + Math.random() * 0.7; this.width = 0.16 - this.tries * 0.015; }
    update() { this.pos = 0.5 + 0.5 * Math.sin(this.elapsed * (0.003 + this.tries * 0.0006)); }
    draw(ctx) {
        const x0 = 30, bw = this.w - 60, y = this.h / 2 - 15;
        ctx.fillStyle = '#333'; ctx.fillRect(x0, y, bw, 30);
        ctx.fillStyle = '#27ae60'; ctx.fillRect(x0 + (this.zone - this.width / 2) * bw, y, this.width * bw, 30);
        ctx.fillStyle = '#fff'; ctx.fillRect(x0 + this.pos * bw - 2, y - 10, 4, 50);
        ctx.textAlign = 'center';
        ctx.fillText(`Intento ${Math.min(this.tries + 1, ATTEMPTS)}/${ATTEMPTS} · Aciertos ${this.hits}`, this.w / 2, y + 80);
        ctx.fillText(this.msg, this.w / 2, y - 30); ctx.textAlign = 'left';
    }
    onDown() {
        const ok = Math.abs(this.pos - this.zone) <= this.width / 2;
        if (ok) this.hits++;
        this.msg = ok ? '¡Bien!' : 'Fallaste';
        this.tries++;
        if (this.tries >= ATTEMPTS) return this.finish();
        this.newZone();
    }
    result() { return this.hits / ATTEMPTS; }
}
