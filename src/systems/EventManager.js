
import { eventsData } from "../data/eventsData.js";

export class EventManager {

    constructor(gameState, resourceManager) {

        this.state = gameState;
        this.resources = resourceManager;
    }

    generateEvent() {

        const totalWeight = eventsData.reduce(
            (total, event) => total + event.weight,
            0
        );

        let random = Math.random() * totalWeight;

        for (const event of eventsData) {

            random -= event.weight;

            if (random < 0) {
                return event;
            }
        }

        return eventsData[eventsData.length - 1];
    }

    applyEvent(event) {

        for (const [resource, amount] of
            Object.entries(event.effect)) {

            if (resource in this.state.resources) {
                this.resources.modifyResource(
                    resource,
                    amount
                );
            } else if (resource in this.state.discovery) {
                this.state.discovery[resource] += amount;
            }
        }

        this.state.addHistory(
            `Evento: ${event.title}`
        );

        return event;
    }
}
