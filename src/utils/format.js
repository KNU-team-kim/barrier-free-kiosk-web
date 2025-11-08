// src/utils/format.js
export function formatPhone(num) {
  const s = (num || "").replace(/\D/g, "");
  if (s.length < 10) return s;
  if (s.startsWith("02"))
    return `${s.slice(0, 2)}-${s.slice(2, s.length - 4)}-${s.slice(-4)}`;
  return `${s.slice(0, 3)}-${s.slice(3, s.length - 4)}-${s.slice(-4)}`;
}
