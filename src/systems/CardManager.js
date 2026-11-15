import { Card } from '../models/Card.js';
import { cardsData } from '../data/cardsData.js';
import { HAND_SIZE, PLAYS_PER_TURN } from '../utils/constants.js';

const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

export class CardManager {
    constructor(gm) { this.gm = gm; this.deck = []; this.discard = []; this.hand = []; this.playsLeft = PLAYS_PER_TURN; }

    buildDeck() {
        this.deck = shuffle(cardsData.flatMap(d => Array.from({ length: d.copies ?? 1 }, () => new Card(d))));
        this.discard = []; this.hand = [];
    }
    draw(n) {
        for (let i = 0; i < n; i++) {
            if (!this.deck.length) { this.deck = shuffle(this.discard); this.discard = []; }
            if (!this.deck.length) break;
            this.hand.push(this.deck.pop());
        }
    }
    startTurn() { this.playsLeft = PLAYS_PER_TURN; this.draw(HAND_SIZE - this.hand.length); }
    canPlay(card) { return this.playsLeft > 0 && this.gm.canAfford(card.effect); }

    play(uid) {
        const card = this.hand.find(c => c.uid === uid);
        if (!card) return { ok: false, message: 'Carta no encontrada' };
        if (this.playsLeft <= 0) return { ok: false, message: 'Sin jugadas este turno' };
        if (!this.gm.canAfford(card.effect)) return { ok: false, message: 'Recursos insuficientes' };
        this.gm.applyEffect(card.effect, card.target);
        this.hand = this.hand.filter(c => c !== card);
        this.discard.push(card);
        this.playsLeft--;
        this.gm.state.addHistory(`Carta: ${card.title}`);
        return { ok: true, message: `${card.title} jugada` };
    }
}
