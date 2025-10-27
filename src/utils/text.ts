export default function truncateText(text: string) {
  if (text.length < 30) return text;

  return text.slice(0, 30) + "...";
}


 export function timeAgo(dateString: string) {
  const now: Date = new Date();
  const past: Date = new Date(dateString);
  const diff = Math.floor((now.getTime() - past.getTime()) / 1000);

  if (diff < 60) return `${diff} seconds ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)} days ago`;
  if (diff < 2592000) return `${Math.floor(diff / 604800)} weeks ago`;
  if (diff < 31536000) return `${Math.floor(diff / 2592000)} month ago`;
  return `${Math.floor(diff / 31536000)} years ago`;
}