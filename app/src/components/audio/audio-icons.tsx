/**
 * Audio icon set — dependency-free, consistent with the app's 24px stroke
 * system. Decorative by default (aria-hidden); label the parent control.
 */
type IconProps = { className?: string };

function Svg({ className = "h-5 w-5", children }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
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

/** Filled play triangle (big transport button). */
export const PlaySolidIcon = ({ className = "h-5 w-5" }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true" focusable="false">
    <path d="M8.6 5.4 18.4 12 8.6 18.6Z" fill="currentColor" />
  </svg>
);

/** Filled pause bars (big transport button). */
export const PauseSolidIcon = ({ className = "h-5 w-5" }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true" focusable="false">
    <rect x="6.4" y="4.6" width="3.8" height="14.8" rx="1.4" fill="currentColor" />
    <rect x="13.8" y="4.6" width="3.8" height="14.8" rx="1.4" fill="currentColor" />
  </svg>
);

export const StopIcon = (p: IconProps) => (
  <Svg {...p}>
    <rect x="6" y="6" width="12" height="12" rx="2.2" />
  </Svg>
);

export const Replay10Icon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4.8 12a7.2 7.2 0 1 1 2.1 5.1" />
    <path d="M4.8 12V6.8M2.4 9.2 4.8 6.8 7.2 9.2" />
    <path d="M9.4 15.4v-5.2l-1.5 1" />
    <path d="M13.2 10.4c.5 0 1.1.1 1.4.6.4.5.5 1.6.5 2.4s-.1 1.9-.5 2.4c-.3.5-.9.6-1.4.6s-1.1-.1-1.4-.6c-.4-.5-.5-1.6-.5-2.4s.1-1.9.5-2.4c.3-.5.9-.6 1.4-.6Z" />
  </Svg>
);

export const Forward10Icon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M19.2 12a7.2 7.2 0 1 0-2.1 5.1" />
    <path d="M19.2 12V6.8M21.6 9.2 19.2 6.8 16.8 9.2" />
    <path d="M9.4 15.4v-5.2l-1.5 1" />
    <path d="M13.2 10.4c.5 0 1.1.1 1.4.6.4.5.5 1.6.5 2.4s-.1 1.9-.5 2.4c-.3.5-.9.6-1.4.6s-1.1-.1-1.4-.6c-.4-.5-.5-1.6-.5-2.4s.1-1.9.5-2.4c.3-.5.9-.6 1.4-.6Z" />
  </Svg>
);

export const VolumeIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4.4 9.4h2.8l4-3.6v12.4l-4-3.6H4.4a1 1 0 0 1-1-1v-3.2a1 1 0 0 1 1-1Z" />
    <path d="M15.4 9.2a3.8 3.8 0 0 1 0 5.6M17.8 6.9a7.2 7.2 0 0 1 0 10.2" />
  </Svg>
);

export const VolumeMuteIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4.4 9.4h2.8l4-3.6v12.4l-4-3.6H4.4a1 1 0 0 1-1-1v-3.2a1 1 0 0 1 1-1Z" />
    <path d="m15.2 10.2 4 4M19.2 10.2l-4 4" />
  </Svg>
);

export const SpeedIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 3.8a8.2 8.2 0 1 1-8.2 8.2" />
    <path d="M12 7.4a4.6 4.6 0 1 1-4.6 4.6" />
    <path d="M12 12 8.8 8.8M12 2.6V5" />
  </Svg>
);

export const HeadphonesIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4.4 13v-1a7.6 7.6 0 0 1 15.2 0v1" />
    <path d="M4.4 13a2.2 2.2 0 0 0-2.2 2.2v2A2.2 2.2 0 0 0 4.4 19.4h1.2a1 1 0 0 0 1-1v-4.4a1 1 0 0 0-1-1Z" />
    <path d="M19.6 13a2.2 2.2 0 0 1 2.2 2.2v2a2.2 2.2 0 0 1-2.2 2.2h-1.2a1 1 0 0 1-1-1v-4.4a1 1 0 0 1 1-1Z" />
  </Svg>
);

export const MusicNoteIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M9.4 17.6V6.2L19 4.4v11.2" />
    <circle cx="7.2" cy="17.6" r="2.4" />
    <circle cx="16.8" cy="15.6" r="2.4" />
  </Svg>
);

export const WaveIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M3.6 12h2M7.6 8.6v6.8M11.6 5.8v12.4M15.6 8.6v6.8M19.6 12h0.8" />
  </Svg>
);

export const XIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M6.4 6.4 17.6 17.6M17.6 6.4 6.4 17.6" />
  </Svg>
);
