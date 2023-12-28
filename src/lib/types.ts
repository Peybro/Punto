import { duplicate } from './utils';

type CardValue = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

enum colors {
	Red = 'red',
	Blue = 'blue',
	Green = 'green',
	Yellow = 'yellow'
}

class Color {
	constructor(public value: colors | 'NULL') {
	}

	get ColorMap() {
		return {
			[colors.Red]: { hex: '#dc3522', bootstrap: 'danger' },
			[colors.Blue]: { hex: '#02ace7', bootstrap: 'info' },
			[colors.Green]: { hex: '#78b728', bootstrap: 'success' },
			[colors.Yellow]: { hex: '#f1b300', bootstrap: 'warning' },
			NULL: { color: 'NULL', hex: '#000000', bootstrap: 'light' }
		};
	}

	get Hex() {
		return this.ColorMap[this.value].hex;
	}

	get Bootstrap() {
		return this.ColorMap[this.value].bootstrap;
	}
}

class Card {
	constructor(
		public value: CardValue,
		public color: Color
	) {
	}
}

class Deck {
	constructor(
		public color: Color | colors,
		public cards: Card[] = duplicate(
			Array(9)
				.fill(0)
				.map((_, j) => j + 1)
		).map((v) => ({ value: v, color: new Color('NULL') }))
	) {
	}

	get Length() {
		return this.cards.length;
	}

	get TopCard() {
		return this.cards[0];
	}

	playCard(index:number): Card {
		return this.cards.splice(index,1)[0]
	}

	static shuffle(arr: any[]): any[] {
		for (let i = arr.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[arr[i], arr[j]] = [arr[j], arr[i]];
		}
		return arr;
	}

	shuffle(): void {
		for (let i = this.cards.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
		}
	}

	addCard(card: Card) {
		this.cards.push(card);
	}

	addCards(cards: Card[]) {
		this.cards = [...this.cards, ...cards];
	}
}

class Player {
	constructor(
		public name: string,
		public uuid: string,
		public color: Color,
		public deck: Deck,
		public wins: number
	) {
	}
}

class GameState {
	constructor(
		public board: Card[][],
		public turn: number,
		public currentPlayerIndex: number
	) {
	}
}

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
};

type LanguagesType = {
	[key: string]: LanguageType;
};

export type { CardValue, LanguagesType };
export { Card, Color, Player, GameState, Deck, colors };
