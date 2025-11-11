import React from "react";
import TrendingList from "./components/TrendingList";

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 text-gray-800">
      <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-5 shadow">
        <h1 className="text-center text-3xl font-bold tracking-wide">
          🛒 Real-Time Herd Behavior Dashboard
        </h1>
        <p className="text-center text-sm opacity-80">
          Monitoring trending e-commerce products in real-time
        </p>
      </header>

      <main className="max-w-6xl mx-auto p-6">
        <TrendingList />
      </main>

      <footer className="text-center text-gray-500 text-sm py-3">
        Built with Kafka • FastAPI • React • Tailwind • Recharts
      </footer>
    </div>
  );
}