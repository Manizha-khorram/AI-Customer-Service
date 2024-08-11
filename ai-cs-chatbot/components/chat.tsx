"use client";
import { useChat, Message } from "ai/react";
import { useState, useEffect, useRef } from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { SendHorizontalIcon } from "lucide-react";
import CopyToClipboard from "@/components/copy-to-clipboard";

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit, isLoading, error, setMessages } =
    useChat({
      initialMessages: [
        {
          id: Date.now().toString(),
          role: "system",
          content: "You are an assistant that gives short answers.",
        },
      ],
    });

  const ref = useRef<HTMLDivElement>(null);

  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (messages.length === 1 && messages[0].role === "system") {
      const defaultMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: "Hi, I'm ChatBot! How can I help you today?"
      };
      setMessages([...messages, defaultMessage]);
    }

    if (ref.current === null) return;
    ref.current.scrollTo(0, ref.current.scrollHeight);
  }, [messages, setMessages]);

  const changeTheme = () => {
    setIsDarkMode(!isDarkMode);
  };
  const logout = () => {
    window.location.href = "/";
  };

  return (
    <section className={`min-h-screen ${isDarkMode ? "dark" : ""}`}>
      <div className="container mx-auto px-4 py-8 flex flex-col h-screen  dark:bg-gray-900 dark:text-white">
        <header className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src="/images/robot.jpg" alt="AI Chatbot" />
              <AvatarFallback className="bg-purple-500 text-white">AI</AvatarFallback>
            </Avatar>
            <h1 className="text-2xl font-bold">AI Chatbot</h1>
          </div>
          <div className="flex space-x-2">
            <Button onClick={changeTheme} variant="outline">
              {isDarkMode ? "Light" : "Dark"} Mode
            </Button>
            <Button onClick={logout} variant="ghost">
              Logout
            </Button>
          </div>
        </header>
        
        <ScrollArea className="flex-grow mb-6 border rounded-lg shadow-inner bg-white dark:bg-gray-800" ref={ref}>
          {error && (
            <div className="p-4 text-sm text-red-500 bg-red-100 dark:bg-red-900 rounded-lg mb-4">{error.message}</div>
          )}
          <div className="p-4 space-y-6">
            {messages.map((m) => (
              m.role !== "system" && (
                <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] ${m.role === "user" ? "bg-purple-100 dark:bg-purple-900" : "bg-gray-100 dark:bg-gray-700"} rounded-lg p-3 shadow`}>
                    {m.role === "assistant" && (
                      <div className="flex items-center mb-2">
                        <Avatar className="h-6 w-6 mr-2">
                          <AvatarImage src="/images/robot.jpg" alt="AI" />
                          <AvatarFallback className="bg-purple-500 text-white text-xs">AI</AvatarFallback>
                        </Avatar>
                        <p className="font-semibold text-sm">BOT</p>
                      </div>
                    )}
                    <div className="text-sm">{m.content}</div>
                    {m.role === "assistant" && (
                      <div className={'mt-2 flex justify-end ${isDarkMode ? "dark" : ""}'}>
                        <CopyToClipboard message={m} className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200" />
                      </div>
                    )}
                  </div>
                </div>
              )
            ))}
          </div>
        </ScrollArea>

        <form onSubmit={handleSubmit} className="relative">
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Ask me anything..."
            className="pr-12 rounded-full bg-white dark:bg-gray-700 dark:text-white shadow-lg"
          />
          <Button
            size="icon"
            type="submit"
            disabled={isLoading}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 rounded-full h-10 w-10 bg-purple-500 hover:bg-purple-600 text-white"
          >
            <SendHorizontalIcon className="h-5 w-5" />
          </Button>
        </form>
      </div>
    </section>
  );
}