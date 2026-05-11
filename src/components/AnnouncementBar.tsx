import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export interface Announcement {
  id: number;
  title: string;      // the message text
}

interface AnnouncementBarProps {
  /** Array of announcements to cycle through */
  announcements: Announcement[];
  /** Interval in milliseconds between message changes (default: 5000) */
  intervalMs?: number;
  /** Button text (default: "Generate Workout →") */
  buttonText?: string;
  /** Button link (default: "/workout") */
  buttonLink?: string;
  /** Background color (default: "#C8F135") */
  bgColor?: string;
  /** Text color (default: "#000") */
  textColor?: string;
  /** Whether the bar can be dismissed by user (default: true) */
  dismissible?: boolean;
  /** Storage key for dismissal (default: "announcementClosed") */
  storageKey?: string;
}

export default function AnnouncementBar({
  announcements,
  intervalMs = 5000,
  buttonText = "Generate Workout →",
  buttonLink = "/workout",
  bgColor = "#C8F135",
  textColor = "#000",
  dismissible = true,
  storageKey = "announcementClosed",
}: AnnouncementBarProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  // Check if user dismissed this bar in this session
  useEffect(() => {
    if (dismissible) {
      const closed = sessionStorage.getItem(storageKey);
      if (closed === 'true') setIsVisible(false);
    }
  }, [dismissible, storageKey]);

  // Cycle through announcements
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

  const currentAnnouncement = announcements[currentIndex];

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1100,
        background: bgColor,
        color: textColor,
        padding: '10px 20px',
        textAlign: 'center',
        fontFamily: "'DM Sans', sans-serif",
        fontSize: '0.9rem',
        fontWeight: 500,
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '20px',
        flexWrap: 'wrap',
      }}
    >
      <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {currentAnnouncement.title}
      </span>
      <button
        onClick={() => navigate(buttonLink)}
        style={{
          background: textColor,
          color: bgColor,
          border: 'none',
          borderRadius: '40px',
          padding: '6px 16px',
          fontWeight: 'bold',
          fontSize: '0.8rem',
          cursor: 'pointer',
          transition: 'transform 0.2s',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.02)')}
        onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
      >
        {buttonText}
      </button>
      {dismissible && (
        <button
          onClick={handleClose}
          style={{
            background: 'transparent',
            border: 'none',
            fontSize: '1.2rem',
            cursor: 'pointer',
            color: textColor,
            opacity: 0.7,
            marginLeft: '10px',
          }}
          aria-label="Close announcement"
        >
          ✕
        </button>
      )}
    </div>
  );
}