'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Cell } from "@/lib/game-utils";

type GameResultDialogProps = {
  isOpen: boolean;
  winner: Cell;
  isDraw: boolean;
  onPlayAgain: () => void;
};

export function GameResultDialog({ isOpen, winner, isDraw, onPlayAgain }: GameResultDialogProps) {
  const getResultMessage = () => {
    if (isDraw) return "It's a draw!";
    if (winner === 'X') return "You won!";
    return "You lose!";
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => onPlayAgain()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            Game Over
          </DialogTitle>
          <DialogDescription className="text-xl text-center">
            {getResultMessage()}
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center mt-4">
          <Button onClick={onPlayAgain}>
            Play Again
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}