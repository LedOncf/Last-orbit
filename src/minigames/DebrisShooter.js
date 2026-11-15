import { Minigame } from './Minigame.js';
const R = 24, SPAWN = 900, LIFE = 1800;

export class DebrisShooter extends Minigame {
    constructor(c, o) { super(c, { ...o, duration: 15000, title: 'Limpieza de escombros' }); }
    init() { this.targets = []; this.acc = SPAWN; this.hits = 0; this.spawned = 0; }
    update(dt) {
        this.acc += dt;
        if (this.acc >= SPAWN) {
            this.acc = 0; this.spawned++;
            this.targets.push({ x: R + Math.random() * (this.w - 2 * R), y: 40 + Math.random() * (this.h - 40 - R), born: this.elapsed });
        }
        this.targets = this.targets.filter(t => this.elapsed - t.born < LIFE);
    }
    draw(ctx) {
        for (const t of this.targets) {
            const k = (this.elapsed - t.born) / LIFE, r = R * (1 - k * 0.3), a = 1 - k;
            [[r, `rgba(220,50,50,${a})`], [r * 0.65, `rgba(255,255,255,${a})`], [r * 0.3, `rgba(180,0,0,${a})`]].forEach(([rad, col]) => {
                ctx.beginPath(); ctx.arc(t.x, t.y, rad, 0, 7); ctx.fillStyle = col; ctx.fill();
            });
        }
        ctx.fillStyle = '#fff'; ctx.textAlign = 'right'; ctx.fillText(`Hits: ${this.hits}`, this.w - 10, 22); ctx.textAlign = 'left';
    }
    onDown(x, y) {
        const i = this.targets.findIndex(t => Math.hypot(t.x - x, t.y - y) <= R);
        if (i >= 0) { this.targets.splice(i, 1); this.hits++; }
    }
    result() { return this.hits / Math.max(1, this.spawned); }
}
