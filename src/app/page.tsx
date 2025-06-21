'use client';

import { Header } from '@/components/header';
import { ParkingLotView } from '@/components/parking-lot-view';
import { SpotLocator } from '@/components/spot-locator';
import { AnalyticsView } from '@/components/analytics-view';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Map, Camera, BarChart } from 'lucide-react';


export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <Tabs defaultValue="parking-lot" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="parking-lot"><Map className="mr-2 h-4 w-4"/>Parking Lot</TabsTrigger>
            <TabsTrigger value="spot-locator"><Camera className="mr-2 h-4 w-4"/>Find My Spot</TabsTrigger>
            <TabsTrigger value="analytics"><BarChart className="mr-2 h-4 w-4"/>Analytics</TabsTrigger>
          </TabsList>
          <TabsContent value="parking-lot">
            <ParkingLotView />
          </TabsContent>
          <TabsContent value="spot-locator">
             <div className="max-w-2xl mx-auto">
               <SpotLocator />
             </div>
          </TabsContent>
          <TabsContent value="analytics">
            <AnalyticsView />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
