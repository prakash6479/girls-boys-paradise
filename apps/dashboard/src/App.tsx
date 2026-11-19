import { useState } from "react";
import { CircleHelp } from "lucide-react";
import { Sidebar } from "./components/Sidebar";
import { Overview } from "./pages/Overview";
import type { PageId } from "./types";

const pageTitles: Record<PageId, string> = {
  overview: "Overview", settings: "Server settings", members: "Members", roles: "Roles & onboarding",
  welcome: "Welcome system", verification: "Verification", giveaways: "Giveaways", rewards: "Rewards",
  tickets: "Tickets", moderation: "Moderation", levels: "XP & leaderboard", voice: "Voice activity",
  announcements: "Announcements", bot: "Bot settings", audit: "Audit logs",
};

export default function App() {
  const [page, setPage] = useState<PageId>("overview");
  return <div className="app-shell">
    <Sidebar page={page} onNavigate={setPage} />
    <main className="main-area">
      <header className="topbar">
        <div className="breadcrumb"><span>Community</span><b>/</b><strong>{pageTitles[page]}</strong></div>
        <div className="top-actions">
          <span className="preview-chip">Foundation preview</span>
          <a className="top-icon" href="https://github.com/prakash6479/girls-boys-paradise#readme" target="_blank" rel="noreferrer" aria-label="Open setup guide"><CircleHelp size={18} /></a>
          <div className="profile-chip" aria-label="Not signed in; dashboard preview"><div className="profile-avatar">P</div><div className="profile-text"><b>Preview</b><small>Not signed in</small></div></div>
        </div>
      </header>
      <div className="content-wrap">{page === "overview" ? <Overview /> : <section className="module-placeholder"><div className="module-icon"><CircleHelp size={24} /></div><div className="eyebrow">COMING IN A FOLLOWING PHASE</div><h1>{pageTitles[page]}</h1><p>This module has not been implemented yet. It will show real server data after its API and bot integration are built—no sample data is displayed.</p><a href="https://github.com/prakash6479/girls-boys-paradise#development-roadmap" target="_blank" rel="noreferrer">View implementation roadmap ↗</a></section>}</div>
      <footer className="app-footer"><span>୨ৎ &nbsp; Made for good company.</span><span>Paradise dashboard <i>·</i> Foundation preview</span></footer>
    </main>
  </div>;
}
