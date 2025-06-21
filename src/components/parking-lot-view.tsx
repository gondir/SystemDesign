'use client';

import { useState, useMemo, useEffect } from 'react';
import type { ParkingSpot, ParkingPreferences } from '@/lib/types';
import { parkingSpots as initialSpots } from '@/lib/data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ParkingLot } from '@/components/parking-lot';
import { Separator } from '@/components/ui/separator';

export function ParkingLotView() {
  const [spots, setSpots] = useState<ParkingSpot[]>([]);
  const [preferences, setPreferences] = useState<ParkingPreferences>({
    showCovered: false,
    showNearExit: false,
  });

  useEffect(() => {
    setSpots(initialSpots);
  }, []);

  const handlePreferenceChange = (key: keyof ParkingPreferences, value: boolean) => {
    setPreferences((prev) => ({ ...prev, [key]: value }));
  };

  const recommendedSpots = useMemo(() => {
    if (!preferences.showCovered && !preferences.showNearExit) {
      return new Set<string>();
    }
    const recommended = spots
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
  }, [spots, preferences]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Live Parking Availability</CardTitle>
        <CardDescription>Select your preferences to see recommended spots. Hover over an available spot for details.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
          <h3 className="font-semibold text-foreground">Preferences:</h3>
          <div className="flex items-center space-x-2">
            <Checkbox id="covered" checked={preferences.showCovered} onCheckedChange={(checked) => handlePreferenceChange('showCovered', !!checked)} />
            <Label htmlFor="covered">Covered Parking</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="near-exit" checked={preferences.showNearExit} onCheckedChange={(checked) => handlePreferenceChange('showNearExit', !!checked)} />
            <Label htmlFor="near-exit">Near an Exit</Label>
          </div>
        </div>
        <Separator />
        <ParkingLot spots={spots} recommendedSpots={recommendedSpots} />
      </CardContent>
    </Card>
  );
}
