"use client";

import { useState } from "react";

// Placeholder questions
const QUESTIONS = [
  {
    question: "What is the capital of France?",
    options: ["Berlin", "London", "Paris", "Madrid"],
    answer: 2,
  },
  {
    question: "Which planet is known as the Red Planet?",
    options: ["Earth", "Mars", "Jupiter", "Saturn"],
    answer: 1,
  },
  {
    question: "Who wrote 'To Kill a Mockingbird'?",
    options: ["Harper Lee", "Mark Twain", "J.K. Rowling", "Jane Austen"],
    answer: 0,
  },
  // ...add 7 more placeholder questions
];

export default function Home() {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);

  const handleOptionClick = (idx: number) => {
    setSelected(idx);
  };

  const handleNext = () => {
    if (selected === QUESTIONS[current].answer) {
      setScore((s) => s + 1);
    }
    setSelected(null);
    if (current < QUESTIONS.length - 1) {
      setCurrent((c) => c + 1);
    } else {
      setShowScore(true);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-3xl font-bold mb-8">AI Quiz App</h1>
      {showScore ? (
        <div className="flex flex-col items-center gap-4 text-xl font-semibold">
          <div>
            You scored {score} out of {QUESTIONS.length}!
          </div>
          <button
            className="mt-4 px-6 py-2 rounded bg-blue-600 text-white font-bold hover:bg-blue-700"
            onClick={() => {
              setCurrent(0);
              setSelected(null);
              setScore(0);
              setShowScore(false);
            }}
          >
            Replay Quiz
          </button>
        </div>
      ) : (
        <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-lg shadow p-6">
          <div className="mb-6 text-lg font-medium">
            Question {current + 1} of {QUESTIONS.length}
          </div>
          <div className="mb-4 text-base font-semibold">
            {QUESTIONS[current].question}
          </div>
          <div className="flex flex-col gap-3 mb-6">
            {QUESTIONS[current].options.map((opt, idx) => (
              <button
                key={idx}
                className={`px-4 py-2 rounded border text-left transition-colors ${
                  selected === idx
                    ? "bg-blue-500 text-white border-blue-500"
                    : "bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 hover:bg-blue-100 dark:hover:bg-blue-900"
                }`}
                onClick={() => handleOptionClick(idx)}
                disabled={selected !== null}
              >
                {opt}
              </button>
            ))}
          </div>
          <button
            className="w-full py-2 rounded bg-blue-600 text-white font-bold disabled:bg-gray-400"
            onClick={handleNext}
            disabled={selected === null}
          >
            {current === QUESTIONS.length - 1 ? "Finish" : "Next"}
          </button>
        </div>
      )}
    </div>
  );
}
