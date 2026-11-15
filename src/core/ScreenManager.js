import { SCREENS, TRANSITION_MS } from '../utils/constants.js';

const history = [SCREENS.INTRO];
let busy = false;
const current = () => history[history.length - 1];

function transition(toId, afterSwap) {
    return new Promise(resolve => {
        const from = document.getElementById(current());
        const to = document.getElementById(toId);
        if (busy || !from || !to || from === to) return resolve(false);
        busy = true;
        from.style.opacity = '0';
        setTimeout(() => {
            from.classList.remove('active');
            to.classList.add('active');
            void to.offsetWidth;
            to.style.opacity = '1';
            afterSwap();
            busy = false;
            resolve(true);
        }, TRANSITION_MS);
    });
}

export const ScreenManager = {
    goToScreen: id => (id === current() ? Promise.resolve(false) : transition(id, () => history.push(id))),
    resetTo: id => transition(id, () => { history.length = 0; history.push(id); }),
    getCurrentScreen: current
};
