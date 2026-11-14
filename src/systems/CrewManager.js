
export class CrewManager {

    constructor(gameState) {
        this.state = gameState;
    }

    addCrewMember(member) {
        this.state.crew.push(member);
    }

    getCrew() {
        return this.state.crew;
    }

    damageCrewMember(name, damage) {

        const member = this.state.crew.find(
            crew => crew.name === name
        );

        if (!member) return false;

        member.modifyHealth(-damage);

        return true;
    }

    checkCrewStatus() {

        return this.state.crew.every(
            member => member.status === "dead"
        );
    }
}
