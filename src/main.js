
import { GameManager } from "./core/GameManager.js";

const game = new GameManager();

// Iniciar partida
game.startGame();

// Mostrar estado inicial
console.log("ESTADO INICIAL:");
console.log(game.getState());

// Avanzar un día
const event = game.nextDay();

console.log("EVENTO GENERADO:");
console.log(event);

// Mostrar nuevo estado
console.log("ESTADO ACTUALIZADO:");
console.log(game.getState());