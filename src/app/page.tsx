'use client';

import Image from 'next/image';
import { Header } from '@/components/header';
import { ParkingLotView } from '@/components/parking-lot-view';
import { SpotLocator } from '@/components/spot-locator';
import { AnalyticsView } from '@/components/analytics-view';
import { Button } from '@/components/ui/button';
import { ArrowDown } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="flex flex-col">
        {/* Hero Section */}
        <section className="relative container mx-auto text-center py-20 md:py-32 flex flex-col items-center justify-center overflow-hidden">
          <Image
            src="https://placehold.co/1200x400.png"
            alt="Aerial view of a parking lot"
            fill
            className="absolute inset-0 object-cover opacity-10 blur-sm"
            data-ai-hint="parking lot aerial"
          />
          <div className="relative z-10">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-4" style={{textShadow: '0 0 20px hsl(var(--primary) / 0.5)'}}>
              The Future of Parking is Here.
            </h1>
            <p className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground mb-8">
              Welcome to ParkWise, the smartest way to manage and navigate parking lots. Find your spot, analyze trends, and get back on the road faster.
            </p>
            <Button size="lg" asChild>
              <a href="#parking-lot">
                View Live Lot
                <ArrowDown className="ml-2 h-5 w-5 animate-bounce" />
              </a>
            </Button>
          </div>
        </section>

        <div id="parking-lot" className="container mx-auto p-4 md:p-8 flex flex-col gap-8 scroll-mt-20">
            <ParkingLotView />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                <SpotLocator />
                <AnalyticsView />
            </div>
        </div>
      </main>
    </div>
  );
}
