'use client';

import { Header } from '@/components/header';
import { ParkingLotView } from '@/components/parking-lot-view';
import { SpotLocator } from '@/components/spot-locator';
import { AnalyticsView } from '@/components/analytics-view';

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto p-4 md:p-8 flex flex-col gap-8">
        <ParkingLotView />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <SpotLocator />
            <AnalyticsView />
        </div>
      </main>
    </div>
  );
}
