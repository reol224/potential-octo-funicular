"use client";
import AddChatRoom from "./_components/AddChatRoom";
import ChatRoomList from "./_components/ChatRoomList";
import React, { useState, useEffect } from "react";
import api from "@/lib/api";
import { Room } from "@/app/types";

export default function Home() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const result = await api.get("/room");
    setRooms(result.data);
    setLoading(false);
  };

  return (
    <main className="min-h-screen justify-between p-24">
      {loading && <div>Loading...</div>}
      <ChatRoomList RoomList={rooms} />
      <AddChatRoom onRoomAdded={fetchData} />
    </main>
  );
}
