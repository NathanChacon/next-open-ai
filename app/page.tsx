"use client";

import { useState } from "react";
import Image from "next/image";

interface Message {
  role: "user" | "system";
  content: string;
}

interface Character {
  imgPath:string,
  id: string,
  label: string,
}

export default function Home() {
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [messages, setMessages] = useState<Array<Message>>([]);
  const [selectedCharacter, setSelectedCharacter] = useState<Character>({
    imgPath: "/images/homer.jpg",
    id: "homer simpson",
    label: "Homer Simpson",
  });

  const characters: Array<Character> = [
      {
        imgPath: "/images/homer.jpg",
        id: "homer simpson",
        label: "Homer Simpson",
      },
      {
        imgPath: "/images/deadpool.jpg",
        id: "deadpool",
        label: "Deadpool",
      },
      {
        imgPath: "/images/spongeBob.png",
        id: "spongebob",
        label: "SpongeBob SquarePants",
      },
      {
        imgPath: "/images/tony.jpg",
        id: "tony stark",
        label: "Tony Stark",
      },
      {
        imgPath: "/images/michael.jpg",
        id: "michael scott",
        label: "Michael Scott",
      },
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
      setCurrentQuestion("")
      const response = await fetch("/api/askJesus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ character:selectedCharacter.id, messages: messagesCopy }),
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <section className="flex flex-col w-full h-screen md:p-10">
      <header className="w-full flex flex-row justify-center gap-4 flex-wrap">
        {characters.map((character) => {
          const isSelected = selectedCharacter.id === character.id;
          return (
              <Image
                onClick={() => setSelectedCharacter(character)}
                src={character.imgPath}
                key={character.id}
                alt={character.label}
                className={`character rounded-full cursor-pointer ${isSelected ? "border-4 border-blue-500" : ""}`}
                width={120}
                height={120}
              />
          );
        })}
      </header>
      <div className="w-full h-4/5 md:p-10">
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
        className="p-5 form-control h-1/5 w-full rounded-lg bg-stone-100 focus:outline-none focus:border-transparent"
        rows={4}
        placeholder={`Ask ${selectedCharacter.label} a question...`}
        value={currentQuestion}
        onChange={(e) => setCurrentQuestion(e.target.value)}
        onKeyDown={handleKeyDown}
      />
    </section>
  );
}
