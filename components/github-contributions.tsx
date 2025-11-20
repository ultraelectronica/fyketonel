"use client";

import { useEffect, useState } from "react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/8bit/chart";
import { Bar, BarChart, XAxis, YAxis } from "recharts";

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

          // Convert to chart data with Pacman colors
          const chartData: ChartData[] = Object.entries(monthlyData)
            .sort(([a], [b]) => a.localeCompare(b))
            .slice(-12) // Last 12 months
            .map(([key, value]) => {
              const [year, month] = key.split("-");
              const date = new Date(parseInt(year), parseInt(month) - 1);
              const monthLabel = date.toLocaleDateString("en-US", { month: "short" });
              
              // Pacman yellow/gold gradient based on contribution level
              let fill = "#FFD700"; // Default Pacman gold
              if (value > 100) fill = "#FFA500"; // High: Orange-gold
              else if (value > 50) fill = "#FFCC00"; // Medium-high: Bright gold
              else if (value > 20) fill = "#FFD700"; // Medium: Classic Pacman
              else if (value > 0) fill = "#FFE55C"; // Low: Light yellow
              else fill = "rgba(255, 215, 0, 0.2)"; // None: Faded yellow
              
              return {
                month: monthLabel,
                contributions: value,
                fill,
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

  if (loading) {
    return (
      <div className="retro flex h-full w-full items-center justify-center text-sm text-muted-foreground">
        Loading contributions...
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="retro flex h-full w-full items-center justify-center text-sm text-muted-foreground">
        Unable to load contributions
      </div>
    );
  }

  const chartConfig = {
    contributions: {
      label: "Contributions",
      color: "#FFD700",
    },
  };

  const totalContributions = data.reduce((sum, month) => sum + month.contributions, 0);

  return (
    <div className="retro w-full flex flex-col gap-4">
      <div className="text-center">
        <p className="text-sm text-muted-foreground uppercase">
          {totalContributions.toLocaleString()} contributions in the last year
        </p>
      </div>
      <ChartContainer config={chartConfig} className="h-[300px] w-full">
        <BarChart data={data} accessibilityLayer>
          <XAxis
            dataKey="month"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            className="retro text-xs"
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            className="retro text-xs"
          />
          <ChartTooltip
            content={
              <ChartTooltipContent
                className="retro"
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

