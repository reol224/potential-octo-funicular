"use client"
import React, { useState, useRef, useEffect } from "react";
import { v4 as uuidv4 } from 'uuid';
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {rooms} from "@/db/schema";
import api from "@/lib/api";
import {useRouter} from "next/navigation";

export default function ChatRoom({ params }: { params: { slug: string } }) {
    const [isConnected, setIsConnected] = useState(false);
    const ws = useRef<WebSocket | null>(null);
    const [message, setMessage] = useState("");
    const [messageList, setMessageList] = useState<{ id: string; text: string; room: string }[]>([]);
    const userId = useRef<string>(uuidv4());
    const [password, setPassword] = useState<string>("");
    const [isPasswordPromptOpen, setIsPasswordPromptOpen] = useState<boolean>(true);
    const router = useRouter()

    useEffect(() => {
        // Initialize WebSocket connection only once when the component mounts
        const chatSocket: WebSocket = new WebSocket(`ws://127.0.0.1:3001?room=${params.slug}&password=${password}`);

        chatSocket.onopen = () => {
            console.log("Connected to server.");
            setIsConnected(true);
        };

        chatSocket.onclose = () => {
            console.log("Disconnected from server.");
            setIsConnected(false);
        };

        chatSocket.onmessage = (e: MessageEvent) => {
            console.log(e);
            const receivedMessage = JSON.parse(e.data);
            if (receivedMessage.room === params.slug) {
                setMessageList((prev) => [...prev, receivedMessage]);
            }
        };

        ws.current = chatSocket;

        return () => {
            chatSocket.close();
        };
    }, [params.slug]);

    const handleSendMessage = () => {
        if (message && ws.current) {
            const formattedMessage = { id: userId.current, text: message, room: params.slug };
            ws.current.send(JSON.stringify(formattedMessage));
            setMessage("");
        }
    };

    const handleEnterRoom = async () => {
        try {
            const response = await api.post("/verify-password", {
                room: params.slug,
                password: password,
            });

            if (response.data.success) {
                setIsPasswordPromptOpen(false);
            } else {
                console.error("Incorrect password");
            }
        } catch (error) {
            console.error("Error verifying password:", error);
        }
    };

    return (
        <div className="grid w-full gap-2">
            {isPasswordPromptOpen ? (
                <div>
                    <p>Enter password to join the room:</p>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <Button onClick={handleEnterRoom}>Enter room</Button>
                    <Button onClick={() => router.back()}>Go back</Button>
                </div>
            ) : (
                <div>
                    <div className="message-container">
                        {messageList.map((msg, index) => (
                            <div key={index} className="message">
                                {msg.id === userId.current ? "You: " : "User " + msg.id + ": "} {msg.text}
                            </div>
                        ))}
                    </div>
                    <Textarea placeholder="Type your message here." value={message} onChange={(e) => setMessage(e.target.value)} />
                    <Button onClick={handleSendMessage}>Send message</Button>
                    <Button onClick={() => router.back()}>Exit chat room</Button>
                </div>
            )}
        </div>
    );
}
