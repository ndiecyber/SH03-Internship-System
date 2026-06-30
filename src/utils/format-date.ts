export function formatDate(date: Date | string) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium"
  }).format(new Date(date));
}
