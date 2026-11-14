
export class ResourceManager {

    constructor(gameState) {
        this.state = gameState;
    }

    // Modificar un recurso
    modifyResource(resource, amount) {

        if (!(resource in this.state.resources)) {
            throw new Error(`Recurso desconocido: ${resource}`);
        }

        const current = this.state.resources[resource];

        // Los materiales y el combustible no tienen
        // el mismo límite que los recursos porcentuales.
        const newValue = current + amount;

        if (newValue < 0) {
            return false;
        }

        this.state.resources[resource] =
            resource === "materials"
                ? newValue
                : Math.min(100, newValue);

        return true;
    }

    // Consumo diario
    consumeDailyResources() {

        this.modifyResource("oxygen", -10);
        this.modifyResource("food", -8);
        this.modifyResource("energy", -5);

    }

    // Consultar un recurso
    getResource(resource) {
        return this.state.resources[resource];
    }

    // Comprobar recursos agotados
    checkCriticalResources() {

        const resources = this.state.resources;

        return (
            resources.oxygen <= 0 ||
            resources.food <= 0 ||
            resources.energy <= 0
        );
    }
}