'use client';

import { useState, useMemo, useEffect, type ElementType } from 'react';
import type { ParkingSpot, ParkingPreferences, VehicleType } from '@/lib/types';
import { parkingSpots as initialSpots } from '@/lib/data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { ParkingLot } from '@/components/parking-lot';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Bike, Truck, Snowflake, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

const CarIcon = ({ className }: { className?: string }) => (
  <div className={className}>
    <Image
      src="https://placehold.co/100x100.png"
      alt="Mercedes car"
      width={32}
      height={32}
      className="h-full w-full object-contain"
      data-ai-hint="mercedes car"
    />
  </div>
);

const vehicleTypes: { value: VehicleType; label: string; icon: ElementType | null }[] = [
    { value: 'car', label: 'Car', icon: CarIcon },
    { value: 'twoWheeler', label: '2-Wheeler', icon: Bike },
    { value: 'threeWheeler', label: '3-Wheeler', icon: null },
    { value: 'heavy', label: 'Heavy', icon: Truck },
];

export function ParkingLotView() {
  const [spots, setSpots] = useState<ParkingSpot[]>([]);
  const [preferences, setPreferences] = useState<ParkingPreferences>({
    showCovered: false,
    showNearExit: false,
    vehicleType: 'car',
  });

  useEffect(() => {
    setSpots(initialSpots);
  }, []);

  const handlePreferenceChange = (key: keyof Omit<ParkingPreferences, 'vehicleType'>, value: boolean) => {
    setPreferences((prev) => ({ ...prev, [key]: value }));
  };
  
  const handleVehicleTypeChange = (value: VehicleType) => {
    setPreferences((prev) => ({...prev, vehicleType: value}));
  }

  const filteredSpots = useMemo(() => {
    return spots.filter(spot => spot.vehicleType === preferences.vehicleType);
  }, [spots, preferences.vehicleType]);

  const recommendedSpots = useMemo(() => {
    if (!preferences.showCovered && !preferences.showNearExit) {
      return new Set<string>();
    }
    const recommended = filteredSpots
      .filter((spot) => {
        if (spot.isOccupied) return false;
        const coveredMatch = preferences.showCovered && spot.isCovered;
        const exitMatch = preferences.showNearExit && spot.isNearExit;
        if (preferences.showCovered && preferences.showNearExit) {
          return coveredMatch && exitMatch;
        }
        return coveredMatch || exitMatch;
      })
      .map((spot) => spot.id);
    return new Set(recommended);
  }, [filteredSpots, preferences.showCovered, preferences.showNearExit]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Live Parking Availability</CardTitle>
        <CardDescription>Select your vehicle type and preferences to see recommended spots. Hover over an available spot for details.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="font-semibold text-foreground mb-4">Vehicle Type:</h3>
            <div className="grid grid-cols-2 gap-4">
              {vehicleTypes.map((vehicle) => {
                const isSelected = preferences.vehicleType === vehicle.value;
                const IconComponent = vehicle.icon;
                return (
                <div
                  key={vehicle.value}
                  onClick={() => handleVehicleTypeChange(vehicle.value)}
                  className={cn(
                    'flex flex-col items-center justify-center gap-2 p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer aspect-square',
                    isSelected
                      ? 'bg-primary/20 border-primary shadow-lg scale-105'
                      : 'bg-card hover:bg-muted/50 border-border hover:border-primary/50'
                  )}
                >
                  {IconComponent ? (
                    <IconComponent className={cn('h-8 w-8 text-primary', isSelected && 'animate-spin-slow')} />
                  ) : (
                    <span className={cn(
                        "text-2xl font-bold h-8 w-8 flex items-center justify-center text-primary", 
                        isSelected && "animate-spin-slow"
                    )}>3W</span>
                  )}
                  <span className="font-medium">{vehicle.label}</span>
                </div>
              )})}
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-4">Preferences:</h3>
            <div className="flex flex-col gap-4">
              <div
                onClick={() => handlePreferenceChange('showCovered', !preferences.showCovered)}
                className={cn(
                  'flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition-all',
                  preferences.showCovered ? 'bg-primary/20 border-primary' : 'bg-card hover:bg-muted/50 border-border hover:border-primary/50'
                )}
              >
                <div className="flex items-center gap-3">
                  <Snowflake className="h-5 w-5 text-primary" />
                  <Label htmlFor="covered" className="font-medium cursor-pointer">Covered Parking</Label>
                </div>
                <Switch id="covered" checked={preferences.showCovered} onCheckedChange={(checked) => handlePreferenceChange('showCovered', !!checked)} />
              </div>
              <div
                onClick={() => handlePreferenceChange('showNearExit', !preferences.showNearExit)}
                className={cn(
                  'flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition-all',
                  preferences.showNearExit ? 'bg-primary/20 border-primary' : 'bg-card hover:bg-muted/50 border-border hover:border-primary/50'
                )}
              >
                <div className="flex items-center gap-3">
                  <LogOut className="h-5 w-5 text-primary" />
                  <Label htmlFor="near-exit" className="font-medium cursor-pointer">Near an Exit</Label>
                </div>
                <Switch id="near-exit" checked={preferences.showNearExit} onCheckedChange={(checked) => handlePreferenceChange('showNearExit', !!checked)} />
              </div>
            </div>
          </div>
        </div>
        <Separator />
        <ParkingLot spots={filteredSpots} recommendedSpots={recommendedSpots} />
      </CardContent>
    </Card>
  );
}
