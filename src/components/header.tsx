import { Car } from 'lucide-react';

export function Header() {
  return (
    <header className="bg-card/80 border-b p-4 sticky top-0 z-50 backdrop-blur-sm">
      <div className="container mx-auto flex items-center gap-3">
        <div className="bg-primary text-primary-foreground p-2 rounded-lg shadow-lg shadow-primary/50">
          <Car className="h-6 w-6" />
        </div>
        <h1 className="text-2xl font-bold text-foreground tracking-wider" style={{textShadow: '0 0 10px hsl(var(--primary) / 0.8)'}}>ParkWise</h1>
      </div>
    </header>
  );
}
