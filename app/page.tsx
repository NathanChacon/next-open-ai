"use client";

import { useState } from "react";
import Image from "next/image";

interface Message {
  role: "user" | "system";
  content: string;
}
export default function Home() {
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [messages, setMessages] = useState<Array<Message>>([]);
  const [selectedCharacter, setSelectedCharacter] = useState("homer simpson");
  const characters = [
    "homer simpson",
    "deadpool",
    "spongebob",
    "tony",
    "michael scott",
  ];
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!currentQuestion.trim()) {
      alert("Please enter a question.");
      return;
    }

    setLoading(true);
    try {
      const formattedCurrentQuestion: Message = {
        role: "user",
        content: currentQuestion,
      };

      const messagesCopy = [...messages];
      messagesCopy.push(formattedCurrentQuestion);

      setMessages(messagesCopy);

      const response = await fetch("/api/askJesus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ character:selectedCharacter, messages: messagesCopy }),
      });

      const data = await response.json();
      const formattedResponseMessage: Message = {
        role: "system",
        content: data.answer,
      };
      messagesCopy.push(formattedResponseMessage);

      setMessages(messagesCopy);
    } catch (error) {
      console.error(error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex flex-col w-full h-screen p-10">
      <header className="w-full flex flex-row justify-center gap-4">
        {characters.map((characterName) => {
          const isSelected = selectedCharacter === characterName;
          return (
              <Image
                onClick={() => setSelectedCharacter(characterName)}
                src="/images/profile_pic_landing.jpg"
                key={characterName}
                alt={characterName}
                className={`rounded-full cursor-pointer ${isSelected ? "border-4 border-blue-500" : ""}`}
                width={90}
                height={90}
              />
          );
        })}
      </header>
      <div className="w-full h-4/5 p-10">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`p-4 mb-2 rounded-lg ${
              message.role === "user" && "bg-gray-300"
            }`}
          >
            {message.content}
          </div>
        ))}
      </div>
      <textarea
        className="p-5 form-control h-1/5 w-full rounded-lg bg-stone-100"
        rows={4}
        placeholder="Ask Jesus a question..."
        value={currentQuestion}
        onChange={(e) => setCurrentQuestion(e.target.value)}
      />
      <button onClick={handleSend}>Send</button>
    </section>
  );
}
