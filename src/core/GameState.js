
export class GameState {

    constructor() {

        // Progreso de la expedición
        this.day = 1;
        this.maxDays = 30;
        this.status = "preparation";

        // Recursos de la nave
        this.resources = {
            oxygen: 100,
            food: 100,
            energy: 100,
            fuel: 100,
            materials: 20
        };

        // Estado de la tripulación
        this.crew = [];

        // Información del objeto interestelar
        this.discovery = {
            researchLevel: 0,
            anomalyLevel: 0,
            discoveredSecrets: []
        };

        // Información de la expedición
        this.communicationRestored = false;
        this.shipRepaired = false;
        this.history = [];
    }

    addHistory(message) {
        this.history.push({
            day: this.day,
            message: message
        });
    }
}
