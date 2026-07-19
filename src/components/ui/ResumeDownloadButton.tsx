import { Magnetic } from "@/components/motion/Magnetic";

type ResumeDownloadButtonProps = Readonly<{
  href: string;
  filename: string;
}>;

/**
 * Circular magnetic download button beside the "Open resume" CTA: a gold
 * fill wipes up on hover while the arrow glyph dips into its tray with a
 * playful overshoot, and the `download` attribute saves the PDF directly.
 */
export function ResumeDownloadButton({
  href,
  filename,
}: ResumeDownloadButtonProps) {
  return (
    <Magnetic strength={0.3} radius={110}>
      <a
        href={href}
        download={filename}
        className="resume-download focus-ring"
        aria-label="Download resume as PDF"
        title="Download resume"
      >
        <span className="resume-download-fill" aria-hidden="true" />
        <svg
          className="resume-download-icon"
          viewBox="0 0 24 24"
          aria-hidden="true"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <g className="resume-download-arrow">
            <path d="M12 4v11" />
            <path d="M7 11l5 5 5-5" />
          </g>
          <path d="M5 20h14" />
        </svg>
      </a>
    </Magnetic>
  );
}
