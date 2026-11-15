export class Card {
    constructor({ id, title, description, type, effect, target = 'all' }) {
        Object.assign(this, { id, title, description, type, effect, target });
        this.uid = `${id}-${Math.random().toString(36).slice(2, 8)}`; // varias copias de la misma carta
    }
}
