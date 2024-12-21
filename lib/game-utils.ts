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

// Type for minimax result
type MinimaxResult = {
  score: number;
  move: number;
};

// Track number of positions evaluated
let positionsEvaluated = 0;

// Get AI move using minimax with alpha-beta pruning
export function getAIMove(cells: Cell[], useAlphaBeta: boolean = true): { move: number; movesChecked: number } {
  positionsEvaluated = 0;
  const result = minimax(cells, 'O', -Infinity, Infinity, true, useAlphaBeta);
  return { move: result.move, movesChecked: positionsEvaluated };
}

// Minimax algorithm with alpha-beta pruning
function minimax(
  cells: Cell[],
  player: 'X' | 'O',
  alpha: number,
  beta: number,
  isMaximizing: boolean,
  useAlphaBeta: boolean
): MinimaxResult {
  positionsEvaluated++;

  // Terminal states
  if (IsVictory(cells)) {
    return {
      score: isMaximizing ? -10 : 10,
      move: -1
    };
  }
  if (IsDraw(cells)) {
    return { score: 0, move: -1 };
  }

  const availableMoves = getAvailableMoves(cells);
  let bestMove = -1;
  let bestScore = isMaximizing ? -Infinity : Infinity;

  for (const move of availableMoves) {
    const newCells = [...cells];
    newCells[move] = player;

    const nextPlayer = player === "O" ? "X" : "O";
    const result = minimax(
      newCells,
      nextPlayer,
      alpha,
      beta,
      !isMaximizing,
      useAlphaBeta
    );

    if (isMaximizing) {
      if (result.score > bestScore) {
        bestScore = result.score;
        bestMove = move;
      }
      if (useAlphaBeta) {
        alpha = Math.max(alpha, bestScore);
      }
    } else {
      if (result.score < bestScore) {
        bestScore = result.score;
        bestMove = move;
      }
      if (useAlphaBeta) {
        beta = Math.min(beta, bestScore);
      }
    }

    if (useAlphaBeta && beta <= alpha) {
      break; // Alpha-beta pruning only when enabled
    }
  }

  return { score: bestScore, move: bestMove };
}