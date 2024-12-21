"use client";

import { Cell } from "@/lib/game-utils";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

type GameCellProps = {
  value: Cell;
  onClick: () => void;
  disabled: boolean;
};

export function GameCell({ value, onClick, disabled }: GameCellProps) {
  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      className={cn(
        "w-24 h-24 bg-card border-2 border-border rounded-lg flex items-center justify-center text-4xl font-bold",
        "transition-colors duration-200",
        !disabled && !value && "hover:bg-accent",
        disabled && "cursor-not-allowed"
      )}
      onClick={onClick}
      disabled={disabled || value !== null}
    >
      {value && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className={cn(value === "X" ? "text-blue-500" : "text-red-500")}
        >
          {value}
        </motion.span>
      )}
    </motion.button>
  );
}
