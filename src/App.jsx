
import { useState, useEffect, useCallback } from "react";

// ─── Theme ────────────────────────────────────────────────────────────────────
const C = {
  navy:"#0F2044", navyL:"#162d5e", teal:"#00B5AD", gold:"#E8A838",
  cream:"#F8F6F1", white:"#FFFFFF", g100:"#F4F5F7", g200:"#E8EAF0",
  g400:"#9CA3B5", g600:"#5A6380", red:"#E05252", green:"#27AE60",
};
const FONTS=`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');`;

// ─── Storage helpers (persist across sessions) ────────────────────────────────
const STORE_KEY = "boardhub_v1";
const loadStore = () => {
  try { return JSON.parse(localStorage.getItem(STORE_KEY) || "{}"); }
  catch { return {}; }
};
const saveStore = (data) => {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(data)); } catch {}
};

// ─── Seed data ────────────────────────────────────────────────────────────────
const SEED = {
  tasks: [
    { id: 1, title: "Review Q1 Financial Report", assignee: "Alice Chen", due: "May 10, 2026", priority: "high", status: "pending" },
    { id: 2, title: "Approve bylaws amendment", assignee: "Board", due: "May 15, 2026", priority: "high", status: "pending" },
    { id: 3, title: "Complete board self-assessment", assignee: "All Members", due: "May 20, 2026", priority: "medium", status: "in-progress" },
    { id: 4, title: "Onboard new treasurer", assignee: "Robert Mills", due: "Jun 1, 2026", priority: "medium", status: "pending" },
    { id: 5, title: "Schedule site visit", assignee: "Sarah Park", due: "May 30, 2026", priority: "low", status: "completed" },
    { id: 6, title: "Submit grant report", assignee: "Donna Torres", due: "May 12, 2026", priority: "high", status: "in-progress" },
  ],
  polls: [
    { id: 1, question: "Should we approve the FY2027 budget as presented?", creator: "Alice Chen", deadline: "May 10, 2026", status: "open", options: [{ id: "yes", label: "Yes – Approve", votes: 3 }, { id: "no", label: "No – Request Revision", votes: 1 }, { id: "abstain", label: "Abstain", votes: 0 }], totalEligible: 6, voted: false },
    { id: 2, question: "Which date works best for the Q3 Board Retreat?", creator: "Sarah Park", deadline: "May 12, 2026", status: "open", options: [{ id: "a", label: "July 18–19", votes: 2 }, { id: "b", label: "July 25–26", votes: 3 }, { id: "c", label: "August 1–2", votes: 1 }], totalEligible: 6, voted: false },
    { id: 3, question: "Ratify the appointment of Kevin Yates to Governance Committee?", creator: "Alice Chen", deadline: "Apr 20, 2026", status: "closed", options: [{ id: "yes", label: "Yes – Ratify", votes: 5 }, { id: "no", label: "No", votes: 0 }, { id: "abstain", label: "Abstain", votes: 1 }], totalEligible: 6, voted: true },
  ],
  savedMinutes: [],
  savedSlides: [],
};

const STATIC = {
  meetings: [
    { id: 1, title: "Q2 Board Meeting", date: "2026-05-15", time: "10:00 AM", location: "Boardroom A / Video", status: "upcoming",
      attendees: ["Alice Chen", "Robert Mills", "Sarah Park", "James Wright", "Donna Torres"],
      agenda: [
        { id: 1, title: "Call to Order & Quorum Check", duration: 5, presenter: "Chair" },
        { id: 2, title: "Approval of Previous Minutes", duration: 10, presenter: "Secretary" },
        { id: 3, title: "CFO Financial Report", duration: 20, presenter: "CFO" },
        { id: 4, title: "Strategic Plan Update", duration: 30, presenter: "CEO" },
        { id: 5, title: "Committee Reports", duration: 20, presenter: "Committee Chairs" },
        { id: 6, title: "New Business", duration: 15, presenter: "All" },
        { id: 7, title: "Adjournment", duration: 5, presenter: "Chair" },
      ] },
    { id: 2, title: "Finance Committee", date: "2026-05-08", time: "2:00 PM", location: "Conference Room B", status: "upcoming",
      attendees: ["Robert Mills", "Donna Torres", "Kevin Yates"],
      agenda: [
        { id: 1, title: "Budget Review Q1", duration: 25, presenter: "CFO" },
        { id: 2, title: "Audit Update", duration: 20, presenter: "Auditor" },
        { id: 3, title: "Investment Portfolio Review", duration: 15, presenter: "Treasurer" },
      ] },
    { id: 3, title: "Annual General Meeting", date: "2026-04-10", time: "9:00 AM", location: "Grand Hall", status: "completed",
      attendees: ["Alice Chen", "Robert Mills", "Sarah Park", "James Wright", "Donna Torres", "Kevin Yates"], agenda: [] },
  ],
  documents: [
    { id: 1, name: "Q1 Financial Report 2026.pdf", category: "Finance", size: "2.4 MB", uploaded: "Apr 5, 2026", uploader: "Robert Mills" },
    { id: 2, name: "Strategic Plan 2026-2028.pdf", category: "Governance", size: "1.8 MB", uploaded: "Mar 20, 2026", uploader: "Alice Chen" },
    { id: 3, name: "Board Minutes - March 2026.docx", category: "Minutes", size: "340 KB", uploaded: "Mar 18, 2026", uploader: "Secretary" },
    { id: 4, name: "Bylaws Amendment Proposal.pdf", category: "Governance", size: "890 KB", uploaded: "Apr 28, 2026", uploader: "James Wright" },
    { id: 5, name: "Annual Report Draft.pdf", category: "Reports", size: "5.1 MB", uploaded: "Apr 30, 2026", uploader: "CEO Office" },
  ],
  members: [
    { id: 1, name: "Alice Chen", role: "Board Chair", email: "alice@org.org", committee: "Executive", joined: "2022", avatar: "AC" },
    { id: 2, name: "Robert Mills", role: "Treasurer", email: "robert@org.org", committee: "Finance", joined: "2021", avatar: "RM" },
    { id: 3, name: "Sarah Park", role: "Secretary", email: "sarah@org.org", committee: "Governance", joined: "2023", avatar: "SP" },
    { id: 4, name: "James Wright", role: "Board Member", email: "james@org.org", committee: "Program", joined: "2020", avatar: "JW" },
    { id: 5, name: "Donna Torres", role: "Vice Chair", email: "donna@org.org", committee: "Finance", joined: "2022", avatar: "DT" },
    { id: 6, name: "Kevin Yates", role: "Board Member", email: "kevin@org.org", committee: "Governance", joined: "2024", avatar: "KY" },
  ],
  discussions: [
    { id: 1, title: "Strategic Partnership Opportunity", author: "Alice Chen", date: "May 2, 2026", replies: 4, unread: true, tag: "Strategy" },
    { id: 2, title: "Upcoming Audit Preparation Notes", author: "Robert Mills", date: "Apr 30, 2026", replies: 2, unread: false, tag: "Finance" },
    { id: 3, title: "Board Retreat Agenda Ideas", author: "Sarah Park", date: "Apr 28, 2026", replies: 7, unread: true, tag: "General" },
    { id: 4, title: "Policy Update: Remote Voting Procedure", author: "James Wright", date: "Apr 25, 2026", replies: 3, unread: false, tag: "Governance" },
  ],
};

const BOARD_PASSWORD = "Board2026!";

const NAV = [
  { id: "dashboard", label: "Dashboard", icon: "⊞" },
  { id: "meetings", label: "Meetings", icon: "📅" },
  { id: "video", label: "Video Room", icon: "🎥" },
  { id: "documents", label: "Documents", icon: "📁" },
  { id: "tasks", label: "Tasks", icon: "✓" },
  { id: "polls", label: "Polls & Voting", icon: "🗳️" },
  { id: "minutes", label: "AI Minutes", icon: "🤖" },
  { id: "slides", label: "Slide Outlines", icon: "🎨" },
  { id: "members", label: "Members", icon: "👥" },
  { id: "discussions", label: "Discussions", icon: "💬" },
];

// ─── Shared UI ────────────────────────────────────────────────────────────────
function Av({ i, size=36, color=C.teal }) {
  return <div style={{width:size,height:size,borderRadius:"50%",background:color,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:size*.35,fontWeight:600,fontFamily:"'DM Sans'",flexShrink:0}}>{i}</div>;
}

function Bdg({ label }) {
  const M={high:["#FEE8E8",C.red],medium:["#FFF3DC","#B07A00"],low:["#E8F5EE",C.green],upcoming:["#E8F0FE","#2563EB"],completed:["#E8F5EE",C.green],pending:["#FFF3DC","#B07A00"],"in-progress":["#E8F0FE","#2563EB"],Finance:["#E8F0FE","#2563EB"],Governance:["#F3E8FE","#7C3AED"],Minutes:["#E8F5EE",C.green],Reports:["#FFF3DC","#B07A00"],Strategy:["#FEE8E8",C.red],General:["#F4F5F7",C.g600],open:["#E8F5EE",C.green],closed:["#F4F5F7",C.g400],live:["#FEE8E8",C.red]};
  const [bg,col]=M[label]||[C.g100,C.g600];
  return <span style={{background:bg,color:col,padding:"2px 10px",borderRadius:20,fontSize:12,fontWeight:600,fontFamily:"'DM Sans'",textTransform:"capitalize",whiteSpace:"nowrap"}}>{label}</span>;
}

