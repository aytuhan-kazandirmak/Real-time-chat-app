export default function truncateText(text: string |null) {
  if(text ===null) return ""
  if (text.length < 30) return text;

  return text.slice(0, 30) + "...";
}


 export function timeAgo(dateString: string | null) {
    if(dateString ===null) return ""
  const now: Date = new Date();
  const past: Date = new Date(dateString);
  const diff = Math.floor((now.getTime() - past.getTime()) / 1000);

  if (diff < 60) return `${diff} s`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d`;
  if (diff < 2592000) return `${Math.floor(diff / 604800)}w`;
  if (diff < 31536000) return `${Math.floor(diff / 2592000)}mnth`;
  return `${Math.floor(diff / 31536000)} years ago`;
}

export function isActive(updatedAt: string | null | undefined) {
  if (!updatedAt) return false; 

  const updatedDate = new Date(updatedAt);
  const now = new Date();
  const diff = (now.getTime() - updatedDate.getTime()) / 1000; 

  return diff <= 30; 
}