export class CrewManager {
    constructor(state) { this.state = state; }
    addCrewMember(m) { this.state.crew.push(m); }
    getCrew() { return [...this.state.crew]; }
    getAlive() { return this.state.crew.filter(m => m.isAlive()); }
    getWeakest() { return this.getAlive().sort((a, b) => a.health - b.health)[0] ?? null; }
    damageCrewMember(name, damage) {
        const m = this.state.crew.find(c => c.name === name);
        if (!m || !m.isAlive() || !(damage > 0)) return false;
        m.modifyHealth(-damage);
        return true;
    }
    isCrewDead() { return this.state.crew.length > 0 && this.getAlive().length === 0; }
}
