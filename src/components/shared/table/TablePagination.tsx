import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TablePaginationProps {
  pageIndex: number;
  pageSize: number;
  pageCount: number;
  totalItems: number;
  onPageChange: (pageIndex: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  pageSizeOptions?: number[];
}

const DEFAULT_PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

const createPageRange = (currentPage: number, pageCount: number) => {
  const siblings = 1;
  const totalPageNumbers = siblings * 2 + 5;

  if (pageCount <= totalPageNumbers) {
    return Array.from({ length: pageCount }, (_, index) => index + 1);
  }

  const leftSiblingIndex = Math.max(currentPage - siblings, 1);
  const rightSiblingIndex = Math.min(currentPage + siblings, pageCount);

  const shouldShowLeftDots = leftSiblingIndex > 2;
  const shouldShowRightDots = rightSiblingIndex < pageCount - 1;

  const firstPageIndex = 1;
  const lastPageIndex = pageCount;

  if (!shouldShowLeftDots && shouldShowRightDots) {
    const leftItemCount = 3 + 2 * siblings;
    const leftRange = Array.from({ length: leftItemCount }, (_, index) => index + 1);

    return [...leftRange, "...", lastPageIndex];
  }

  if (shouldShowLeftDots && !shouldShowRightDots) {
    const rightItemCount = 3 + 2 * siblings;
    const rightRange = Array.from(
      { length: rightItemCount },
      (_, index) => pageCount - rightItemCount + index + 1
    );

    return [firstPageIndex, "...", ...rightRange];
  }

  if (shouldShowLeftDots && shouldShowRightDots) {
    return [
      firstPageIndex,
      "...",
      leftSiblingIndex,
      currentPage,
      rightSiblingIndex,
      "...",
      lastPageIndex,
    ];
  }

  return Array.from({ length: pageCount }, (_, index) => index + 1);
};

const TablePagination = ({
  pageIndex,
  pageSize,
  pageCount,
  totalItems,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
}: TablePaginationProps) => {
  const [customSize, setCustomSize] = useState("");
  const [dropdownValue, setDropdownValue] = useState<string>(String(pageSize));

  const effectiveDropdownValue = dropdownValue === "custom" ? "custom" : String(pageSize);
  const pageNumber = pageIndex + 1;

  const pages = useMemo(
    () => createPageRange(pageNumber, pageCount),
    [pageCount, pageNumber]
  );

  const handleCustomSizeSubmit = () => {
    const parsed = Number(customSize);
    if (!Number.isNaN(parsed) && parsed > 0) {
      onPageSizeChange(parsed);
      setDropdownValue(String(parsed));
      setCustomSize("");
    }
  };

  return (
    <div className="mt-4 flex  gap-4 rounded-lg bg-secondary/20">
      <div className="w-full flex min-w-0 flex-nowrap items-center gap-2 overflow-x-auto  px-2 py-2">
        <Button
          variant="secondary"
          size="sm"
          disabled={pageIndex === 0}
          onClick={() => onPageChange(0)}
        >
          First
        </Button>
        <Button
          variant="secondary"
          size="sm"
          disabled={pageIndex === 0}
          onClick={() => onPageChange(Math.max(pageIndex - 1, 0))}
        >
          Prev
        </Button>

        {pages.map((page, pageIndex) =>
          page === "..." ? (
            <span key={`ellipsis-${pageIndex}`} className="px-2 text-sm text-muted-foreground">
              {page}
            </span>
          ) : (
            <Button
              key={`page-${page}`}
              variant={pageNumber === page ? "default" : "outline"}
              size="sm"
              onClick={() => onPageChange(Number(page) - 1)}
              className={pageNumber === page ? "font-semibold" : ""}
            >
              {page}
            </Button>
          )
        )}

        <Button
          variant="secondary"
          size="sm"
          disabled={pageIndex >= pageCount - 1}
          onClick={() => onPageChange(Math.min(pageIndex + 1, pageCount - 1))}
        >
          Next
        </Button>
        <Button
          variant="secondary"
          size="sm"
          disabled={pageIndex >= pageCount - 1}
          onClick={() => onPageChange(pageCount - 1)}
        >
          Last
        </Button>
      </div>

      <div className="w-full flex flex-wrap  justify-end gap-3  px-3 py-3">
        <div className="flex min-w-0 flex-wrap items-center gap-2 sm:flex-nowrap">
          
          <Select value={effectiveDropdownValue} onValueChange={(value) => {
            if (value === null) {
              return;
            }
            if (value === "custom") {
              setCustomSize("");
              setDropdownValue(value);
              return;
            }
            setDropdownValue(value);
            onPageSizeChange(Number(value));
          }}>
            <SelectTrigger className="w-28" size="sm">
              <SelectValue placeholder={dropdownValue} />
            </SelectTrigger>
            <SelectContent>
              {pageSizeOptions.map((size) => (
                <SelectItem key={size} value={String(size)}>
                  {size}
                </SelectItem>
              ))}
              <SelectItem key="custom" value="custom">
                Custom
              </SelectItem>
            </SelectContent>
          </Select>
          <span className="text-sm text-muted-foreground">rows</span>
          {dropdownValue === "custom" && (
            <div className="flex flex-wrap items-center gap-2 sm:flex-nowrap">
              <Input
                type="number"
                value={customSize}
                onChange={(event) => setCustomSize(event.target.value)}
                placeholder="Custom"
                className="w-24"
                min={1}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    handleCustomSizeSubmit();
                  }
                }}
              />
              <Button variant="secondary" size="sm" onClick={handleCustomSizeSubmit}>
                Apply
              </Button>
            </div>
          )}
        </div>

        <div className="flex min-w-0 flex-wrap items-center gap-2 whitespace-nowrap sm:flex-nowrap">
          <span className="truncate text-sm text-muted-foreground">
            Page {pageNumber} of {pageCount}
          </span>
         
          <span className="text-sm text-muted-foreground">|</span>
          <span className="truncate text-sm text-muted-foreground">Total: {totalItems}</span>
        </div>
      </div>
    </div>
  );
};

export default TablePagination;
