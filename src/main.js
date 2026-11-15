import { SCREENS } from './utils/constants.js';
import { ScreenManager } from './core/ScreenManager.js';
import { GameManager } from './core/GameManager.js';
import { GameUI } from './ui/GameUI.js';
import { MinigameManager } from './minigames/MinigameManager.js';

const gm = new GameManager();

async function showObservatoryImage() {
    $('story-title').textContent = 'OBSERVATORY IMAGE RECOVERED';
    $('story-text').textContent = 'Luke, you know this is a once-in-a-lifetime opportunity before it vanishes into the void. I need you to intercept it so we can study it.';
    $('story-day').textContent = '';
    $('story-art').src = 'assets/img/img2.png';
    $('story-art-frame').hidden = false;
    $('story-actions').innerHTML = '<button id="btn-prepare-mission" class="btn-next">Prepare Mission</button>';
    await ScreenManager.goToScreen(SCREENS.STORY);
    $('btn-prepare-mission').addEventListener('click', async () => {
        GameUI.resetLoadout();
        await ScreenManager.goToScreen(SCREENS.LOADOUT);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    GameUI.init(gm, () => {});
    GameUI.initLoadout(() => {});
    gm.onDefeat = () => {
        MinigameManager.stop();
        GameUI.renderEnding(gm.getEnding());
        ScreenManager.goToScreen(SCREENS.ENDING);
    };

    const modal = document.getElementById('modal-intro');
    document.getElementById('btn-start').addEventListener('click', () => modal.classList.remove('hidden'));
    document.getElementById('btn-next').addEventListener('click', async () => {
        modal.classList.add('hidden');
        $('story-art-frame').hidden = true;
        await showObservatoryImage();
    });
    document.getElementById('btn-loadout-back').addEventListener('click', async () => {
        if (await ScreenManager.goToScreen(SCREENS.INTRO)) modal.classList.remove('hidden');
    });
    document.getElementById('btn-loadout-previous').addEventListener('click', () => GameUI.previousLoadoutRound());
    document.getElementById('btn-loadout-next').addEventListener('click', () => GameUI.nextLoadoutRound());
    document.getElementById('btn-confirm-loadout').addEventListener('click', () => GameUI.confirmLoadout());
    document.getElementById('btn-restart').addEventListener('click', () => {
        MinigameManager.stop();
        GameUI.resetLoadout();
        ScreenManager.resetTo(SCREENS.INTRO);
    });
});

function $(id) { return document.getElementById(id); }
