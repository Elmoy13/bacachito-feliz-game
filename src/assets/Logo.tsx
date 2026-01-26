const Logo = ({ className = "", size = 200 }: { className?: string; size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 512 512"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Bottle outline */}
    <path
      d="M342 161H354V207C354 207 395 220 420 280C445 340 420 460 420 460H92S67 340 92 280C117 220 158 207 158 207V161H170"
      stroke="currentColor"
      strokeWidth="24"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    
    {/* Bottle cap */}
    <rect
      x="192"
      y="90"
      width="128"
      height="71"
      rx="12"
      stroke="currentColor"
      strokeWidth="24"
      fill="none"
    />
    
    {/* Cap detail lines */}
    <line
      x1="205"
      y1="115"
      x2="307"
      y2="115"
      stroke="currentColor"
      strokeWidth="16"
      strokeLinecap="round"
    />
    <line
      x1="205"
      y1="138"
      x2="307"
      y2="138"
      stroke="currentColor"
      strokeWidth="16"
      strokeLinecap="round"
    />
    
    {/* Happy face - Eyes */}
    <circle cx="210" cy="265" r="18" fill="currentColor" />
    <circle cx="302" cy="265" r="18" fill="currentColor" />
    
    {/* Happy face - Smile */}
    <path
      d="M190 330C190 330 220 375 256 375C292 375 322 330 322 330"
      stroke="currentColor"
      strokeWidth="20"
      strokeLinecap="round"
      fill="none"
    />
    
    {/* Liquid level */}
    <path
      d="M130 380C130 380 160 390 256 390C352 390 382 380 382 380V450H130V380Z"
      fill="currentColor"
      opacity="0.2"
    />
  </svg>
);

export default Logo;
