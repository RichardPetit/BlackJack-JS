window.addEventListener('load', function(){

    const deck = [
        '1H', '2H', '3H', '4H', '5H', '6H', '7H', '8H', '9H','TH', 'JH', 'QH', 'KH',
        '1D', '2D', '3D', '4D', '5D', '6D', '7D', '8D', '9D','TD', 'JD', 'QD', 'KD',
        '1S', '2S', '3S', '4S', '5S', '6S', '7S', '8S', '9S','TS', 'JS', 'QS', 'KS',
        '1C', '2C', '3C', '4C', '5C', '6C', '7C', '8C', '9C','TC', 'JC', 'QC', 'KC',
    ];
    const nbDecks = 6;
    const Scores = {
        'banque' : 0,
        'player1': 0
    }
    let sixDecks = [];
    for( let i = 0; i < nbDecks; i ++) {
        sixDecks = sixDecks.concat(deck);
    }

    const btns = document.querySelectorAll(".draw");
    btns.forEach(btn => {
        btn.addEventListener("click", drawCard);
    })



    function drawCard() {
        const btn = this;
        const player = btn.closest('.player');

        const randomCardIndex = Math.floor(Math.random() * sixDecks.length);
        const cardDraw = sixDecks[randomCardIndex];
        sixDecks.splice(randomCardIndex, 1);

        const p = document.createElement("p");
        const cards = document.querySelector(`[data-player="${player.dataset.player}"] .cards`);
        p.innerHTML = cardDraw;
        cards.appendChild(p);

        updatePlayerScore(player.dataset.player, cardDraw);
    }
    
    function updatePlayerScore(player, cardDraw) {
        const playerScore = Scores[player];
        const cardValue = cardDraw.split("")[0];
    }
})