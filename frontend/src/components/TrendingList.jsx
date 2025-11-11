// frontend/src/components/TrendingList.jsx
import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import ProductModal from "./ProductModal";

export default function TrendingList() {
  const [trending, setTrending] = useState({});
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8765");

    ws.onopen = () => console.log("✅ Connected to WebSocket");

    ws.onmessage = (msg) => {
      try {
        const alert = JSON.parse(msg.data);
        const { product_id, current, timestamp } = alert;

        setTrending((prev) => {
          const pid = String(product_id);
          const product = prev[pid] || { current: 0, history: [], details: null };
          const minute = new Date(timestamp * 1000).toLocaleTimeString();

          const updatedHistory = [...product.history, { minute, count: current }];
          if (updatedHistory.length > 20) updatedHistory.shift();

          return {
            ...prev,
            [pid]: { ...product, current, history: updatedHistory },
          };
        });
      } catch (e) {
        console.error("Failed to parse WS message:", e);
      }
    };

    ws.onclose = () => console.log("❌ WebSocket closed");
    ws.onerror = (err) => console.error("WebSocket error:", err);

    return () => {
      try { ws.close(); } catch (e) {}
    };
  }, []);

  const productEntries = Object.entries(trending);

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold mb-2">🔥 Trending Now</h2>

      {productEntries.length === 0 ? (
        <p>No trending products yet...</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {productEntries.map(([pid, data]) => (
            <ProductCard
              key={pid}
              product_id={pid}
              current={data.current}
              history={data.history}
              onClick={(p) => setSelected({ ...p, product_id: pid })}
            />
          ))}
        </div>
      )}

      {/* Modal */}
      {selected && (
        <ProductModal product={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}
