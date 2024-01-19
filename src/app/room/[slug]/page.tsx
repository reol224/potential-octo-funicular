"use client"
import React, { useState, useRef, useEffect } from "react";
import { v4 as uuidv4 } from 'uuid';
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {rooms} from "@/db/schema";
import api from "@/lib/api";

export default function ChatRoom({ params }: { params: { slug: string } }) {
    const [isConnected, setIsConnected] = useState(false);
    const ws = useRef<WebSocket | null>();
    const [message, setMessage] = useState("");
    const [messageList, setMessageList] = useState<{ id: string, text: string, room: string }[]>([]);
    const userId = useRef<string>(uuidv4());
    const [password, setPassword] = useState<string>("");
    const [isPasswordPromptOpen, setIsPasswordPromptOpen] = useState<boolean>(true);

    useEffect(() => {
        try {
            const chatSocket: WebSocket = new WebSocket(`ws://127.0.0.1:3001?room=${params.slug}&password=${password}`);

            if (!chatSocket) return;

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
        } catch (e) {
            console.log(e);
        }
    }, [params.slug, password]);

    const handleSendMessage = () => {
        if (message && ws.current) {
            const formattedMessage = { id: userId.current, text: message, room: params.slug };
            ws.current.send(JSON.stringify(formattedMessage));
            setMessage("");
        }
    };

    const handleEnterRoom = async () => {
        console.error("handling enter room");
        try {
            // Perform a request to your server to verify the password
            const response = await api.post("/verify-password", {
                room: params.slug,
                password: password,
            });

            if (response.data.success) {
                setIsPasswordPromptOpen(false);
                // Add your logic for successful entry into the room here
            } else {
                // Password is incorrect, display an error or handle it accordingly
                console.error("Incorrect password");
            }
        } catch (error) {
            console.error("Error verifying password:", error);
        }
    };



    // const handleEnterRoom = () => {
    //     setIsPasswordPromptOpen(false);
    // };

    return (
        <div className="grid w-full gap-2">
            {isPasswordPromptOpen ? (
                <div>
                    <p>Enter password to join the room:</p>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <Button onClick={handleEnterRoom}>Enter</Button>
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
                </div>
            )}
        </div>
    );
}
