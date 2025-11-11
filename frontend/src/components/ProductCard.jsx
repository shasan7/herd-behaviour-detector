// frontend/src/components/ProductCard.jsx
import React, { useEffect, useState } from "react";
import TrendChart from "./TrendChart";
import { motion } from "framer-motion";

export default function ProductCard({ product_id, current, history, onClick }) {
  const [details, setDetails] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch(`https://api.escuelajs.co/api/v1/products/${product_id}`);
        const data = await res.json();
        if (mounted) setDetails(data);
      } catch (err) {
        console.error("Failed to fetch product details", err);
      }
    })();
    return () => (mounted = false);
  }, [product_id]);

  return (
    <motion.div
      layout
      whileHover={{ scale: 1.02 }}
      onClick={() => onClick({ product_id, current, history, details })}
      className="bg-white rounded-2xl p-4 shadow-md hover:shadow-lg cursor-pointer transition-all"
    >
      {details ? (
        <>
          <div className="flex items-center gap-4">
            <img
              src={details.images?.[0]}
              alt={details.title}
              className="w-20 h-20 object-cover rounded-lg"
            />
            <div className="flex-1">
              <h3 className="font-semibold text-lg line-clamp-1">{details.title}</h3>
              <p className="text-gray-500 text-sm">#{product_id}</p>
            </div>
            <div className="text-right">
              <p className="text-red-600 font-bold text-lg">{current}</p>
              <p className="text-xs text-gray-400">views/min</p>
            </div>
          </div>
          <div className="mt-3">
            <TrendChart data={history} />
          </div>
        </>
      ) : (
        <div className="animate-pulse text-gray-400">Loading...</div>
      )}
    </motion.div>
  );
}
