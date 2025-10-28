export function getGreeting(now = new Date()): string {
  const hour = now.getHours();
  if (hour < 5) return "Up late, Auirah?";
  if (hour < 12) return "Good morning, Auirah";
  if (hour < 17) return "Good afternoon, Auirah";
  if (hour < 22) return "Good evening, Auirah";
  return "Night mode, engage";
}

export function formatTime(now = new Date()): string {
  return now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}
