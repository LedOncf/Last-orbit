import { SCREENS } from './utils/constants.js';
import { ScreenManager } from './core/ScreenManager.js';
import { ComicPages } from './core/ComicPages.js';
import { GameManager } from './core/GameManager.js';
import { GameUI } from './ui/GameUI.js';
import { MinigameManager } from './minigames/MinigameManager.js';
import { minigamesData } from './data/minigamesData.js';
import { ShipSelection } from './core/ShipSelection.js';
import { shipsData } from './data/shipsData.js';

const gm = new GameManager();
let selectedShip = null;

function startPageMinigame() {
    const page = ComicPages.getIndex() + 1;
    GameUI.setNextEnabled(false);
    GameUI.setHint(minigamesData[page].hint);
    MinigameManager.start(page, ratio => {
        GameUI.toast(gm.applyMinigameReward(page, ratio));
        GameUI.renderAll();
        GameUI.setNextEnabled(true);
    });
}

async function startRun() {
    MinigameManager.stop();
    gm.reset();
    gm.startGame();    // TODO: aplicar selectedShip al GameManager (necesito GameManager.js)
    ComicPages.reset();
    GameUI.showEvent(null);
    GameUI.renderAll();
    GameUI.setNextEnabled(false);
    if (await ScreenManager.goToScreen(SCREENS.GAME)) startPageMinigame();
}

async function onNextPage() {
    GameUI.setNextEnabled(false);
    MinigameManager.stop();
    const { event, status } = gm.advanceTurn();
    if (status !== 'active') {
        GameUI.renderEnding(gm.getEnding());
        await ScreenManager.goToScreen(SCREENS.ENDING);
        return;
    }
    GameUI.showEvent(event);
    GameUI.renderAll();
    await ComicPages.next();
    startPageMinigame();
}

document.addEventListener('DOMContentLoaded', () => {
    GameUI.init(gm, uid => {
        const r = gm.cards.play(uid);
        GameUI.toast(r.message);
        GameUI.renderAll();
    });

    // NUEVO: inicializa la selección de nave
    ShipSelection.init(shipId => {
        selectedShip = shipsData[shipId];
        startRun();
    });

    const modal = document.getElementById('modal-intro');
    document.getElementById('btn-start').addEventListener('click', () => modal.classList.remove('hidden'));

    // CAMBIADO: antes llamaba a startRun(), ahora abre la selección
    document.getElementById('btn-next').addEventListener('click', () => {
        modal.classList.add('hidden');
        ScreenManager.goToScreen(SCREENS.SELECTION);
    });

    document.getElementById('btn-next-page').addEventListener('click', onNextPage);
    document.getElementById('btn-restart').addEventListener('click', () => { MinigameManager.stop(); ScreenManager.resetTo(SCREENS.INTRO); });
});