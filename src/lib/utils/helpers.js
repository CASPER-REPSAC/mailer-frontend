export function formatDate(dateInput) {
  const date = new Date(dateInput);
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return date.toLocaleDateString(undefined, options);
}

export function truncateText(text, maxLength = 100) {
  return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
}