function Card({ children, style={} }) {
  return <div style={{background:C.white,borderRadius:14,border:`1px solid ${C.g200}`,boxShadow:"0 2px 12px rgba(15,32,68,0.06)",padding:24,...style}}>{children}</div>;
}

function Btn({ children, onClick, variant="primary", style={}, disabled=false }) {
  const V={primary:{background:C.teal,color:"#fff",border:"none"},secondary:{background:C.g100,color:C.navy,border:"none"},navy:{background:C.navy,color:"#fff",border:"none"},outline:{background:"transparent",color:C.navy,border:`1px solid ${C.g200}`},danger:{background:C.red,color:"#fff",border:"none"}};
  return <button onClick={onClick} disabled={disabled} style={{...V[variant],borderRadius:8,padding:"8px 16px",fontFamily:"'DM Sans'",fontWeight:600,fontSize:13,cursor:disabled?"not-allowed":"pointer",opacity:disabled?.5:1,...style}}>{children}</button>;
}

function StatCard({ label, value, sub, icon, accent }) {
  return (
    <div style={{background:C.white,borderRadius:14,border:`1px solid ${C.g200}`,boxShadow:"0 2px 12px rgba(15,32,68,0.06)",padding:22,display:"flex",flexDirection:"column",gap:8,borderLeft:`4px solid ${accent}`}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <span style={{fontSize:13,color:C.g400,fontFamily:"'DM Sans'",fontWeight:500}}>{label}</span>
        <span style={{fontSize:22}}>{icon}</span>
      </div>
      <div style={{fontSize:32,fontWeight:700,color:C.navy,fontFamily:"'Playfair Display'"}}>{value}</div>
      {sub&&<div style={{fontSize:12,color:C.g400,fontFamily:"'DM Sans'"}}>{sub}</div>}
    </div>
  );
}

function SectionHeader({ title, action }) {
  return (
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
      <h2 style={{fontFamily:"'Playfair Display'",color:C.navy,fontSize:24,margin:0}}>{title}</h2>
      {action}
    </div>
  );
}

// ─── Login Gate ───────────────────────────────────────────────────────────────
function LoginGate({ onLogin }) {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState(false);
  const [show, setShow] = useState(false);

  const attempt = () => {
    if (pw === BOARD_PASSWORD) { onLogin(); }
    else { setErr(true); setPw(""); setTimeout(()=>setErr(false),2000); }
  };

  return (
    <div style={{minHeight:"100vh",background:`linear-gradient(135deg, ${C.navy} 0%, #1a3a6e 100%)`,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'DM Sans'"}}>
      <style>{FONTS}</style>
      <div style={{background:C.white,borderRadius:20,padding:"48px 44px",width:380,boxShadow:"0 24px 80px rgba(0,0,0,0.3)",textAlign:"center"}}>
        <div style={{width:60,height:60,borderRadius:16,background:C.teal,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 20px",fontSize:28}}>⊞</div>
        <h1 style={{fontFamily:"'Playfair Display'",color:C.navy,fontSize:26,margin:"0 0 6px"}}>BoardHub</h1>
        <p style={{color:C.g400,fontSize:14,margin:"0 0 28px"}}>Board Management Suite</p>
        <div style={{position:"relative",marginBottom:16}}>
          <input
            type={show?"text":"password"}
            value={pw}
            onChange={e=>{setPw(e.target.value);setErr(false);}}
            onKeyDown={e=>e.key==="Enter"&&attempt()}
            placeholder="Enter board password"
            style={{width:"100%",border:`2px solid ${err?C.red:C.g200}`,borderRadius:10,padding:"12px 44px 12px 16px",fontFamily:"'DM Sans'",fontSize:15,outline:"none",transition:"border 0.2s",boxSizing:"border-box",background:err?"#FFF5F5":C.white}}
          />
          <button onClick={()=>setShow(s=>!s)} style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",fontSize:18,color:C.g400}}>{show?"🙈":"👁️"}</button>
        </div>
        {err&&<p style={{color:C.red,fontSize:13,margin:"0 0 12px",fontWeight:600}}>Incorrect password. Please try again.</p>}
        <Btn onClick={attempt} style={{width:"100%",padding:13,fontSize:15}}>Access Board Portal</Btn>
        <p style={{color:C.g400,fontSize:12,marginTop:20}}>🔒 Secured access · Board members only</p>
      </div>
    </div>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
function Dashboard({ store, setNav }) {
  const upcoming = STATIC.meetings.filter(m=>m.status==="upcoming");
  const pending = store.tasks.filter(t=>t.status!=="completed");
  const highP = store.tasks.filter(t=>t.priority==="high"&&t.status!=="completed");
  const openP = store.polls.filter(p=>p.status==="open"&&!p.voted);

  return (
    <div style={{display:"flex",flexDirection:"column",gap:24}}>
      <div>
        <h2 style={{fontFamily:"'Playfair Display'",color:C.navy,fontSize:26,margin:"0 0 4px"}}>Good morning, Alice 👋</h2>
        <p style={{color:C.g400,fontFamily:"'DM Sans'",fontSize:14,margin:0}}>Here's what's happening with your board today.</p>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(148px,1fr))",gap:14}}>
        <StatCard label="Upcoming Meetings" value={upcoming.length} sub="Next: May 8" icon="📅" accent={C.teal}/>
        <StatCard label="Open Tasks" value={pending.length} sub={`${highP.length} high priority`} icon="✅" accent={C.gold}/>
        <StatCard label="Pending Votes" value={openP.length} sub="Need your vote" icon="🗳️" accent={C.green}/>
        <StatCard label="Saved Minutes" value={store.savedMinutes.length} sub="In documents" icon="📝" accent={C.navyL}/>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}}>
        <Card>
          <h3 style={{fontFamily:"'Playfair Display'",color:C.navy,fontSize:17,margin:"0 0 14px"}}>Upcoming Meetings</h3>
          {upcoming.map(m=>(
            <div key={m.id} style={{display:"flex",alignItems:"center",gap:13,padding:"10px 0",borderBottom:`1px solid ${C.g200}`}}>
              <div style={{background:C.navy,color:"#fff",borderRadius:10,padding:"7px 10px",textAlign:"center",minWidth:44}}>
                <div style={{fontSize:16,fontWeight:700,fontFamily:"'Playfair Display'"}}>{m.date.split("-")[2]}</div>
                <div style={{fontSize:9,fontFamily:"'DM Sans'",opacity:.8}}>{new Date(m.date).toLocaleString("default",{month:"short"})}</div>
              </div>
              <div style={{flex:1}}>
                <div style={{fontWeight:600,fontFamily:"'DM Sans'",color:C.navy,fontSize:14}}>{m.title}</div>
                <div style={{fontSize:12,color:C.g400,fontFamily:"'DM Sans'"}}>{m.time} · {m.location}</div>
              </div>
              <Btn onClick={()=>setNav("video")} style={{fontSize:11,padding:"5px 10px"}}>Join</Btn>
            </div>
          ))}
        </Card>
        <Card>
          <h3 style={{fontFamily:"'Playfair Display'",color:C.navy,fontSize:17,margin:"0 0 14px"}}>High Priority Tasks</h3>
          {highP.slice(0,4).map(t=>(
            <div key={t.id} style={{display:"flex",gap:10,alignItems:"flex-start",padding:"9px 0",borderBottom:`1px solid ${C.g200}`}}>
              <div style={{width:16,height:16,borderRadius:4,border:`2px solid ${C.red}`,flexShrink:0,marginTop:2}}/>
              <div style={{flex:1}}>
                <div style={{fontWeight:500,fontFamily:"'DM Sans'",color:C.navy,fontSize:13}}>{t.title}</div>
                <div style={{fontSize:11,color:C.g400,fontFamily:"'DM Sans'"}}>{t.assignee} · Due {t.due}</div>
              </div>
              <Bdg label={t.status}/>
            </div>
          ))}
        </Card>
      </div>
      <Card>
        <h3 style={{fontFamily:"'Playfair Display'",color:C.navy,fontSize:17,margin:"0 0 14px"}}>Quick Actions</h3>
        <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:12}}>
          {[["🎥","Start Video",C.red,"video"],["🤖","AI Minutes",C.teal,"minutes"],["🗳️","Create Poll",C.gold,"polls"],["🎨","Slide Outline",C.navyL,"slides"],["📁","Documents",C.g600,"documents"]].map(([icon,label,color,nav])=>(
            <div key={label} onClick={()=>setNav(nav)} style={{background:C.g100,borderRadius:12,padding:"16px 10px",display:"flex",flexDirection:"column",alignItems:"center",gap:8,cursor:"pointer"}}>
              <div style={{width:42,height:42,borderRadius:12,background:color,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>{icon}</div>
              <span style={{fontFamily:"'DM Sans'",fontSize:12,fontWeight:600,color:C.navy,textAlign:"center",lineHeight:1.3}}>{label}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ─── Meetings ─────────────────────────────────────────────────────────────────
function Meetings({ setNav }) {
  const [sel, setSel] = useState(null);
  const m = STATIC.meetings.find(x=>x.id===sel);
  return (
    <div style={{display:"flex",gap:20,height:"100%"}}>
      <div style={{flex:"0 0 290px",display:"flex",flexDirection:"column",gap:10}}>
        <SectionHeader title="Meetings" action={<Btn>+ New</Btn>}/>
        <div style={{marginTop:4,display:"flex",flexDirection:"column",gap:10}}>
          {STATIC.meetings.map(x=>(
            <div key={x.id} onClick={()=>setSel(x.id)} style={{background:sel===x.id?C.navy:C.white,color:sel===x.id?"#fff":C.navy,borderRadius:12,padding:"13px 15px",cursor:"pointer",border:`1px solid ${sel===x.id?C.navy:C.g200}`,boxShadow:"0 2px 8px rgba(15,32,68,0.05)"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                <div style={{fontWeight:600,fontFamily:"'DM Sans'",fontSize:14}}>{x.title}</div>
                <Bdg label={x.status}/>
              </div>
              <div style={{fontSize:12,opacity:.7,fontFamily:"'DM Sans'",marginTop:5}}>{new Date(x.date).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})} · {x.time}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{flex:1}}>
        {m?(
          <Card style={{height:"100%",overflowY:"auto"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:20}}>
              <div>
                <h2 style={{fontFamily:"'Playfair Display'",color:C.navy,fontSize:22,margin:"0 0 4px"}}>{m.title}</h2>
                <p style={{color:C.g400,fontFamily:"'DM Sans'",fontSize:13,margin:0}}>{new Date(m.date).toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric",year:"numeric"})} · {m.time} · {m.location}</p>
              </div>
              <div style={{display:"flex",gap:8}}>
                <Bdg label={m.status}/>
                {m.status==="upcoming"&&<Btn variant="navy" onClick={()=>setNav("video")}>🎥 Join</Btn>}
              </div>
            </div>
            <h3 style={{fontFamily:"'Playfair Display'",color:C.navy,fontSize:15,margin:"0 0 10px"}}>Attendees</h3>
            <div style={{display:"flex",gap:7,flexWrap:"wrap",marginBottom:22}}>
              {m.attendees.map(a=>(
                <div key={a} style={{display:"flex",alignItems:"center",gap:6,background:C.g100,borderRadius:20,padding:"4px 10px 4px 5px"}}>
                  <Av i={a.split(" ").map(n=>n[0]).join("")} size={20} color={C.navyL}/>
                  <span style={{fontSize:12,fontFamily:"'DM Sans'",color:C.navy}}>{a}</span>
                </div>
              ))}
            </div>
            {m.agenda.length>0&&<>
              <h3 style={{fontFamily:"'Playfair Display'",color:C.navy,fontSize:15,margin:"0 0 10px"}}>Agenda</h3>
              <div style={{display:"flex",flexDirection:"column",gap:7}}>
                {m.agenda.map((a,i)=>(
                  <div key={a.id} style={{display:"flex",gap:12,alignItems:"center",padding:"10px 13px",background:C.g100,borderRadius:9}}>
                    <div style={{width:24,height:24,borderRadius:"50%",background:C.navy,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,fontFamily:"'DM Sans'",flexShrink:0}}>{i+1}</div>
                    <div style={{flex:1}}>
                      <div style={{fontWeight:500,fontFamily:"'DM Sans'",color:C.navy,fontSize:13}}>{a.title}</div>
                      <div style={{fontSize:11,color:C.g400,fontFamily:"'DM Sans'"}}>{a.presenter}</div>
                    </div>
                    <span style={{fontSize:11,color:C.g400,fontFamily:"'DM Sans'",background:C.white,padding:"3px 9px",borderRadius:20}}>{a.duration}m</span>
                  </div>
                ))}
              </div>
            </>}
          </Card>
        ):(
          <Card style={{height:"100%",display:"flex",alignItems:"center",justifyContent:"center"}}>
            <div style={{textAlign:"center",color:C.g400}}>
              <div style={{fontSize:48,marginBottom:12}}>📅</div>
              <p style={{fontFamily:"'DM Sans'",fontSize:15}}>Select a meeting to view details</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}

// ─── Video Room ───────────────────────────────────────────────────────────────
function VideoRoom() {
  const [inCall,setInCall]=useState(false);
  const [muted,setMuted]=useState(false);
  const [vidOff,setVidOff]=useState(false);
  const [rec,setRec]=useState(false);
  const [chat,setChat]=useState([{id:1,author:"Robert Mills",msg:"Good morning everyone!",time:"10:02 AM"},{id:2,author:"Sarah Park",msg:"Morning! Ready to start.",time:"10:03 AM"}]);
  const [ci,setCi]=useState("");
  const participants=STATIC.members.slice(0,4);
  const send=()=>{if(!ci.trim())return;setChat(c=>[...c,{id:Date.now(),author:"Alice Chen",msg:ci,time:"Now"}]);setCi("");};

  if(!inCall) return (
    <div style={{display:"flex",flexDirection:"column",gap:24}}>
      <div><h2 style={{fontFamily:"'Playfair Display'",color:C.navy,fontSize:26,margin:"0 0 4px"}}>Video Meetings</h2><p style={{color:C.g400,fontFamily:"'DM Sans'",fontSize:14,margin:0}}>Start or join a secure board video meeting.</p></div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}}>
        <Card style={{display:"flex",flexDirection:"column",gap:16,alignItems:"center",textAlign:"center",padding:36}}>
          <div style={{width:70,height:70,borderRadius:20,background:`linear-gradient(135deg,${C.teal},${C.navyL})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:34}}>🎥</div>
          <h3 style={{fontFamily:"'Playfair Display'",color:C.navy,fontSize:20,margin:0}}>Start Instant Meeting</h3>
          <p style={{color:C.g400,fontFamily:"'DM Sans'",fontSize:14,margin:0}}>Launch a secure video room and invite board members.</p>
          <Btn onClick={()=>setInCall(true)} style={{width:"100%",padding:12}}>Start Meeting Now</Btn>
        </Card>
        <Card>
          <h3 style={{fontFamily:"'Playfair Display'",color:C.navy,fontSize:18,margin:"0 0 14px"}}>Scheduled Meetings</h3>
          {STATIC.meetings.filter(m=>m.status==="upcoming").map(m=>(
            <div key={m.id} style={{display:"flex",gap:12,alignItems:"center",padding:"10px 0",borderBottom:`1px solid ${C.g200}`}}>
              <div style={{background:C.navy,color:"#fff",borderRadius:8,padding:"7px 9px",textAlign:"center",minWidth:42}}>
                <div style={{fontSize:15,fontWeight:700,fontFamily:"'Playfair Display'"}}>{m.date.split("-")[2]}</div>
                <div style={{fontSize:9,fontFamily:"'DM Sans'",opacity:.7}}>{new Date(m.date).toLocaleString("default",{month:"short"})}</div>
              </div>
              <div style={{flex:1}}><div style={{fontWeight:600,fontFamily:"'DM Sans'",color:C.navy,fontSize:13}}>{m.title}</div><div style={{fontSize:11,color:C.g400,fontFamily:"'DM Sans'"}}>{m.time}</div></div>
              <Btn onClick={()=>setInCall(true)} style={{fontSize:12,padding:"6px 12px"}}>Join</Btn>
            </div>
          ))}
        </Card>
      </div>
      <Card>
        <h3 style={{fontFamily:"'Playfair Display'",color:C.navy,fontSize:17,margin:"0 0 12px"}}>Platform Features</h3>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:10}}>
          {[["🎙️","HD Audio & Video"],["📝","Live AI Minutes"],["🔒","End-to-End Encrypted"],["📊","Screen Sharing"],["💬","In-Meeting Chat"],["⏺️","Session Recording"]].map(([ic,lb])=>(
            <div key={lb} style={{background:C.g100,borderRadius:10,padding:"12px",display:"flex",gap:9,alignItems:"center"}}><span style={{fontSize:19}}>{ic}</span><span style={{fontFamily:"'DM Sans'",fontSize:12,fontWeight:500,color:C.navy}}>{lb}</span></div>
          ))}
        </div>
      </Card>
    </div>
  );

  return (
    <div style={{display:"flex",flexDirection:"column",height:"100%",background:"#0D1B2A",borderRadius:16,overflow:"hidden"}}>
      <div style={{background:"#0D1B2A",padding:"13px 20px",display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:"1px solid rgba(255,255,255,0.08)"}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          {rec&&<><span style={{width:8,height:8,borderRadius:"50%",background:C.red,display:"inline-block"}}/><span style={{color:C.red,fontFamily:"'DM Sans'",fontSize:12,fontWeight:600}}>REC</span></>}
          <span style={{color:"#fff",fontFamily:"'Playfair Display'",fontSize:15}}>Q2 Board Meeting</span>
          <Bdg label="live"/>
        </div>
        <span style={{color:"rgba(255,255,255,0.4)",fontFamily:"'DM Sans'",fontSize:13}}>10:04 AM · {participants.length} participants</span>
      </div>
      <div style={{flex:1,display:"flex",overflow:"hidden"}}>
        <div style={{flex:1,padding:12,display:"grid",gridTemplateColumns:"1fr 1fr",gridTemplateRows:"1fr 1fr",gap:8}}>
          {participants.map((p,i)=>(
            <div key={p.id} style={{background:i===0?"#1a2f4e":"#162240",borderRadius:10,position:"relative",display:"flex",alignItems:"center",justifyContent:"center",border:i===0?`2px solid ${C.teal}`:"2px solid transparent"}}>
              <Av i={p.avatar} size={50} color={i===0?C.teal:C.navyL}/>
              <div style={{position:"absolute",bottom:8,left:10,display:"flex",alignItems:"center",gap:5}}>
                <span style={{background:"rgba(0,0,0,0.6)",color:"#fff",borderRadius:6,padding:"2px 7px",fontSize:11,fontFamily:"'DM Sans'"}}>{i===0?"You":p.name}</span>
                {i===0&&muted&&<span style={{background:C.red,borderRadius:4,padding:"1px 5px",fontSize:10,color:"#fff"}}>🔇</span>}
              </div>
            </div>
          ))}
        </div>
        <div style={{width:240,background:"#111d30",display:"flex",flexDirection:"column",borderLeft:"1px solid rgba(255,255,255,0.06)"}}>
          <div style={{padding:"12px 14px",borderBottom:"1px solid rgba(255,255,255,0.06)",color:"#fff",fontFamily:"'DM Sans'",fontWeight:600,fontSize:13}}>Chat</div>
          <div style={{flex:1,overflowY:"auto",padding:10,display:"flex",flexDirection:"column",gap:9}}>
            {chat.map(msg=>(
              <div key={msg.id}>
                <div style={{fontSize:10,color:"rgba(255,255,255,0.35)",fontFamily:"'DM Sans'",marginBottom:2}}>{msg.author} · {msg.time}</div>
                <div style={{background:msg.author==="Alice Chen"?C.teal:"rgba(255,255,255,0.08)",color:"#fff",borderRadius:8,padding:"7px 10px",fontSize:13,fontFamily:"'DM Sans'"}}>{msg.msg}</div>
              </div>
            ))}
          </div>
          <div style={{padding:8,borderTop:"1px solid rgba(255,255,255,0.06)",display:"flex",gap:5}}>
            <input value={ci} onChange={e=>setCi(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder="Message…" style={{flex:1,background:"rgba(255,255,255,0.08)",border:"none",borderRadius:7,padding:"7px 10px",color:"#fff",fontFamily:"'DM Sans'",fontSize:12,outline:"none"}}/>
            <button onClick={send} style={{background:C.teal,border:"none",borderRadius:7,color:"#fff",padding:"7px 11px",cursor:"pointer",fontSize:13}}>➤</button>
          </div>
        </div>
      </div>
      <div style={{background:"#0D1B2A",padding:"13px 20px",borderTop:"1px solid rgba(255,255,255,0.08)",display:"flex",justifyContent:"center",gap:9,alignItems:"center"}}>
        {[[muted?"🔇":"🎙️",muted?"Unmute":"Mute",()=>setMuted(m=>!m),muted],[vidOff?"📵":"📹",vidOff?"Start":"Stop Video",()=>setVidOff(v=>!v),vidOff],["🖥️","Share",()=>{},false],[rec?"⏹️":"⏺️",rec?"Stop":"Record",()=>setRec(r=>!r),rec]].map(([ic,lb,fn,act])=>(
          <button key={lb} onClick={fn} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:3,background:act?"rgba(224,82,82,0.18)":"rgba(255,255,255,0.08)",border:`1px solid ${act?C.red:"transparent"}`,borderRadius:9,padding:"8px 13px",cursor:"pointer",color:"#fff",minWidth:60}}>
            <span style={{fontSize:17}}>{ic}</span>
            <span style={{fontSize:10,fontFamily:"'DM Sans'",opacity:.7}}>{lb}</span>
          </button>
        ))}
        <button onClick={()=>setInCall(false)} style={{background:C.red,border:"none",borderRadius:9,padding:"10px 22px",color:"#fff",fontFamily:"'DM Sans'",fontWeight:700,fontSize:14,cursor:"pointer",marginLeft:12}}>Leave</button>
      </div>
    </div>
  );
}

// ─── Documents ────────────────────────────────────────────────────────────────
function Documents({ store }) {
  const [filter,setFilter]=useState("All");
  const cats=["All",...new Set(STATIC.documents.map(d=>d.category))];
  const docs=filter==="All"?STATIC.documents:STATIC.documents.filter(d=>d.category===filter);
  const icons={Finance:"💰",Governance:"⚖️",Minutes:"📝",Reports:"📊"};
  return (
    <div style={{display:"flex",flexDirection:"column",gap:20}}>
      <SectionHeader title="Document Center" action={<Btn>+ Upload</Btn>}/>
      <div style={{display:"flex",gap:7,flexWrap:"wrap"}}>
        {cats.map(c=><button key={c} onClick={()=>setFilter(c)} style={{padding:"5px 14px",borderRadius:20,border:`1px solid ${filter===c?C.navy:C.g200}`,background:filter===c?C.navy:C.white,color:filter===c?"#fff":C.g600,fontFamily:"'DM Sans'",fontWeight:500,fontSize:12,cursor:"pointer"}}>{c}</button>)}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:13}}>
        {[...docs,...(store.savedMinutes.map(m=>({id:"m"+m.id,name:`Minutes – ${m.title}`,category:"Minutes",size:"—",uploaded:m.date,uploader:"AI Generated"})))].map(doc=>(
          <Card key={doc.id} style={{display:"flex",flexDirection:"column",gap:11,padding:16,cursor:"pointer"}}>
            <div style={{display:"flex",gap:11,alignItems:"flex-start"}}>
              <div style={{fontSize:28}}>{icons[doc.category]||"📄"}</div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontWeight:600,fontFamily:"'DM Sans'",color:C.navy,fontSize:13,lineHeight:1.3}}>{doc.name}</div>
                <div style={{fontSize:11,color:C.g400,fontFamily:"'DM Sans'",marginTop:1}}>{doc.size}</div>
              </div>
            </div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <Bdg label={doc.category}/>
              <span style={{fontSize:11,color:C.g400,fontFamily:"'DM Sans'"}}>{doc.uploaded}</span>
            </div>
            <div style={{display:"flex",gap:7}}>
              <button style={{flex:1,padding:"6px",background:C.navy,color:"#fff",border:"none",borderRadius:6,fontFamily:"'DM Sans'",fontSize:12,cursor:"pointer",fontWeight:500}}>View</button>
              <button style={{flex:1,padding:"6px",background:C.g100,color:C.navy,border:"none",borderRadius:6,fontFamily:"'DM Sans'",fontSize:12,cursor:"pointer",fontWeight:500}}>Download</button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ─── Tasks ────────────────────────────────────────────────────────────────────
function Tasks({ store, update }) {
  const toggle=id=>update({tasks:store.tasks.map(t=>t.id===id?{...t,status:t.status==="completed"?"pending":"completed"}:t)});
  const by=s=>store.tasks.filter(t=>t.status===s);
  const Col=({title,items,color})=>(
    <div style={{flex:1,minWidth:190}}>
      <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:11}}>
        <div style={{width:9,height:9,borderRadius:"50%",background:color}}/>
        <span style={{fontFamily:"'DM Sans'",fontWeight:600,color:C.navy,fontSize:13}}>{title}</span>
        <span style={{background:C.g100,color:C.g600,borderRadius:10,padding:"1px 7px",fontSize:11,fontFamily:"'DM Sans'"}}>{items.length}</span>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:9}}>
        {items.map(t=>(
          <div key={t.id} style={{background:C.white,borderRadius:10,padding:12,border:`1px solid ${C.g200}`}}>
            <div style={{display:"flex",gap:8,alignItems:"flex-start"}}>
              <input type="checkbox" checked={t.status==="completed"} onChange={()=>toggle(t.id)} style={{marginTop:3,cursor:"pointer",accentColor:C.teal}}/>
              <div style={{flex:1}}>
                <div style={{fontWeight:500,fontFamily:"'DM Sans'",color:t.status==="completed"?C.g400:C.navy,fontSize:13,textDecoration:t.status==="completed"?"line-through":"none"}}>{t.title}</div>
                <div style={{fontSize:11,color:C.g400,fontFamily:"'DM Sans'",marginTop:3}}>{t.assignee}</div>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:7}}>
                  <Bdg label={t.priority}/>
                  <span style={{fontSize:11,color:C.g400,fontFamily:"'DM Sans'"}}>{t.due}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
  return (
    <div style={{display:"flex",flexDirection:"column",gap:20}}>
      <SectionHeader title="Task Manager" action={<Btn>+ Add Task</Btn>}/>
      <div style={{display:"flex",gap:14,overflowX:"auto"}}>
        <Col title="Pending" items={by("pending")} color={C.gold}/>
        <Col title="In Progress" items={by("in-progress")} color={C.teal}/>
        <Col title="Completed" items={by("completed")} color={C.green}/>
      </div>
    </div>
  );
}

// ─── Polls ────────────────────────────────────────────────────────────────────
function Polls({ store, update }) {
  const [vid,setVid]=useState(null);
  const [sel,setSel]=useState(null);
  const [showNew,setShowNew]=useState(false);
  const [newQ,setNewQ]=useState("");
  const cast=pid=>{
    if(!sel)return;
    update({polls:store.polls.map(p=>p.id===pid?{...p,voted:true,options:p.options.map(o=>o.id===sel?{...o,votes:o.votes+1}:o)}:p)});
    setVid(null);setSel(null);
  };
  return (
    <div style={{display:"flex",flexDirection:"column",gap:22}}>
      <SectionHeader title="Polls & Voting" action={<Btn onClick={()=>setShowNew(true)}>+ Create Poll</Btn>}/>
      {showNew&&(
        <Card style={{border:`2px solid ${C.teal}`}}>
          <h3 style={{fontFamily:"'Playfair Display'",color:C.navy,fontSize:16,margin:"0 0 11px"}}>New Poll</h3>
          <input value={newQ} onChange={e=>setNewQ(e.target.value)} placeholder="Enter poll question…" style={{width:"100%",border:`1px solid ${C.g200}`,borderRadius:8,padding:"9px 12px",fontFamily:"'DM Sans'",fontSize:14,outline:"none",marginBottom:11}}/>
          <div style={{display:"flex",gap:8}}>
            <Btn onClick={()=>{if(newQ.trim()){update({polls:[...store.polls,{id:Date.now(),question:newQ,creator:"Alice Chen",deadline:"May 20, 2026",status:"open",options:[{id:"yes",label:"Yes",votes:0},{id:"no",label:"No",votes:0},{id:"abstain",label:"Abstain",votes:0}],totalEligible:6,voted:false}]});setNewQ("");setShowNew(false);}}}>Create</Btn>
            <Btn variant="secondary" onClick={()=>setShowNew(false)}>Cancel</Btn>
          </div>
        </Card>
      )}
      {store.polls.map(poll=>{
        const total=poll.options.reduce((s,o)=>s+o.votes,0);
        const voting=vid===poll.id;
        return (
          <Card key={poll.id} style={{borderLeft:`4px solid ${poll.status==="open"?C.teal:C.g200}`}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14}}>
              <div style={{flex:1}}>
                <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:5}}><Bdg label={poll.status}/>{poll.voted&&<span style={{fontSize:12,color:C.green,fontFamily:"'DM Sans'",fontWeight:600}}>✓ Voted</span>}</div>
                <h3 style={{fontFamily:"'Playfair Display'",color:C.navy,fontSize:17,margin:"0 0 3px"}}>{poll.question}</h3>
                <p style={{color:C.g400,fontFamily:"'DM Sans'",fontSize:12,margin:0}}>By {poll.creator} · Due {poll.deadline} · {total}/{poll.totalEligible} voted</p>
              </div>
              {poll.status==="open"&&!poll.voted&&!voting&&<Btn onClick={()=>{setVid(poll.id);setSel(null);}}>Cast Vote</Btn>}
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:9}}>
              {poll.options.map(opt=>{
                const pct=total>0?Math.round((opt.votes/total)*100):0;
                return (
                  <div key={opt.id}>
                    {voting?(
                      <div onClick={()=>setSel(opt.id)} style={{display:"flex",alignItems:"center",gap:11,padding:"9px 12px",borderRadius:9,border:`2px solid ${sel===opt.id?C.teal:C.g200}`,background:sel===opt.id?"#F0FFFE":C.white,cursor:"pointer"}}>
                        <div style={{width:15,height:15,borderRadius:"50%",border:`2px solid ${sel===opt.id?C.teal:C.g200}`,background:sel===opt.id?C.teal:"transparent",flexShrink:0}}/>
                        <span style={{fontFamily:"'DM Sans'",fontSize:13,fontWeight:sel===opt.id?600:400,color:C.navy}}>{opt.label}</span>
                      </div>
                    ):(
                      <div>
                        <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                          <span style={{fontFamily:"'DM Sans'",fontSize:13,color:C.navy}}>{opt.label}</span>
                          <span style={{fontFamily:"'DM Sans'",fontSize:12,color:C.g400}}>{opt.votes} ({pct}%)</span>
                        </div>
                        <div style={{height:7,background:C.g100,borderRadius:4,overflow:"hidden"}}>
                          <div style={{height:"100%",width:`${pct}%`,background:pct>=50?C.teal:C.navyL,borderRadius:4,transition:"width .5s"}}/>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            {voting&&<div style={{display:"flex",gap:8,marginTop:13}}><Btn disabled={!sel} onClick={()=>cast(poll.id)}>Submit Vote</Btn><Btn variant="secondary" onClick={()=>setVid(null)}>Cancel</Btn></div>}
          </Card>
        );
      })}
    </div>
  );
}

// ─── AI Minutes ───────────────────────────────────────────────────────────────
function Minutes({ store, update }) {
  const [sid,setSid]=useState(null);
  const [notes,setNotes]=useState("");
  const [result,setResult]=useState("");
  const [loading,setLoading]=useState(false);
  const [err,setErr]=useState("");
  const [step,setStep]=useState(1);
  const mtg=STATIC.meetings.find(m=>m.id===sid);

  const generate=async()=>{
    if(!mtg)return;
    setLoading(true);setErr("");setResult("");
    const agenda=mtg.agenda.map((a,i)=>`${i+1}. ${a.title} (${a.duration} min, ${a.presenter})`).join("\n");
    try{
      const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,messages:[{role:"user",content:`You are a professional nonprofit board secretary. Generate complete, formal board meeting minutes.\n\nMeeting: ${mtg.title}\nDate: ${new Date(mtg.date).toLocaleDateString("en-US",{weekday:"long",year:"numeric",month:"long",day:"numeric"})}\nTime: ${mtg.time} | Location: ${mtg.location}\nAttendees: ${mtg.attendees.join(", ")}\n\nAgenda:\n${agenda}\n\nNotes:\n${notes||"None."}\n\nGenerate complete minutes: call to order, quorum, agenda summaries with discussion, motions/votes, action items with owners, adjournment. Use formal governance language.`}]})});
      const j=await res.json();
      const text=j.content?.find(b=>b.type==="text")?.text||"";
      if(!text)throw new Error();
      setResult(text);setStep(3);
    }catch{setErr("Generation failed. Please try again.");}
    setLoading(false);
  };

  const save=()=>{
    const entry={id:Date.now(),title:mtg?.title||"Meeting",date:new Date().toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"}),content:result};
    update({savedMinutes:[...store.savedMinutes,entry]});
    alert("Minutes saved to Documents!");
  };

  const Steps=()=>(
    <div style={{display:"flex",alignItems:"center",gap:0,marginBottom:4}}>
      {["Select Meeting","Add Notes","Review Minutes"].map((s,i)=>(
        <div key={s} style={{display:"flex",alignItems:"center"}}>
          <div style={{display:"flex",alignItems:"center",gap:7}}>
            <div style={{width:25,height:25,borderRadius:"50%",background:step>i+1?C.green:step===i+1?C.teal:C.g200,color:step>=i+1?"#fff":C.g400,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,fontFamily:"'DM Sans'"}}>{step>i+1?"✓":i+1}</div>
            <span style={{fontFamily:"'DM Sans'",fontSize:12,fontWeight:step===i+1?600:400,color:step===i+1?C.navy:C.g400}}>{s}</span>
          </div>
          {i<2&&<div style={{width:32,height:2,background:step>i+1?C.green:C.g200,margin:"0 8px"}}/>}
        </div>
      ))}
    </div>
  );

  return (
    <div style={{display:"flex",flexDirection:"column",gap:22}}>
      <div><h2 style={{fontFamily:"'Playfair Display'",color:C.navy,fontSize:26,margin:"0 0 4px"}}>AI Minutes Maker</h2><p style={{color:C.g400,fontFamily:"'DM Sans'",fontSize:14,margin:0}}>Generate professional board minutes from your agenda instantly.</p></div>
      <Steps/>
      {step===1&&(
        <Card>
          <h3 style={{fontFamily:"'Playfair Display'",color:C.navy,fontSize:16,margin:"0 0 13px"}}>Select a Meeting</h3>
          <div style={{display:"flex",flexDirection:"column",gap:9}}>
            {STATIC.meetings.map(m=>(
              <div key={m.id} onClick={()=>setSid(m.id)} style={{display:"flex",gap:12,alignItems:"center",padding:"12px 14px",borderRadius:9,border:`2px solid ${sid===m.id?C.teal:C.g200}`,background:sid===m.id?"#F0FFFE":C.white,cursor:"pointer"}}>
                <div style={{width:16,height:16,borderRadius:"50%",border:`2px solid ${sid===m.id?C.teal:C.g200}`,background:sid===m.id?C.teal:"transparent",flexShrink:0}}/>
                <div style={{flex:1}}><div style={{fontWeight:600,fontFamily:"'DM Sans'",color:C.navy,fontSize:13}}>{m.title}</div><div style={{fontSize:11,color:C.g400,fontFamily:"'DM Sans'"}}>{new Date(m.date).toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"})} · {m.attendees.length} attendees</div></div>
                <Bdg label={m.status}/>
              </div>
            ))}
          </div>
          <div style={{marginTop:16}}><Btn disabled={!sid} onClick={()=>setStep(2)}>Continue →</Btn></div>
        </Card>
      )}
      {step===2&&mtg&&(
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <Card>
            <h3 style={{fontFamily:"'Playfair Display'",color:C.navy,fontSize:16,margin:"0 0 3px"}}>{mtg.title}</h3>
            <p style={{color:C.g400,fontFamily:"'DM Sans'",fontSize:13,margin:"0 0 12px"}}>{new Date(mtg.date).toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric",year:"numeric"})}</p>
            <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:14}}>{mtg.attendees.map(a=><div key={a} style={{display:"flex",alignItems:"center",gap:5,background:C.g100,borderRadius:20,padding:"3px 9px 3px 4px"}}><Av i={a.split(" ").map(n=>n[0]).join("")} size={16} color={C.navyL}/><span style={{fontSize:11,fontFamily:"'DM Sans'",color:C.navy}}>{a}</span></div>)}</div>
            {mtg.agenda.map((a,i)=><div key={a.id} style={{display:"flex",gap:9,alignItems:"center",padding:"6px 0",borderBottom:`1px solid ${C.g200}`}}><span style={{fontFamily:"'DM Sans'",fontSize:12,color:C.g400,minWidth:16}}>{i+1}.</span><span style={{fontFamily:"'DM Sans'",fontSize:12,color:C.navy,flex:1}}>{a.title}</span><span style={{fontSize:11,color:C.g400,fontFamily:"'DM Sans'"}}>{a.duration}m</span></div>)}
          </Card>
          <Card>
            <h3 style={{fontFamily:"'Playfair Display'",color:C.navy,fontSize:16,margin:"0 0 6px"}}>Meeting Notes <span style={{fontSize:13,color:C.g400,fontFamily:"'DM Sans'",fontWeight:400}}>(optional)</span></h3>
            <textarea value={notes} onChange={e=>setNotes(e.target.value)} rows={5} placeholder="Key decisions, motions, votes, highlights…" style={{width:"100%",border:`1px solid ${C.g200}`,borderRadius:9,padding:"10px 12px",fontFamily:"'DM Sans'",fontSize:13,resize:"vertical",outline:"none",lineHeight:1.6}}/>
          </Card>
          <div style={{display:"flex",gap:8,alignItems:"center"}}>
            <Btn variant="secondary" onClick={()=>setStep(1)}>← Back</Btn>
            <Btn onClick={generate}>{loading?"Generating…":"🤖 Generate Minutes"}</Btn>
            {err&&<span style={{color:C.red,fontFamily:"'DM Sans'",fontSize:13}}>{err}</span>}
          </div>
          {loading&&<Card style={{textAlign:"center",padding:36}}><div style={{fontSize:38,marginBottom:12}}>🤖</div><div style={{fontFamily:"'Playfair Display'",color:C.navy,fontSize:18,marginBottom:6}}>Drafting Minutes…</div><div style={{color:C.g400,fontFamily:"'DM Sans'",fontSize:13}}>AI is writing professional board minutes from your agenda.</div></Card>}
        </div>
      )}
      {step===3&&result&&(
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <Card style={{borderLeft:`4px solid ${C.green}`}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
              <div style={{display:"flex",alignItems:"center",gap:9}}><span style={{fontSize:20}}>✅</span><h3 style={{fontFamily:"'Playfair Display'",color:C.navy,fontSize:17,margin:0}}>Minutes Generated</h3></div>
              <div style={{display:"flex",gap:8}}><Btn variant="secondary" onClick={()=>{setStep(2);setResult("");}}>Regenerate</Btn><Btn variant="navy" onClick={save}>📥 Save to Documents</Btn></div>
            </div>
            <div style={{background:C.g100,borderRadius:9,padding:"16px 20px",maxHeight:440,overflowY:"auto"}}>
              <pre style={{fontFamily:"'DM Sans'",fontSize:13,color:C.navy,whiteSpace:"pre-wrap",lineHeight:1.8,margin:0}}>{result}</pre>
            </div>
          </Card>
          <div style={{display:"flex",gap:8}}>
            <Btn onClick={()=>{setStep(1);setSid(null);setNotes("");setResult("");}}>Start New</Btn>
            <Btn variant="outline" onClick={()=>navigator.clipboard?.writeText(result)}>📋 Copy</Btn>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Slide Outlines ───────────────────────────────────────────────────────────
function Slides({ store, update }) {
  const [sid,setSid]=useState(null);
  const [ctx,setCtx]=useState("");
  const [result,setResult]=useState(null);
  const [loading,setLoading]=useState(false);
  const [err,setErr]=useState("");
  const [step,setStep]=useState(1);
  const [viewSaved,setViewSaved]=useState(null);
  const mtg=STATIC.meetings.find(m=>m.id===sid);

  const generate=async()=>{
    if(!mtg)return;
    setLoading(true);setErr("");setResult(null);
    const agenda=mtg.agenda.map((a,i)=>`${i+1}. ${a.title} (${a.duration} min)`).join("\n");
    try{
      const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,messages:[{role:"user",content:`You are creating a board presentation outline. Return ONLY a valid JSON array of slide objects, no markdown, no explanation.\n\nEach slide object must have:\n- "title": string (slide title)\n- "subtitle": string (optional subtitle or null)\n- "bullets": array of strings (3-5 bullet points)\n- "notes": string (speaker notes, 1-2 sentences)\n- "type": one of "title","agenda","content","data","closing"\n\nMeeting: ${mtg.title}\nDate: ${new Date(mtg.date).toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"})}\nAgenda:\n${agenda}\nContext: ${ctx||"Standard board meeting presentation."}\n\nGenerate 8-12 slides covering: title slide, agenda overview, one slide per major agenda item, and a closing/next steps slide. Return only the JSON array.`}]})});
      const j=await res.json();
      const text=j.content?.find(b=>b.type==="text")?.text||"";
      const clean=text.replace(/```json|```/g,"").trim();
      const slides=JSON.parse(clean);
      setResult(slides);setStep(3);
    }catch(e){setErr("Generation failed. Check your connection and try again.");}
    setLoading(false);
  };

  const save=()=>{
    const entry={id:Date.now(),title:mtg?.title||"Meeting",date:new Date().toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"}),slides:result};
    update({savedSlides:[...store.savedSlides,entry]});
    alert("Slide outline saved!");
  };

  const typeColors={title:[C.navy,"#fff"],agenda:[C.teal,"#fff"],content:[C.white,C.navy],data:["#FFF3DC",C.navy],closing:[C.navyL,"#fff"]};
  const typeIcons={title:"🏛️",agenda:"📋",content:"📄",data:"📊",closing:"✅"};

  if(viewSaved) return (
    <div style={{display:"flex",flexDirection:"column",gap:20}}>
      <div style={{display:"flex",gap:10,alignItems:"center"}}>
        <Btn variant="secondary" onClick={()=>setViewSaved(null)}>← Back</Btn>
        <h2 style={{fontFamily:"'Playfair Display'",color:C.navy,fontSize:22,margin:0}}>{viewSaved.title} — Slides</h2>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:14}}>
        {viewSaved.slides.map((slide,i)=>{
          const [bg,col]=typeColors[slide.type]||[C.white,C.navy];
          return (
            <div key={i} style={{background:bg,borderRadius:14,padding:"22px 26px",border:`1px solid ${C.g200}`,position:"relative"}}>
              <div style={{position:"absolute",top:16,right:18,display:"flex",gap:8,alignItems:"center"}}>
                <span style={{fontSize:16}}>{typeIcons[slide.type]||"📄"}</span>
                <span style={{fontSize:11,fontFamily:"'DM Sans'",color:col,opacity:.6,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.08em"}}>Slide {i+1}</span>
              </div>
              <h3 style={{fontFamily:"'Playfair Display'",color:col,fontSize:18,margin:"0 0 4px"}}>{slide.title}</h3>
              {slide.subtitle&&<p style={{color:col,opacity:.7,fontFamily:"'DM Sans'",fontSize:13,margin:"0 0 12px"}}>{slide.subtitle}</p>}
              <ul style={{margin:"0 0 12px",paddingLeft:18}}>
                {slide.bullets.map((b,bi)=><li key={bi} style={{color:col,fontFamily:"'DM Sans'",fontSize:13,marginBottom:4,opacity:.9}}>{b}</li>)}
              </ul>
              <div style={{borderTop:`1px solid ${col}22`,paddingTop:10,marginTop:10}}>
                <span style={{fontSize:11,fontFamily:"'DM Sans'",color:col,opacity:.55,fontStyle:"italic"}}>🎙 {slide.notes}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div style={{display:"flex",flexDirection:"column",gap:22}}>
      <div><h2 style={{fontFamily:"'Playfair Display'",color:C.navy,fontSize:26,margin:"0 0 4px"}}>🎨 Slide Outlines</h2><p style={{color:C.g400,fontFamily:"'DM Sans'",fontSize:14,margin:0}}>Generate a slide-by-slide presentation outline from any meeting agenda. Paste into PowerPoint or Google Slides.</p></div>

      {store.savedSlides.length>0&&(
        <Card>
          <h3 style={{fontFamily:"'Playfair Display'",color:C.navy,fontSize:16,margin:"0 0 12px"}}>Saved Outlines</h3>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {store.savedSlides.map(s=>(
              <div key={s.id} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 14px",background:C.g100,borderRadius:9}}>
                <span style={{fontSize:20}}>🎨</span>
                <div style={{flex:1}}><div style={{fontWeight:600,fontFamily:"'DM Sans'",color:C.navy,fontSize:13}}>{s.title}</div><div style={{fontSize:11,color:C.g400,fontFamily:"'DM Sans'"}}>{s.slides.length} slides · {s.date}</div></div>
                <Btn onClick={()=>setViewSaved(s)} style={{fontSize:12,padding:"6px 12px"}}>View</Btn>
              </div>
            ))}
          </div>
        </Card>
      )}

      <div style={{display:"flex",alignItems:"center",gap:0,marginBottom:0}}>
        {["Select Meeting","Add Context","View Slides"].map((s,i)=>(
          <div key={s} style={{display:"flex",alignItems:"center"}}>
            <div style={{display:"flex",alignItems:"center",gap:7}}>
              <div style={{width:25,height:25,borderRadius:"50%",background:step>i+1?C.green:step===i+1?C.teal:C.g200,color:step>=i+1?"#fff":C.g400,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,fontFamily:"'DM Sans'"}}>{step>i+1?"✓":i+1}</div>
              <span style={{fontFamily:"'DM Sans'",fontSize:12,fontWeight:step===i+1?600:400,color:step===i+1?C.navy:C.g400}}>{s}</span>
            </div>
            {i<2&&<div style={{width:32,height:2,background:step>i+1?C.green:C.g200,margin:"0 8px"}}/>}
          </div>
        ))}
      </div>

      {step===1&&(
        <Card>
          <h3 style={{fontFamily:"'Playfair Display'",color:C.navy,fontSize:16,margin:"0 0 12px"}}>Select a Meeting</h3>
          <div style={{display:"flex",flexDirection:"column",gap:9}}>
            {STATIC.meetings.map(m=>(
              <div key={m.id} onClick={()=>setSid(m.id)} style={{display:"flex",gap:12,alignItems:"center",padding:"12px 14px",borderRadius:9,border:`2px solid ${sid===m.id?C.teal:C.g200}`,background:sid===m.id?"#F0FFFE":C.white,cursor:"pointer"}}>
                <div style={{width:15,height:15,borderRadius:"50%",border:`2px solid ${sid===m.id?C.teal:C.g200}`,background:sid===m.id?C.teal:"transparent",flexShrink:0}}/>
                <div style={{flex:1}}><div style={{fontWeight:600,fontFamily:"'DM Sans'",color:C.navy,fontSize:13}}>{m.title}</div><div style={{fontSize:11,color:C.g400,fontFamily:"'DM Sans'"}}>{m.agenda.length} agenda items · {m.attendees.length} attendees</div></div>
                <Bdg label={m.status}/>
              </div>
            ))}
          </div>
          <div style={{marginTop:14}}><Btn disabled={!sid} onClick={()=>setStep(2)}>Continue →</Btn></div>
        </Card>
      )}

      {step===2&&mtg&&(
        <div style={{display:"flex",flexDirection:"column",gap:13}}>
          <Card>
            <h3 style={{fontFamily:"'Playfair Display'",color:C.navy,fontSize:16,margin:"0 0 4px"}}>{mtg.title}</h3>
            <p style={{color:C.g400,fontFamily:"'DM Sans'",fontSize:13,margin:"0 0 13px"}}>{mtg.agenda.length} agenda items → {mtg.agenda.length+3} estimated slides</p>
            <div style={{display:"flex",flexWrap:"wrap",gap:7,marginBottom:14}}>
              {mtg.agenda.map((a,i)=>(
                <div key={a.id} style={{background:C.g100,borderRadius:8,padding:"5px 10px",display:"flex",gap:6,alignItems:"center"}}>
                  <span style={{fontFamily:"'DM Sans'",fontSize:11,color:C.g400}}>{i+1}.</span>
                  <span style={{fontFamily:"'DM Sans'",fontSize:12,color:C.navy}}>{a.title}</span>
                </div>
              ))}
            </div>
            <h4 style={{fontFamily:"'DM Sans'",color:C.navy,fontSize:13,fontWeight:600,margin:"0 0 7px"}}>Additional Context <span style={{color:C.g400,fontWeight:400}}>(optional)</span></h4>
            <textarea value={ctx} onChange={e=>setCtx(e.target.value)} rows={4} placeholder="e.g. Audience is the full board. Tone should be formal. Key highlight is the $2M surplus in Q1. CEO will present strategic growth slide." style={{width:"100%",border:`1px solid ${C.g200}`,borderRadius:8,padding:"10px 12px",fontFamily:"'DM Sans'",fontSize:13,resize:"vertical",outline:"none",lineHeight:1.6}}/>
          </Card>
          <div style={{display:"flex",gap:8,alignItems:"center"}}>
            <Btn variant="secondary" onClick={()=>setStep(1)}>← Back</Btn>
            <Btn onClick={generate}>{loading?"Generating…":"🎨 Generate Slide Outline"}</Btn>
            {err&&<span style={{color:C.red,fontFamily:"'DM Sans'",fontSize:13}}>{err}</span>}
          </div>
          {loading&&<Card style={{textAlign:"center",padding:36}}><div style={{fontSize:38,marginBottom:12}}>🎨</div><div style={{fontFamily:"'Playfair Display'",color:C.navy,fontSize:18,marginBottom:6}}>Building Slide Outline…</div><div style={{color:C.g400,fontFamily:"'DM Sans'",fontSize:13}}>AI is structuring your presentation from the meeting agenda.</div></Card>}
        </div>
      )}

      {step===3&&result&&(
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <Card style={{borderLeft:`4px solid ${C.green}`,padding:"16px 20px"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div style={{display:"flex",alignItems:"center",gap:9}}><span style={{fontSize:20}}>✅</span><h3 style={{fontFamily:"'Playfair Display'",color:C.navy,fontSize:17,margin:0}}>{result.length} Slides Generated</h3></div>
              <div style={{display:"flex",gap:8}}>
                <Btn variant="secondary" onClick={()=>{setStep(2);setResult(null);}}>Regenerate</Btn>
                <Btn variant="navy" onClick={save}>💾 Save Outline</Btn>
              </div>
            </div>
          </Card>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:13}}>
            {result.map((slide,i)=>{
              const [bg,col]=typeColors[slide.type]||[C.white,C.navy];
              return (
                <div key={i} style={{background:bg,borderRadius:13,padding:"20px 22px",border:`1px solid ${C.g200}`,position:"relative",minHeight:180}}>
                  <div style={{position:"absolute",top:14,right:16,display:"flex",gap:6,alignItems:"center"}}>
                    <span style={{fontSize:14}}>{typeIcons[slide.type]||"📄"}</span>
                    <span style={{fontSize:10,fontFamily:"'DM Sans'",color:col,opacity:.55,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.08em"}}>{i+1}</span>
                  </div>
                  <h3 style={{fontFamily:"'Playfair Display'",color:col,fontSize:16,margin:"0 0 4px",paddingRight:40}}>{slide.title}</h3>
                  {slide.subtitle&&<p style={{color:col,opacity:.65,fontFamily:"'DM Sans'",fontSize:12,margin:"0 0 10px"}}>{slide.subtitle}</p>}
                  <ul style={{margin:"0 0 10px",paddingLeft:16}}>
                    {slide.bullets.map((b,bi)=><li key={bi} style={{color:col,fontFamily:"'DM Sans'",fontSize:12,marginBottom:3,opacity:.85}}>{b}</li>)}
                  </ul>
                  <div style={{borderTop:`1px solid ${col}22`,paddingTop:8,marginTop:8}}>
                    <span style={{fontSize:11,fontFamily:"'DM Sans'",color:col,opacity:.5,fontStyle:"italic"}}>🎙 {slide.notes}</span>
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{display:"flex",gap:8}}>
            <Btn onClick={()=>{setStep(1);setSid(null);setCtx("");setResult(null);}}>New Outline</Btn>
            <Btn variant="outline" onClick={()=>navigator.clipboard?.writeText(result.map((s,i)=>`SLIDE ${i+1}: ${s.title}\n${s.subtitle?s.subtitle+"\n":""}\nBullets:\n${s.bullets.map(b=>"• "+b).join("\n")}\n\nSpeaker Notes: ${s.notes}`).join("\n\n---\n\n"))}>📋 Copy All</Btn>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Members ──────────────────────────────────────────────────────────────────
function Members() {
  return (
    <div style={{display:"flex",flexDirection:"column",gap:20}}>
      <SectionHeader title="Board Members" action={<Btn>+ Invite</Btn>}/>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:14}}>
        {STATIC.members.map(m=>(
          <Card key={m.id} style={{display:"flex",flexDirection:"column",gap:12,alignItems:"center",textAlign:"center",padding:22}}>
            <Av i={m.avatar} size={52} color={C.navy}/>
            <div><div style={{fontWeight:700,fontFamily:"'Playfair Display'",color:C.navy,fontSize:16}}>{m.name}</div><div style={{fontSize:12,color:C.teal,fontFamily:"'DM Sans'",fontWeight:600,marginTop:2}}>{m.role}</div></div>
            <div style={{display:"flex",gap:5,flexWrap:"wrap",justifyContent:"center"}}>
              <span style={{background:C.g100,color:C.g600,borderRadius:12,padding:"3px 9px",fontSize:11,fontFamily:"'DM Sans'"}}>{m.committee}</span>
              <span style={{background:C.g100,color:C.g600,borderRadius:12,padding:"3px 9px",fontSize:11,fontFamily:"'DM Sans'"}}>Since {m.joined}</span>
            </div>
            <div style={{fontSize:12,color:C.g400,fontFamily:"'DM Sans'"}}>{m.email}</div>
            <Btn variant="secondary" style={{width:"100%"}}>View Profile</Btn>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ─── Discussions ──────────────────────────────────────────────────────────────
function Discussions() {
  return (
    <div style={{display:"flex",flexDirection:"column",gap:20}}>
      <SectionHeader title="Discussions" action={<Btn>+ New Thread</Btn>}/>
      <Card style={{padding:0,overflow:"hidden"}}>
        {STATIC.discussions.map((d,i)=>(
          <div key={d.id} style={{display:"flex",gap:14,alignItems:"center",padding:"15px 19px",borderBottom:i<STATIC.discussions.length-1?`1px solid ${C.g200}`:"none",background:d.unread?"#F6FAFE":C.white,cursor:"pointer"}}>
            <Av i={d.author.split(" ").map(n=>n[0]).join("")} size={38} color={C.navyL}/>
            <div style={{flex:1,minWidth:0}}>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <span style={{fontWeight:d.unread?700:500,fontFamily:"'DM Sans'",color:C.navy,fontSize:14}}>{d.title}</span>
                {d.unread&&<span style={{width:7,height:7,borderRadius:"50%",background:C.teal,flexShrink:0}}/>}
              </div>
              <div style={{fontSize:12,color:C.g400,fontFamily:"'DM Sans'",marginTop:2}}>By {d.author} · {d.date}</div>
            </div>
            <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:6}}><Bdg label={d.tag}/><span style={{fontSize:12,color:C.g400,fontFamily:"'DM Sans'"}}>💬 {d.replies}</span></div>
          </div>
        ))}
      </Card>
    </div>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [auth, setAuth] = useState(false);
  const [nav, setNav] = useState("dashboard");
  const [store, setStore] = useState(() => {
    const saved = loadStore();
    return { ...SEED, ...saved };
  });

  const update = useCallback((patch) => {
    setStore(s => {
      const next = { ...s, ...patch };
      saveStore(next);
      return next;
    });
  }, []);

  // Check if previously logged in this session
  useEffect(() => {
    if (sessionStorage.getItem("boardhub_auth") === "1") setAuth(true);
  }, []);

  const login = () => { sessionStorage.setItem("boardhub_auth","1"); setAuth(true); };
  const logout = () => { sessionStorage.removeItem("boardhub_auth"); setAuth(false); };

  if (!auth) return <LoginGate onLogin={login}/>;

  const label = NAV.find(n=>n.id===nav)?.label || "";

  const renderPage = () => {
    switch(nav) {
      case "dashboard":   return <Dashboard store={store} setNav={setNav}/>;
      case "meetings":    return <Meetings setNav={setNav}/>;
      case "video":       return <VideoRoom/>;
      case "documents":   return <Documents store={store}/>;
      case "tasks":       return <Tasks store={store} update={update}/>;
      case "polls":       return <Polls store={store} update={update}/>;
      case "minutes":     return <Minutes store={store} update={update}/>;
      case "slides":      return <Slides store={store} update={update}/>;
      case "members":     return <Members/>;
      case "discussions": return <Discussions/>;
      default:            return null;
    }
  };

  return (
    <>
      <style>{FONTS}</style>
      <style>{`*{box-sizing:border-box;}body{margin:0;background:${C.cream};}::-webkit-scrollbar{width:5px;height:5px;}::-webkit-scrollbar-thumb{background:${C.g200};border-radius:3px;}`}</style>
      <div style={{display:"flex",height:"100vh",fontFamily:"'DM Sans'",overflow:"hidden"}}>
        {/* Sidebar */}
        <div style={{width:218,background:C.navy,display:"flex",flexDirection:"column",flexShrink:0}}>
          <div style={{padding:"20px 15px 15px",borderBottom:"1px solid rgba(255,255,255,0.08)"}}>
            <div style={{display:"flex",alignItems:"center",gap:9}}>
              <div style={{width:33,height:33,borderRadius:9,background:C.teal,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>⊞</div>
              <div><div style={{fontFamily:"'Playfair Display'",color:"#fff",fontSize:15,fontWeight:700,lineHeight:1}}>BoardHub</div><div style={{color:"rgba(255,255,255,0.35)",fontSize:10,fontFamily:"'DM Sans'"}}>Management Suite</div></div>
            </div>
          </div>
          <nav style={{flex:1,padding:"11px 8px",overflowY:"auto"}}>
            <div style={{fontSize:9,color:"rgba(255,255,255,0.27)",fontWeight:600,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:5,paddingLeft:7}}>Menu</div>
            {NAV.map(item=>(
              <button key={item.id} onClick={()=>setNav(item.id)} style={{width:"100%",display:"flex",alignItems:"center",gap:8,padding:"8px 9px",borderRadius:7,border:"none",background:nav===item.id?"rgba(0,181,173,0.18)":"transparent",color:nav===item.id?C.teal:"rgba(255,255,255,0.52)",fontFamily:"'DM Sans'",fontSize:12,fontWeight:nav===item.id?600:400,cursor:"pointer",textAlign:"left",borderLeft:nav===item.id?`3px solid ${C.teal}`:"3px solid transparent",marginBottom:1}}>
                <span>{item.icon}</span><span>{item.label}</span>
              </button>
            ))}
          </nav>
          <div style={{padding:"11px 12px 15px",borderTop:"1px solid rgba(255,255,255,0.08)"}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
              <Av i="AC" size={29} color={C.teal}/>
              <div><div style={{fontFamily:"'DM Sans'",color:"#fff",fontSize:12,fontWeight:600}}>Alice Chen</div><div style={{fontSize:10,color:"rgba(255,255,255,0.35)",fontFamily:"'DM Sans'"}}>Board Chair</div></div>
            </div>
            <button onClick={logout} style={{width:"100%",background:"rgba(255,255,255,0.06)",border:"none",borderRadius:6,padding:"6px",color:"rgba(255,255,255,0.4)",fontFamily:"'DM Sans'",fontSize:11,cursor:"pointer"}}>Sign Out</button>
          </div>
        </div>
        {/* Main */}
        <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
          <div style={{background:C.white,borderBottom:`1px solid ${C.g200}`,padding:"11px 22px",display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0}}>
            <div style={{fontFamily:"'Playfair Display'",color:C.navy,fontSize:18,fontWeight:600}}>{label}</div>
            <div style={{display:"flex",gap:10,alignItems:"center"}}>
              <div style={{background:C.g100,borderRadius:7,padding:"6px 12px",display:"flex",alignItems:"center",gap:6,fontSize:13,color:C.g400,fontFamily:"'DM Sans'"}}>🔍 Search…</div>
              <div style={{position:"relative",cursor:"pointer"}}><span style={{fontSize:18}}>🔔</span><span style={{position:"absolute",top:-3,right:-4,width:14,height:14,borderRadius:"50%",background:C.red,color:"#fff",fontSize:8,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700}}>3</span></div>
            </div>
          </div>
          <div style={{flex:1,overflowY:"auto",padding:22}}>{renderPage()}</div>
        </div>
      </div>
    </>
  );
}
