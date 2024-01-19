import {type NextRequest, NextResponse} from "next/server";
import db from "@/db/connection";
import {rooms} from "@/db/schema";

// get all rooms
export async function GET(request: NextRequest) {
  // get all rooms
  const allRooms = await db.select().from(rooms);

  return NextResponse.json(allRooms);
}

// add a room
export async function POST(request: NextRequest) {
  // parse the streaming body to json
  const res = await request.json();
  console.log(res);

  // insert a new room
  await db.insert(rooms).values({
    name: res.name,
    password: res.password,
  });

  return NextResponse.json({ status: "ok" });
}
