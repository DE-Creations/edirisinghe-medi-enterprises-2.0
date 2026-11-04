import React from 'react';
import ReactPaginate from 'react-paginate';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface TablePaginationProps {
  page: number;
  lastPage: number;
  total: number;
  onPageChange: (page: number) => void;
  className?: string;
}

// react-paginate renders plain <ul><li><a> markup; it is styled here through its *ClassName props.
const pageLink =
  'inline-flex h-9 min-w-9 items-center justify-center rounded-md border border-transparent px-3 text-sm ' +
  'text-foreground transition-colors hover:bg-muted cursor-pointer select-none';

export default function TablePagination({ page, lastPage, total, onPageChange, className = '' }: TablePaginationProps) {
  if (lastPage <= 1) return null;

  return (
    <div className={`mt-4 flex flex-col items-center gap-2 sm:flex-row sm:justify-between ${className}`}>
      <span className="text-sm text-muted-foreground">
        {total} records · Page {page} of {lastPage}
      </span>
      <ReactPaginate
        forcePage={page - 1}
        pageCount={lastPage}
        onPageChange={({ selected }) => onPageChange(selected + 1)}
        marginPagesDisplayed={1}
        pageRangeDisplayed={3}
        breakLabel="…"
        previousLabel={<><ChevronLeft className="h-4 w-4" /><span>Previous</span></>}
        nextLabel={<><span>Next</span><ChevronRight className="h-4 w-4" /></>}
        renderOnZeroPageCount={null}
        disableInitialCallback
        containerClassName="flex flex-wrap items-center justify-center gap-1"
        pageClassName="list-none"
        pageLinkClassName={pageLink}
        activeLinkClassName="!border-border bg-background font-semibold shadow-sm"
        previousClassName="list-none"
        nextClassName="list-none"
        previousLinkClassName={`${pageLink} gap-1 pl-2.5 text-muted-foreground`}
        nextLinkClassName={`${pageLink} gap-1 pr-2.5 text-muted-foreground`}
        disabledClassName="pointer-events-none opacity-50"
        breakClassName="list-none"
        breakLinkClassName="inline-flex h-9 min-w-9 items-center justify-center px-2 text-muted-foreground select-none"
        ariaLabelBuilder={(p) => `Go to page ${p}`}
        previousAriaLabel="Go to previous page"
        nextAriaLabel="Go to next page"
      />
    </div>
  );
}
