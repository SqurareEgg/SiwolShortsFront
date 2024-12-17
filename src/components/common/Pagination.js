import React from 'react';

export const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pageGroup = Math.floor(currentPage / 5);
  const startPage = pageGroup * 5;
  const endPage = Math.min(startPage + 5, totalPages);

  return (
    <div className="mt-auto pt-3">
      <div className="flex justify-center items-center space-x-1">
        <button
          onClick={() => onPageChange(Math.max(0, currentPage - 5))}
          disabled={currentPage === 0}
          className="px-2 py-1 border border-gray-500 rounded text-sm hover:bg-gray-600 disabled:bg-gray-600 text-white"
        >
          {"<<"}
        </button>
        {[...Array(endPage - startPage)].map((_, i) => {
          const pageNum = startPage + i;
          return (
            <button
              key={pageNum}
              onClick={() => onPageChange(pageNum)}
              className={`px-3 py-1 border border-gray-500 rounded text-sm hover:bg-gray-600 text-white ${
                pageNum === currentPage ? 'bg-gray-600' : ''
              }`}
            >
              {pageNum + 1}
            </button>
          );
        })}
        <button
          onClick={() => onPageChange(Math.min(totalPages - 1, currentPage + 1))}
          disabled={currentPage >= totalPages - 1}
          className="px-2 py-1 border border-gray-500 rounded text-sm hover:bg-gray-600 disabled:bg-gray-600 text-white"
        >
          {">"}
        </button>
        <button
          onClick={() => onPageChange(Math.min(totalPages - 1, (pageGroup + 1) * 5))}
          disabled={currentPage >= totalPages - 1}
          className="px-2 py-1 border border-gray-500 rounded text-sm hover:bg-gray-600 disabled:bg-gray-600 text-white"
        >
          {">>"}
        </button>
      </div>
      <div className="text-center text-sm text-gray-300 mt-2">
        페이지: {currentPage + 1} / {totalPages}
      </div>
    </div>
  );
};