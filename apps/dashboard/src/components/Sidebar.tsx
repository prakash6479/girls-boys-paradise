import { useState } from "react";
import { Activity, AudioLines, Bell, CircleHelp, Gift, Gauge, Gamepad2, House, Menu, MessageSquareText, Settings2, ShieldAlert, ShieldCheck, Sparkles, Users, X, type LucideIcon } from "lucide-react";
import type { PageId } from "../types";

type NavItem = { id: PageId; label: string; icon: LucideIcon; group: "Community" | "Automation" | "System" };
const nav: NavItem[] = [
  { id: "overview", label: "Overview", icon: House, group: "Community" },
  { id: "members", label: "Members", icon: Users, group: "Community" },
  { id: "roles", label: "Roles & onboarding", icon: Sparkles, group: "Community" },
  { id: "welcome", label: "Welcome system", icon: MessageSquareText, group: "Community" },
  { id: "verification", label: "Verification", icon: ShieldCheck, group: "Community" },
  { id: "giveaways", label: "Giveaways", icon: Gift, group: "Automation" },
  { id: "rewards", label: "Rewards", icon: Sparkles, group: "Automation" },
  { id: "tickets", label: "Tickets", icon: CircleHelp, group: "Automation" },
  { id: "moderation", label: "Moderation", icon: ShieldAlert, group: "Automation" },
  { id: "levels", label: "XP & leaderboard", icon: Gauge, group: "Automation" },
  { id: "voice", label: "Voice activity", icon: AudioLines, group: "Automation" },
  { id: "announcements", label: "Announcements", icon: Bell, group: "Automation" },
  { id: "settings", label: "Server settings", icon: Settings2, group: "System" },
  { id: "bot", label: "Bot settings", icon: Gamepad2, group: "System" },
  { id: "audit", label: "Audit logs", icon: Activity, group: "System" },
];

export function Sidebar({ page, onNavigate }: { page: PageId; onNavigate: (id: PageId) => void }) {
  const [open, setOpen] = useState(false);
  const groups = ["Community", "Automation", "System"] as const;
  const choose = (id: PageId) => { onNavigate(id); setOpen(false); };
  return <>
    <button className="mobile-menu" aria-label={open ? "Close navigation" : "Open navigation"} onClick={() => setOpen(!open)}>{open ? <X size={20} /> : <Menu size={20} />}</button>
    {open && <button className="mobile-scrim" aria-label="Close navigation" onClick={() => setOpen(false)} />}
    <aside className={`sidebar ${open ? "sidebar-open" : ""}`}>
      <div className="brand"><div className="brand-mark">୨ৎ</div><div><strong>paradise</strong><span>COMMUNITY HUB</span></div></div>
      <div className="server-switch"><span className="server-avatar">🌸</span><span className="server-name"><b>Girls & Boys Paradise</b><small>No Discord server connected</small></span></div>
      <nav aria-label="Main navigation">{groups.map(group => <div className="nav-group" key={group}><div className="nav-heading">{group}</div>{nav.filter(item => item.group === group).map(item => <button key={item.id} className={`nav-item ${page === item.id ? "active" : ""}`} onClick={() => choose(item.id)}><item.icon size={17} strokeWidth={1.8} /><span>{item.label}</span></button>)}</div>)}</nav>
      <div className="sidebar-footer"><div className="support-icon"><CircleHelp size={17} /></div><div><b>Need a hand?</b><span>Setup guide & resources</span></div><a href="https://github.com/prakash6479/girls-boys-paradise#readme" target="_blank" rel="noreferrer" aria-label="Open setup guide">↗</a></div>
    </aside>
  </>;
}
