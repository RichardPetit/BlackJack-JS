window.addEventListener('load', function(){
    const deck = [
        '1H', '2H', '3H', '4H', '5H', '6H', '7H', '8H', '9H','TH', 'JH', 'QH', 'KH',
        '1D', '2D', '3D', '4D', '5D', '6D', '7D', '8D', '9D','TD', 'JD', 'QD', 'KD',
        '1S', '2S', '3S', '4S', '5S', '6S', '7S', '8S', '9S','TS', 'JS', 'QS', 'KS',
        '1C', '2C', '3C', '4C', '5C', '6C', '7C', '8C', '9C','TC', 'JC', 'QC', 'KC',
    ];
    // const deck = [
    //     '1H', '1H', '1H', 'JH', 'QH', 'KH',
    //     '1D', '1D', '1D', 'QD', 'KD',
    //     '1S', '1S', '1S', 
    //     '1C', '1C', '1C', '2C',  'QC', 'KC',
    // ];
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
    let indexInit = 0;
    
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

            if (Scores['banque'] >= 17) {
                nextPlayer('banque');
                return;
            }
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
                !card.dataset.as
            ) {
                if (player !== 'banque') {
                    const popupAs = document.querySelector('.popup--as');
                    popupAs.classList.remove('hide');
                    playerNode.classList.add('player--waiting');

                    return;
                } else {
                    if (Scores['banque'] <= 10) {
                        card.dataset.as = '11';
                        currentScore += 11;
                    } else {
                        card.dataset.as = '1';
                        currentScore += 1;
                    }
                }
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
        document.querySelector('.container').classList.add('init');

        const players = document.querySelectorAll(".player");
        // players.forEach(player => {
        //     document.querySelector(".player.playing").classList.remove('playing');
        //     player.classList.add('playing');

        //     const role = player.dataset.player;
            
        //     drawCard(role);
        //     drawCard(role);
        // });

        let memory = '';
        for (let i = indexInit; i < players.length * 2 - 2; i += 1) {
            const player = document.querySelector(".player.playing");
            const role = player.dataset.player;

            if (memory === role) return;

            drawCard(role);
            nextPlayer(role);
            
            memory = role;
            indexInit += 1;
        }

        document.querySelector('.container').classList.remove('init');
    }

    function nextPlayer(player) {
        console.log('next player of', player);
        
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

        if (nbPlayerStoped >= nbPlayers) {
            // fin du jeu
            end();
        } else if ((nextPlayerNode.classList.contains('player--stop'))) {
            nextPlayer(nextPlayerNode.dataset.player);
        }
    }

    function end() {
        console.log('END');
        
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
        const asCard = currentPlayer.querySelector('.cards .card__img[data-value="1S"], .cards .card__img[data-value="1H"], .cards .card__img[data-value="1D"], .cards .card__img[data-value="1C"]');
        
        asCard.dataset.as = valueSelected;

        // Masquer la popup
        popupAs.classList.add('hide');

        currentPlayer.classList.remove('player--waiting');

        updatePlayerScore(currentPlayer.dataset.player);
        
        nextPlayer(currentPlayer.dataset.player);

        if (document.querySelector('.container').classList.contains('init')) {
            init();
        }
    })
})

/*
    // ajouter la classe 'player--stop' si on dépasse 21
    ajouter dynamiquement depuis l'UI le nombre de joueur
    // gérer le cas de l'AS :
        // - pour les joueurs
        // - pour la banque (valeur as auto)
    gérer les mises :
        Mises des joueurs :
            Mise principale : 
                - Chaque joueur doit placer sa mise avant la distribution des cartes.
                - Les montants minimum et maximum sont fixés par le casino, et varient selon les tables.

            // Mises secondaires (facultatives) : 
            //     - Les joueurs peuvent également placer des paris additionnels, appelés side bets, qui sont indépendants de la mise principale.
            //     Exemples :
            //         - Perfect Pair : Gagner si les deux premières cartes forment une paire.
            //         - 21+3 : Gagner en formant une combinaison spécifique avec les deux cartes du joueur et la carte visible du croupier (par exemple, brelan ou suite).
            //         - Hot 3 : Gagner si la somme des deux cartes du joueur et de la carte visible du croupier atteint un certain total (19 à 21).
            //         - Bust It : Gagner si le croupier dépasse 21 avec un certain nombre de cartes.

        Mises de la banque (croupier) :
            - La banque ne place pas de mise comme les joueurs, mais agit en tant qu'adversaire unique pour tous les joueurs à la table.
            - Le croupier suit des règles strictes : il doit tirer jusqu'à atteindre au moins 17 points et s'arrêter ensuite.
            - Si le croupier dépasse 21 points, il perd contre toutes les mains encore en jeu, et les joueurs restants gagnent leur mise.

        Paiement des gains :
            - Si le joueur obtient un Blackjack (21 avec deux cartes), il est payé à raison de 3 pour 2 (1,5 fois sa mise).
            - Si le joueur a un score supérieur à celui du croupier sans dépasser 21, il gagne une fois sa mise.
            - En cas d'égalité avec le croupier, le joueur récupère simplement sa mise.
            - Si le joueur perd (score inférieur au croupier ou dépasse 21), il perd sa mise.

        // Options spéciales liées aux mises :
        //     Assurance : 
        //         - Si la première carte du croupier est un As, les joueurs peuvent s'assurer contre un éventuel Blackjack de la banque en misant la moitié de leur mise initiale. 
        //         - Si le croupier fait Blackjack, l'assurance est payée à 2 pour 1.
        //     Doublement : Les joueurs peuvent doubler leur mise initiale après avoir reçu leurs deux premières cartes, mais ils ne recevront qu'une seule carte supplémentaire ensuite.
        //     Split (séparation) : En cas de paire parmi les deux premières cartes, le joueur peut diviser sa main en deux jeux distincts, nécessitant une mise supplémentaire égale à la mise initiale

    gérer les splits

    Stack de départ : 100 jetons
    mise minimale : 6 jetons
*/