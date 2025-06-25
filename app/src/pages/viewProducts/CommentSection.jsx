import React from "react";
import { MessageCircle, Send, ThumbsUp, Star } from "lucide-react";

const CommentsSection = ({
  comments,
  newComment,
  setNewComment,
  handleAddComment,
  likedComments,
  toggleLike,
}) => {
  return (
    <div className="border-t border-gray-200 p-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <MessageCircle className="h-6 w-6 mr-2" />
          Customer Reviews ({comments.length})
        </h2>

        {/* Add Comment */}
        <div className="bg-gray-50 rounded-xl p-6 mb-8">
          <h3 className="font-semibold mb-4">Write a Review</h3>
          <div className="space-y-4">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Share your experience with this product..."
              className="w-full p-3 border border-gray-300 rounded-lg resize-none h-24 focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none"
            />
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">
                  Rate this product:
                </span>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 text-yellow-400 fill-current cursor-pointer hover:scale-110 transition-transform"
                    />
                  ))}
                </div>
              </div>
              <button
                onClick={handleAddComment}
                className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-2 px-6 rounded-lg transition-colors flex items-center space-x-2"
              >
                <Send className="h-4 w-4" />
                <span>Post Review</span>
              </button>
            </div>
          </div>
        </div>

        {/* Comments List */}
        <div className="space-y-6">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start space-x-4">
                <img
                  src={comment.Avatar}
                  alt={comment.UserId}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {comment.UserId}
                      </h4>
                      <div className="flex items-center space-x-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < comment.Rating
                                  ? "text-yellow-400 fill-current"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-500">
                          {comment.date}
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-3 leading-relaxed">
                    {comment.Comment}
                  </p>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => toggleLike(comment._id)}
                      className={`flex items-center space-x-1 text-sm transition-colors ${
                        likedComments.has(comment._id)
                          ? "text-blue-600"
                          : "text-gray-500 hover:text-blue-600"
                      }`}
                    >
                      <ThumbsUp
                        className={`h-4 w-4 ${
                          likedComments.has(comment.id) ? "fill-current" : ""
                        }`}
                      />
                      <span>
                        {comment.likes +
                          (likedComments.has(comment.id) ? 1 : 0)}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CommentsSection;