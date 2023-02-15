export function getItems(key) {
  const value = localStorage.getItem(key);
  return value ? JSON.parse(value) : [];
}

export function setItems(key, newItems) {
  localStorage.setItem(key, JSON.stringify(newItems));
}
