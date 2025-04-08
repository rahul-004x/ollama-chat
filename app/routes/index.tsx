import { useRef, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/start";
import { Bot, Loader2, MessageSquare, Send, User2 } from "lucide-react";
import { useMemo, useState } from "react";
import Markdown from "react-markdown";

import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

type Message = {
  role: "user" | "assistant" | "tool" | "system";
  content: string;
};

type MessageWithThinking = Message & {
  finishedThinking?: boolean;
  think?: string;
};

function useMessagesWithThinking(messages: Message[]) {
  return useMemo(
    () =>
      messages.map((m: Message): MessageWithThinking => {
        if (m.role === "assistant") {
          if (m.content.includes("</think>")) {
            return {
              ...m,
              finishedThinking: true,
              think: m.content
                .split("</think>")[0]
                .replace("</think>", "")
                .replace("<think>", ""),
              content: m.content.split("</think>")[1],
            };
          } else {
            return {
              ...m,
              finishedThinking: false,
              think: m.content.replace("<think>", ""),
              content: "",
            };
          }
        }
        return m;
      }),
    [messages]
  );
}

function streamAsyncIterator(reader: ReadableStreamDefaultReader<Uint8Array>) {
  const decoder = new TextDecoder("utf-8");
  return {
    async *[Symbol.asyncIterator]() {
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) return;
          yield decoder.decode(value);
        }
      } finally {
        reader.releaseLock();
      }
    },
  };
}

export const Route = createFileRoute("/")({
  component: AIChat,
});

const chat = createServerFn(
  "POST",
  async ({ messages }: { messages: Message[] }) => {
    return fetch("http://127.0.0.1:11434/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "deepseek-r1:1.5b",
        streaming: true,
        options: {
          temperature: 0.1,
          repeat_penalty: 1.2,
          numa: true, // testing for ARM
        },
        messages: [...messages],
      }),
    });
  }
);

function AIChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [premise, setPremise] = useState("You are a software developer with a focus on React/TypeScript.\rKeep your answer simple and straight forward.");
  const [loading, setLoading] = useState(false);

  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setInput("");
    setLoading(true);

    const messagesWithInput: Message[] = [
      ...messages,
      { role: "system", content: premise },
      { role: "user", content: input },
    ];
    setMessages(messagesWithInput);

    const stream = await chat({ messages: messagesWithInput });
    if (stream.body) {
      let assistantResponse = "";
      const reader = stream.body.getReader();
      for await (const value of streamAsyncIterator(reader)) {
        const {
          message: { content },
        } = JSON.parse(value);
        assistantResponse += content;
        setMessages([
          ...messagesWithInput,
          {
            role: "assistant",
            content: assistantResponse,
          },
        ]);
      }
    }
    setLoading(false);
  };

  const messagesWithThinkingSplit = useMessagesWithThinking(messages);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      {/* System Prompt Input */}
      <div className="p-6 container mx-auto max-w-4xl space-y-4">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50 shadow-lg transition-all hover:bg-gray-800/60">
          <label htmlFor="premise" className="block text-sm font-medium text-gray-300 mb-2">
            System Prompt:
            <textarea
              name="premise"
              className="mt-2 w-full rounded-lg bg-gray-900/50 border-gray-700/50 text-gray-100 p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              value={premise}
              onChange={(e) => setPremise(e.target.value)}
              rows={3}
            />
          </label>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 p-6 container mx-auto max-w-4xl space-y-6 pb-32 overflow-y-auto">
        {messagesWithThinkingSplit
          .filter(({ role }) => role === "user" || role === "assistant")
          .map((m, index) => (
            <AIMessage key={index} message={m} />
          ))}
        {/* 👇 Scroll target */}
        <div ref={bottomRef} />
      </div>

      {/* Message Input */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gray-900/80 backdrop-blur-md border-t border-gray-800 shadow-lg">
        <form onSubmit={handleSubmit} className="container mx-auto max-w-4xl">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <MessageSquare className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                className="flex-1 h-12 bg-gray-800/50 border-gray-700/50 text-gray-100 pl-11 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                value={input}
                disabled={loading}
                placeholder="Ask your local DeepSeek..."
                onChange={(e) => setInput(e.target.value)}
              />
            </div>
            <Button
              type="submit"
              disabled={loading || !input.trim()}
              className="h-12 px-6 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium transition-colors disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
              <span className="sr-only">Send message</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

const AIMessage: React.FC<{ message: MessageWithThinking }> = ({ message }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} animate-in slide-in-from-bottom-2 duration-300 ease-out`}
    >
      <div
        className={`max-w-[80%] rounded-2xl p-4 shadow-lg transition-all ${
          message.role === "user"
            ? "bg-blue-600 text-white hover:bg-blue-500"
            : "bg-gray-800/80 text-gray-100 hover:bg-gray-800"
        } backdrop-blur-sm border border-white/10`}
      >
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-2 flex-1">
            {message.role === "user" ? (
              <div className="bg-white/20 rounded-full p-1">
                <User2 className="h-4 w-4" />
              </div>
            ) : (
              <div className="bg-blue-500/20 rounded-full p-1">
                {!message.finishedThinking ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Bot className="h-4 w-4" />
                )}
              </div>
            )}
            <span className="text-sm font-medium">
              {message.role === "user" ? "You" : "DeepSeek R1 (1.5b)"}
            </span>
          </div>
          
          {message.role === "assistant" && (
            <button
              onClick={() => setCollapsed((c) => !c)}
              className="text-xs italic text-gray-400 hover:text-gray-300 transition-colors"
            >
              {collapsed ? "show thoughts" : "hide thoughts"}
            </button>
          )}
        </div>

        {message.role === "assistant" && !message.finishedThinking && (
          <div className="flex items-center gap-2 text-gray-400 mb-2">
            <div className="flex gap-1">
              <span className="animate-bounce delay-0">.</span>
              <span className="animate-bounce delay-150">.</span>
              <span className="animate-bounce delay-300">.</span>
            </div>
            <span className="text-sm">Thinking</span>
          </div>
        )}

        {message.think && (
          <div 
            className={`mb-3 text-sm italic border-l-2 border-gray-600 pl-3 py-2 text-gray-300 transition-all duration-300 ${
              collapsed ? 'hidden' : 'block animate-in slide-in-from-top-2'
            }`}
          >
            <Markdown>{message.think}</Markdown>
          </div>
        )}

        <article
          className={`prose max-w-none ${
            message.role === "user"
              ? "prose-invert prose-p:text-white/90 prose-headings:text-white prose-strong:text-white/90 prose-li:text-white/90"
              : "prose-invert prose-p:text-gray-100 prose-headings:text-gray-100 prose-strong:text-gray-100 prose-li:text-gray-100"
          }`}
        >
          <Markdown>{message.content}</Markdown>
        </article>
      </div>
    </div>
  );
}