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
        'player1': 0,
        'player2': 0,
        'player3': 0,
    }
    let sixDecks = [];
    for( let i = 0; i < nbDecks; i ++) {
        sixDecks = sixDecks.concat(deck);
    }

    let nbPlayerStoped = 0;
    const nbPlayers = Object.keys(Scores).length;

    const drawBtns = document.querySelectorAll(".draw");
    drawBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            const player = btn.closest('.player');
            drawCard(player.dataset.player);
            nextPlayer(player.dataset.player);
        });
    })

    const stopBtns = document.querySelectorAll(".stop")
    stopBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            const player = btn.closest('.player');
            stop(player.dataset.player);
            nextPlayer(player.dataset.player);
        });
    })

    let gameOver = false;
    
    init();

    function drawCard(player) {
        const cards = document.querySelector(`[data-player="${player}"] .cards`);
        const nbPlayerCards = cards.querySelectorAll('.card__img').length;

        // Pour la 3e carte de la banque
        if(player === 'banque' && nbPlayerCards === 2) {
            const secondCard = cards.querySelector('.card__img--hide');
            const srcImg = secondCard.dataset.src;
            secondCard.src = srcImg;
            secondCard.classList.remove('card__img--hide');
            updatePlayerScore('banque');
            if (Scores['banque'] >= 17) return;
        }

        const randomCardIndex = Math.floor(Math.random() * sixDecks.length);
        const cardDraw = sixDecks[randomCardIndex];
        sixDecks.splice(randomCardIndex, 1);

        const img = document.createElement("img");
        img.classList.add('card__img');
        img.src = `./Cards/${cardDraw}.png`;
        img.dataset.value = cardDraw;
        cards.appendChild(img);

        // Pour la 2e carte de la banque
        if (player === 'banque' && (nbPlayerCards === 1)) {
            const cardCached = document.querySelector(".cards .card__img:nth-child(2)");
            cardCached.classList.add('card__img--hide');
            cardCached.dataset.src = cardCached.src;
            cardCached.src = './Cards/cardBack_green5.png';
        }

        updatePlayerScore(player);

        if(player === 'banque') nextPlayer('banque');
    }
    
    function updatePlayerScore(player) {
        const playerNode = document.querySelector(`[data-player="${player}"]`);
        const playerCards = playerNode.querySelectorAll('.card__img:not(.card__img--hide)');

        let currentScore = 0;
        playerCards.forEach(card => {
            const cardValue = card.dataset.value.split("")[0];

            if (
                parseInt(cardValue) === 1 &&
                !card.dataset.as &&
                player !== 'banque'
            ) {
                const popupAs = document.querySelector('.popup--as');
                popupAs.classList.remove('hide');
                playerNode.classList.add('player--waiting');

                return;
            } else {
                let cv;

                if (parseInt(cardValue) === 1) cv = parseInt(card.dataset.as);
                else cv = parseInt(cardValue) ? parseInt(cardValue) : 10

                currentScore += cv;
            }
        })

        Scores[player] = currentScore;

        if (Scores[player] >= 21) {
            playerNode.classList.add('player--stop');
        }

        const playerScore = playerNode.querySelector('.score');
        playerScore.innerHTML = Scores[player];

        isGameOver(Scores[player]);
        if(gameOver) console.log('PERDU', player);
    }

    function isGameOver(playerScore) {
        gameOver = playerScore > 21;
    }

    function stop(player) {
        nbPlayerStoped += 1;
        const currentPlayer = document.querySelector(`[data-player="${player}"]`);
        currentPlayer.classList.add('player--stop');
        const drawBtnOfPlayer = currentPlayer.querySelector('.draw');
        drawBtnOfPlayer.classList.add("hide");
        const stopBtnOfPlayer = currentPlayer.querySelector('.stop');
        stopBtnOfPlayer.classList.add("hide");

        const allPlayers = document.querySelectorAll('.player:not([data-player="banque"])');
        if (allPlayers.length === nbPlayerStoped) {            
            while (Scores['banque'] < 17) {
                drawCard('banque');
            }
    
            if(!gameOver) console.log('BANQUE GAGNE');
        }
    }
    
    function init(){
        const players = document.querySelectorAll(".player");
        // players.forEach(player => {
        //     const role = player.dataset.player;
            
        //     drawCard(role);
        //     drawCard(role);
        // });
    }

    function nextPlayer(player) {
        const currentPlayer = document.querySelector(`[data-player="${player}"]`);
        if (currentPlayer.classList.contains('player--waiting')) return;

        currentPlayer.classList.remove('playing');
        const nextPlayerNode = document.querySelector(`[data-player="${currentPlayer.dataset.next}"]`);

        nextPlayerNode.classList.add('playing');

        if (nextPlayerNode.dataset.player === 'banque') {
            if (Scores['banque'] < 17) {
                drawCard('banque');
            } else {
                // boucle infini
                // on passe 2* ici, du coup ça incrémente de 2 nbPlayerStoped
                console.log('nbPlayerStoped :', nbPlayerStoped);
                
                
                nextPlayerNode.classList.add('player--stop');
                nbPlayerStoped += 1;
                nextPlayer(nextPlayerNode.dataset.next);
            }
        }

        console.log(nbPlayerStoped, '/', nbPlayers);

        if (nbPlayerStoped >= nbPlayers) {
            // fin du jeu
            end();
        } else if ((nextPlayerNode.classList.contains('player--stop'))) {
            nextPlayer(nextPlayerNode.dataset.player);
        }
    }

    function end() {
        const scoreBanque = Scores["banque"];
        
        for (const [player, playerScore] of Object.entries(Scores)) {
            if (player !== 'banque') {
                const playerNode = document.querySelector(`.player[data-player='${player}']`);

                if (playerScore <= 21 && (playerScore > scoreBanque || scoreBanque > 21)) {
                    playerNode.classList.add('player--win');
                } else {
                    playerNode.classList.add('player--lose');
                }
            }
        }
    }

    const popupAs = document.querySelector('.popup--as');
    const btnAsValide = popupAs.querySelector('.popup__confirm');
    btnAsValide.addEventListener('click', () => {
        const currentPlayer = document.querySelector('.player.playing');
        const valueSelected = popupAs.querySelector('.popup__input:checked').value;
        const lastCard = currentPlayer.querySelector('.cards .card__img:last-child');
        lastCard.dataset.as = valueSelected;

        // Masquer la popup
        popupAs.classList.add('hide');

        currentPlayer.classList.remove('player--waiting');

        updatePlayerScore(currentPlayer.dataset.player);
        nextPlayer(currentPlayer.dataset.player);
    })
})

/*
    // ajouter la classe 'player--stop' si on dépasse 21
    ajouter dynamiquement depuis l'UI le nombre de joueur
    gérer le cas de l'AS :
        // - pour les joueurs
        - pour la banque (valeur as auto)
    gérer les mises
    gérer les splits
*/