import bcrypt from 'bcrypt';
import {type NextRequest, NextResponse} from "next/server";
import db from "@/db/connection";
import {rooms} from "@/db/schema";
import {sql} from "drizzle-orm";

export async function POST(request: NextRequest) {
    // parse the streaming body to json

    //check from DB
    return NextResponse.json({ success: true });
}
