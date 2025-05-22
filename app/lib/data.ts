export async function fetchBooks({ username }: { username?: string }) {
  const query: string[] = [];

  if (username && username !== " ") {
    query.push(`username=${username}`);
  }

  return await fetch(`/api/books?${query.join("&")}`, {
    method: "GET",
    credentials: "include",
  });
}
