'use client';

import { LogOut, MapPin, Snowflake, Bike, Truck, DollarSign } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import type { ParkingSpot } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';

interface ParkingLotProps {
  spots: ParkingSpot[];
  recommendedSpots: Set<string>;
}

const CarImage = ({ className }: { className?: string }) => (
  <div className={className}>
    <Image
      src="https://placehold.co/100x100.png"
      alt="Car"
      width={24}
      height={24}
      className="h-full w-full object-contain"
      data-ai-hint="mercedes car"
    />
  </div>
);

const VehicleIcon = ({ type, className }: { type: ParkingSpot['vehicleType'], className?: string }) => {
    switch(type) {
        case 'car':
            return <CarImage className={className} />;
        case 'twoWheeler':
            return <Bike className={className} />;
        case 'heavy':
            return <Truck className={className} />;
        case 'threeWheeler':
            return <span className="font-bold text-xs">3W</span>;
        default:
            return <CarImage className={className} />;
    }
}

export function ParkingLot({ spots, recommendedSpots }: ParkingLotProps) {

  if (spots.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-muted-foreground">
        <p>No parking spots available for this vehicle type.</p>
      </div>
    );
  }

  return (
    <TooltipProvider delayDuration={100}>
      <div className="relative">
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-4 px-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-4 h-4 rounded-sm bg-accent" /> Available
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-4 h-4 rounded-sm bg-secondary" /> Occupied
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-4 h-4 rounded-sm ring-2 ring-primary bg-accent" /> Recommended
            </div>
        </div>
        <div className="[perspective:900px]">
          <div className="relative transform [transform:rotateX(50deg)] origin-bottom transition-transform duration-700 ease-in-out hover:[transform:rotateX(0deg)]">
            <div className="grid grid-cols-10 gap-2 p-4 bg-muted/50 rounded-lg">
              {spots.map((spot) => (
                <Tooltip key={spot.id}>
                  <TooltipTrigger asChild>
                    <div
                      className={cn(
                        'aspect-square rounded-md flex items-center justify-center transition-all duration-200 cursor-pointer text-foreground/70',
                        spot.isOccupied ? 'bg-secondary' : 'bg-accent hover:bg-accent/80',
                        recommendedSpots.has(spot.id) && !spot.isOccupied && 'ring-2 ring-primary ring-offset-2 ring-offset-muted/50'
                      )}
                      aria-label={`Parking spot ${spot.id}`}
                    >
                      {spot.isOccupied ? <VehicleIcon type={spot.vehicleType} className="h-5 w-5 md:h-6 md:w-6 opacity-80" /> : <span className="text-xs font-bold text-accent-foreground">{spot.id.split('-')[1]}</span>}
                    </div>
                  </TooltipTrigger>
                  {!spot.isOccupied && (
                     <TooltipContent className="bg-background border-border shadow-lg">
                      <div className="p-1 space-y-2">
                        <p className="font-bold text-lg">Spot {spot.id}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <DollarSign className="h-4 w-4 text-primary" />
                          <span>Price: ${spot.price}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4 text-primary" />
                          <span>{spot.distanceToVenue}m to venue</span>
                        </div>
                        {spot.isCovered && (
                          <Badge variant="outline" className="flex items-center gap-1 w-fit">
                            <Snowflake className="h-3 w-3" /> 
                            Covered
                          </Badge>
                        )}
                        {spot.isNearExit && (
                          <Badge variant="outline" className="flex items-center gap-1 w-fit">
                            <LogOut className="h-3 w-3" />
                            Near Exit
                          </Badge>
                        )}
                      </div>
                     </TooltipContent>
                  )}
                </Tooltip>
              ))}
            </div>
            <div className="mt-4 text-center text-lg font-semibold text-foreground">
              ↓ Venue Entrance ↓
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
