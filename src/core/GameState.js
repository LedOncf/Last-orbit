import { initialResources } from '../data/initialResources.js';
export class GameState {
    constructor() {
        this.status = 'preparation';
        Object.assign(this, initialResources);
        this.ship = null;
        this.artifact = null;
        this.crew = [];
        this.currentDay = 0;
        this.usedEvents = [];
    }
}
