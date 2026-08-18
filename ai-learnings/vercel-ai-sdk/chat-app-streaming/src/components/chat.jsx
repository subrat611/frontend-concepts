"use client";

import { useChat } from "@ai-sdk/react";
import { useState } from "react";

const Chat = () => {
  const [input, setInput] = useState("");
  const { messages, sendMessage } = useChat();

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleSendMessage = () => {
    sendMessage({ text: input });
    setInput("");
  };

  return (
    <div className="flex flex-col w-full max-w-2xl py-24 mx-auto stretch">
      {messages.map((message) => (
        <div key={message.id} className="whitespace-pre-wrap">
          {message.role === "user" ? "User: " : "AI: "}
          {message.parts.map((part, i) => {
            switch (part.type) {
              case "text":
                return <div key={`${message.id}-${i}`}>{part.text}</div>;
            }
          })}
        </div>
      ))}
      <div className="w-full max-w-2xl mx-auto fixed bottom-3 left-[50%] translate-x-[-50%]">
        <div className="flex items-center gap-2 rounded-3xl border border-gray-200 bg-white px-4 py-3 shadow-sm focus-within:border-gray-300 focus-within:shadow-md transition-all">
          <textarea
            //   ref={textareaRef}
            value={input}
            onChange={handleInputChange}
            //   onKeyDown={handleKeyDown}
            id="input-message-box"
            name="input-message-area"
            placeholder="How can I help you today?"
            rows={1}
            className="flex-1 resize-none bg-transparent text-gray-800 placeholder-gray-400 text-base leading-6 outline-none overflow-y-auto"
          />
          <button
            onClick={handleSendMessage}
            disabled={!input.trim()}
            className={`flex items-center justify-center h-9 w-9 rounded-full transition-colors shrink-0 ${
              input.trim()
                ? "bg-gray-900 hover:bg-gray-700 text-white cursor-pointer"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
            aria-label="Send message"
          >
            🚀
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
