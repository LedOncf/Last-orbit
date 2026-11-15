import { Minigame } from './Minigame.js';
const R = 38;

export class Tracking extends Minigame {
    constructor(c, o) { super(c, { ...o, duration: 15000, title: 'Acoplamiento' }); }
    init() { this.cx = this.w / 2; this.cy = this.h / 2; this.tx = this.cx; this.ty = this.cy; this.inside = 0; this.on = false; }
    update(dt) {
        const t = this.elapsed;
        this.tx = this.w / 2 + (this.w / 2 - R - 10) * Math.sin(t * 0.0011);
        this.ty = this.h / 2 + (this.h / 2 - R - 10) * Math.sin(t * 0.0017 + 1);
        this.on = Math.hypot(this.cx - this.tx, this.cy - this.ty) <= R;
        if (this.on) this.inside += dt;
    }
    draw(ctx) {
        ctx.beginPath(); ctx.arc(this.tx, this.ty, R, 0, 7);
        ctx.strokeStyle = this.on ? '#27ae60' : '#c0392b'; ctx.lineWidth = 4; ctx.stroke();
        ctx.beginPath(); ctx.arc(this.cx, this.cy, 7, 0, 7); ctx.fillStyle = '#fff'; ctx.fill();
        ctx.textAlign = 'right'; ctx.fillText(`${Math.round(this.result() * 100)}%`, this.w - 10, 22); ctx.textAlign = 'left';
    }
    onMove(x, y) { this.cx = x; this.cy = y; }
    onDown(x, y) { this.onMove(x, y); }
    result() { return this.inside / Math.max(1, this.elapsed); }
}
