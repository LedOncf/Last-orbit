import { GameState } from './GameState.js';
import { CrewManager } from '../systems/CrewManager.js';
import { CrewMember } from '../models/CrewMember.js';

export class GameManager {
    constructor() {
        this.onDefeat = null;
        this.reset();
    }

    reset() {
        this.state = new GameState();
        this.crew = new CrewManager(this.state);
    }

    startGame(loadout) {
        if (this.state.status !== 'preparation') return false;
        if (!loadout?.ship || !loadout?.artifact || !Array.isArray(loadout.crew)
            || loadout.crew.length !== loadout.ship.crewCapacity) return false;
        if (loadout.ship.defaultCrew && !loadout.crew.some(member => member.id === loadout.ship.defaultCrew)) return false;
        this.state.ship = loadout.ship.id;
        this.state.artifact = loadout.artifact.id;
        this.state.crew = loadout.crew.map(member => member.id);
        this.state.energy = 10;
        this.state.integrity = 10;
        this.state.lifeSupport = 10;
        this.state.science = 0;
        this.state.status = 'active';
        return true;
    }

    applyVariables(changes) {
        for (const [key, amount] of Object.entries(changes)) {
            if (!['lifeSupport', 'energy', 'integrity', 'science'].includes(key) || !Number.isFinite(amount)) continue;
            const next = this.state[key] + amount;
            this.state[key] = key === 'science' ? Math.max(0, next) : Math.max(0, Math.min(10, next));
            if (key !== 'science' && this.state[key] <= 0) return this.checkDefeat();
        }
        return this.checkDefeat();
    }

    checkDefeat() {
        if (this.state.lifeSupport <= 0 || this.state.energy <= 0 || this.state.integrity <= 0) {
            const newlyDefeated = this.state.status !== 'defeat';
            this.state.status = 'defeat';
            if (newlyDefeated) this.onDefeat?.();
            return true;
        }
        return false;
    }

    getEnding() {
        if (this.state.status !== 'defeat') return null;
        return { type: 'defeat', title: 'NO SIGNAL — GAME OVER', text: 'All critical telemetry has been lost.', stats: { science: this.state.science } };
    }
    getState() { return this.state; }
}
