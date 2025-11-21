import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import {
  BookOpenCheck,
  Camera,
  CheckSquare,
  MapPinned,
  Music4,
  StickyNote,
} from "lucide-react";

type QuickLink = {
  to: string;
  label: string;
  icon: ReactNode;
};

const quickLinks: QuickLink[] = [
  { to: "/tasks", label: "Tasks", icon: <CheckSquare size={16} /> },
  { to: "/notes", label: "Notes", icon: <StickyNote size={16} /> },
  { to: "/music", label: "Music", icon: <Music4 size={16} /> },
  { to: "/media", label: "Media", icon: <Camera size={16} /> },
  { to: "/learn", label: "Learn", icon: <BookOpenCheck size={16} /> },
  { to: "/maps", label: "Maps", icon: <MapPinned size={16} /> },
];

export function QuickApps() {
  return (
    <div className="quick-apps" aria-label="Quick apps">
      {quickLinks.map((link) => (
        <Link key={link.to} to={link.to}>
          {link.icon}
          <span>{link.label}</span>
        </Link>
      ))}
    </div>
  );
}
