import { FADE_MS } from '../utils/constants.js';

let pages = [], index = 0, busy = false;

function update() {
    const ind = document.getElementById('page-indicator');
    const btn = document.getElementById('btn-next-page');
    if (ind) ind.textContent = `${index + 1} / ${pages.length}`;
    if (btn) btn.textContent = hasNext() ? 'Next page →' : 'Go to Ending →';
}
const hasNext = () => index < pages.length - 1;

export const ComicPages = {
    hasNext,
    getIndex: () => index,
    next() {
        if (busy || !hasNext()) return Promise.resolve(false);
        busy = true;
        const from = pages[index], to = pages[index + 1];
        from.style.opacity = '0';
        return new Promise(resolve => setTimeout(() => {
            from.classList.remove('active');
            to.classList.add('active');
            void to.offsetWidth;
            to.style.opacity = '1';
            index++; busy = false; update();
            resolve(true);
        }, FADE_MS));
    },
    reset() {
        pages = [...document.querySelectorAll('.comic-page')];
        pages.forEach(p => { p.classList.remove('active'); p.style.opacity = ''; });
        index = 0; busy = false;
        pages[0].classList.add('active');
        pages[0].style.opacity = '1';
        update();
    }
};
