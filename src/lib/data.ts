import type { ParkingSpot, VehicleType } from './types';

// This function now uses a fixed seed for Math.random to ensure consistent data on every load
const createSeededRandom = (seed: number) => {
  let state = seed;
  return () => {
    state = (state * 9301 + 49297) % 233280;
    return state / 233280;
  };
};

const seededRandom = createSeededRandom(12345);

const getVehicleDetails = (index: number): { vehicleType: VehicleType, price: number } => {
  if (index < 40) { // First 40 spots for cars
    return { vehicleType: 'car', price: 10 };
  } else if (index < 50) { // Next 10 for 2-wheelers
    return { vehicleType: 'twoWheeler', price: 5 };
  } else if (index < 55) { // Next 5 for 3-wheelers
    return { vehicleType: 'threeWheeler', price: 7 };
  } else { // Last 5 for heavy vehicles
    return { vehicleType: 'heavy', price: 20 };
  }
};


export const parkingSpots: ParkingSpot[] = Array.from({ length: 60 }, (_, i) => {
  const row = Math.floor(i / 10);
  const isOccupied = seededRandom() > 0.6;
  const isCovered = row < 2; // First two rows are covered
  const isNearExit = (i % 10 < 2) || (i % 10 > 7); // Spots near the ends of rows are near an exit
  
  // Calculate a plausible distance. Assume venue is at one end.
  const distance = 50 + row * 10 + Math.abs(5 - (i % 10)) * 3;
  const { vehicleType, price } = getVehicleDetails(i);

  return {
    id: `A-${i + 1}`,
    isOccupied,
    isCovered,
    isNearExit,
    distanceToVenue: Math.round(distance),
    vehicleType,
    price,
  };
});
