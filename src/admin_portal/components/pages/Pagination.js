import React, { useState, useEffect } from "react";

const Pagination = ({
  totalItems,
  itemsPerPage,
  currentPage,
  onPageChange,
}) => {
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    setTotalPages(Math.ceil(totalItems / itemsPerPage));
  }, [totalItems, itemsPerPage]);

  const handlePageChange = (pageNumber) => {
    onPageChange(pageNumber);
  };

  return (
    <div className="pagination">
      {Array.from({ length: totalPages }, (_, index) => index + 1).map(
        (pageNumber) => (
          <button
            key={pageNumber}
            className={pageNumber === currentPage ? "active" : ""}
            onClick={() => handlePageChange(pageNumber)}
          >
            {pageNumber}
          </button>
        )
      )}
    </div>
  );
};

export default Pagination;
