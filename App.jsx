import { useEffect, useMemo, useState } from "react";
import "./style.css";

const STORAGE_KEY = "ksf_board_strategy_hybrid_v1";

const seed = {
  title: "Board Strategy & Execution Dashboard",
  subtitle: "A living board operating system for governance, development, program buildout, and community engagement.",
  eyebrow: "Kent Schools Foundation · BoardHub",
  metrics: [
    { label: "Active Workstreams", value: "4", note: "Board-facing priorities" },
    { label: "Near-Term Actions", value: "10", note: "Due before next meeting" },
    { label: "Next Meeting", value: "May 15", note: "12:00 PM · Stevens Room / Zoom" },
    { label: "Board Focus", value: "Execution", note: "Decisions, ownership, follow-through" },
  ],
  phases: [
    { id: "stabilize", label: "Stabilize", date: "May", text: "Finance, filings, board roles, meeting rhythm" },
    { id: "align", label: "Align", date: "June", text: "Priorities, dashboards, governance calendar" },
    { id: "activate", label: "Activate", date: "Summer", text: "Development, Repp CTE design, partner outreach" },
    { id: "sustain", label: "Sustain", date: "Fall", text: "Board engagement, campaigns, reporting cadence" },
  ],
  workstreams: [
    {
      id: "governance",
      phase: "stabilize",
      title: "Governance & Board Engagement",
      tagline: "Clarify roles, strengthen cadence, and move board work from discussion to action.",
      status: "Active",
      owner: "Alan Sutliff / Marquise Dixon",
      boardFocus: "Confirm board commitments, treasurer path, and September board presentation direction.",
      sections: [
        { title: "Key Decisions", items: ["Determine next Treasurer recruitment approach.", "Finalize land acknowledgement action steps beyond meeting recitation.", "Confirm board presentation priorities for September."] },
        { title: "Active Work", items: ["Board members schedule 30-45 minute onboarding conversations with Marquise.", "Review board commitment forms and identify gaps.", "Prepare May meeting agenda with decision points separated from updates."] },
        { title: "Risks / Watch Items", items: ["Treasurer vacancy could slow financial oversight and approvals.", "Board action items may remain distributed across email without a central follow-up tool."] },
      ],
    },
    {
      id: "finance",
      phase: "stabilize",
      title: "Finance, Compliance & Infrastructure",
      tagline: "Complete filings, clean up accounting, and stabilize the operating backbone.",
      status: "Urgent",
      owner: "Jenny Buron / Allison Parker / Alan Sutliff",
      boardFocus: "Support timely completion of state filings, bank access, and accounting clean-up decisions.",
      sections: [
        { title: "Immediate Actions", items: ["Complete WA Charitable Solicitation and Trust filings.", "Deliver Mechanics Bank paperwork.", "Move forward on CPA tax prep and accounting clean-up within approved parameters."] },
        { title: "Board Oversight", items: ["Review monthly financial report in a dashboard format.", "Track expense account and technology purchase against approved budget.", "Clarify who owns finance follow-up between meetings."] },
        { title: "Dependencies", items: ["Treasurer recruitment or interim finance lead.", "Updated records and access across bank, Schwab, and accounting systems."] },
      ],
    },
    {
      id: "development",
      phase: "activate",
      title: "Development & Community Visibility",
      tagline: "Build the fundraising engine, donor confidence, and community-facing presence.",
      status: "Building",
      owner: "Marquise Dixon / Board Development",
      boardFocus: "Use board relationships to activate donor introductions, business sponsors, and community visibility moments.",
      sections: [
        { title: "Strategic Moves", items: ["Align board dashboard with the development roadmap and revenue goals.", "Use Kent International Festival as a visibility and list-building opportunity.", "Create a board-ready donor and sponsor pipeline view."] },
        { title: "Communications", items: ["Finalize website review and launch updates.", "Clarify donation tool/app updates and business donation levels.", "Package key stories from scholarships, classroom grants, and KSD impact."] },
        { title: "Board Actions Needed", items: ["Identify warm business introductions.", "Share potential donor and sponsor names.", "Attend priority events and help with follow-up."] },
      ],
    },
    {
      id: "programs",
      phase: "activate",
      title: "Scholarships, Grants & Repp CTE Program",
      tagline: "Connect current scholarship/grant operations with the longer-term Repp CTE program design.",
      status: "Designing",
      owner: "Connie Compton / Marilyn Boxly / Marquise Dixon",
      boardFocus: "Protect donor intent while shaping a clear, rigorous, student-centered CTE pathway.",
      sections: [
        { title: "Current Program Work", items: ["Prepare for May 21 Scholarship Event.", "Finalize KW grant carryover communication.", "Review classroom enrichment grant reporting and application improvements."] },
        { title: "Repp CTE Design Questions", items: ["Define eligibility, selection criteria, and CTE alignment.", "Determine annual award structure and student support model.", "Map connections to mentors, internships, and workforce partners."] },
        { title: "Next Milestones", items: ["Create a Repp CTE briefing for board review.", "Develop timeline from design workshop to spring launch.", "Identify board members or partners who can support workforce connections."] },
      ],
    },
  ],
  meetings: [
    { title: "Board Meeting – May 15, 2026", time: "12:00 PM", location: "KSD Administration Center – Stevens Room / Zoom", focus: "Treasurer leads, festival planning, land acknowledgement action, September presentation planning" },
    { title: "Scholarship Event", time: "May 21, 2026 · 5:30 PM", location: "Kent Covenant Church", focus: "Board presence and student celebration" },
    { title: "Kent International Festival", time: "May 30, 2026 · 10 AM–5 PM", location: "Showare", focus: "KSF booth planning and community visibility" },
  ],
  tasks: [
    { title: "Complete WA Charitable Solicitation & Trust state filings", owner: "Allison Parker", due: "May 15, 2026", priority: "High" },
    { title: "Identify Treasurer candidates – update at May meeting", owner: "All Board", due: "May 15, 2026", priority: "High" },
    { title: "Deliver Mechanics Bank paperwork", owner: "Alan Sutliff", due: "May 8, 2026", priority: "High" },
    { title: "Notify educator re: KW grant carryover decision", owner: "Connie Compton", due: "May 8, 2026", priority: "Medium" },
    { title: "Send teacher appreciation week email to KSD staff", owner: "Marquise Dixon", due: "May 9, 2026", priority: "Medium" },
    { title: "Schedule 30–45 minute meetings with Marquise", owner: "All Board", due: "May 15, 2026", priority: "Medium" },
    { title: "Plan KSF booth for Kent International Festival", owner: "Allyson Johnson / Alan Sutliff", due: "May 15, 2026", priority: "Medium" },
    { title: "Review native-land.ca for land acknowledgement discussion", owner: "All Board", due: "May 15, 2026", priority: "Low" },
    { title: "Explore credit card with cash back for bookkeeper/ED", owner: "Jenny Buron", due: "May 30, 2026", priority: "Low" },
    { title: "Attend May 21 Scholarship Event", owner: "Randy, Marilyn, Allyson, Connie", due: "May 21, 2026", priority: "Medium" },
  ],
  members: [
    { name: "Alan Sutliff", role: "President", initials: "AS" },
    { name: "Allyson Johnson", role: "Past President", initials: "AJ" },
    { name: "Randy Heath", role: "VP Board Development", initials: "RH" },
    { name: "Connie Compton", role: "Secretary", initials: "CC" },
    { name: "Marilyn Boxly", role: "VP Classroom Grants", initials: "MB" },
    { name: "Sharn Shoker", role: "VP Communications", initials: "SS" },
    { name: "Marquise Dixon", role: "Executive Director", initials: "MD" },
  ],
};

