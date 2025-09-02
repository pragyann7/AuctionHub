// src/components/UserFeedback.jsx
import React from "react";
import { Star, ThumbsUp, ThumbsDown } from "lucide-react";

const feedbacks = [
  {
    id: 1,
    name: "John Doe",
    rating: 5,
    date: "2 weeks ago",
    comment: "Great seller! The product was exactly as described and shipping was fast.",
  },
  {
    id: 2,
    name: "Jane Smith",
    rating: 4,
    date: "1 month ago",
    comment: "Good communication and the item was in perfect condition. Would buy from again.",
  },
  {
    id: 3,
    name: "Mike Johnson",
    rating: 5,
    date: "2 months ago",
    comment: "Excellent service and product quality. Highly recommended seller!",
  },
];

export default function UserFeedback() {
  return (
    <div className="w-full max-w-full">
      <div className="space-y-6">
      {/* Feedback Summary */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Feedback Summary</h2>

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <span className="text-3xl font-bold text-gray-800">4.5</span>
            <div className="flex items-center">
              {[1, 2, 3, 4].map((star) => (
                <Star key={star} className="w-5 h-5 text-yellow-400 fill-current" />
              ))}
              <Star className="w-5 h-5 text-gray-300" />
            </div>
            <span className="text-gray-500 text-sm">(14 ratings)</span>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <ThumbsUp className="w-5 h-5 text-green-500" />
              <span className="text-gray-700 font-medium">95%</span>
            </div>
            <div className="flex items-center space-x-1">
              <ThumbsDown className="w-5 h-5 text-red-500" />
              <span className="text-gray-700 font-medium">5%</span>
            </div>
          </div>
        </div>

        {/* Rating Bars */}
        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map((rating) => (
            <div key={rating} className="flex items-center space-x-3">
              <div className="flex items-center space-x-1 w-16">
                <span className="text-sm text-gray-600">{rating}</span>
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
              </div>
              <div className="flex-grow h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-yellow-400 rounded-full"
                  style={{ width: rating === 5 ? '70%' : rating === 4 ? '20%' : rating === 3 ? '5%' : rating === 2 ? '3%' : '2%' }}
                ></div>
              </div>
              <span className="text-sm text-gray-600 w-10">
                {rating === 5 ? '70%' : rating === 4 ? '20%' : rating === 3 ? '5%' : rating === 2 ? '3%' : '2%'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Feedback */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Feedback</h2>

        <div className="space-y-6">
          {feedbacks.map((feedback) => (
            <div key={feedback.id} className="pb-6 border-b border-gray-200 last:border-0 last:pb-0">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-medium text-gray-800">{feedback.name}</h3>
                  <div className="flex items-center space-x-2">
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${i < feedback.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                        />
                      ))}
                    </div>
                    <span className="text-gray-500 text-sm">{feedback.date}</span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button className="p-1.5 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                    <ThumbsUp className="w-4 h-4 text-gray-600" />
                  </button>
                  <button className="p-1.5 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                    <ThumbsDown className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>
              <p className="text-gray-600 text-sm">{feedback.comment}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 text-center">
          <button className="border border-gray-300 px-8 py-3 rounded-lg font-medium hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-colors shadow-sm">
            See All Feedback
          </button>
        </div>
      </div>

      {/* Feedback Prompt */}
      <div className="mt-8 text-center text-gray-500">
        Do you like our profile experience?
        <button className="ml-2 hover:text-gray-700">👍</button>
        <button className="ml-1 hover:text-gray-700">👎</button>
      </div>
    </div>
    </div>
  );
}