export type SearchResult = {
  id: string;
  title: string;
  snippet: string;
  href: string;
  type: "tasks" | "notes" | "music" | "photos" | "learn" | "maps" | "article";
};

export const SEARCH_RESULTS: SearchResult[] = [
  {
    id: "tasks-overview",
    title: "Stay on top of your tasks",
    snippet: "Capture quick todos and long-form goals with reminders that sync across the Auirah suite.",
    href: "/tasks",
    type: "tasks",
  },
  {
    id: "notes-quick",
    title: "Ideas, drafts, and daily notes",
    snippet: "Organise inspirations with tags, colours, and collaborative sharing for the whole family.",
    href: "/notes",
    type: "notes",
  },
  {
    id: "music-focus",
    title: "Focus playlists that energise",
    snippet: "Stream curated ambient and lofi mixes while you build, study, or unwind late at night.",
    href: "/music",
    type: "music",
  },
  {
    id: "photos-memories",
    title: "Memories in vibrant colour",
    snippet: "Upload and relive your favourite shots with smart albums, face recognition, and quick share links.",
    href: "/photos",
    type: "photos",
  },
  {
    id: "learn-paths",
    title: "Learning paths for curious minds",
    snippet: "Discover curated lessons, books, and bite-sized workshops tailored to your current focus.",
    href: "/learn",
    type: "learn",
  },
  {
    id: "maps-weekend",
    title: "Maps that know your weekend plans",
    snippet: "Plot adventures with favourite spots, offline guides, and location sharing that respects privacy.",
    href: "/maps",
    type: "maps",
  },
  {
    id: "tasks-automation",
    title: "Automate recurring chores",
    snippet: "Build workflows that assign owners, send reminders, and report on progress with one glance dashboards.",
    href: "/tasks",
    type: "tasks",
  },
  {
    id: "notes-sync",
    title: "Sync notebooks instantly",
    snippet: "Write once and read anywhere with encrypted sync, offline access, and shared notebooks for every project.",
    href: "/notes",
    type: "notes",
  },
  {
    id: "learn-inspiration",
    title: "Inspiration playlists for deep work",
    snippet: "Watch expert-led sessions, save highlights, and keep momentum with streak tracking and reflections.",
    href: "/learn",
    type: "learn",
  },
  {
    id: "music-community",
    title: "Community-curated soundscapes",
    snippet: "Follow collaborative playlists from friends and family to soundtrack every moment of the day.",
    href: "/music",
    type: "music",
  },
  {
    id: "photos-prints",
    title: "Print-ready photos in seconds",
    snippet: "Design wall art, albums, and gifts straight from your gallery with premium finishes and fast delivery.",
    href: "/photos",
    type: "photos",
  },
  {
    id: "maps-nearby",
    title: "Find the best spots nearby",
    snippet: "Explore restaurants, studios, and parks with trusted reviews and AR previews before you go.",
    href: "/maps",
    type: "maps",
  },
  {
    id: "article-hostinger",
    title: "Deploy Laravel APIs on Hostinger",
    snippet: "Step-by-step guide for configuring PHP 8.2, Composer, and queues for resilient deployments.",
    href: "https://www.hostinger.com/tutorials/laravel", // external reference
    type: "article",
  },
];
