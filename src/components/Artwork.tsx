import { useId } from 'react';

export function BrandMark({ small = false }: { small?: boolean }) {
  const id = useId();
  return (
    <svg
      className="brand-mark"
      width={small ? 30 : 36}
      height={small ? 33 : 39}
      viewBox="0 0 39 43"
      fill="none"
      aria-hidden="true"
      data-uid={id}
    >
      <path d="m7 5 19-4 7 29-23 5z" fill="#203B5A" />
      <path d="m11 5 20 1 3 30-23-1z" fill="#A4B8D0" />
      <path d="M3 10.5a2 2 0 0 1 2-2h21l1 8v23a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" fill="#F16B4F" />
      <path d="M26 8.5v8h8" fill="#FFB6A3" />
      <path
        d="M10 20h12M10 25h17M10 30h12"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {/* Indian Flag Strip */}
      <rect x="6" y="34" width="27" height="2.2" fill="#FF9933" />
      <rect x="6" y="36.2" width="27" height="2.2" fill="#FFFFFF" />
      <rect x="6" y="38.4" width="27" height="2.2" fill="#138808" />
      <circle cx="19.5" cy="37.3" r="0.9" fill="#000080" />
    </svg>
  );
}

function Portrait({ id }: { id: string }) {
  return (
    <span data-portrait={id} />
  );
}
