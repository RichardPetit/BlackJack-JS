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

    const drawBtns = document.querySelectorAll(".draw");
    drawBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            const player = btn.closest('.player');
            drawCard(player.dataset.player);
        });
    })

    const stopBtns = document.querySelectorAll(".stop")
    stopBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            const player = btn.closest('.player');
            stop(player.dataset.player);
        });
    })

    let gameOver = false;
    
    init();

    function drawCard(player) {
        const randomCardIndex = Math.floor(Math.random() * sixDecks.length);
        const cardDraw = sixDecks[randomCardIndex];
        sixDecks.splice(randomCardIndex, 1);

        const img = document.createElement("img");
        const cards = document.querySelector(`[data-player="${player}"] .cards`);
        img.classList.add('card__img');
        img.src = `./Cards/${cardDraw}.png`;
        cards.appendChild(img);

        updatePlayerScore(player, cardDraw);

        // TEST
        // if (
        //     player !== 'banque' &&
        //     Scores['banque'] < 17
        // ) {
        //     drawCard('banque');
        // }
    }
    
    function updatePlayerScore(player, cardDraw) {
        const cardValue = cardDraw.split("")[0];
        Scores[player] += parseInt(cardValue) ? parseInt(cardValue) : 10;

        const playerScore = document.querySelector(`[data-player="${player}"] .score`);
        playerScore.innerHTML = Scores[player];

        isGameOver(Scores[player]);
        if(gameOver) console.log('PERDU', player);
    }

    function isGameOver(playerScore) {
        gameOver = playerScore > 21;
    }

    function stop(player) {
        const drawBtnOfPlayer = document.querySelector(`[data-player="${player}"] .draw`)
        drawBtnOfPlayer.classList.add("hide");

        while (Scores['banque'] < 17) {
            drawCard('banque');
        }

        if(!gameOver) console.log('BANQUE GAGNE');
    }
    
    function init(){
        const players = document.querySelectorAll(".player");
        players.forEach(player => {
            const role = player.dataset.player;
            drawCard(role);
            drawCard(role);
            
            if(role === 'banque'){
                const cardCached = document.querySelector(".cards .card__img:nth-child(2)");
                cardCached.classList.add('card__img--hide');
                cardCached.dataset.src = cardCached.src;
                cardCached.src = './Cards/cardBack_green5.png';
            }
        });
    }
})