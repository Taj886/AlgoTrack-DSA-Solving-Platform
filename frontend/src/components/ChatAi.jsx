import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import axiosClient from "../utils/axiosClient";
import { Send } from 'lucide-react';

function ChatAi({problem}) {
    const [messages, setMessages] = useState([
        { role: 'model', parts:[{text: "Hi, How are you"}]},
        { role: 'user', parts:[{text: "I am Good"}]}
    ]);

    const { register, handleSubmit, reset,formState: {errors} } = useForm();
    const [chatError, setChatError] = useState(null);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const onSubmit = async (data) => {
        setChatError(null);
        const userMessage = { role: 'user', parts:[{text: data.message}] };
        // add to UI immediately
        setMessages(prev => [...prev, userMessage]);
        reset();

        try {
            // send the messages including the latest user message (avoid stale state)
            const payloadMessages = [...messages, userMessage];
            const response = await axiosClient.post("/ai/chat", {
                messages: payloadMessages,
                title:problem.title,
                description:problem.description,
                testCases: problem.visibleTestCases,
                startCode:problem.startCode
            });

            const reply = response?.data?.message || JSON.stringify(response?.data || '');
            setMessages(prev => [...prev, { role: 'model', parts:[{text: reply}] }]);
        } catch (error) {
            console.error("API Error:", error);
            // extract server message when possible
            let serverMsg = error?.response?.data?.message || (typeof error?.response?.data === 'string' ? error.response.data : null) || error.message || 'Error from AI Chatbot';
            setChatError(serverMsg);
            setMessages(prev => [...prev, { role: 'model', parts:[{text: serverMsg}] }]);
        }
    };

    return (
        <div className="flex flex-col h-screen max-h-[80vh] min-h-[500px]">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg, index) => (
                    <div 
                        key={index} 
                        className={`chat ${msg.role === "user" ? "chat-end" : "chat-start"}`}
                    >
                        <div className="chat-bubble bg-base-200 text-base-content">
                            {msg.parts[0].text}
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <form 
                onSubmit={handleSubmit(onSubmit)} 
                className="sticky bottom-0 p-4 bg-base-100 border-t"
            >
                <div className="flex items-center">
                    <input 
                        placeholder="Ask me anything" 
                        className="input input-bordered flex-1" 
                        {...register("message", { required: true, minLength: 2 })}
                    />
                    <button 
                        type="submit" 
                        className="btn btn-ghost ml-2"
                        disabled={errors.message}
                    >
                        <Send size={20} />
                    </button>
                </div>
            </form>
        </div>
    );
}

export default ChatAi;