export class CrewMember {
    constructor(name, specialty) {
        this.name = name;
        this.specialty = specialty;
        this.health = 100;
        this.mentalHealth = 100;
        this.status = 'healthy';
    }
    isAlive() { return this.health > 0; }
    modifyHealth(amount) {
        if (!this.isAlive()) return;               // los muertos no revives
        this.health = Math.max(0, Math.min(100, this.health + amount));
        this.updateStatus();
    }
    modifyMentalHealth(amount) {
        if (!this.isAlive()) return;
        this.mentalHealth = Math.max(0, Math.min(100, this.mentalHealth + amount));
    }
    updateStatus() {
        if (this.health <= 0) this.status = 'dead';
        else if (this.health < 40) this.status = 'critical';
        else if (this.health < 70) this.status = 'injured';
        else this.status = 'healthy';
    }
}
