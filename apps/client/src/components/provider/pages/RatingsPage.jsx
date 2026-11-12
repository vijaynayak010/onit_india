import React, { useState } from "react";
import { Star, X } from "lucide-react";

const RatingsPage = ({ onSubmit, onitindiaSupportName }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [feedback, setFeedback] = useState("");

  const handleSubmit = () => {
    if (rating > 0) {
      onSubmit({ rating, feedback });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-medium text-gray-800">Rate your experience</h2>
          <button onClick={() => onSubmit(null)} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>
        <p className="text-gray-600 mb-6">How would you rate your chat with {onitindiaSupportName}?</p>
        <div className="flex justify-center mb-6">
          {[...Array(5)].map((_, index) => {
            const ratingValue = index + 1;
            return (
              <label key={index}>
                <input
                  type="radio"
                  name="rating"
                  value={ratingValue}
                  onClick={() => setRating(ratingValue)}
                  className="hidden"
                />
                <Star
                  size={40}
                  className="cursor-pointer"
                  color={ratingValue <= (hover || rating) ? "#ffc107" : "#e4e5e9"}
                  onMouseEnter={() => setHover(ratingValue)}
                  onMouseLeave={() => setHover(0)}
                />
              </label>
            );
          })}
        </div>
        <textarea
          className="w-full p-4 border border-gray-200 rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows="4"
          placeholder="Tell us more about your experience..."
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
        ></textarea>
        <button
          onClick={handleSubmit}
          disabled={rating === 0}
          className="w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 transition-colors"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default RatingsPage;