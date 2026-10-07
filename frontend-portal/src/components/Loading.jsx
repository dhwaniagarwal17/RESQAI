export default function Loading({ label = "Loading…" }) {
  return <p role="status" className="p-4 text-muted">{label}</p>;
}
