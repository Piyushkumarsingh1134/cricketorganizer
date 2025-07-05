import React, { useState, useEffect } from "react";

const testimonials = [
  {
    name: "Rohit Sharma",
    team: "Mumbai Warriors",
    review:
      "One of the most seamless tournament experiences. Match scheduling and updates were spot on!",
  },
  {
    name: "Anjali Patel",
    team: "Gujarat Gladiators",
    review:
      "We loved how professional the organizers were. The whole process was smooth and fun!",
  },
  {
    name: "Varun Singh",
    team: "Delhi Smashers",
    review:
      "Scoring and player stats feature is amazing. Would recommend to every cricket lover.",
  },
];

const CustomerCarousel = () => {
  const [index, setIndex] = useState(0);

  const handleNext = () => {
    setIndex((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  // Auto-slide
  useEffect(() => {
    const timer = setInterval(handleNext, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full bg-gray-100 py-12 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-blue-600 mb-10">
          What Customers Say About Us
        </h2>

        <div className="bg-white rounded-xl p-8 shadow-md">
          <p className="text-lg italic text-gray-700">
            “{testimonials[index].review}”
          </p>

          <p className="mt-4 font-semibold text-gray-900">
            - {testimonials[index].name}
          </p>
          <p className="text-sm text-gray-500">{testimonials[index].team}</p>

          <div className="mt-6 flex justify-center gap-6">
            <button
              onClick={handlePrev}
              className="text-blue-500 hover:underline"
            >
              ⬅️ Previous
            </button>
            <button
              onClick={handleNext}
              className="text-blue-500 hover:underline"
            >
              Next ➡️
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerCarousel;

