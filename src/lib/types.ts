type Color = 'red' | 'blue' | 'green' | 'yellow' | null;
type CardValue = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
type Card = { value: CardValue; color: Color };
type Player = { name: string; connections: any; color: Color; deck: Card[]; wins: number };
type GameState = {
	board: Card[][];
	turn: number;
	currentPlayerIndex: number;
};

export type { Color, CardValue, Card, Player, GameState };
