import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

const COUNTER_KEY = "visitors";

export async function GET() {
  try {
    const redis = Redis.fromEnv();
    const count = await redis.get<number>(COUNTER_KEY);
    return NextResponse.json({ count: count ?? 0 });
  } catch (error) {
    console.error("Error fetching visitor count:", error);
    return NextResponse.json({ count: 0 }, { status: 200 });
  }
}

export async function POST() {
  try {
    const redis = Redis.fromEnv();
    const count = await redis.incr(COUNTER_KEY);
    return NextResponse.json({ count });
  } catch (error) {
    console.error("Error incrementing visitor count:", error);
    return NextResponse.json({ count: 0 }, { status: 500 });
  }
}
