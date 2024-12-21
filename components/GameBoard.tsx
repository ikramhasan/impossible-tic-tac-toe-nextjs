'use client';

import { useState, useCallback, useEffect } from 'react';
import { GameCell } from './GameCell';
import { GameConsole } from './GameConsole';
import { GameResultDialog } from './GameResultDialog';
import {
  GameState,
  IsVictory,
  IsDraw,
  getAIMove,
  Cell,
} from "@/lib/game-utils";
import { motion } from 'framer-motion';
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

const INITIAL_STATE: GameState = {
  cells: Array(9).fill(null),
  currentPlayer: 'X',
  winner: null,
  isDraw: false,
  consoleMessages: ['Game started. Your turn!'],
};

export function GameBoard() {
  const [gameState, setGameState] = useState<GameState>(INITIAL_STATE);
  const [useAlphaBeta, setUseAlphaBeta] = useState(true);
  const [playerFirst, setPlayerFirst] = useState(true);

  useEffect(() => {
    if (!playerFirst && gameState.cells.every((cell) => cell === null)) {
      const aiMove = getAIMove([...gameState.cells], useAlphaBeta);
      const newCells: Cell[] = [...gameState.cells];
      newCells[aiMove.move] = "O";

      setGameState((prev) => ({
        ...prev,
        cells: newCells,
        consoleMessages: [
          ...prev.consoleMessages,
          `AI starts. Checked ${aiMove.movesChecked} moves ahead to find the best move.`,
        ],
      }));
    }
  }, [playerFirst, useAlphaBeta, gameState.cells]);

  const addConsoleMessage = useCallback((message: string) => {
    setGameState(prev => ({
      ...prev,
      consoleMessages: [...prev.consoleMessages, message],
    }));
  }, []);

  const handleCellClick = useCallback(
    (index: number) => {
      if (gameState.cells[index] || gameState.winner || gameState.isDraw)
        return;

      // Player move
      const newCells = [...gameState.cells];
      newCells[index] = gameState.currentPlayer;

      if (IsVictory(newCells)) {
        setGameState((prev) => ({
          ...prev,
          cells: newCells,
          winner: gameState.currentPlayer,
          consoleMessages: [
            ...prev.consoleMessages,
            `Player ${gameState.currentPlayer} wins!`,
          ],
        }));
        return;
      }

      if (IsDraw(newCells)) {
        setGameState((prev) => ({
          ...prev,
          cells: newCells,
          isDraw: true,
          consoleMessages: [...prev.consoleMessages, "Game ended in a draw!"],
        }));
        return;
      }

      // AI move
      const aiMove = getAIMove(newCells, useAlphaBeta);
      newCells[aiMove.move] = "O";

      const newMessages = [
        ...gameState.consoleMessages,
        `Checked ${aiMove.movesChecked} moves ahead to find the best move.`,
      ];

      if (IsVictory(newCells)) {
        setGameState((prev) => ({
          ...prev,
          cells: newCells,
          winner: "O",
          consoleMessages: [...newMessages, "AI wins!"],
        }));
        return;
      }

      if (IsDraw(newCells)) {
        setGameState((prev) => ({
          ...prev,
          cells: newCells,
          isDraw: true,
          consoleMessages: [...newMessages, "Game ended in a draw!"],
        }));
        return;
      }

      setGameState((prev) => ({
        ...prev,
        cells: newCells,
        consoleMessages: newMessages,
      }));
    },
    [gameState, useAlphaBeta]
  );

  const resetGame = useCallback(() => {
    setGameState(prev => ({
      ...INITIAL_STATE,
      consoleMessages: [playerFirst ? 'Game started. Your turn!' : 'Game started. AI goes first...']
    }));
  }, [playerFirst]);

  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-col items-start justify-start space-y-2 mb-4">
        <div className="flex items-center space-x-2">
          <Switch
            id="alpha-beta"
            checked={useAlphaBeta}
            onCheckedChange={setUseAlphaBeta}
          />
          <Label htmlFor="alpha-beta">With alpha-beta pruning</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="player-first"
            checked={playerFirst}
            onCheckedChange={setPlayerFirst}
          />
          <Label htmlFor="player-first">
            {playerFirst ? "Player goes first" : "AI goes first"}
          </Label>
        </div>
      </div>

      <div className="flex items-start justify-start space-x-2">
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
        <button
          onClick={resetGame}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
          </svg>
        </button>
      </div>

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