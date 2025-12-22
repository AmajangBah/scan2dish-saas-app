"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

export default function OrderTracker() {
  const { tableId, orderId } = useParams();

  // mock progress
  const steps = [
    { id: 1, label: "Received", done: true },
    { id: 2, label: "Been prepared", done: true },
    { id: 3, label: "Ready for delivery", done: false },
    { id: 4, label: "Completed", done: false },
  ];

  return (
    <div className="min-h-screen pb-28 px-4 pt-6">
      <div className="max-w-xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-6">
          Order #{orderId}
        </h2>

        <div className="bg-white p-6 rounded-2xl shadow">
          <div className="flex items-center justify-between mb-6">
            {steps.map((s, i) => (
              <div key={s.id} className="flex-1 text-center">
                <div
                  className={`w-8 h-8 mx-auto rounded-full ${
                    s.done ? "bg-orange-600" : "bg-gray-200"
                  }`}
                />
                <div className="text-xs mt-2">{s.label}</div>
              </div>
            ))}
          </div>

          <div className="text-center mt-6">
            <p className="text-gray-600">Estimated preparation time</p>
            <p className="text-2xl font-bold mt-2">7–15 minutes</p>
          </div>

          <Link
            href={`/menu/${tableId}/browse`}
            className="mt-6 block bg-orange-600 text-white text-center py-3 rounded-xl"
          >
            Back to menu
          </Link>
        </div>
      </div>
    </div>
  );
}
