"use client";

import { useState } from "react";
interface Message {
  role: 'user' | 'system',
  content: string
}
export default function Home() {
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [messages, setMessages] = useState<Array<Message>>([]) //Thats gonna be an array of objects with from, content and manage the context
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!currentQuestion.trim()) {
      alert("Please enter a question.");
      return;
    }

    setLoading(true);
    try {
      const formattedCurrentQuestion:Message = { 
        role: "user",
        content: currentQuestion
      }

      const messagesCopy = [...messages]
      messagesCopy.push(formattedCurrentQuestion)

      setMessages(messagesCopy)

      const response = await fetch("/api/askJesus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: messagesCopy }),
      });
      
      const data = await response.json();
      const formattedResponseMessage: Message = {
        role: "system",
        content: data.answer
      }
      messagesCopy.push(formattedResponseMessage)

      setMessages(messagesCopy)
    } catch (error) {
      console.error(error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="d-flex flex-col w-full h-screen p-10">
      <header className="text-center w-full">
        <h1>Ask Jesus:</h1>
      </header>
      <div className="w-full h-4/5 border-solid border border-indigo-600">
          {
            messages.map((message, index:number) => {
              return <li key={index}>{message.content}</li>
            })
          }
      </div>
      <textarea
        className="form-control h-1/5 w-full rounded-lg bg-stone-100"
        rows={4}
        placeholder="Ask Jesus a question..."
        value={currentQuestion}
        onChange={(e) => setCurrentQuestion(e.target.value)}
      />
      <button onClick={handleSend}>Send</button>
    </section>
  );
}