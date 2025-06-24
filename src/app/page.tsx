"use client";

import { useState, useEffect, useRef } from "react";
import gsap from "gsap";

export default function Home() {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);

  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [replay, setReplay] = useState(0);

  const questionBoxRef = useRef<HTMLDivElement>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    async function fetchQuestions() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/questions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ topic: "general", numQuestions: 10 }),
        });
        const data = await res.json();
        if (!res.ok || !data.questions || !Array.isArray(data.questions) || data.questions.length === 0) {
          throw new Error(data.error || "Failed to load questions");
        }
        setQuestions(data.questions);
      } catch (err: any) {
        setError(err.message || "Failed to load questions");
        setQuestions([]);
      } finally {
        setLoading(false);
        setCurrent(0);
        setSelected(null);
        setScore(0);
        setShowScore(false);
      }
    }
    fetchQuestions();
  }, [replay]);

  const handleOptionClick = (idx: number) => {
    setSelected(idx);
  };

  const handleNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);

    // Animate to 90deg (hide old content)
    gsap.to(questionBoxRef.current, {
      rotateY: 90,
      duration: 0.4,
      ease: "power2.in",
      onComplete: () => {
        // Update question at halfway point
        if (selected === questions[current].answer) setScore((s) => s + 1);
        setSelected(null);
        if (current < questions.length - 1) {
          setCurrent((c) => c + 1);
        } else {
          setShowScore(true);
        }
        // Instantly set to -90deg (hidden, new content)
        gsap.set(questionBoxRef.current, { rotateY: -90 });
        // Animate to 0deg (show new content)
        gsap.to(questionBoxRef.current, {
          rotateY: 0,
          duration: 0.4,
          ease: "power2.out",
          onComplete: () => setIsAnimating(false),
        });
      },
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-3xl font-bold mb-8">AI Quiz App</h1>
        <div className="flex items-center justify-center h-24">
          <span className="inline-block w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-3xl font-bold mb-8">AI Quiz App</h1>
        <div className="text-red-600 mb-4">{error}</div>
        <button
          className="px-6 py-2 rounded bg-blue-600 text-white font-bold hover:bg-blue-700"
          onClick={() => setReplay((r) => r + 1)}
        >
          Try Again
        </button>
      </div>
    );
  }

  if (showScore) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-3xl font-bold mb-8">AI Quiz App</h1>
        <div className="flex flex-col items-center gap-4 text-xl font-semibold">
          <div>
            You scored {score} out of {questions.length}!
          </div>
          <button
            className="mt-4 px-6 py-2 rounded bg-blue-600 text-white font-bold hover:bg-blue-700"
            onClick={() => setReplay((r) => r + 1)}
          >
            Replay Quiz
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cube-container flex justify-center items-center min-h-screen p-4">
      <div
        ref={questionBoxRef}
        className="cube-box w-full max-w-md bg-white dark:bg-gray-900 rounded-lg shadow p-6"
        style={{ transform: "rotateY(0deg)" }}
      >
        <div className="mb-6 text-lg font-medium">
          Question {current + 1} of {questions.length}
        </div>
        <div className="mb-4 text-base font-semibold">
          {questions[current].question}
        </div>
        <div className="flex flex-col gap-3 mb-6">
          {questions[current].options.map((opt: string, idx: number) => (
            <button
              key={idx}
              className={`px-4 py-2 rounded border text-left transition-colors ${
                selected === idx
                  ? "bg-blue-500 text-white border-blue-500"
                  : "bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 hover:bg-blue-100 dark:hover:bg-blue-900"
              }`}
              onClick={() => handleOptionClick(idx)}
              disabled={false}
            >
              {opt}
            </button>
          ))}
        </div>
        <button
          className="w-full py-2 rounded bg-blue-600 text-white font-bold disabled:bg-gray-400"
          onClick={handleNext}
          disabled={selected === null || isAnimating}
        >
          {current === questions.length - 1 ? "Finish" : "Next"}
        </button>
      </div>
    </div>
  );
}
