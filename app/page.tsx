import { GameBoard } from '@/components/GameBoard';
import FlickeringGrid from "@/components/ui/flickering-grid";
export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative">
      <FlickeringGrid
        className="z-[-1] absolute inset-0 size-full"
        squareSize={4}
        gridGap={6}
        color="#6B7280"
        maxOpacity={0.5}
        flickerChance={0.1}
      />
      <div className="z-10 w-fit bg-background rounded-lg p-2">
        <h1 className="text-4xl font-bold mb-8 text-foreground text-center">
          Impossible Tic Tac Toe
        </h1>
        <GameBoard />
      </div>
    </div>
  );
}