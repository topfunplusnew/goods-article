"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface SearchBarProps {
  searchPlaceholder: string;
  searchButtonLabel: string;
  className?: string;
}

export function SearchBar({
  searchPlaceholder,
  searchButtonLabel,
  className,
}: SearchBarProps) {
  const router = useRouter();
  const [searchKeyword, setSearchKeyword] = useState("");

  return (
    <form
      className={className ? `relative ${className}` : "relative"}
      onSubmit={(event) => {
        event.preventDefault();
        const keyword = searchKeyword.trim();

        if (!keyword) {
          router.push("/article/search");
          return;
        }

        router.push(`/article/search?q=${encodeURIComponent(keyword)}`);
      }}
    >
      <div className="relative flex items-center rounded-md border border-border bg-white shadow-sm transition focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/15">
        <svg
          className="pointer-events-none absolute left-4 h-5 w-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>

        <input
          value={searchKeyword}
          onChange={(event) => setSearchKeyword(event.target.value)}
          type="search"
          placeholder={searchPlaceholder}
          className="h-[48px] w-full bg-transparent pl-12 pr-[118px] text-sm text-gray-700 outline-none placeholder:text-gray-400"
        />

        <button
          type="submit"
          className="absolute right-1.5 inline-flex h-[38px] min-w-[92px] items-center justify-center rounded-[4px] bg-primary px-4 text-sm font-semibold text-white transition hover:bg-primary-light"
        >
          {searchButtonLabel}
        </button>
      </div>
    </form>
  );
}
