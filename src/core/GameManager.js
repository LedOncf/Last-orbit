
import { GameState } from "./GameState.js";

import { ResourceManager }
from "../systems/ResourceManager.js";

import { CrewManager }
from "../systems/CrewManager.js";

import { EventManager }
from "../systems/EventManager.js";

import { CrewMember }
from "../models/CrewMember.js";

export class GameManager {

    constructor() {

        this.state = new GameState();

        this.resources = new ResourceManager(
            this.state
        );

        this.crew = new CrewManager(
            this.state
        );

        this.events = new EventManager(
            this.state,
            this.resources
        );
    }

    startGame() {

        if (this.state.status !== "preparation") {
            return false;
        }

        // Crear tripulación inicial
        this.crew.addCrewMember(
            new CrewMember("Alex", "Ingeniero")
        );

        this.crew.addCrewMember(
            new CrewMember("Morgan", "Científico")
        );

        this.crew.addCrewMember(
            new CrewMember("Sam", "Médico")
        );

        this.state.status = "active";

        this.state.addHistory(
            "La expedición ha comenzado."
        );

        return true;
    }

    nextDay() {

        if (this.state.status !== "active") {
            return null;
        }

        // Consumir recursos
        this.resources.consumeDailyResources();

        // Generar y aplicar evento
        const event = this.events.generateEvent();

        this.events.applyEvent(event);

        // Comprobar condiciones
        if (
            this.resources.checkCriticalResources() ||
            this.crew.checkCrewStatus()
        ) {
            this.state.status = "defeat";
        } else if (this.state.day >= this.state.maxDays) {
            this.state.status = "evaluation";
        } else {
            this.state.day++;
        }

        return event;
    }

    getState() {
        return this.state;
    }
}
