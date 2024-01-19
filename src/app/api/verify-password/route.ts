import bcrypt from 'bcrypt';
import {type NextRequest, NextResponse} from "next/server";
import db from "@/db/connection";
import {rooms} from "@/db/schema";
import {eq, sql} from "drizzle-orm";

export async function POST(request: NextRequest) {
    const { room, password } = await request.json();

    try {
        // Check if the room exists based on the provided name
        const roomsList = await db
            .select()
            .from(rooms)
            .where(eq(rooms.id, room));

        console.log('Received Room:', room);
        console.log('Received Password:', password);
        console.log('Rooms List:', roomsList);

        if (roomsList.length > 0) {
            // Access the first record in the array
            const roomRecord = roomsList[0];

            console.log('Room Record:', roomRecord);

            // Check if the password and roomRecord.password are not null
            if (password && roomRecord.password !== null) {
                // Compare the password with the hashed password
                //const passwordMatches = await bcrypt.compare(password, roomRecord.password);
                const passwordMatches = password === roomRecord.password;

                console.log('Password Matches:', passwordMatches);

                if (passwordMatches) {
                    // Passwords match, user can enter the room
                    console.log('Password Matched');
                    return NextResponse.json({ success: true });
                } else {
                    // Password doesn't match
                    console.log('Password Mismatch');
                    return NextResponse.json({ success: false, message: 'Incorrect password' });
                }
            } else {
                // Either password or roomRecord.password is null
                console.log('Password or Room Record Password is null');
                return NextResponse.json({ success: false, message: 'Invalid password or room data' });
            }
        } else {
            // Room not found
            console.log('Room Not Found');
            return NextResponse.json({ success: false, message: 'Room not found' });
        }
    } catch (error) {
        console.error('Error verifying password:', error);
        return NextResponse.json({ success: false, message: 'Internal server error' });
    }
}

