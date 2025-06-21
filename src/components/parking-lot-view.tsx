'use client';

import { useState, useMemo, useEffect } from 'react';
import type { ParkingSpot, ParkingPreferences, VehicleType } from '@/lib/types';
import { parkingSpots as initialSpots } from '@/lib/data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ParkingLot } from '@/components/parking-lot';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Car, Bike, Truck } from 'lucide-react';

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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-foreground mb-2">Vehicle Type:</h3>
              <RadioGroup defaultValue="car" value={preferences.vehicleType} onValueChange={(value) => handleVehicleTypeChange(value as VehicleType)} className="flex flex-wrap gap-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="car" id="car" />
                  <Label htmlFor="car" className="flex items-center gap-2 cursor-pointer"><Car className="h-4 w-4" /> Car</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="twoWheeler" id="twoWheeler" />
                  <Label htmlFor="twoWheeler" className="flex items-center gap-2 cursor-pointer"><Bike className="h-4 w-4" /> 2-Wheeler</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="threeWheeler" id="threeWheeler" />
                  <Label htmlFor="threeWheeler" className="cursor-pointer">3-Wheeler</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="heavy" id="heavy" />
                  <Label htmlFor="heavy" className="flex items-center gap-2 cursor-pointer"><Truck className="h-4 w-4" /> Heavy</Label>
                </div>
              </RadioGroup>
            </div>
          <div>
            <h3 className="font-semibold text-foreground mb-2">Preferences:</h3>
            <div className="flex flex-col gap-2">
              <div className="flex items-center space-x-2">
                <Checkbox id="covered" checked={preferences.showCovered} onCheckedChange={(checked) => handlePreferenceChange('showCovered', !!checked)} />
                <Label htmlFor="covered">Covered Parking</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="near-exit" checked={preferences.showNearExit} onCheckedChange={(checked) => handlePreferenceChange('showNearExit', !!checked)} />
                <Label htmlFor="near-exit">Near an Exit</Label>
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
