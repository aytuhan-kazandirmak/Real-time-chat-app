export default function truncateText(text: string) {
  if (text.length < 30) return text;

  return text.slice(0, 30) + "...";
}
