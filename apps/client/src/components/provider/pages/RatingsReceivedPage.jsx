import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Star } from 'lucide-react';

// Mock data based on the image provided
const ratingsSummary = {
  average: 4.8,
  total: 54,
  distribution: [
    { stars: 5, count: 42 },
    { stars: 4, count: 9 },
    { stars: 3, count: 2 },
    { stars: 2, count: 1 },
    { stars: 1, count: 0 },
  ],
};

const recentRatings = [
  {
    initial: 'P',
    name: 'Priya Sharma',
    service: 'Logo Design',
    rating: 5,
    date: 'Jun 8, 2026',
    comment: 'Absolutely fantastic work! Delivered ahead of schedule and the quality exceeded expectations.',
    color: 'bg-green-500',
  },
  {
    initial: 'R',
    name: 'Rahul Mehta',
    service: 'Web Development',
    rating: 5,
    date: 'Jun 3, 2026',
    comment: 'Very professional and responsive. Will definitely hire again for future projects.',
    color: 'bg-orange-500',
  },
  {
    initial: 'A',
    name: 'Anjali Verma',
    service: 'Content Writing',
    rating: 4,
    date: 'May 28, 2026',
    comment: 'Great work overall. Minor revisions were needed but handled promptly.',
    color: 'bg-blue-500',
  },
  {
    initial: 'K',
    name: 'Kiran Patel',
    service: 'SEO Audit',
    rating: 5,
    date: 'May 19, 2026',
    comment: 'Thorough, detailed, and delivered exactly what was promised. Highly recommend.',
    color: 'bg-purple-500',
  },
  {
    initial: 'S',
    name: 'Sneha Iyer',
    service: 'UI/UX Design',
    rating: 4,
    date: 'May 10, 2026',
    comment: 'Good communication throughout. The final output was clean and well-structured.',
    color: 'bg-pink-500',
  },
  {
    initial: 'A',
    name: 'Arjun Nair',
    service: 'Video Editing',
    rating: 3,
    date: 'Apr 29, 2026',
    comment: 'Decent work but took longer than expected. Quality was acceptable.',
    color: 'bg-yellow-500',
  },
];

const StarRating = ({ rating, size = 16 }) => (
  <div className="flex items-center">
    {[...Array(5)].map((_, i) => (
      <Star
        key={i}
        size={size}
        className={i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 fill-gray-300'}
      />
    ))}
  </div>
);

const RatingsReceivedPage = () => {
  const navigate = useNavigate();
  const maxCount = Math.max(...ratingsSummary.distribution.map(d => d.count));

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="max-w-2xl mx-auto p-4 sm:p-6">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-gray-900 mb-6">
          <ArrowLeft size={18} />
          Back
        </button>

        <header className="mb-8">
          <h1 className="text-3xl font-medium text-gray-900">Ratings Received</h1>
          <p className="text-gray-500 mt-1">All ratings from your clients</p>
        </header>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 mb-8">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="flex-shrink-0 text-center">
              <p className="text-6xl font-bold text-gray-800">{ratingsSummary.average.toFixed(1)}</p>
              <div className="flex justify-center mt-1">
                <StarRating rating={Math.round(ratingsSummary.average)} size={20} />
              </div>
              <p className="text-sm text-gray-500 mt-2">{ratingsSummary.total} ratings</p>
            </div>
            <div className="w-full flex-1">
              <div className="space-y-2">
                {ratingsSummary.distribution.map(item => (
                  <div key={item.stars} className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-600">{item.stars}</span>
                    <Star size={14} className="text-yellow-400 fill-yellow-400" />
                    <div className="flex-1 bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-yellow-400 h-2.5 rounded-full"
                        style={{ width: `${(item.count / maxCount) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-600 w-8 text-right">{item.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-sm font-medium uppercase tracking-wider text-gray-500 mb-4">Recent Ratings</h2>
          <div className="space-y-4">
            {recentRatings.map((review, index) => (
              <div key={index} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${review.color}`}>
                      {review.initial}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{review.name}</p>
                      <p className="text-sm text-gray-500">{review.service}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <StarRating rating={review.rating} />
                    <p className="text-xs text-gray-400 mt-1">{review.date}</p>
                  </div>
                </div>
                <p className="text-gray-600 leading-relaxed">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RatingsReceivedPage;