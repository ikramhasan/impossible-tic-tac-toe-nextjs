// Game state types
export type Cell = 'X' | 'O' | null;
export type GameState = {
  cells: Cell[];
  currentPlayer: 'X' | 'O';
  winner: Cell;
  isDraw: boolean;
  consoleMessages: string[];
};

// Return true if cells is in a winning configuration.
export function IsVictory(cells: Cell[]): boolean {
  const positions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6],
    [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]
  ];

  const isRowComplete = (row: number[]) => {
    const symbols = row.map(i => cells[i]);
    return symbols.every(i => i !== null && i === symbols[0]);
  };

  return positions.map(isRowComplete).some(i => i === true);
}

// Return true if all cells are occupied.
export function IsDraw(cells: Cell[]): boolean {
  return cells.filter(c => c === null).length === 0;
}

// Get available moves
export function getAvailableMoves(cells: Cell[]): number[] {
  return cells.reduce<number[]>((moves, cell, index) => {
    if (cell === null) moves.push(index);
    return moves;
  }, []);
}

// Get AI move (currently random)
export function getAIMove(cells: Cell[]): number {
  const availableMoves = getAvailableMoves(cells);
  const randomIndex = Math.floor(Math.random() * availableMoves.length);
  return availableMoves[randomIndex];
}