import { Minigame } from './Minigame.js';

export class AsteroidDodge extends Minigame {
    constructor(c, o) { super(c, { ...o, duration: 18000, title: 'Campo de asteroides' }); }
    init() { this.x = this.w / 2; this.rocks = []; this.acc = 0; this.lives = 3; this.inv = 0; }
    update(dt) {
        this.acc += dt; this.inv = Math.max(0, this.inv - dt);
        if (this.acc > 450 - Math.min(200, this.elapsed / 90)) {
            this.acc = 0;
            this.rocks.push({ x: Math.random() * this.w, y: -20, r: 12 + Math.random() * 14, v: 0.18 + Math.random() * 0.2 });
        }
        const sy = this.h - 40;
        for (const a of this.rocks) {
            a.y += a.v * dt;
            if (!this.inv && Math.hypot(a.x - this.x, a.y - sy) < a.r + 14) { this.lives--; this.inv = 900; a.y = this.h + 99; }
        }
        this.rocks = this.rocks.filter(a => a.y < this.h + 40);
        if (this.lives <= 0) this.finish();
    }
    draw(ctx) {
        ctx.fillStyle = '#7f8c8d';
        for (const a of this.rocks) { ctx.beginPath(); ctx.arc(a.x, a.y, a.r, 0, 7); ctx.fill(); }
        const blink = this.inv && Math.floor(this.elapsed / 80) % 2;
        ctx.fillStyle = blink ? 'rgba(0,0,0,0)' : '#ecf0f1';
        const sy = this.h - 40;
        ctx.beginPath(); ctx.moveTo(this.x, sy - 16); ctx.lineTo(this.x - 14, sy + 14); ctx.lineTo(this.x + 14, sy + 14); ctx.fill();
        ctx.fillStyle = '#fff'; ctx.textAlign = 'right'; ctx.fillText('♥'.repeat(Math.max(0, this.lives)), this.w - 10, 22); ctx.textAlign = 'left';
    }
    onMove(x) { this.x = Math.max(14, Math.min(this.w - 14, x)); }
    onDown(x) { this.onMove(x); }
    result() { return Math.max(0, this.lives) / 3; }
}