function clone(x){ return JSON.parse(JSON.stringify(x)); }
function load(){ try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || clone(seed); } catch { return clone(seed); } }
function save(data){ try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch {} }

function Editable({ value, onChange, editMode, className="", multiline=false }){
  if(!editMode) return multiline ? <span className={className}>{value}</span> : <span className={className}>{value}</span>;
  const Tag = multiline ? "textarea" : "input";
  return <Tag className={`editable-field ${className}`} value={value} onChange={e=>onChange(e.target.value)} />;
}

function Pill({ children, tone="green" }){ return <span className={`pill ${tone}`}>{children}</span>; }

export default function App(){
  const [data,setData] = useState(load);
  const [editMode,setEditMode] = useState(false);
  const [filter,setFilter] = useState("all");
  const [openCards,setOpenCards] = useState({ governance:true });
  const [openSections,setOpenSections] = useState({});
  const [saved,setSaved] = useState(false);

  useEffect(()=>{ save(data); setSaved(true); const t=setTimeout(()=>setSaved(false),900); return ()=>clearTimeout(t); },[data]);

  const filteredWorkstreams = useMemo(()=> data.workstreams.filter(w => filter === "all" || w.phase === filter), [data.workstreams, filter]);
  const completedCount = data.tasks.filter(t => String(t.priority).toLowerCase() !== "high").length;
  const progress = Math.round((completedCount / Math.max(data.tasks.length,1))*100);

  const update = (path, value) => {
    setData(prev => {
      const next = clone(prev);
      let obj = next;
      for(let i=0;i<path.length-1;i++) obj = obj[path[i]];
      obj[path[path.length-1]] = value;
      return next;
    });
  };

  const addItem = (wIdx, sIdx) => update(["workstreams", wIdx, "sections", sIdx, "items"], [...data.workstreams[wIdx].sections[sIdx].items, "New item — click edit mode to update."]);
  const removeItem = (wIdx, sIdx, iIdx) => update(["workstreams", wIdx, "sections", sIdx, "items"], data.workstreams[wIdx].sections[sIdx].items.filter((_,i)=>i!==iIdx));
  const addTask = () => update(["tasks"], [...data.tasks, { title:"New task", owner:"Owner", due:"Date", priority:"Medium" }]);
  const addWorkstream = () => update(["workstreams"], [...data.workstreams, { id:`new-${Date.now()}`, phase:"align", title:"New Workstream", tagline:"Describe the strategic purpose.", status:"New", owner:"Owner", boardFocus:"Board focus here.", sections:[{title:"Key Work", items:["New item"]}] }]);

  const exportEdits = () => {
    const blob = new Blob([JSON.stringify(data,null,2)], {type:"application/json"});
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob); a.download = "ksf-board-dashboard-edits.json"; a.click();
  };
  const importEdits = (e) => {
    const f = e.target.files?.[0]; if(!f) return;
    const r = new FileReader();
    r.onload = () => { try { setData(JSON.parse(r.result)); } catch { alert("Could not import this JSON file."); } };
    r.readAsText(f);
  };

  return <div>
    <div className="topbar">
      <div className="brand">KSF BoardHub</div>
      <button onClick={()=>setEditMode(!editMode)} className={editMode?"btn gold":"btn"}>{editMode ? "Exit edit mode" : "Edit mode"}</button>
      <button className="btn ghost" onClick={exportEdits}>Export edits</button>
      <label className="btn ghost file-label">Import edits<input type="file" accept="application/json" onChange={importEdits}/></label>
      <button className="btn danger" onClick={()=>{ if(confirm("Reset dashboard to default content?")){ localStorage.removeItem(STORAGE_KEY); setData(clone(seed)); }}}>Reset</button>
      <span className={`save ${saved?"show":""}`}>Saved</span>
    </div>

    <main className="page">
      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow"><Editable value={data.eyebrow} onChange={v=>update(["eyebrow"],v)} editMode={editMode}/></div>
          <h1><Editable value={data.title} onChange={v=>update(["title"],v)} editMode={editMode}/></h1>
          <p><Editable value={data.subtitle} onChange={v=>update(["subtitle"],v)} editMode={editMode} multiline/></p>
        </div>
        <div className="hero-panel">
          <div className="panel-title">Execution Health</div>
          <div className="progress-row"><span>Board actions tracked</span><strong>{progress}%</strong></div>
          <div className="progress"><div style={{width:`${progress}%`}} /></div>
          <p className="small">Progress is estimated from the current action list and can be refined as tasks are completed.</p>
        </div>
      </section>

      <section className="metrics-grid">
        {data.metrics.map((m,i)=><div className="metric" key={i}>
          <Editable value={m.value} onChange={v=>update(["metrics",i,"value"],v)} editMode={editMode} className="metric-value" />
          <Editable value={m.label} onChange={v=>update(["metrics",i,"label"],v)} editMode={editMode} className="metric-label" />
          <Editable value={m.note} onChange={v=>update(["metrics",i,"note"],v)} editMode={editMode} className="metric-note" />
        </div>)}
      </section>

      <section className="timeline-card">
        <div className="section-kicker">Strategic Arc</div>
        <div className="phase-timeline">
          {data.phases.map((p,i)=><button key={p.id} className={`phase ${filter===p.id?"active":""}`} onClick={()=>setFilter(filter===p.id?"all":p.id)}>
            <span className="phase-num">{i+1}</span>
            <span className="phase-main"><Editable value={p.label} onChange={v=>update(["phases",i,"label"],v)} editMode={editMode}/></span>
            <span className="phase-date"><Editable value={p.date} onChange={v=>update(["phases",i,"date"],v)} editMode={editMode}/></span>
            <span className="phase-text"><Editable value={p.text} onChange={v=>update(["phases",i,"text"],v)} editMode={editMode}/></span>
          </button>)}
        </div>
      </section>

      <div className="controls-row">
        <div className="filter-pills">
          <button className={filter==="all"?"active":""} onClick={()=>setFilter("all")}>All workstreams</button>
          {data.phases.map(p=><button key={p.id} className={filter===p.id?"active":""} onClick={()=>setFilter(p.id)}>{p.label}</button>)}
        </div>
        {editMode && <button className="btn" onClick={addWorkstream}>+ Add workstream</button>}
      </div>

      <section className="workstreams">
        {filteredWorkstreams.map((w)=>{
          const wIdx = data.workstreams.findIndex(x=>x.id===w.id);
          const isOpen = !!openCards[w.id];
          return <article className={`work-card ${isOpen?"open":""}`} key={w.id}>
            <div className="work-head" onClick={()=>setOpenCards(o=>({...o,[w.id]:!o[w.id]}))}>
              <div className="accent" />
              <div className="work-title-block">
                <div className="work-meta"><Pill tone={w.status.toLowerCase()==="urgent"?"gold":"green"}>{w.status}</Pill><span>{w.owner}</span></div>
                <h2 onClick={e=>e.stopPropagation()}><Editable value={w.title} onChange={v=>update(["workstreams",wIdx,"title"],v)} editMode={editMode}/></h2>
                <p onClick={e=>e.stopPropagation()}><Editable value={w.tagline} onChange={v=>update(["workstreams",wIdx,"tagline"],v)} editMode={editMode} multiline/></p>
              </div>
              <div className="chev">⌄</div>
            </div>
            {isOpen && <div className="work-body">
              <div className="board-focus"><strong>Board Focus:</strong> <Editable value={w.boardFocus} onChange={v=>update(["workstreams",wIdx,"boardFocus"],v)} editMode={editMode} multiline/></div>
              <div className="subsections">
                {w.sections.map((s,sIdx)=>{
                  const key = `${w.id}-${sIdx}`;
                  const secOpen = openSections[key] !== false;
                  return <div className="subsection" key={key}>
                    <button className="subsection-head" onClick={()=>setOpenSections(o=>({...o,[key]:!secOpen}))}>
                      <span><Editable value={s.title} onChange={v=>update(["workstreams",wIdx,"sections",sIdx,"title"],v)} editMode={editMode}/></span>
                      <span>{secOpen?"−":"+"}</span>
                    </button>
                    {secOpen && <div className="subsection-body">
                      {s.items.map((item,iIdx)=><div className="item-row" key={iIdx}>
                        <span className="dot" />
                        <Editable value={item} onChange={v=>update(["workstreams",wIdx,"sections",sIdx,"items",iIdx],v)} editMode={editMode} multiline />
                        {editMode && <button className="mini danger-text" onClick={()=>removeItem(wIdx,sIdx,iIdx)}>remove</button>}
                      </div>)}
                      {editMode && <button className="mini" onClick={()=>addItem(wIdx,sIdx)}>+ Add item</button>}
                    </div>}
                  </div>
                })}
              </div>
            </div>}
          </article>
        })}
      </section>

      <section className="two-col">
        <div className="panel">
          <div className="panel-header"><div><div className="section-kicker">Upcoming Board Moments</div><h3>Meetings & Events</h3></div></div>
          {data.meetings.map((m,i)=><div className="meeting" key={i}>
            <strong><Editable value={m.title} onChange={v=>update(["meetings",i,"title"],v)} editMode={editMode}/></strong>
            <span><Editable value={m.time} onChange={v=>update(["meetings",i,"time"],v)} editMode={editMode}/></span>
            <span><Editable value={m.location} onChange={v=>update(["meetings",i,"location"],v)} editMode={editMode}/></span>
            <p><Editable value={m.focus} onChange={v=>update(["meetings",i,"focus"],v)} editMode={editMode} multiline/></p>
          </div>)}
        </div>
        <div className="panel">
          <div className="panel-header"><div><div className="section-kicker">Board Composition</div><h3>Members</h3></div></div>
          <div className="member-grid">
            {data.members.map((m,i)=><div className="member" key={i}>
              <div className="avatar"><Editable value={m.initials} onChange={v=>update(["members",i,"initials"],v)} editMode={editMode}/></div>
              <div><strong><Editable value={m.name} onChange={v=>update(["members",i,"name"],v)} editMode={editMode}/></strong><span><Editable value={m.role} onChange={v=>update(["members",i,"role"],v)} editMode={editMode}/></span></div>
            </div>)}
          </div>
        </div>
      </section>

      <section className="panel action-panel">
        <div className="panel-header"><div><div className="section-kicker">Action Tracker</div><h3>Near-Term Board Actions</h3></div>{editMode && <button className="btn" onClick={addTask}>+ Add task</button>}</div>
        <div className="task-table">
          <div className="task-head"><span>Action</span><span>Owner</span><span>Due</span><span>Priority</span></div>
          {data.tasks.map((t,i)=><div className="task-row" key={i}>
            <span><Editable value={t.title} onChange={v=>update(["tasks",i,"title"],v)} editMode={editMode} multiline/></span>
            <span><Editable value={t.owner} onChange={v=>update(["tasks",i,"owner"],v)} editMode={editMode}/></span>
            <span><Editable value={t.due} onChange={v=>update(["tasks",i,"due"],v)} editMode={editMode}/></span>
            <span><Pill tone={String(t.priority).toLowerCase()==="high"?"gold":"green"}><Editable value={t.priority} onChange={v=>update(["tasks",i,"priority"],v)} editMode={editMode}/></Pill></span>
          </div>)}
        </div>
      </section>
    </main>
  </div>;
}
