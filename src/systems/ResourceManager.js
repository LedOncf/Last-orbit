import { TURN_CONSUMPTION, RESOURCE_MAX } from '../utils/constants.js';

export class ResourceManager {
    constructor(state) { this.state = state; }

    modifyResource(resource, amount) {
        if (!(resource in this.state.resources)) throw new Error(`Recurso desconocido: ${resource}`);
        if (!Number.isFinite(amount)) return false;
        const next = this.state.resources[resource] + amount;
        this.state.resources[resource] = Math.max(0, Math.min(RESOURCE_MAX[resource], next)); // clamp 0..max
        return true;
    }
    consumeTurnResources() {
        for (const [r, v] of Object.entries(TURN_CONSUMPTION)) this.modifyResource(r, -v);
    }
    getResource(r) { return this.state.resources[r]; }
    getDepleted() { return ['oxygen', 'food', 'energy'].filter(r => this.state.resources[r] <= 0); }
    checkCriticalResources() { return this.getDepleted().length > 0; }
}
