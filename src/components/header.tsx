import { Car } from 'lucide-react';

export function Header() {
  return (
    <header className="bg-card border-b p-4 sticky top-0 z-50 bg-opacity-80 backdrop-blur-sm">
      <div className="container mx-auto flex items-center gap-3">
        <div className="bg-primary text-primary-foreground p-2 rounded-lg">
          <Car className="h-6 w-6" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">ParkWise</h1>
      </div>
    </header>
  );
}
