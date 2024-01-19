import bcrypt from 'bcrypt';
import {type NextRequest, NextResponse} from "next/server";
import db from "@/db/connection";
import {rooms} from "@/db/schema";
import {eq, sql} from "drizzle-orm";

export async function POST(request: NextRequest) {
    // parse the streaming body to json
    const { room, password } = await request.json();

    try {
        // Check if the room exists based on the provided name
        const roomsList = await db
            .select()
            .from(rooms)
            .where(eq(rooms.name, room));

        if (roomsList.length > 0) {
            // Iterate through the rooms to find a matching password
            const roomWithMatchingPassword = roomsList.find(async (room) =>
                room.password ? await bcrypt.compare(password, room.password) : false
            );

            if (roomWithMatchingPassword) {
                // Passwords match, user can enter the room
                return NextResponse.json({ success: true });
            } else {
                // No room with matching password found
                return NextResponse.json({ success: false, message: 'Incorrect password' });
            }
        } else {
            // Room not found
            return NextResponse.json({ success: false, message: 'Room not found' });
        }
    } catch (error) {
        console.error('Error verifying password:', error);
        return NextResponse.json({ success: false, message: 'Internal server error' });
    }
}

