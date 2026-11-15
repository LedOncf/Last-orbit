import { MAX_TURNS, MISSION_HOURS, RESOURCE_MAX } from '../utils/constants.js';

const $ = id => document.getElementById(id);
const L = { oxygen: 'O₂', food: 'Food', energy: 'Energy', materials: 'Mat', researchLevel: 'Research', anomalyLevel: 'Anomaly' };
let gm, onPlay, toastTimer;
const sign = v => (v > 0 ? '+' : '') + v;

const chips = (e = {}) => [
    ...Object.entries(e.resources ?? {}).map(([k, v]) => `${sign(v)} ${L[k]}`),
    ...Object.entries(e.discovery ?? {}).map(([k, v]) => `${sign(v)} ${L[k]}`),
    ...(e.crew?.health ? [`${sign(e.crew.health)} HP`] : []),
    ...(e.crew?.mentalHealth ? [`${sign(e.crew.mentalHealth)} Mind`] : [])
].map(c => `<span>${c}</span>`).join('');

export const GameUI = {
    init(gameManager, playHandler) { gm = gameManager; onPlay = playHandler; },

    renderAll() { this.renderHud(); this.renderHand(); },

    renderHud() {
        const s = gm.getState();
        $('hud-stats').innerHTML = Object.entries(s.resources).map(([k, v]) => {
            const capped = RESOURCE_MAX[k] !== Infinity;
            return `<div class="stat"><span>${L[k]} ${v}</span><div class="bar"><i class="${capped && v <= 25 ? 'low' : ''}" style="width:${capped ? v : 100}%"></i></div></div>`;
        }).join('');
        $('hud-crew').innerHTML = s.crew.map(m => `<span class="chip ${m.status}" title="HP ${m.health} · Mind ${m.mentalHealth}">${m.name}</span>`).join('');
        $('hud-meta').textContent = `T+${Math.round((s.turn - 1) * MISSION_HOURS / MAX_TURNS)}h / ${MISSION_HOURS}h · Research ${s.discovery.researchLevel}`;
    },

    renderHand() {
        const hand = $('card-hand');
        $('plays-left').textContent = `Plays: ${gm.cards.playsLeft}`;
        hand.innerHTML = '';
        gm.cards.hand.forEach(c => {
            const b = document.createElement('button');
            b.className = `card card--${c.type}`;
            b.disabled = !gm.cards.canPlay(c);
            b.innerHTML = `<strong>${c.title}</strong><small>${c.description}</small><em>${chips(c.effect)}</em>`;
            b.addEventListener('click', () => onPlay(c.uid));
            hand.append(b);
        });
    },

    showEvent(ev) {
        const el = $('event-banner');
        el.hidden = !ev;
        if (ev) { el.className = `event-banner event--${ev.type}`; el.innerHTML = `<strong>${ev.title}</strong> — ${ev.description}`; }
    },

    renderEnding(e) {
        $('ending-title').textContent = e.title;
        $('ending-text').textContent = e.text;
        $('ending-stats').innerHTML = `<li>Research: ${e.stats.research}</li><li>Anomaly: ${e.stats.anomaly}</li><li>Survivors: ${e.stats.survivors}/${e.stats.crew}</li>`;
        $('screen-ending').dataset.result = e.type;
    },

    setNextEnabled(on) { $('btn-next-page').disabled = !on; },
    setHint(t) { $('minigame-hint').textContent = t; },

    toast(msg) {
        const el = $('toast');
        el.textContent = msg; el.classList.add('show');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => el.classList.remove('show'), 2200);
    }
};
