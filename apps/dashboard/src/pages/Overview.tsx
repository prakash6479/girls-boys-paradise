import { useEffect, useState } from "react";
import { Activity, ArrowUpRight, Bot, CircleAlert, Clock3, Gift, Radio, RefreshCw, ShieldCheck, Users } from "lucide-react";
import { fetchApiHealth } from "../services/api";
import type { ApiHealth } from "../types";

const cards = [
  { label: "Total members", value: "—", icon: Users, color: "lavender", note: "Live member sync not connected" },
  { label: "Active giveaways", value: "—", icon: Gift, color: "peach", note: "Giveaway module not configured" },
  { label: "Open tickets", value: "—", icon: Radio, color: "mint", note: "Ticket module not configured" },
  { label: "Moderation actions", value: "—", icon: ShieldCheck, color: "blue", note: "No activity source connected" },
];

export function Overview() {
  const [health, setHealth] = useState<ApiHealth | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);
  const check = async () => { setChecking(true); setError(null); try { setHealth(await fetchApiHealth()); } catch (err) { setHealth(null); setError(err instanceof Error ? err.message : "API is not reachable"); } finally { setChecking(false); } };
  useEffect(() => { void check(); }, []);
  const apiOnline = health?.status === "ok";
  const apiReachable = health !== null;
  return <>
    <div className="page-heading"><div><div className="eyebrow">YOUR COMMUNITY, AT A GLANCE</div><h1>Good to see you <span className="wave">✳</span></h1><p>Here’s what’s happening in your corner of Paradise.</p></div><div className="date-chip"><Clock3 size={15} /> Phase 1 foundation</div></div>
    <section className="welcome-banner"><div className="banner-copy"><div className="banner-tag"><Sparkle /> COMMUNITY CONTROL CENTER</div><h2>A little more paradise,<br /><em>every day.</em></h2><p>Your Discord community tools will live here. Connect your services to get started.</p><a className="banner-link" href="https://github.com/prakash6479/girls-boys-paradise#setup" target="_blank" rel="noreferrer">Explore setup guide <ArrowUpRight size={16} /></a></div><div className="banner-art" aria-hidden="true"><div className="orb orb-one" /><div className="orb orb-two" /><div className="orbit"><span>✿</span></div><div className="flower">🌸</div><div className="sparkle s1">✦</div><div className="sparkle s2">✧</div><div className="sparkle s3">✧</div></div></section>
    <div className="section-title"><div><h2>Community overview</h2><p>Numbers appear here once the bot and API are configured.</p></div><button className="icon-button" onClick={() => void check()} aria-label="Refresh API status" title="Refresh API status"><RefreshCw size={16} className={checking ? "spin" : ""} /></button></div>
    <div className="stats-grid">{cards.map(({ label, value, icon: Icon, color, note }) => <article className="stat-card" key={label}><div className={`stat-icon ${color}`}><Icon size={19} /></div><div className="stat-label">{label}</div><div className="stat-value">{value}</div><div className="stat-note">{note}</div></article>)}</div>
    <div className="lower-grid"><section className="panel activity-panel"><div className="panel-heading"><div><h3>Recent activity</h3><p>Updates from across your server</p></div><span className="quiet-label">LIVE FEED</span></div><div className="empty-state"><div className="empty-icon"><Activity size={21} /></div><b>No activity to show yet</b><p>Connect the Discord bot to start seeing community updates here.</p></div></section>
      <section className="panel connection-panel"><div className="panel-heading"><div><h3>Connections</h3><p>Services powering your community</p></div></div><div className="connection-row"><span className="connection-icon bot-icon"><Bot size={18} /></span><div className="connection-label"><b>Discord bot</b><small>Gateway service</small></div><span className="status-pill status-off"><i /> Unknown</span></div><div className="connection-row"><span className="connection-icon api-icon"><Activity size={18} /></span><div className="connection-label"><b>Community API</b><small>{health ? `Checked ${new Date(health.timestamp).toLocaleTimeString()}` : "Health endpoint"}</small></div><span className={`status-pill ${apiOnline ? "status-on" : "status-off"}`}><i />{checking ? "Checking" : apiOnline ? "Online" : apiReachable ? "Degraded" : "Offline"}</span></div>{error && <div className="inline-warning"><CircleAlert size={15} /><span>API health check failed: {error}. Start the API with <code>npm run dev:api</code>.</span></div>}{apiOnline && <div className="api-meta">Database binding: <b>{health.database === "connected" ? "connected" : health.database === "error" ? "unavailable" : "not configured"}</b></div>}</section>
    </div>
  </>;
}
function Sparkle() { return <span className="sparkle-icon">✦</span>; }
