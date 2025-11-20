import { NextResponse } from "next/server";
import giveMeAJoke from "give-me-a-joke";

export async function GET() {
  try {
    const joke = await new Promise<string>((resolve, reject) => {
      giveMeAJoke.getRandomDadJoke((joke: string) => {
        if (joke) {
          resolve(joke);
        } else {
          reject(new Error("No joke received"));
        }
      });
    });

    return NextResponse.json({ joke });
  } catch (error) {
    console.error("Error fetching joke:", error);
    return NextResponse.json(
      { joke: "The joke machine is recalibrating—check back after the next coffee break." },
      { status: 200 }
    );
  }
}

