export const ShipSelection = {
    init(onSelect) {
        const cards = document.querySelectorAll('.ship-card');
        cards.forEach(card => {
            card.querySelector('.select-btn').addEventListener('click', () => {
                cards.forEach(c => c.classList.remove('selected'));
                card.classList.add('selected');
                onSelect(card.dataset.ship);
            });
        });
    }
};