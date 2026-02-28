export default function RupeeIcon({ size = 18, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="currentColor"
      className={`rupee-icon ${className}`}
      aria-hidden="true"
    >
      <path d="M17 4H7v2h3.74a4.22 4.22 0 0 1 3.86 2H7v2h7.2a4.22 4.22 0 0 1-3.46 2.4H7v1.2l6.4 6.4 1.4-1.4L10 13.2a6.22 6.22 0 0 0 5.16-3.2H17v-2h-1.37A6.15 6.15 0 0 0 15.5 6H17V4Z" />
    </svg>
  )
}
