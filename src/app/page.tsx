import { Header } from '@/components/header';
import { ParkingLotView } from '@/components/parking-lot-view';
import { SpotLocator } from '@/components/spot-locator';
import { AnalyticsView } from '@/components/analytics-view';
import Image from 'next/image';
import { Separator } from '@/components/ui/separator';

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <article className="max-w-none">
          <header className="mb-12 text-center">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-primary mb-4">
              Welcome to ParkWise: Revolutionizing Your Parking Experience
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground">
              Discover how AI and intuitive design are making parking simpler, faster, and smarter.
            </p>
          </header>

          <figure className="mb-12">
            <Image
              src="https://placehold.co/1200x600.png"
              alt="A modern parking garage with smart sensors"
              width={1200}
              height={600}
              className="rounded-xl shadow-2xl w-full"
              data-ai-hint="smart parking garage"
            />
            <figcaption className="text-center mt-2 text-sm text-muted-foreground">
              ParkWise offers a seamless, next-generation parking solution.
            </figcaption>
          </figure>

          <Separator className="my-12" />

          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-6 text-center">The Future of Parking is Here: Live 3D Lot View</h2>
            <p className="text-lg text-muted-foreground mb-8 text-center max-w-3xl mx-auto">
              No more endless circling. Our dynamic, 3D-inspired parking map gives you a real-time overview of available spots. Filter by vehicle type—from cars to heavy trucks—and select preferences like covered or near-exit parking with our stunning, interactive selectors.
            </p>
            <div className="mt-8">
              <ParkingLotView />
            </div>
          </section>

          <Separator className="my-12" />

          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-6 text-center">Lost Your Car? Not Anymore.</h2>
            <p className="text-lg text-muted-foreground mb-8 text-center max-w-3xl mx-auto">
              We've all been there. Forgetting where you parked can be frustrating. With our AI Spot Locator, simply take a photo with your phone's camera or upload an image, and our advanced AI will provide you with a description of your spot's location.
            </p>
            <div className="mt-8 max-w-2xl mx-auto">
               <SpotLocator />
            </div>
          </section>
          
          <Separator className="my-12" />

          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-6 text-center">Smart Insights, Smarter Decisions</h2>
             <p className="text-lg text-muted-foreground mb-8 text-center max-w-3xl mx-auto">
              Our analytics dashboard provides valuable insights into parking trends. See occupancy rates by vehicle type and get an overall view of the lot's status at a glance, presented in clear, beautiful charts.
            </p>
            <div className="mt-8">
                <AnalyticsView />
            </div>
          </section>

          <footer className="text-center mt-16 py-8 border-t border-border">
              <p className="text-muted-foreground">Experience the future of parking. Experience ParkWise.</p>
          </footer>

        </article>
      </main>
    </div>
  );
}
