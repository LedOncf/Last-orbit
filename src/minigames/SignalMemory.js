import { Minigame } from './Minigame.js';
const COLORS = ['#c0392b', '#2980b9', '#27ae60', '#f1c40f'];
const GOAL = 4, STEP = 700;
const rnd = () => Math.floor(Math.random() * 4);

export class SignalMemory extends Minigame {
    constructor(c, o) { super(c, { ...o, duration: 45000, title: 'Señal desconocida' }); }
    init() { this.seq = [rnd(), rnd()]; this.score = 0; this.mistakes = 0; this.replay(); }
    replay() { this.phase = 'show'; this.t = 0; this.lit = -1; this.flash = 0; this.pos = 0; }
    update(dt) {
        this.flash = Math.max(0, this.flash - dt);
        if (this.phase === 'show') {
            this.t += dt;
            const i = Math.floor(this.t / STEP);
            if (i >= this.seq.length) { this.phase = 'input'; this.pos = 0; this.lit = -1; }
            else this.lit = this.t % STEP < 500 ? this.seq[i] : -1;
        } else if (this.flash <= 0) this.lit = -1;
    }
    rect(i) {
        const top = 44, pw = (this.w - 36) / 2, ph = (this.h - top - 24) / 2;
        return [12 + (i % 2) * (pw + 12), top + (i >> 1) * (ph + 12), pw, ph];
    }
    draw(ctx) {
        for (let i = 0; i < 4; i++) {
            ctx.globalAlpha = this.lit === i ? 1 : 0.28; ctx.fillStyle = COLORS[i];
            ctx.fillRect(...this.rect(i));
        }
        ctx.globalAlpha = 1; ctx.fillStyle = '#fff'; ctx.textAlign = 'right';
        ctx.fillText(`${this.phase === 'show' ? 'Observa' : 'Repite'} · ${this.score}/${GOAL} · fallos ${this.mistakes}/2`, this.w - 10, 22);
        ctx.textAlign = 'left';
    }
    onDown(x, y) {
        if (this.phase !== 'input') return;
        const pad = [0, 1, 2, 3].find(i => { const [rx, ry, rw, rh] = this.rect(i); return x >= rx && x <= rx + rw && y >= ry && y <= ry + rh; });
        if (pad === undefined) return;
        this.lit = pad; this.flash = 150;
        if (pad === this.seq[this.pos]) {
            if (++this.pos === this.seq.length) {
                if (++this.score >= GOAL) return this.finish();
                this.seq.push(rnd()); this.replay();
            }
        } else if (++this.mistakes >= 2) this.finish();
        else this.replay();
    }
    result() { return this.score / GOAL; }
}
