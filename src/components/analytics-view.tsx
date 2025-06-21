'use client';

import { useMemo } from 'react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Pie, PieChart, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart';
import type { ChartConfig } from '@/components/ui/chart';
import { parkingSpots } from '@/lib/data';
import type { VehicleType } from '@/lib/types';

export function AnalyticsView() {
  const occupancyByVehicleType = useMemo(() => {
    const counts: Record<VehicleType, { occupied: number; total: number }> = {
      car: { occupied: 0, total: 0 },
      twoWheeler: { occupied: 0, total: 0 },
      threeWheeler: { occupied: 0, total: 0 },
      heavy: { occupied: 0, total: 0 },
    };

    parkingSpots.forEach(spot => {
      if (!counts[spot.vehicleType]) return;
      counts[spot.vehicleType].total++;
      if (spot.isOccupied) {
        counts[spot.vehicleType].occupied++;
      }
    });
    
    return [
      { name: 'Cars', total: counts.car.total, occupied: counts.car.occupied, available: counts.car.total - counts.car.occupied },
      { name: '2-Wheelers', total: counts.twoWheeler.total, occupied: counts.twoWheeler.occupied, available: counts.twoWheeler.total - counts.twoWheeler.occupied },
      { name: '3-Wheelers', total: counts.threeWheeler.total, occupied: counts.threeWheeler.occupied, available: counts.threeWheeler.total - counts.threeWheeler.occupied },
      { name: 'Heavy', total: counts.heavy.total, occupied: counts.heavy.occupied, available: counts.heavy.total - counts.heavy.occupied },
    ].filter(v => v.total > 0);
  }, []);

  const barChartConfig = {
    occupied: { label: 'Occupied', color: 'hsl(var(--secondary))' },
    available: { label: 'Available', color: 'hsl(var(--accent))' },
  } satisfies ChartConfig;

  const overallOccupancyData = useMemo(() => {
    const occupied = parkingSpots.filter(spot => spot.isOccupied).length;
    const total = parkingSpots.length;
    return [
      { name: 'Occupied', value: occupied, fill: 'var(--color-occupied)' },
      { name: 'Available', value: total - occupied, fill: 'var(--color-available)' },
    ];
  }, []);

  const pieChartConfig = {
    occupied: { label: 'Occupied', color: 'hsl(var(--secondary))' },
    available: { label: 'Available', color: 'hsl(var(--accent))' },
  } satisfies ChartConfig;

  const totalOccupied = useMemo(() => parkingSpots.filter(spot => spot.isOccupied).length, []);

  return (
    <Card>
        <CardHeader>
          <CardTitle>Parking Lot Analytics</CardTitle>
          <CardDescription>Insights into parking occupancy and trends.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
            <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
            <Card>
                <CardHeader>
                <CardTitle>Occupancy by Vehicle Type</CardTitle>
                <CardDescription>Live count of occupied vs. available spots for each vehicle category.</CardDescription>
                </CardHeader>
                <CardContent>
                <ChartContainer config={barChartConfig} className="min-h-[300px] w-full">
                    <BarChart accessibilityLayer data={occupancyByVehicleType} layout="vertical" margin={{ left: 10 }}>
                    <CartesianGrid horizontal={false} />
                    <YAxis
                        dataKey="name"
                        type="category"
                        tickLine={false}
                        tickMargin={10}
                        axisLine={false}
                        className="text-sm"
                    />
                    <XAxis dataKey="total" type="number" hide />
                    <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
                    <ChartLegend content={<ChartLegendContent />} />
                    <Bar dataKey="occupied" stackId="a" fill="var(--color-occupied)" radius={[4, 0, 0, 4]} />
                    <Bar dataKey="available" stackId="a" fill="var(--color-available)" radius={[0, 4, 4, 0]} />
                    </BarChart>
                </ChartContainer>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                <CardTitle>Overall Lot Occupancy</CardTitle>
                <CardDescription>{`Currently ${totalOccupied} of ${parkingSpots.length} spots are occupied.`}</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-center pb-0">
                <ChartContainer config={pieChartConfig} className="mx-auto aspect-square max-h-[300px]">
                    <PieChart>
                    <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                    <Pie
                        data={overallOccupancyData}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={60}
                        strokeWidth={5}
                        labelLine={false}
                        label={({
                            cx,
                            cy,
                            midAngle,
                            innerRadius,
                            outerRadius,
                            value,
                            index,
                        }) => {
                            const RADIAN = Math.PI / 180;
                            const radius = 12 + innerRadius + (outerRadius - innerRadius);
                            const x = cx + radius * Math.cos(-midAngle * RADIAN);
                            const y = cy + radius * Math.sin(-midAngle * RADIAN);
        
                            return (
                            <text
                                x={x}
                                y={y}
                                className="fill-muted-foreground text-xs"
                                textAnchor={x > cx ? 'start' : 'end'}
                                dominantBaseline="central"
                            >
                                {overallOccupancyData[index].name} ({value})
                            </text>
                            );
                        }}
                    >
                        {overallOccupancyData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                    </Pie>
                    </PieChart>
                </ChartContainer>
                </CardContent>
            </Card>
            </div>
        </CardContent>
    </Card>
  );
}
