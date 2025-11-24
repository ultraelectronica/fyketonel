"use client";

import { useEffect, useState } from "react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/8bit/chart";
import { Bar, BarChart, XAxis, YAxis } from "recharts";
import { Skeleton } from "@/components/ui/8bit/skeleton";

interface ChartData {
  month: string;
  contributions: number;
  fill: string;
}

export default function GitHubContributions() {
  const [data, setData] = useState<ChartData[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchContributions() {
      try {
        const response = await fetch(
          "https://github-contributions-api.deno.dev/heimin22.json"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch");
        }

        const result = await response.json();

        // Transform the API response to monthly aggregated data
        if (result.contributions && Array.isArray(result.contributions)) {
          const monthlyData: Record<string, number> = {};
          
          result.contributions.forEach((week: unknown[]) => {
            (week as Array<{
              date: string;
              contributionCount?: number;
            }>).forEach((day) => {
              const date = new Date(day.date);
              const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
              
              if (!monthlyData[monthKey]) {
                monthlyData[monthKey] = 0;
              }
              monthlyData[monthKey] += day.contributionCount || 0;
            });
          });

          // Convert to chart data using CSS variables for theming
          const chartData: ChartData[] = Object.entries(monthlyData)
            .sort(([a], [b]) => a.localeCompare(b))
            .slice(-12) // Last 12 months
            .map(([key, value]) => {
              const [year, month] = key.split("-");
              const date = new Date(parseInt(year), parseInt(month) - 1);
              const monthLabel = date.toLocaleDateString("en-US", { month: "short" });
              
              // Use CSS variables for theming - will be styled via chart config
              // The actual color will come from --color-contributions CSS variable
              return {
                month: monthLabel,
                contributions: value,
                fill: "var(--color-contributions, var(--chart-1))",
              };
            });

          setData(chartData);
        } else {
          throw new Error("Invalid data format");
        }

        setLoading(false);
      } catch (err) {
        console.error("Error fetching contributions:", err);
        setError(true);
        setLoading(false);
      }
    }

    fetchContributions();
  }, []);

  // Deterministic heights for skeleton bars to avoid hydration mismatch
  const skeletonHeights = [65, 45, 80, 55, 70, 40, 85, 60, 75, 50, 68, 72];

  if (loading) {
    return (
      <div className="retro w-full flex flex-col gap-3 sm:gap-3.5 md:gap-4">
        <div className="text-center">
          <Skeleton className="h-4 w-48 mx-auto sm:h-4.5 sm:w-56 md:h-5 md:w-64" />
        </div>
        <div className="h-[180px] w-full space-y-3 sm:h-[220px] sm:space-y-3.5 md:h-[300px] md:space-y-4">
          <div className="flex justify-between items-end h-full gap-1 px-2 sm:gap-1.5 sm:px-4 md:gap-2 md:px-8">
            {skeletonHeights.map((height, i) => (
              <Skeleton
                key={i}
                className="w-full"
                style={{
                  height: `${height}%`,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="retro flex h-full w-full items-center justify-center text-[0.5rem] text-muted-foreground sm:text-xs md:text-sm">
        Unable to load contributions
      </div>
    );
  }

  const chartConfig = {
    contributions: {
      label: "Contributions",
      color: "var(--chart-1)",
    },
  };

  const totalContributions = data.reduce((sum, month) => sum + month.contributions, 0);

  return (
    <div className="retro w-full flex flex-col gap-3 sm:gap-3.5 md:gap-4">
      <div className="text-center">
        <p className="text-[0.45rem] text-muted-foreground uppercase sm:text-[0.55rem] md:text-xs lg:text-sm">
          {totalContributions.toLocaleString()} contributions in the last year
        </p>
      </div>
      <ChartContainer config={chartConfig} className="h-[180px] w-full sm:h-[220px] md:h-[300px]">
        <BarChart data={data} accessibilityLayer>
          <XAxis
            dataKey="month"
            tickLine={false}
            tickMargin={6}
            axisLine={false}
            className="retro text-[0.4rem] sm:text-[0.5rem] md:text-xs"
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            className="retro text-[0.4rem] sm:text-[0.5rem] md:text-xs"
          />
          <ChartTooltip
            content={
              <ChartTooltipContent
                className="retro text-[0.45rem] sm:text-[0.5rem] md:text-xs"
                labelFormatter={(value) => `${value}`}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                formatter={(value: any) => [`${value} contributions`, ""]}
              />
            }
          />
          <Bar
            dataKey="contributions"
            radius={0}
            fill="var(--color-contributions)"
            style={{
              fill: "var(--color-contributions)",
            }}
          />
        </BarChart>
      </ChartContainer>
    </div>
  );
}

