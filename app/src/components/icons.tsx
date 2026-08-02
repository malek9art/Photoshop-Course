/**
 * Hand-rolled icon set (zero dependencies, tree-shakeable, currentColor).
 * Replaces emoji-as-iconography with a coherent, premium 24px stroke system.
 * All icons are decorative by default (aria-hidden) — label the parent.
 */

type IconProps = {
  className?: string;
  strokeWidth?: number;
};

function Svg({
  className = "h-5 w-5",
  strokeWidth = 1.7,
  children,
}: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {children}
    </svg>
  );
}

export const HomeIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M3.6 10.4 12 3.8l8.4 6.6V19a1.6 1.6 0 0 1-1.6 1.6h-3.6v-6H9.8v6H5.2A1.6 1.6 0 0 1 3.6 19Z" />
  </Svg>
);

export const LibraryIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 5.2A1.6 1.6 0 0 1 5.6 3.6H10a2 2 0 0 1 2 2v13a2 2 0 0 0-2-2H5.6A1.6 1.6 0 0 1 4 15V5.2Z" />
    <path d="M20 5.2a1.6 1.6 0 0 0-1.6-1.6H14a2 2 0 0 0-2 2v13a2 2 0 0 1 2-2h4.4A1.6 1.6 0 0 0 20 15Z" />
  </Svg>
);

export const CertificateIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="9.4" r="5.4" />
    <path d="m8.6 14 -1 6.4 4.4-2.2 4.4 2.2-1-6.4" />
  </Svg>
);

export const ProjectIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 7.6a2 2 0 0 1 2-2h3l1.6 2H18a2 2 0 0 1 2 2v6.8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z" />
    <path d="M4 11h16" />
  </Svg>
);

export const AdminIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 20V10.6M9.4 20V4.6M14.8 20v-8.4M20.2 20V7.4" />
  </Svg>
);

export const UserIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="8.2" r="3.8" />
    <path d="M4.8 20a7.2 7.2 0 0 1 14.4 0" />
  </Svg>
);

export const SearchIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="11" cy="11" r="6.4" />
    <path d="m16 16 4 4" />
  </Svg>
);

export const CheckIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="m5 12.6 4.4 4.4L19 7.4" />
  </Svg>
);

export const CheckCircleIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="8.6" />
    <path d="m8.2 12.3 2.6 2.6 5-5.2" />
  </Svg>
);

export const AlertIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="8.6" />
    <path d="M12 7.8v4.8M12 16.1v.1" />
  </Svg>
);

export const InfoIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="8.6" />
    <path d="M12 11.2v5M12 7.9v.1" />
  </Svg>
);

export const XIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M6.4 6.4 17.6 17.6M17.6 6.4 6.4 17.6" />
  </Svg>
);

export const ArrowLeftIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M19 12H5.4M11 5.6 4.8 12l6.2 6.4" />
  </Svg>
);

export const ArrowRightIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M5 12h13.6M13 5.6 19.2 12 13 18.4" />
  </Svg>
);

export const ChevronLeftIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M14.6 5.8 8.4 12l6.2 6.2" />
  </Svg>
);

export const ChevronRightIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="m9.4 5.8 6.2 6.2-6.2 6.2" />
  </Svg>
);

export const ChevronDownIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="m5.8 9.4 6.2 6.2 6.2-6.2" />
  </Svg>
);

export const MenuIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </Svg>
);

export const ClockIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="8.6" />
    <path d="M12 7.4V12l3 1.8" />
  </Svg>
);

export const SparkIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 3.4 13.9 9l5.6 1.9-5.6 1.9L12 18.4 10.1 12.8 4.5 10.9 10.1 9Z" />
    <path d="M18.6 3.4v3M20.1 4.9h-3" />
  </Svg>
);

export const QuizIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M6.2 3.8h11.6a1.4 1.4 0 0 1 1.4 1.4v13.6a1.4 1.4 0 0 1-1.4 1.4H6.2a1.4 1.4 0 0 1-1.4-1.4V5.2a1.4 1.4 0 0 1 1.4-1.4Z" />
    <path d="M8.6 9h6.8M8.6 13h4.4" />
  </Svg>
);

export const ExamIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M8 4.2h8.4a2 2 0 0 1 2 2v13.6H8a2 2 0 0 1-2-2V6.2a2 2 0 0 1 2-2Z" />
    <path d="M6 17.4h12.4M10 8.4h5M10 12h3" />
  </Svg>
);

export const BookIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M5 5.4a1.8 1.8 0 0 1 1.8-1.8H18v14.8H6.8A1.8 1.8 0 0 0 5 20.2Z" />
    <path d="M5 18.4a1.8 1.8 0 0 1 1.8-1.8H18" />
  </Svg>
);

export const LockIcon = (p: IconProps) => (
  <Svg {...p}>
    <rect x="4.8" y="10.4" width="14.4" height="9.4" rx="2.2" />
    <path d="M8.4 10.4V7.8a3.6 3.6 0 0 1 7.2 0v2.6" />
  </Svg>
);

export const LogoutIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M10 4.6H6.4a1.8 1.8 0 0 0-1.8 1.8v11.2a1.8 1.8 0 0 0 1.8 1.8H10" />
    <path d="M15 8.4 18.8 12 15 15.6M18.4 12H9.2" />
  </Svg>
);

export const TrendIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="m4 15.6 5-5 3.4 3.4L20 6.6" />
    <path d="M15.4 6.6H20v4.6" />
  </Svg>
);

export const UsersIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="9.4" cy="8.4" r="3.4" />
    <path d="M3.6 19.4a5.8 5.8 0 0 1 11.6 0" />
    <path d="M16.2 5.4a3.4 3.4 0 0 1 0 6.6M17.6 14.6a5.6 5.6 0 0 1 2.8 4.8" />
  </Svg>
);

export const InboxIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 13.4 6 5.6h12l2 7.8v4.4a1.6 1.6 0 0 1-1.6 1.6H5.6A1.6 1.6 0 0 1 4 17.8Z" />
    <path d="M4 13.4h4.2l1.2 2.4h5.2l1.2-2.4H20" />
  </Svg>
);

export const CompassIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="8.6" />
    <path d="m14.8 9.2-1.4 4.2-4.2 1.4 1.4-4.2Z" />
  </Svg>
);

export const ShieldCheckIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 3.6 5.4 6v5.4c0 4 2.8 7.6 6.6 9 3.8-1.4 6.6-5 6.6-9V6Z" />
    <path d="m9.2 12 2 2 3.6-3.8" />
  </Svg>
);

export const PlayIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M8.6 5.8 18 12l-9.4 6.2Z" />
  </Svg>
);

export const HeadphonesIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4.4 13v-1a7.6 7.6 0 0 1 15.2 0v1" />
    <path d="M4.4 13a2.2 2.2 0 0 0-2.2 2.2v2A2.2 2.2 0 0 0 4.4 19.4h1.2a1 1 0 0 0 1-1v-4.4a1 1 0 0 0-1-1Z" />
    <path d="M19.6 13a2.2 2.2 0 0 1 2.2 2.2v2a2.2 2.2 0 0 1-2.2 2.2h-1.2a1 1 0 0 1-1-1v-4.4a1 1 0 0 1 1-1Z" />
  </Svg>
);

export const LayersIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="m12 3.8 8 4.2-8 4.2-8-4.2Z" />
    <path d="m4 12.4 8 4.2 8-4.2M4 16.6l8 4.2 8-4.2" />
  </Svg>
);
