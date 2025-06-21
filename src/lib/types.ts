export type ParkingSpot = {
  id: string;
  isOccupied: boolean;
  isCovered: boolean;
  isNearExit: boolean;
  distanceToVenue: number; // in meters
};

export type ParkingPreferences = {
  showCovered: boolean;
  showNearExit: boolean;
};
