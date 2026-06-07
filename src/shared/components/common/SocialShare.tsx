"use client";

interface SocialShareProps {
  url: string;
  title: string;
  labels: {
    copy: string;
    facebook: string;
    email: string;
  };
}

export function SocialShare({ url, title, labels }: SocialShareProps) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  async function copyLink() {
    await navigator.clipboard.writeText(url);
  }

  function openShareWindow(href: string) {
    window.open(href, "_blank", "noopener,noreferrer,width=640,height=640");
  }

  const shareItems = [
    {
      key: "copy",
      label: labels.copy,
      className: "text-primary",
      icon: (
        <path
          d="M9 9.75A2.25 2.25 0 0 1 11.25 7.5h7.5A2.25 2.25 0 0 1 21 9.75v7.5a2.25 2.25 0 0 1-2.25 2.25h-7.5A2.25 2.25 0 0 1 9 17.25v-7.5Zm-6 3A2.25 2.25 0 0 1 5.25 10.5h.75v6.75A3.75 3.75 0 0 0 9.75 21h6.75v.75A2.25 2.25 0 0 1 14.25 24h-9A2.25 2.25 0 0 1 3 21.75v-9Z"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.8"
        />
      ),
      type: "stroke" as const,
      action: copyLink,
    },
    {
      key: "x",
      label: "X",
      className: "text-black",
      icon: (
        <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.847h-7.406l-5.8-7.584-6.64 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932 6.064-6.933Zm-1.291 19.492h2.039L6.486 3.248H4.298L17.61 20.645Z" />
      ),
      type: "fill" as const,
      action: () =>
        openShareWindow(
          `https://x.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
        ),
    },
    {
      key: "linkedin",
      label: "LinkedIn",
      className: "text-[#0A66C2]",
      icon: (
        <path d="M4.983 3.5C4.983 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.113 1 2.5 1s2.483 1.12 2.483 2.5ZM.5 8h4V23h-4V8Zm6.5 0h3.833v2.047h.054C11.42 9.033 12.72 7.5 15.41 7.5 21 7.5 22 11.127 22 15.854V23h-4v-6.327c0-1.509-.027-3.449-2.101-3.449-2.104 0-2.426 1.643-2.426 3.34V23h-4V8Z" />
      ),
      type: "fill" as const,
      action: () =>
        openShareWindow(
          `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
        ),
    },
    {
      key: "facebook",
      label: labels.facebook,
      className: "text-[#1877F2]",
      icon: (
        <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073c0 6.019 4.388 11.009 10.125 11.927v-8.437H7.078v-3.49h3.047V9.413c0-3.021 1.792-4.688 4.533-4.688 1.313 0 2.686.235 2.686.235v2.969H15.83c-1.491 0-1.956.931-1.956 1.887v2.257h3.328l-.532 3.49h-2.796V24C19.612 23.082 24 18.092 24 12.073Z" />
      ),
      type: "fill" as const,
      action: () =>
        openShareWindow(
          `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
        ),
    },
    {
      key: "email",
      label: labels.email,
      className: "text-[#EA4335]",
      icon: (
        <path
          d="M3.75 6.75h16.5A1.5 1.5 0 0 1 21.75 8.25v7.5a1.5 1.5 0 0 1-1.5 1.5H3.75a1.5 1.5 0 0 1-1.5-1.5v-7.5a1.5 1.5 0 0 1 1.5-1.5Zm0 .75 8.25 5.625L20.25 7.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.8"
        />
      ),
      type: "stroke" as const,
      action: () => {
        window.location.href = `mailto:?subject=${encodedTitle}&body=${encodedUrl}`;
      },
    },
  ];

  return (
    <div className="flex flex-wrap items-center gap-3">
      {shareItems.map((item) => (
        <button
          key={item.key}
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-white text-sm font-medium text-gray-600 transition hover:border-primary hover:bg-primary-subtle"
          aria-label={item.label}
          title={item.label}
          onClick={item.action}
        >
          <svg
            className={`h-4 w-4 shrink-0 ${item.className}`}
            viewBox="0 0 24 24"
            fill={item.type === "fill" ? "currentColor" : "none"}
            stroke={item.type === "stroke" ? "currentColor" : "none"}
            aria-hidden="true"
          >
            {item.icon}
          </svg>
        </button>
      ))}
    </div>
  );
}
