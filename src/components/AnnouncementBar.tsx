import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export interface Announcement {
  id: number;
  title: string;
}

interface AnnouncementBarProps {
  announcements: Announcement[];
  intervalMs?: number;
  buttonText?: string;
  buttonLink?: string;
  bgColor?: string;
  textColor?: string;
  dismissible?: boolean;
  storageKey?: string;
}

export default function AnnouncementBar({
  announcements,
  intervalMs = 5000,
  buttonText = "Generate",
  buttonLink = "/workout",
  bgColor = "#C8F135",
  textColor = "#000",
  dismissible = true,
  storageKey = "announcementClosed",
}: AnnouncementBarProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (dismissible) {
      const closed = sessionStorage.getItem(storageKey);
      if (closed === 'true') setIsVisible(false);
    }
  }, [dismissible, storageKey]);

  useEffect(() => {
    if (!isVisible || announcements.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % announcements.length);
    }, intervalMs);
    return () => clearInterval(timer);
  }, [isVisible, announcements.length, intervalMs]);

  const handleClose = () => {
    if (!dismissible) return;
    setIsVisible(false);
    sessionStorage.setItem(storageKey, 'true');
  };

  if (!isVisible || announcements.length === 0) return null;

  const current = announcements[currentIndex];

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[1100] flex items-center justify-between gap-1 px-2 py-1 text-[11px] font-medium"
      style={{
        background: bgColor,
        color: textColor,
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {/* Message - truncated on mobile, full on larger screens */}
      <span className="flex-1 truncate text-center sm:text-left">
        {current.title}
      </span>

      {/* Button - very compact */}
      <button
        onClick={() => navigate(buttonLink)}
        className="shrink-0 px-2 py-0.5 rounded-full font-bold text-[10px] sm:text-xs transition active:scale-95"
        style={{
          background: textColor,
          color: bgColor,
        }}
      >
        {buttonText}
      </button>

      {/* Close button - tiny */}
      {dismissible && (
        <button
          onClick={handleClose}
          className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs hover:bg-black/10 transition"
          style={{ color: textColor }}
          aria-label="Close"
        >
          ✕
        </button>
      )}
    </div>
  );
}