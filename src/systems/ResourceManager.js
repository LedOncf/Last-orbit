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
        const loadout = this.state.loadout;
        const crewEffects = loadout?.crew.reduce((effects, member) => {
            for (const [key, value] of Object.entries(member.effects ?? {})) effects[key] = (effects[key] ?? 0) + value;
            return effects;
        }, {}) ?? {};
        for (const [resource, amount] of Object.entries(TURN_CONSUMPTION)) {
            let multiplier = 1;
            if (resource === 'energy') {
                multiplier = (loadout?.ship.energyDrainMultiplier ?? 1)
                    * (loadout?.artifact.energyDrainMultiplier ?? 1)
                    * (1 - (crewEffects.energyDrainReduction ?? 0));
            } else if (resource === 'lifeSupport') {
                multiplier = (loadout?.ship.lifeSupportDrainMultiplier ?? 1)
                    * (1 - (crewEffects.lifeSupportDrainReduction ?? 0));
            }
            this.modifyResource(resource, -Math.ceil(amount * multiplier));
        }
        if (loadout?.ship.integrityRecovery) this.modifyResource('integrity', loadout.ship.integrityRecovery);
        if (loadout?.artifact.exposureStartTurn && this.state.turn >= loadout.artifact.exposureStartTurn) {
            const hullMitigation = (loadout.ship.hullDamageMultiplier ?? 1) * (1 - (crewEffects.hullDamageReduction ?? 0));
            this.modifyResource('integrity', -Math.ceil(loadout.artifact.exposureIntegrityDamage * hullMitigation));
        }
        if (loadout?.ship.integrityRecovery) {
            this.modifyResource('integrity', loadout.ship.integrityRecovery);
        }
    }
    getResource(r) { return this.state.resources[r]; }
    getDepleted() { return ['lifeSupport', 'food', 'energy', 'integrity'].filter(r => this.state.resources[r] <= 0); }
    checkCriticalResources() { return this.getDepleted().length > 0; }
}
