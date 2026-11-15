// Clase base: loop, resize, puntero, HUD (barra de tiempo) y overlay final.
// Las subclases implementan: init(), update(dt), draw(ctx), onDown(x,y), onMove(x,y), result() -> 0..1
export class Minigame {
    constructor(canvas, { duration = 15000, title = '', onFinish } = {}) {
        Object.assign(this, { canvas, duration, title, onFinish });
        this.running = false;
    }
    start() {
        this.ctx = this.canvas.getContext('2d');
        this._resize();
        this.elapsed = 0; this.running = true; this.last = performance.now();
        this._rs = () => this._resize();
        this._dn = e => this.running && this.onDown(...this._pos(e));
        this._mv = e => this.running && this.onMove(...this._pos(e));
        window.addEventListener('resize', this._rs);
        this.canvas.addEventListener('pointerdown', this._dn);
        this.canvas.addEventListener('pointermove', this._mv);
        this.init();
        this.raf = requestAnimationFrame(t => this._loop(t));
    }
    stop() {
        this.running = false;
        cancelAnimationFrame(this.raf);
        window.removeEventListener('resize', this._rs);
        this.canvas?.removeEventListener('pointerdown', this._dn);
        this.canvas?.removeEventListener('pointermove', this._mv);
    }
    finish() {
        if (!this.running) return;
        this.stop();
        const r = Math.max(0, Math.min(1, this.result()));
        const { ctx, w, h } = this;
        ctx.fillStyle = 'rgba(0,0,0,0.6)'; ctx.fillRect(0, 0, w, h);
        ctx.fillStyle = '#fff'; ctx.textAlign = 'center';
        ctx.font = 'bold 28px sans-serif'; ctx.fillText(`${Math.round(r * 100)}%`, w / 2, h / 2);
        ctx.font = '14px sans-serif'; ctx.fillText('Completado', w / 2, h / 2 + 26);
        ctx.textAlign = 'left';
        this.onFinish?.(r);
    }
    _resize() {
        const p = this.canvas.parentElement;
        this.w = this.canvas.width = p.clientWidth;
        this.h = this.canvas.height = p.clientHeight;
    }
    _pos(e) {
        const r = this.canvas.getBoundingClientRect();
        return [(e.clientX - r.left) * (this.w / r.width), (e.clientY - r.top) * (this.h / r.height)];
    }
    _loop(now) {
        if (!this.running) return;
        const dt = Math.min(50, now - this.last); this.last = now;
        this.elapsed += dt;
        this.update(dt);
        if (!this.running) return;          // update() pudo llamar a finish()
        const { ctx, w, h } = this;
        ctx.fillStyle = '#1a1a2e'; ctx.fillRect(0, 0, w, h);
        this.draw(ctx);
        ctx.fillStyle = '#cc0000'; ctx.fillRect(0, 0, w * Math.max(0, 1 - this.elapsed / this.duration), 4);
        ctx.fillStyle = '#fff'; ctx.font = 'bold 14px sans-serif'; ctx.fillText(this.title, 10, 22);
        if (this.elapsed >= this.duration) return this.finish();
        this.raf = requestAnimationFrame(t => this._loop(t));
    }
    init() {} update() {} draw() {} onDown() {} onMove() {} result() { return 0; }
}
