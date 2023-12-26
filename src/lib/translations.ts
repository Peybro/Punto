import type { LanguagesType } from './types';

const translations: LanguagesType = {
	en: {
		colors: {
			red: 'Red',
			blue: 'Blue',
			green: 'Green',
			yellow: 'Yellow'
		},
		subtitle: 'Point over point to victory!',
		by: 'A game by',
		aim: {
			title: 'Objective of the Game',
			text: [
				'Connect four cards of',
				'the same color',
				'directly adjacent to each other in a row, column, or diagonal.'
			]
		},
		rules: {
			title: 'How to Play?',
			text: [
				'Players take turns placing the top card of their shuffled deck on the game board. The card can be placed on any side of a card already laid out (marked by the gray squares).',
				'The card to be placed can also be placed on another card already laid out if it has a higher value.',
				'It is recommended to play the game with 4 players, but it can also be started with fewer.'
			]
		},
		back: 'Back',
		createRoom: 'Create Room',
		joinRoom: 'Join Room',
		closeRoom: 'Close Room',
		leaveRoom: 'Leave Room',
		players: 'Players',
		waitingForPlayers: {
			self: 'Waiting for you to start the round...',
			others: 'Waiting for the host to start the round...'
		},
		kick: 'Kick',
		free: 'vacant',
		startGame: {
			new: 'Start',
			again: 'Restart'
		},
		endRound: 'End Round',
		turn: 'Move',
		yourTurn: "It's your turn",
		notConnected: 'No room connected',
		noMoreCards: 'Round over: No more cards in play!',
		toasts: {
			roomNotFound: 'Room not found!',
			kick: 'You have been kicked!',
			win: 'has won!',
			winnerWhenNoCards: 'The player with the most 3-in-a-row sets wins!',
			nameMissing: 'Please enter a name!',
			roomCodeNotValid: 'Please enter a valid room code!',
			noMatchingRoom: 'There is no room with this code!',
			roomFull: 'This room is already full!',
			nameAlreadyTaken: 'There is already a player with this name!',
			roundStarted: 'The round has already started! Please wait until it is over.'
		},
		shareText: 'Invite Friends',
		inviteText: 'Do you want to play Punto with me?',
		gameTypes: {
			one: '1-Player-Mode: Your toughest opponent is yourself.',
			two: '2-Player-Mode: Each player plays with two colors.',
			three: [
				'3-Player-Mode: Each player plays with one color. The',
				'fourth color',
				'is neutral and does not win with 4 in a row.'
			],
			four: '4-Player-Mode: Each player plays with one color.'
		}
	},
	de: {
		colors: {
			red: 'Rot',
			blue: 'Blau',
			green: 'Grün',
			yellow: 'Gelb'
		},
		subtitle: 'Punkt über Punkt zum Sieg!',
		by: 'Ein Spiel von',
		aim: {
			title: 'Ziel des Spiels',
			text: [
				'Vier, direkt nebeneinander liegende Karten',
				'derselben',
				'Farbe in eine Reihe, Spalte oder Diagonale bringen.'
			]
		},
		rules: {
			title: 'Wie wird gespielt?',
			text: [
				'Die Spielenden legen nacheinander die oberste Karte ihres gemischten Decks auf das Spielfeld. Dabei kann die Karte an jede beliebige Seite einer bereits gelegten Karte angelegt werden (gekennzeichnet durch die grauen Felder).',
				'Die zu legende Karte kann auch auf eine andere bereits gelegte Karte gelegt werden, wenn sie einen höheren Wert hat.',
				'Es wird empfohlen, das Spiel mit 4 Spielenden zu spielen. Es kann aber auch mit weniger gestartet werden.'
			]
		},
		back: 'zurück',
		createRoom: 'Raum erstellen',
		joinRoom: 'Raum beitreten',
		closeRoom: 'Raum schließen',
		leaveRoom: 'Raum verlassen',
		players: 'Spieler',
		waitingForPlayers: {
			self: 'Warte darauf dass du die Runde beginnst...',
			others: 'Warte darauf dass der Host die Runde beginnt...'
		},
		kick: 'Kicken',
		free: 'unbesetzt',
		startGame: {
			new: 'Start',
			again: 'Neustart'
		},
		endRound: 'Runde beenden',
		turn: 'Zug',
		yourTurn: 'Du bist dran',
		notConnected: 'Kein Raum verbunden',
		noMoreCards: 'Runde zu Ende: Keine Karten mehr im Spiel!',
		toasts: {
			roomNotFound: 'Raum nicht gefunden!',
			kick: 'Du wurdest gekickt!',
			win: 'hat gewonnen!',
			winnerWhenNoCards: 'Es gewinnt der Spieler mit den meisten 3er-Reihen!',
			nameMissing: 'Bitte gib einen Namen ein!',
			roomCodeNotValid: 'Bitte gib einen gültigen Raumcode ein!',
			noMatchingRoom: 'Es gibt keinen Raum mit diesem Code!',
			roomFull: 'Dieser Raum ist bereits voll!',
			nameAlreadyTaken: 'Es gibt bereits einen Spieler mit diesem Namen!',
			roundStarted: 'Die Runde hat bereits begonnen! Bitte warte bis sie vorbei ist.'
		},
		shareText: 'Freunde einladen',
		inviteText: 'Willst du mit mir Punto spielen?',
		gameTypes: {
			one: '1-Spieler-Modus: Dein härtester Gegner bist du selbst.',
			two: '2-Spieler-Modus: Jeder spielt mit zwei Farben.',
			three: [
				'3-Spieler-Modus: Jeder spielt mit einer Farbe. Die',
				'vierte Farbe',
				'ist neutral und gewinnt nicht mit 4 in einer Reihe.'
			],
			four: '4-Spieler-Modus: Jeder spielt mit einer Farbe.'
		}
	},
	fr: {
		colors: {
			red: 'Rouge',
			blue: 'Bleu',
			green: 'Vert',
			yellow: 'Jaune'
		},
		subtitle: 'La victoire point par point!',
		by: 'Un jeu créé par',
		aim: {
			title: 'Objectif du Jeu',
			text: [
				'Connectez quatre cartes',
				'de la même',
				'couleur directement adjacentes les unes aux autres en ligne, en colonne ou en diagonale.'
			]
		},
		rules: {
			title: 'Comment Jouer ?',
			text: [
				"Les joueurs placent tour à tour la carte du dessus de leur paquet mélangé sur le plateau de jeu. La carte peut être placée sur n'importe quel côté d'une carte déjà posée (marqué par les carrés gris).",
				'La carte à poser peut également être placée sur une autre carte déjà posée si elle a une valeur plus élevée.',
				'Il est recommandé de jouer avec 4 joueurs, mais le jeu peut également être démarré avec moins.'
			]
		},
		back: 'Retour',
		createRoom: 'Créer une Salle',
		joinRoom: 'Rejoindre une Salle',
		closeRoom: 'Fermer la Salle',
		leaveRoom: 'Quitter la Salle',
		players: 'Joueurs',
		waitingForPlayers: {
			self: 'En attente que vous commenciez la partie...',
			others: "En attente que l'hôte commence la partie..."
		},
		kick: 'Exclure',
		free: 'libre',
		startGame: {
			new: 'Démarrer',
			again: 'Recommencer'
		},
		endRound: 'Terminer la Manche',
		turn: 'Tour',
		yourTurn: "C'est à vous de jouer",
		notConnected: 'Aucune salle connectée',
		noMoreCards: 'Fin du tour : plus de cartes en jeu!',
		toasts: {
			roomNotFound: 'Salle introuvable!',
			kick: 'Vous avez été exclu(e)!',
			win: 'a gagné!',
			winnerWhenNoCards: 'Le joueur avec le plus de séries de 3 gagne!',
			nameMissing: 'Veuillez entrer un nom!',
			roomCodeNotValid: 'Veuillez entrer un code de salle valide!',
			noMatchingRoom: "Il n'y a aucune salle avec ce code!",
			roomFull: 'Cette salle est déjà pleine!',
			nameAlreadyTaken: 'Il y a déjà un joueur avec ce nom!',
			roundStarted: "La manche a déjà commencé! Veuillez attendre qu'elle se termine."
		},
		shareText: 'Inviter des Amis',
		inviteText: 'Veux-tu jouer à Punto avec moi?',
		gameTypes: {
			one: 'Mode 1 Joueur : Votre adversaire le plus coriace, c’est vous-même.',
			two: 'Mode 2 Joueurs : Chaque joueur joue avec deux couleurs.',
			three: [
				'Mode 3 Joueurs : Chaque joueur joue avec une couleur. La',
				'quatrième couleur',
				"est neutre et ne gagne pas avec 4 d'affilée."
			],
			four: 'Mode 4 Joueurs : Chaque joueur joue avec une couleur.'
		}
	}
};

export { translations };
