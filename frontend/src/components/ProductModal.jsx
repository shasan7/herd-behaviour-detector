// frontend/src/components/ProductModal.jsx
import React from "react";
import TrendChart from "./TrendChart";
import { motion, AnimatePresence } from "framer-motion";

export default function ProductModal({ product, onClose }) {
  if (!product) return null;
  const { details, history, current, product_id } = product;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl p-6 max-w-3xl w-full shadow-xl relative"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-6 text-2xl text-gray-500 hover:text-black"
          >
            ×
          </button>

          <div className="flex gap-6">
            <img
              src={details?.images?.[0]}
              alt={details?.title}
              className="w-64 h-64 object-cover rounded-xl shadow-md"
            />
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-1">{details?.title}</h2>
              <p className="text-gray-500 mb-2">#{product_id}</p>
              <p className="text-sm mb-3">{details?.description}</p>
              <p className="text-green-600 font-bold text-xl">${details?.price}</p>
              <p className="text-red-600 font-semibold mt-2">{current} views/min</p>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-2 text-gray-700">
              Activity Trend (last {history?.length ?? 0} points)
            </h3>
            <div className="h-64">
              <TrendChart data={history} />
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
