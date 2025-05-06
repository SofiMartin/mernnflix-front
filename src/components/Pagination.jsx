// components/Pagination.jsx
import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;

    pageNumbers.push(1);

    let startPage = Math.max(2, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages - 1, startPage + maxPagesToShow - 3);

    if (startPage > 2) pageNumbers.push('...');
    for (let i = startPage; i <= endPage; i++) pageNumbers.push(i);
    if (endPage < totalPages - 1) pageNumbers.push('...');
    if (totalPages > 1) pageNumbers.push(totalPages);

    return pageNumbers;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center mt-8">
      <nav className="flex items-center space-x-1">
        {/* Botón Anterior */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-3 py-2 rounded-md ${
            currentPage === 1
              ? 'text-gray-500 cursor-not-allowed'
              : 'text-white hover:bg-gray-700'
          }`}
        >
          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </button>

        {/* Números de página */}
        {getPageNumbers().map((page, index) => (
          <button
            key={index}
            onClick={() => typeof page === 'number' ? onPageChange(page) : null}
            disabled={page === '...'}
            className={`px-4 py-2 rounded-md ${
              currentPage === page
                ? 'bg-purple-600 text-white'
                : page === '...'
                  ? 'text-gray-500 cursor-default'
                  : 'text-white hover:bg-gray-700'
            }`}
          >
            {page}
          </button>
        ))}

        {/* Botón Siguiente */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-3 py-2 rounded-md ${
            currentPage === totalPages
              ? 'text-gray-500 cursor-not-allowed'
              : 'text-white hover:bg-gray-700'
          }`}
        >
          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        </button>
      </nav>
    </div>
  );
};

export default Pagination;