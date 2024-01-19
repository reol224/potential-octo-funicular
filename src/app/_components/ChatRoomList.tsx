"use client";
import React from "react";
import Link from "next/link";
import { Room } from "@/app/types";

type Props = {
  RoomList: Room[];
};

export default function ChatRoomList({ RoomList }: Props) {
  return (
    <div>
      {RoomList.map((room) => (
        <div key={room.id}>
          <Link href={`/room/${room.id}`}>{room.name}</Link>
        </div>
      ))}
    </div>
  );
}
