import Link from "next/link";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  makeHref: (page: number) => string;
}

export function Pagination({ currentPage, totalPages, makeHref }: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="mt-10 flex items-center justify-center gap-3 text-sm font-semibold text-text-secondary">
      {currentPage > 1 ? (
        <Link
          href={makeHref(currentPage - 1)}
          className="inline-flex min-h-11 items-center rounded-full border border-black/10 bg-white px-4 text-text-primary"
        >
          이전
        </Link>
      ) : (
        <span className="inline-flex min-h-11 items-center rounded-full border border-black/5 bg-white px-4 opacity-50">
          이전
        </span>
      )}

      <span className="inline-flex min-h-11 items-center rounded-full bg-ivory-warm px-4 text-text-primary">
        {currentPage} / {totalPages}
      </span>

      {currentPage < totalPages ? (
        <Link
          href={makeHref(currentPage + 1)}
          className="inline-flex min-h-11 items-center rounded-full border border-black/10 bg-white px-4 text-text-primary"
        >
          다음
        </Link>
      ) : (
        <span className="inline-flex min-h-11 items-center rounded-full border border-black/5 bg-white px-4 opacity-50">
          다음
        </span>
      )}
    </div>
  );
}
