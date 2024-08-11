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

  return (
    <section className={`${isDarkMode ? "dark-mode" : ""}`}>
      <div className="container flex h-screen flex-col items-center justify-center" style={{
        border: '6px solid purple',
        backgroundColor: 'var(--background)',
        color: 'var(--text)'
      }}>
        <Avatar>
          <AvatarImage src="/images/robot.jpg"></AvatarImage>
          <AvatarFallback className="bg-purple-500 text-white">AI</AvatarFallback>
        </Avatar>
        <h1 className="font-serif text-2x1 font-medium">AI Chatbot</h1>
        <Button onClick={changeTheme} className="mb-4">
            Switch to {isDarkMode ? "Light" : "Dark"} Mode
        </Button>
        <div className="mt-6 w-full max-w-lg">
          
          {/* {response container} */}
          <ScrollArea
            className="mb-2 h-[400px] p-4 border-4 border-purple-500 rounded-md"
            ref={ref}
          >
            {error && (
              <div className="text-sm text-red-400"> {error.message}</div>
            )}
            {messages.map((m) => (
              <div key={m.id} className="mr-6 whitespace-pre-wrap md:mr-12">
                {m.role === "user" && (
                  <div className="mb-6 flex gap-3 justify-end">
                    <div className="mt-1.5 w-full text-right">
                      <p className="front-semibold text-purple-500">You</p>
                      <div className="mt-1.5 text-sm">{m.content}</div>
                    </div>
                  </div>
                )}
                {m.role === "assistant" && (
                  <div className="mb-6 flexgap-3">
                    <Avatar>
                      <AvatarImage src="/images/robot.jpg"></AvatarImage>
                      <AvatarFallback className="bg-purple-500 text-white">
                        AI
                      </AvatarFallback>
                    </Avatar>
                    <div className="mt-1.5 w-full">
                      <div className="flex justify-between">
                        <p className="font-semibold">BOT</p>
                        <CopyToClipboard
                          message={m}
                          className="mt-1"
                        ></CopyToClipboard>
                      </div>
                      <div className="m-2 text-sm text-zinc-500">
                        {m.content}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </ScrollArea>

          {/* {input form } */}
          <form onSubmit={handleSubmit} className="relative">
            <Input
              value={input}
              onChange={handleInputChange}
              placeholder="Ask me anything..."
              className="pr-12 placeholder:italic placeholder:text-zinc-600"
            ></Input>
            <Button
              size="icon"
              type="submit"
              variant="secondary"
              disabled={isLoading}
              className="absolute right-1 top-1 h-8 w-10"
            >
              <SendHorizontalIcon className="h-5 w-5 text-purple-500"></SendHorizontalIcon>
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
