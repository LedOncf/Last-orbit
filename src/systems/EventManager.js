import { eventsData } from '../data/eventsData.js';

export class EventManager {
    constructor(state, resources) { this.state = state; this.resources = resources; }

    generateEvent() {
        let r = Math.random() * eventsData.reduce((t, e) => t + e.weight, 0);
        for (const e of eventsData) { r -= e.weight; if (r < 0) return e; }
        return eventsData[eventsData.length - 1];
    }
    applyEvent(event) {
        for (const [k, v] of Object.entries(event.effect)) {
            if (k in this.state.resources) {
                const crew = this.state.loadout?.crew ?? [];
                let effect = v;
                if (v < 0 && (k === 'integrity' || k === 'lifeSupport' || k === 'oxygen' || k === 'energy')) {
                    const crewEffect = k === 'integrity' ? 'hullDamageReduction'
                        : k === 'energy' ? 'energyDamageReduction' : 'lifeSupportDamageReduction';
                    const reduction = crew.reduce((bonus, member) => bonus + (member.effects?.[crewEffect] ?? 0), 0);
                    const shipMultiplier = k === 'integrity' ? (this.state.loadout?.ship.hullDamageMultiplier ?? 1) : 1;
                    effect = Math.ceil(v * shipMultiplier * (1 - reduction));
                }
                this.resources.modifyResource(k, effect);
            } else if (k in this.state.discovery) {
                const isScience = k === 'researchLevel';
                const scienceMultiplier = isScience
                    ? (this.state.loadout?.artifact.scienceYieldMultiplier ?? 1)
                        + (this.state.loadout?.crew.reduce((bonus, member) => bonus + (member.effects?.scienceYieldBonus ?? 0), 0) ?? 0)
                    : 1;
                const gain = isScience ? Math.round(v * scienceMultiplier) : v;
                this.state.discovery[k] = Math.max(0, Math.min(100, this.state.discovery[k] + gain));
                if (isScience) this.state.science += Math.max(0, gain);
            }
        }
        this.state.addHistory(`Evento: ${event.title}`);
        return event;
    }
}
