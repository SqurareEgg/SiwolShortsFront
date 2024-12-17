import React from 'react';

const PostItem = ({ post, onClick }) => {
  return (
    <button
      onClick={() => onClick(post)}
      className="w-full p-3 bg-gray-600 rounded-lg hover:bg-gray-500
                transition-colors duration-200 text-left"
    >
      <div className="text-sm font-medium text-white break-words">
        {post.title}
      </div>
      <div className="flex items-center mt-2 space-x-2 text-xs text-gray-300">
        <span className="bg-gray-700 px-2 py-0.5 rounded-full">
          {post.community}
        </span>
        <span>조회 {post.views}</span>
        <span>{post.date}</span>
      </div>
    </button>
  );
};

export default PostItem;