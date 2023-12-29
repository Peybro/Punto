type Color = 'red' | 'blue' | 'green' | 'yellow' | null;
type CardValue = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
type Card = { value: CardValue; color: Color };
type Player = { name: string; uuid: string; color: Color; deck: Card[]; wins: number };
type GameState = {
	board: Card[][];
	turn: number;
	currentPlayerIndex: number;
};

type LanguageType = {
	colors: {
		red: string;
		blue: string;
		green: string;
		yellow: string;
	};
	subtitle: string;
	by: string;
	aim: {
		title: string;
		text: [string, string, string];
	};
	rules: {
		title: string;
		text: [string, string, string];
	};
	back: string;
	createRoom: string;
	joinRoom: string;
	closeRoom: string;
	leaveRoom: string;
	players: string;
	waitingForPlayers: {
		self: string;
		others: string;
	};
	kick: string;
	free: string;
	startGame: {
		new: string;
		again: string;
	};
	endRound: string;
	turn: string;
	yourTurn: string;
	notConnected: string;
	noMoreCards: string;
	toasts: {
		roomNotFound: string;
		kick: string;
		win: string;
		winnerWhenNoCards: string;
		nameMissing: string;
		roomCodeNotValid: string;
		noMatchingRoom: string;
		roomFull: string;
		nameAlreadyTaken: string;
		roundStarted: string;
		playerLeft: string;
		playerJoined: {
			new: string;
			again: string;
		};
	};
	shareText: string;
	inviteText: string;
	gameTypes: {
		one: string;
		two: string;
		three: [string, string, string];
		four: string;
	};
	order: string;
	winsWithThrees: [string, string];
	reconnect: {
		title: string;
		reconnect: string;
		dismiss: string;
	};
};

type LanguagesType = {
	[key: string]: LanguageType;
};

export type { Color, CardValue, Card, Player, GameState, LanguagesType };
