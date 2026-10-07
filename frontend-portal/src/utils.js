import { useEffect } from "react";

export const STATUS = {
  pending: "Waiting for a rescue team", assigned: "Team assigned", accepted: "Team accepted the job",
  en_route: "Help is on the way", on_site: "Team is at the location", resolved: "Resolved", cancelled: "Cancelled",
};
export const ORDER = ["pending", "assigned", "accepted", "en_route", "on_site", "resolved"];
export const NEXT = {
  assigned: ["accepted", "Accept job"], accepted: ["en_route", "On the way"],
  en_route: ["on_site", "Arrived"], on_site: ["resolved", "Mark resolved"],
};
export const nice = (s) => (s || "").replace(/_/g, " ");
export const idOf = (x) => x?._id || x?.id;
export const ref = (i) => "RQ-" + String(idOf(i)).slice(-6).toUpperCase();
export const when = (d) => (d ? new Date(d).toLocaleString([], { dateStyle: "medium", timeStyle: "short" }) : "");
// `priority` is always set by the backend (mapped from Gemini urgency, or inferred from the category).
export const PRIORITY = { critical: "Critical", high: "High", medium: "Medium", low: "Low" };
export const priorityOf = (i) => i.priority || { HIGH: "critical", MEDIUM: "high", LOW: "medium" }[i.urgency] || "medium";
export const priorityRank = (i) => ["critical", "high", "medium", "low"].indexOf(priorityOf(i));

// Refreshes every 30s, and not while the tab is hidden (keeps request counts low for the API rate limiter).
export function usePoll(fn, ms = 30000, deps = []) {
  useEffect(() => { fn(); const t = setInterval(() => { if (!document.hidden) fn(); }, ms); return () => clearInterval(t); }, deps);
}
