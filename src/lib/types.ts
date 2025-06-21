export type VehicleType = 'car' | 'twoWheeler' | 'threeWheeler' | 'heavy';

export type ParkingSpot = {
  id: string;
  isOccupied: boolean;
  isCovered: boolean;
  isNearExit: boolean;
  distanceToVenue: number; // in meters
  vehicleType: VehicleType;
  price: number; // in USD
};

export type ParkingPreferences = {
  showCovered: boolean;
  showNearExit: boolean;
  vehicleType: VehicleType;
};
