import { GameBoard } from '@/components/GameBoard';

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold mb-8 text-foreground">Impossible Tic Tac Toe</h1>
      <GameBoard />
    </div>
  );
}