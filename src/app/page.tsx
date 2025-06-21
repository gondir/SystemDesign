import { Header } from '@/components/header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ParkingLotView } from '@/components/parking-lot-view';
import { SpotLocator } from '@/components/spot-locator';
import { AnalyticsView } from '@/components/analytics-view';
import { Car, MapPin, LineChart } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <Tabs defaultValue="lot-view" className="w-full">
          <TabsList className="grid w-full grid-cols-3 md:w-[600px]">
            <TabsTrigger value="lot-view">
              <Car className="mr-2 h-4 w-4"/>
              Parking Lot
            </TabsTrigger>
            <TabsTrigger value="spot-locator">
              <MapPin className="mr-2 h-4 w-4" />
              Find My Spot
            </TabsTrigger>
            <TabsTrigger value="analytics">
              <LineChart className="mr-2 h-4 w-4" />
              Analytics
            </TabsTrigger>
          </TabsList>
          <TabsContent value="lot-view" className="mt-6">
            <ParkingLotView />
          </TabsContent>
          <TabsContent value="spot-locator" className="mt-6">
            <SpotLocator />
          </TabsContent>
          <TabsContent value="analytics" className="mt-6">
            <AnalyticsView />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
