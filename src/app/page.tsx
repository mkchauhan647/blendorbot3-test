'use client'

import { useState, useRef, useEffect } from 'react';

export default function Home() {
    const [userMessage, setUserMessage] = useState('');
    const [chatHistory, setChatHistory] = useState<{ user: string; bot: any }[]>([]);
    const [isTyping, setIsTyping] = useState(false);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    const sendMessage = async (e:any) => {
        e.preventDefault();
        
        setChatHistory((prevChatHistory) => [
            ...prevChatHistory,
            { user: userMessage, bot: "typing..." }
        ]);
        setUserMessage('');
        setIsTyping(true);

        try {
            const response = await fetch('/api/chatbot', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userMessage })
            });
            const data = await response.json();

            if (data.error && data.error.includes("currently loading")) {
                setChatHistory((prevChatHistory) => [
                    ...prevChatHistory.slice(0, -1),
                    { user: userMessage, bot: "Bot is currently loading, please wait..." }
                ]);
            } else {
                setChatHistory((prevChatHistory) => {
                    const updatedChat = [...prevChatHistory];
                    updatedChat[updatedChat.length - 1].bot = data.botMessage;
                    return updatedChat;
                });
            }
        } catch (error) {
            console.error("Error fetching bot response:", error);
            setChatHistory((prevChatHistory) => [
                ...prevChatHistory.slice(0, -1),
                { user: userMessage, bot: "Error: Could not connect to the chatbot." }
            ]);
        } finally {
            setIsTyping(false);
        }
    };

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [chatHistory]);

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100 p-4">
            <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-4">
                <div
                    ref={chatContainerRef}
                    className="h-96 overflow-y-scroll flex flex-col space-y-2 p-4"
                >
                    {chatHistory.map((chat, index) => (
                        <div key={index}>
                            <div className="flex justify-end">
                                <div className="bg-blue-500 text-white rounded-lg p-2 m-1 max-w-xs">
                                    <p>{chat.user}</p>
                                </div>
                            </div>
                            <div className="flex justify-start">
                                <div className="bg-gray-200 text-gray-800 rounded-lg p-2 m-1 max-w-xs">
                                    <p>{chat.bot}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <form onSubmit={sendMessage} className="flex items-center border-t p-2">
                    <input
                        type="text"
                        value={userMessage}
                        onChange={(e) => setUserMessage(e.target.value)}
                        placeholder="Type a message"
                        className="flex-1 border border-gray-300 rounded-lg p-2 mr-2 focus:outline-none"
                    />
                    <button
                        type="submit"
                        className="bg-blue-500 text-white rounded-lg px-4 py-2"
                        disabled={!userMessage.trim()}
                    >
                        Send
                    </button>
                </form>
            </div>
        </div>
    );
}
