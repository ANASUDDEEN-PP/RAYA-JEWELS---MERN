import React, { useState } from "react";
import { MessageCircle, Send, ThumbsUp, Star, Loader2 } from "lucide-react";

const CommentsSection = ({
  comments = [],
  newComment = "",
  setNewComment,
  handleAddComment,
  likedComments = new Set(),
  isLoading = false,
  rating = 0,
  setRating,
  hoverRating = 0,
  setHoverRating
}) => {
  const [showAllComments, setShowAllComments] = useState(false);

  // Sort comments by date (newest first)
  const sortedComments = [...comments].sort((a, b) =>
    new Date(b.date) - new Date(a.date)
  );

  // Display either all comments or first 3
  const displayedComments = showAllComments
    ? sortedComments
    : sortedComments.slice(0, 3);

  return (
    <div className="border-t border-gray-200 pt-8 px-8 pb-4">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <MessageCircle className="h-6 w-6 mr-2" />
            Customer Reviews ({comments.length})
          </h2>
          {comments.length > 3 && (
            <button
              onClick={() => setShowAllComments(!showAllComments)}
              className="text-sm font-medium text-yellow-600 hover:text-yellow-700"
            >
              {showAllComments ? 'Show Less' : 'Show All Reviews'}
            </button>
          )}
        </div>

        {/* Add Comment Form */}
        <div className="bg-gray-50 rounded-xl p-6 mb-8">
          <h3 className="font-semibold text-lg mb-4">Share Your Experience</h3>
          <div className="space-y-4">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="What did you think of this product? Would you recommend it?"
              className="w-full p-3 border border-gray-300 rounded-lg resize-none h-28 focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none transition-all"
              disabled={isLoading}
            />

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Your Rating:</span>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="focus:outline-none"
                    >
                      <Star
                        className={`h-6 w-6 transition-colors ${star <= (hoverRating || rating)
                            ? "text-yellow-400 fill-current"
                            : "text-gray-300"
                          }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleAddComment}
                disabled={isLoading || !newComment.trim() || rating === 0}
                className={`px-6 py-2 rounded-lg font-medium flex items-center space-x-2 transition-all ${isLoading || !newComment.trim() || rating === 0
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-yellow-500 hover:bg-yellow-600 text-black"
                  }`}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Posting...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    <span>Submit Review</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Comments List */}
        {displayedComments.length > 0 ? (
          <div className="space-y-6">
            {displayedComments.map((comment) => (
              <div
                key={comment._id || comment.id}
                className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-sm transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <img
                    src={comment.Avatar}
                    alt={comment.UserId}
                    className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                  />

                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                      <h4 className="font-semibold text-gray-900">
                        {comment.UserId}
                      </h4>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        {(comment.Date)}
                      </div>
                    </div>

                    <div className="flex items-center mb-3">
                      <div className="flex mr-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-4 w-4 ${star <= (comment.Rating || 0)
                                ? "text-yellow-400 fill-current"
                                : "text-gray-300"
                              }`}
                          />
                        ))}
                      </div>
                    </div>

                    <p className="text-gray-700 mb-4 leading-relaxed">
                      {comment.Comment}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <MessageCircle className="mx-auto h-8 w-8 mb-2" />
            <p>No reviews yet. Be the first to share your thoughts!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentsSection;