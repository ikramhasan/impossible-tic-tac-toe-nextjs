'use client';

import { useState, useCallback } from 'react';
import { GameCell } from './GameCell';
import { GameConsole } from './GameConsole';
import { GameResultDialog } from './GameResultDialog';
import { Cell, GameState, IsVictory, IsDraw, getAIMove } from '@/lib/game-utils';
import { motion } from 'framer-motion';

const INITIAL_STATE: GameState = {
  cells: Array(9).fill(null),
  currentPlayer: 'X',
  winner: null,
  isDraw: false,
  consoleMessages: ['Game started. Your turn!'],
};

export function GameBoard() {
  const [gameState, setGameState] = useState<GameState>(INITIAL_STATE);

  const addConsoleMessage = useCallback((message: string) => {
    setGameState(prev => ({
      ...prev,
      consoleMessages: [...prev.consoleMessages, message],
    }));
  }, []);

  const handleCellClick = useCallback((index: number) => {
    if (gameState.cells[index] || gameState.winner || gameState.isDraw) return;

    // Player move
    const newCells = [...gameState.cells];
    newCells[index] = gameState.currentPlayer;
    
    addConsoleMessage(`Player placed ${gameState.currentPlayer} at position ${index + 1}`);

    if (IsVictory(newCells)) {
      setGameState(prev => ({
        ...prev,
        cells: newCells,
        winner: gameState.currentPlayer,
        consoleMessages: [...prev.consoleMessages, `Player ${gameState.currentPlayer} wins!`],
      }));
      return;
    }

    if (IsDraw(newCells)) {
      setGameState(prev => ({
        ...prev,
        cells: newCells,
        isDraw: true,
        consoleMessages: [...prev.consoleMessages, 'Game ended in a draw!'],
      }));
      return;
    }

    // AI move
    const aiMove = getAIMove(newCells);
    newCells[aiMove] = 'O';
    
    const newMessages = [
      ...gameState.consoleMessages,
      `Player placed ${gameState.currentPlayer} at position ${index + 1}`,
      `AI placed O at position ${aiMove + 1}`,
    ];

    if (IsVictory(newCells)) {
      setGameState(prev => ({
        ...prev,
        cells: newCells,
        winner: 'O',
        consoleMessages: [...newMessages, 'AI wins!'],
      }));
      return;
    }

    if (IsDraw(newCells)) {
      setGameState(prev => ({
        ...prev,
        cells: newCells,
        isDraw: true,
        consoleMessages: [...newMessages, 'Game ended in a draw!'],
      }));
      return;
    }

    setGameState(prev => ({
      ...prev,
      cells: newCells,
      consoleMessages: [...newMessages, 'Your turn!'],
    }));
  }, [gameState, addConsoleMessage]);

  const resetGame = useCallback(() => {
    setGameState(INITIAL_STATE);
  }, []);

  return (
    <div className="flex flex-col items-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-3 gap-2"
      >
        {gameState.cells.map((cell, index) => (
          <GameCell
            key={index}
            value={cell}
            onClick={() => handleCellClick(index)}
            disabled={!!gameState.winner || gameState.isDraw}
          />
        ))}
      </motion.div>

      <GameConsole messages={gameState.consoleMessages} />

      <GameResultDialog
        isOpen={!!gameState.winner || gameState.isDraw}
        winner={gameState.winner}
        isDraw={gameState.isDraw}
        onPlayAgain={resetGame}
      />
    </div>
  );
}