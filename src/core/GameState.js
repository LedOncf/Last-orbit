// src/core/GameState.js
// Handles screen navigation with a history stack (forward + back).

export const SCREENS = {
    INTRO:  'screen-intro',
    GAME:   'screen-game',
    ENDING: 'screen-ending',
};

const TRANSITION_MS = 500; // must match CSS transition duration

const GameState = (() => {

    // History stack — each entry is a screen id.
    // Starts with INTRO already in history.
    const history = [SCREENS.INTRO];

    // ── Internal ────────────────────────────────────────────────

    function _currentId() {
        return history[history.length - 1];
    }

    function _transition(fromId, toId, onSwap) {
        const from = document.getElementById(fromId);
        const to   = document.getElementById(toId);

        if (!from || !to) {
            console.warn(`[GameState] Screen not found: ${!from ? fromId : toId}`);
            return;
        }

        // Fade out
        from.style.opacity = '0';

        setTimeout(() => {
            from.classList.remove('active');
            to.classList.add('active');

            // Trigger reflow so the CSS transition fires on 'to'
            void to.offsetWidth;

            to.style.opacity = '1';

            // Update history after the swap
            onSwap();
        }, TRANSITION_MS);
    }

    // ── Public API ───────────────────────────────────────────────

    /**
     * Navigate to any screen by id.
     * Pushes the target onto the history stack.
     * Usage: GameState.goToScreen(SCREENS.GAME)
     */
    function goToScreen(screenId) {
        if (screenId === _currentId()) return;

        _transition(_currentId(), screenId, () => {
            history.push(screenId);
        });
    }

    /**
     * Go back to the previous screen.
     * Pops the current screen off the history stack.
     * Does nothing if already at the first screen.
     */
    function goBack() {
        if (history.length <= 1) return;

        const fromId = _currentId();
        const toId   = history[history.length - 2];

        _transition(fromId, toId, () => {
            history.pop();
        });
    }

    /**
     * Jump directly to a screen, clearing all history.
     * Useful for "restart" or "go to intro" actions.
     */
    function resetTo(screenId) {
        const fromId = _currentId();

        _transition(fromId, screenId, () => {
            history.length = 0;
            history.push(screenId);
        });
    }

    function getCurrentScreen() {
        return _currentId();
    }

    function getHistory() {
        return [...history];
    }

    // ── Init ─────────────────────────────────────────────────────

    function init() {
        // Intro → Game
        const btnStart = document.getElementById('btn-start');
        if (btnStart) {
            btnStart.addEventListener('click', () => goToScreen(SCREENS.GAME));
        }

        // Game → Ending  (temporary dev button)
        const btnEnding = document.getElementById('btn-go-ending');
        if (btnEnding) {
            btnEnding.addEventListener('click', () => goToScreen(SCREENS.ENDING));
        }

        // Ending → Intro  (play again)
        const btnRestart = document.getElementById('btn-restart');
        if (btnRestart) {
            btnRestart.addEventListener('click', () => resetTo(SCREENS.INTRO));
        }

        // Generic back button (works on any screen)
        document.querySelectorAll('[data-action="back"]').forEach(el => {
            el.addEventListener('click', goBack);
        });
    }

    return {
        SCREENS,
        init,
        goToScreen,
        goBack,
        resetTo,
        getCurrentScreen,
        getHistory,
    };

})();

export default GameState;
