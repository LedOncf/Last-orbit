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
            if (k in this.state.resources) this.resources.modifyResource(k, v);
            else if (k in this.state.discovery) this.state.discovery[k] = Math.max(0, Math.min(100, this.state.discovery[k] + v));
        }
        this.state.addHistory(`Evento: ${event.title}`);
        return event;
    }
}
