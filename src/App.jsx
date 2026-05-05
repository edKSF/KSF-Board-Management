import { useState, useEffect, useCallback } from "react";

// ─── Theme ────────────────────────────────────────────────────────────────────
const C = {
  navy:"#006600",    // KSF --navy (primary green)
  navyL:"#005200",   // KSF --navy-dark
  teal:"#006600",    // KSF primary green for buttons/CTAs
  gold:"#ffc200",    // KSF --gold
  goldL:"#ffd44d",   // KSF --gold-light
  cream:"#f8fafc",   // KSF --off-white
  white:"#ffffff",   // KSF --white
  g100:"#f0f7f0",    // light green tint for hover states
  g200:"rgba(0,102,0,0.12)", // KSF --border
  g400:"#94A3B8",    // neutral gray
  g600:"#475569",    // KSF --text-secondary
  red:"#EF4444",
  green:"#006600",   // KSF green
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
    { id: 1, title: "Complete WA Charitable Solicitation & Trust state filings", assignee: "Allison Parker", due: "May 15, 2026", priority: "high", status: "pending" },
    { id: 2, title: "Identify Treasurer candidates – update at May meeting", assignee: "All Board", due: "May 15, 2026", priority: "high", status: "in-progress" },
    { id: 3, title: "Alan deliver Mechanics Bank paperwork to bank", assignee: "Alan Sutliff", due: "May 8, 2026", priority: "high", status: "pending" },
    { id: 4, title: "Connie notify educator re: KW grant carryover decision", assignee: "Connie Compton", due: "May 8, 2026", priority: "medium", status: "pending" },
    { id: 5, title: "Marquise send teacher appreciation week email to KSD staff", assignee: "Marquise Dixon", due: "May 9, 2026", priority: "medium", status: "in-progress" },
    { id: 6, title: "Board members schedule 30-45 min with Marquise on calendar", assignee: "All Board", due: "May 15, 2026", priority: "medium", status: "pending" },
    { id: 7, title: "Plan KSF booth for Kent International Festival (May 30)", assignee: "Allyson Johnson / Alan Sutliff", due: "May 15, 2026", priority: "medium", status: "pending" },
    { id: 8, title: "Board members review native-land.ca for land acknowledgement discussion", assignee: "All Board", due: "May 15, 2026", priority: "low", status: "pending" },
    { id: 9, title: "Jenny explore credit card with cash back for bookkeeper/ED", assignee: "Jenny Buron", due: "May 30, 2026", priority: "low", status: "in-progress" },
    { id: 10, title: "Attend May 21 Scholarship Event", assignee: "Randy, Marilyn, Allyson, Connie", due: "May 21, 2026", priority: "medium", status: "pending" },
  ],
  polls: [
    { id: 1, question: "Should we hire Madalina Dovra (CPA) for 2025 tax prep & accounting clean-up (max $17,000)?", creator: "Randy Heath", deadline: "May 15, 2026", status: "closed", options: [{ id: "yes", label: "Yes – Approve", votes: 6 }, { id: "no", label: "No", votes: 0 }, { id: "abstain", label: "Abstain", votes: 0 }], totalEligible: 6, voted: true },
    { id: 2, question: "Who should we prioritize as our next Treasurer?", creator: "Alan Sutliff", deadline: "May 15, 2026", status: "open", options: [{ id: "a", label: "Internal board member", votes: 2 }, { id: "b", label: "Recruit from community", votes: 1 }, { id: "c", label: "Discuss at May meeting first", votes: 1 }], totalEligible: 6, voted: false },
  ],
  savedMinutes: [
    { id: 1, title: "Board Meeting – April 17, 2026", date: "Apr 17, 2026", content: `KENT SCHOOLS FOUNDATION\nBoard Meeting Minutes – April 17, 2026\nKSD Administration Center – Stevens Room – 12:00 p.m.\n\nPRESENT: Alan Sutliff, Randy Heath, Marilyn Boxly, Connie Compton, Sharn Shoker, Marquise Dixon; Allison Parker (Executive Director); Jenny Buron (Strategy Consultant); Wade Barringer (Bookkeeper); KSD Liaison\n\nABSENT: Allyson Johnson, Meghin Margel (KSD School Board ex-officio)\n\nMeeting called to order at 12:05 P.M.\n\nLAND ACKNOWLEDGMENT & AGENDA\nAlan opened with the land acknowledgment. Discussion of how to go beyond recitation and put action behind the words. Board to review native-land.ca and continue discussion at May meeting.\nMotion to approve agenda with flexibility: Marilyn. Seconded: Sharn. Motion carried.\n\nAPPROVAL OF PRIOR MINUTES\nRandy moved to approve the minutes of 3/20/2026. Seconded: Sharn. Motion carried.\nReminder: Include Jenny when sending minutes and agenda.\n\nFINANCIAL REPORT\nJenny reported current status of accounts. Marilyn moved to approve the March financial report as presented. Seconded: Sharn. Motion carried.\n\nTREASURER'S REPORT\nAllison shared progress on the administrative fee for the Stordahl account.\nRandy moved to make a one-year exception and use the April 9th balance for the Stordahl account fee assessment. Seconded: Sharn. Motion carried.\nRandy moved to remove Justin Fogle from the Schwab account. Seconded: Connie. Motion carried.\n\nSTATE REGISTRATIONS & EMPLOYMENT INFRASTRUCTURE\nMost items are in order. Need to complete WA Charitable Solicitation and Trust Filings.\n\nTREASURER SUCCESSION PLANNING\nUpdate on leads for Treasurer. Moved to May meeting.\n\nMECHANICS BANK PAPERWORK\nCompleted. Alan will deliver to the bank.\n\nEXPENSE BUDGET\nConnie moved to approve $2,000 for initial technology purchase (computer/monitor/printer) for the Executive Director position. Seconded: Marilyn. Motion carried.\nSharn moved to authorize a monthly expense account of $350 for the Executive Director. Seconded: Randy. Motion carried.\nConsensus that Jenny can explore a cash-back credit card for bookkeeper and Executive Director positions.\n\nCPA CONSIDERATION\nJenny met with Madalina Dovra, CPA with Philanthropy Northwest. Randy moved to hire Madalina Dovra for accounting clean-up and 2025 tax preparation, maximum cost $17,000. Seconded: Marilyn. Motion carried.\n\nKSD LIAISON REPORT (Wade Barringer)\nSpring break last week. Budget reduction discussions ongoing with labor partners — goal is to reduce staffing through attrition. 2027 budget in development. 5th grade camp starting. May is testing month. Marquise to prepare teacher appreciation email; Wade will help distribute to KSD staff.\n\nSCHOLARSHIP & GRANT UPDATES\nMay 21 Scholarship Event. Randy, Marilyn, Allyson, and Connie will attend. Alan will try.\n5 Emiko Craig scholarship recipients approved by email vote (tied 4th place). Connie moved to ratify the email vote. Seconded: Marilyn. Motion carried.\nConnie shared updates to grant application information. Grant committee (Connie & Marilyn), Sharn, Ikbir, and Marquise to meet and discuss further.\nRandy moved to carry over KW grant balance (less food budget) to be spent in the first semester of 2026-27. Seconded: Sharn. Motion carried. Connie will notify the educator.\n\nCOMMUNICATIONS UPDATE\nWebsite review — hope to go live today. Board members to review and send updates to Sharn. Jenny to update donation tool/app.\n\nCONSULTANT UPDATE (Allison)\nED Onboarding planned. Wilbur Repp Briefing will also include Jenny.\n\nROLE RESPONSIBILITIES (Marquise)\nBoard commitments reviewed. Each board member to schedule 30-45 minutes on Marquise's calendar. Working to plan the Wilbur Repp scholarship.\n\nKENT INTERNATIONAL FESTIVAL\nSponsorship fee paid. Board to complete booth planning at May meeting.\n\nNEXT MEETING: May 15, 2026, noon\nTopics: Land Acknowledgement action, Kent International Festival planning, Treasurer leads, September board presentation planning.\nRandy will be absent.\n\nAdjourned: 2:00 P.M.\n\nCOMMUNITY CALENDAR:\n• April 22 – 5:30 pm – Meeker MS Colors of Connection (KSF grant $2,250)\n• April 23 – 6 pm – "Finding Nemo" at Park Orchard (grant funded)\n• April 24 – 6-8 pm – Covington Elementary Festival of Cultures (KSF grant)\n• May 21 – 5:30 pm – Scholarship Event, Kent Covenant Church\n• May 30 – 10am-5pm – Kent International Festival, Showare\n\nOur Mission: Building a bridge to an equitable future through innovative learning opportunities for all students in the Kent School District.` },
  ],
  savedSlides: [],
};

const STATIC = {
  meetings: [
    { id: 1, title: "Board Meeting – May 15, 2026", date: "2026-05-15", time: "12:00 PM", location: "KSD Administration Center – Stevens Room / Zoom", status: "upcoming",
      attendees: ["Alan Sutliff", "Allyson Johnson", "Randy Heath", "Connie Compton", "Marilyn Boxly", "Sharn Shoker", "Marquise Dixon"],
      agenda: [
        { id: 1, title: "Welcome, Land Acknowledgment & Acceptance of Agenda", duration: 10, presenter: "Alan Sutliff" },
        { id: 2, title: "Approval of April 17 Minutes", duration: 5, presenter: "All" },
        { id: 3, title: "Financial Report", duration: 15, presenter: "Jenny Buron" },
        { id: 4, title: "Treasurer's Report & Succession Planning", duration: 20, presenter: "Allison Parker" },
        { id: 5, title: "KSD Board Liaison Report", duration: 10, presenter: "Meghin Margel" },
        { id: 6, title: "Scholarship & Grant Updates", duration: 15, presenter: "Allyson Johnson / Connie Compton" },
        { id: 7, title: "Kent International Festival Booth Planning", duration: 15, presenter: "Allyson Johnson / Alan Sutliff" },
        { id: 8, title: "Land Acknowledgement – Moving Beyond Recitation", duration: 10, presenter: "All" },
        { id: 9, title: "September Board Presentation Planning", duration: 10, presenter: "All" },
        { id: 10, title: "Communications Update", duration: 10, presenter: "Sharn Shoker" },
        { id: 11, title: "Next Meeting & Adjournment", duration: 5, presenter: "Alan Sutliff" },
      ] },
    { id: 2, title: "Board Meeting – April 17, 2026", date: "2026-04-17", time: "12:00 PM", location: "KSD Administration Center – Stevens Room / Zoom", status: "completed",
      attendees: ["Alan Sutliff", "Randy Heath", "Marilyn Boxly", "Connie Compton", "Sharn Shoker", "Marquise Dixon"],
      agenda: [
        { id: 1, title: "Welcome, Land Acknowledgment & Acceptance of Agenda", duration: 10, presenter: "Alan Sutliff" },
        { id: 2, title: "Approval of March 20 Minutes", duration: 5, presenter: "All" },
        { id: 3, title: "Financial Report", duration: 15, presenter: "Jenny Buron" },
        { id: 4, title: "Treasurer's Report & Account Updates", duration: 20, presenter: "Allison Parker" },
        { id: 5, title: "Expense Budget – ED Position", duration: 10, presenter: "All" },
        { id: 6, title: "CPA Consideration", duration: 10, presenter: "Jenny Buron" },
        { id: 7, title: "KSD Liaison Report", duration: 10, presenter: "Wade Barringer" },
        { id: 8, title: "Scholarship & Grant Updates", duration: 15, presenter: "Allyson Johnson / Connie Compton" },
        { id: 9, title: "Communications Update", duration: 10, presenter: "Sharn Shoker" },
        { id: 10, title: "Kent International Festival Planning", duration: 10, presenter: "Allyson / Alan" },
      ] },
    { id: 3, title: "Board Meeting – March 20, 2026", date: "2026-03-20", time: "12:00 PM", location: "KSD Administration Center – Stevens Room / Zoom", status: "completed",
      attendees: ["Alan Sutliff", "Allyson Johnson", "Randy Heath", "Connie Compton", "Marilyn Boxly", "Sharn Shoker"], agenda: [] },
  ],
  documents: [
    { id: 1, name: "KSF Board Minutes – April 17, 2026", category: "Minutes", size: "340 KB", uploaded: "Apr 17, 2026", uploader: "Alan Sutliff", driveUrl: "https://drive.google.com/file/d/1NpsHr2mZMTU-bAceVqwVaBi1Yz20BQCN/view" },
    { id: 2, name: "Statement of Financial Position – March 2026", category: "Finance", size: "136 KB", uploaded: "Apr 16, 2026", uploader: "Jenny Buron", driveUrl: "https://drive.google.com/file/d/1Zzkueif5aqumHQMwyyF-_V1O-zTuWYk3/view" },
    { id: 3, name: "Statement of Financial Position – March 2026 (Detail)", category: "Finance", size: "156 KB", uploaded: "Apr 17, 2026", uploader: "Jenny Buron", driveUrl: "https://drive.google.com/file/d/1wZMn1QqC_tRhbhCuFRpfooHFYgJnJeR5/view" },
    { id: 4, name: "Donor Restricted Funds Summary", category: "Finance", size: "319 KB", uploaded: "Apr 30, 2026", uploader: "Jenny Buron", driveUrl: "https://drive.google.com/file/d/1CNvDBcn6HmGDLMEXvzHU01B0IIZaRfdF/view" },
    { id: 5, name: "Statement of Financial Position – February 2026", category: "Finance", size: "138 KB", uploaded: "Mar 24, 2026", uploader: "Jenny Buron", driveUrl: "https://drive.google.com/file/d/14yCCxYMdxPd0cth7qeUJnmijrq-lC7gh/view" },
    { id: 6, name: "KSF Board Job Description", category: "Governance", size: "141 KB", uploaded: "Jan 16, 2026", uploader: "Alan Sutliff", driveUrl: "https://drive.google.com/file/d/1xW75atR83Gf1rfSPnYLhhEx_1Usef4MV/view" },
    { id: 7, name: "Executive Director Job Description", category: "Governance", size: "124 KB", uploaded: "Jan 8, 2026", uploader: "Alan Sutliff", driveUrl: "https://drive.google.com/file/d/1aEcHkp7f9NCayJw1Pd9t1Ul55CiNKWxM/view" },
    { id: 8, name: "Board Commitment Form (Blank)", category: "Governance", size: "167 KB", uploaded: "Nov 26, 2025", uploader: "Alan Sutliff", driveUrl: "https://drive.google.com/file/d/15_jZYZI5jX-_4L7l5QJ2fsZOvb3Tg64G/view" },
    { id: 9, name: "Teacher Appreciation Email Draft", category: "Communications", size: "48 KB", uploaded: "Apr 25, 2026", uploader: "Marquise Dixon", driveUrl: "https://docs.google.com/document/d/1RMz53glGPmmDz5U9rdHc5GuVAXezMGnJUr8DbX4vYCw/edit" },
    { id: 10, name: "Business Donation Levels", category: "Communications", size: "20 KB", uploaded: "Apr 19, 2026", uploader: "Sharn Shoker", driveUrl: "https://drive.google.com/file/d/1hCF3vUfAhOWvXZU0gRQqBWCLViOPCNjj/view" },
    { id: 11, name: "Classroom Enrichment Grant Report – May 2026", category: "Grants", size: "679 KB", uploaded: "May 2, 2026", uploader: "Connie Compton", driveUrl: "https://drive.google.com/file/d/1xUcRu491irCqJiSzCXUd-PgUo5esWXVF/view" },
  ],
  members: [
    { id: 1, name: "Alan Sutliff", role: "President", email: "asutliff@me.com", committee: "Executive", joined: "2011", avatar: "AS",
      bio: "Alan and his partner have lived in the Kent School District for over twenty years. He currently works for the Washington Education Association representing educators in Renton. A founding member of KSF, Alan believes strongly in equitable funding for public education." },
    { id: 2, name: "Allyson Johnson", role: "Past President", email: "ptamom@q.com", committee: "Grants", joined: "2011", avatar: "AJ",
      bio: "Allyson has been a tireless advocate for kids and public education for over 13 years with KSF. She raised 3 children in the Kent School District and worked for KSD as a Health Tech and Administrative Assistant for 15 years." },
    { id: 3, name: "Randy Heath", role: "VP of Board Development", email: "randyheath@seattleymca.org", committee: "Governance", joined: "2024", avatar: "RH",
      bio: "Randy worked in public schools in Washington for 33 years, retiring from KSD in June 2024 as Executive Director/Associate Superintendent. He now serves as Executive Director of the Washington State Alliance of YMCAs." },
    { id: 4, name: "Connie Compton", role: "Secretary", email: "richcompton2@compcast.net", committee: "Grants", joined: "2023", avatar: "CC",
      bio: "Connie taught special education in Kent from 1983 through retirement in 2023. She served as Kent Education Association president in 2011, a term that directly led to the founding of KSF. She is passionate about strong public schools and equitable opportunities for students." },
    { id: 5, name: "Marilyn Boxly", role: "VP of Classroom Grants", email: "mobotea@comcast.net", committee: "Grants", joined: "2022", avatar: "MB",
      bio: "Marilyn taught at Jenkins Creek Elementary School for 32 years after joining KSD in 1990. She is an active member of the Kent Educators of Color Network and deeply committed to ensuring opportunities are accessible to every child regardless of zip code or background." },
    { id: 6, name: "Sharn Shoker", role: "VP of Communications", email: "sharnkaur15@gmail.com", committee: "Communications", joined: "2024", avatar: "SS",
      bio: "Sharn is a lifelong Kent resident and proud KSD graduate. She attended Emerald Park Elementary, Meeker Middle School, and Kent Ridge High School. She is now raising a future KSD student and is honored to give back to the system that shaped her." },
    { id: 7, name: "Marquise Dixon", role: "Executive Director", email: "marquise@kentschoolsfoundation.org", committee: "Staff", joined: "2025", avatar: "MD",
      bio: "Marquise brings visionary nonprofit leadership to KSF, most recently serving as CEO of a Tacoma nonprofit serving 1,500+ students and families annually. He expanded employer partnerships, grew programming, and strengthened organizational sustainability." },
  ],
  discussions: [
    { id: 1, title: "May 15 Meeting – Zoom Link & Agenda", author: "Alan Sutliff", date: "May 8, 2026", replies: 3, unread: true, tag: "Meetings" },
    { id: 2, title: "Kent International Festival – Booth Planning Ideas", author: "Allyson Johnson", date: "May 5, 2026", replies: 5, unread: true, tag: "Events" },
    { id: 3, title: "Treasurer Recruitment – Community Leads?", author: "Randy Heath", date: "May 2, 2026", replies: 2, unread: false, tag: "Governance" },
    { id: 4, title: "Land Acknowledgement – Action Steps Discussion", author: "Sharn Shoker", date: "Apr 28, 2026", replies: 4, unread: false, tag: "General" },
  ],
};

const BOARD_PASSWORD = "KSF2026!";

const NAV = [
  { id: "dashboard", label: "Dashboard", icon: "⊞" },
  { id: "meetings", label: "Meetings", icon: "📅" },
  { id: "video", label: "Video Room", icon: "🎥" },
  { id: "documents", label: "Documents", icon: "📁" },
  { id: "governance", label: "Governance", icon: "⚖️" },
  { id: "tasks", label: "Tasks", icon: "✓" },
  { id: "polls", label: "Polls & Voting", icon: "🗳️" },
  { id: "minutes", label: "AI Minutes", icon: "🤖" },
  { id: "slides", label: "Slide Outlines", icon: "🎨" },
  { id: "members", label: "Members", icon: "👥" },
  { id: "discussions", label: "Discussions", icon: "💬" },
];

// ─── Governance Data (linked directly to Google Drive) ────────────────────────
const GOVERNANCE_DOCS = [
  {
    id: "g1", category: "Job Descriptions", icon: "📋",
    title: "Board of Directors Job Description",
    description: "Full responsibilities, officer roles, term limits, and governance requirements for all KSF board members.",
    updated: "Jan 16, 2026",
    driveUrl: "https://drive.google.com/file/d/1xW75atR83Gf1rfSPnYLhhEx_1Usef4MV/view",
    tag: "Current",
  },
  {
    id: "g2", category: "Job Descriptions", icon: "📋",
    title: "Executive Director Job Description",
    description: "Full position overview, key responsibilities, and qualifications for the KSF Executive Director role.",
    updated: "Jan 8, 2026",
    driveUrl: "https://drive.google.com/file/d/1aEcHkp7f9NCayJw1Pd9t1Ul55CiNKWxM/view",
    tag: "Current",
  },
  {
    id: "g3", category: "Commitment Forms", icon: "✍️",
    title: "Board Commitment Form (Blank Template)",
    description: "2025 revised commitment agreement covering meeting attendance, financial commitment, fundraising, and committee participation.",
    updated: "Nov 26, 2025",
    driveUrl: "https://drive.google.com/file/d/15_jZYZI5jX-_4L7l5QJ2fsZOvb3Tg64G/view",
    tag: "Template",
  },
  {
    id: "g4", category: "Commitment Forms", icon: "✅",
    title: "Alan Sutliff – Signed Commitment Form",
    description: "Digitally signed board commitment agreement for Alan Sutliff. Term: 2025. Annual contribution: $1,200.",
    updated: "Dec 1, 2025",
    driveUrl: "https://drive.google.com/file/d/1NpsHr2mZMTU-bAceVqwVaBi1Yz20BQCN/view",
    tag: "Signed",
  },
];

const COMMITMENT_STATUS = [
  { name: "Alan Sutliff", role: "President", avatar: "AS", signed: true, date: "Dec 1, 2025" },
  { name: "Allyson Johnson", role: "Past President", avatar: "AJ", signed: false, date: null },
  { name: "Randy Heath", role: "VP Board Development", avatar: "RH", signed: false, date: null },
  { name: "Connie Compton", role: "Secretary", avatar: "CC", signed: false, date: null },
  { name: "Marilyn Boxly", role: "VP Classroom Grants", avatar: "MB", signed: false, date: null },
  { name: "Sharn Shoker", role: "VP Communications", avatar: "SS", signed: false, date: null },
];

// ─── Shared UI ────────────────────────────────────────────────────────────────
function Av({ i, size=36, color=C.teal }) {
  return <div style={{width:size,height:size,borderRadius:"50%",background:color,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:size*.35,fontWeight:600,fontFamily:"'DM Sans'",flexShrink:0}}>{i}</div>;
}

function Bdg({ label }) {
  const M={high:["#FEE2E2","#DC2626"],medium:["#FFF8E1","#B45309"],low:["#f0f7f0","#006600"],upcoming:["#f0f7f0","#006600"],completed:["#f0f7f0","#006600"],pending:["#FFF8E1","#B45309"],"in-progress":["#f0f7f0","#006600"],Finance:["#FFF8E1","#B45309"],Governance:["#f0f7f0","#006600"],Minutes:["#f0f7f0","#006600"],Reports:["#FFF8E1","#B45309"],Strategy:["#FEE2E2","#DC2626"],General:["#f8fafc","#475569"],Events:["#FFF8E1","#B45309"],Meetings:["#f0f7f0","#006600"],Grants:["#f0f7f0","#006600"],open:["#f0f7f0","#006600"],closed:["#f8fafc","#94A3B8"],live:["#FEE2E2","#DC2626"],Signed:["#f0f7f0","#006600"],Template:["#FFF8E1","#B45309"],Current:["#f0f7f0","#006600"],Staff:["#FFF8E1","#B45309"]};
  const [bg,col]=M[label]||[C.g100,C.g600];
  return <span style={{background:bg,color:col,padding:"2px 10px",borderRadius:20,fontSize:12,fontWeight:600,fontFamily:"'DM Sans'",textTransform:"capitalize",whiteSpace:"nowrap"}}>{label}</span>;
}

function Card({ children, style={} }) {
  return <div style={{background:C.white,borderRadius:14,border:`1px solid ${C.g200}`,boxShadow:"0 2px 12px rgba(15,32,68,0.06)",padding:24,...style}}>{children}</div>;
}

function Btn({ children, onClick, variant="primary", style={}, disabled=false }) {
  const V={primary:{background:"#006600",color:"#fff",border:"none"},secondary:{background:"#f0f7f0",color:"#006600",border:"none"},navy:{background:"#003d00",color:"#fff",border:"none"},outline:{background:"transparent",color:"#006600",border:`1px solid rgba(0,102,0,0.3)`},danger:{background:C.red,color:"#fff",border:"none"},gold:{background:"#ffc200",color:"#003d00",border:"none"}};
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
    <div style={{minHeight:"100vh",background:`linear-gradient(135deg, #003d00 0%, #006600 60%, #005200 100%)`,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'DM Sans'"}}>
      <style>{FONTS}</style>
      <div style={{background:C.white,borderRadius:20,padding:"48px 44px",width:380,boxShadow:"0 24px 80px rgba(0,0,0,0.3)",textAlign:"center"}}>
        <div style={{width:60,height:60,borderRadius:16,background:"#ffc200",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 20px",fontSize:28}}>⊞</div>
        <h1 style={{fontFamily:"'Playfair Display'",color:C.navy,fontSize:24,margin:"0 0 4px"}}>Kent Schools Foundation</h1>
        <p style={{color:C.g400,fontSize:13,margin:"0 0 6px",fontFamily:"'DM Sans'",fontWeight:500}}>Unlocking Brighter Futures</p>
        <p style={{color:C.g400,fontSize:13,margin:"0 0 28px",fontFamily:"'DM Sans'"}}>Board Member Portal</p>
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
        <h2 style={{fontFamily:"'Playfair Display'",color:C.navy,fontSize:26,margin:"0 0 4px"}}>Good morning, Alan 👋</h2>
        <p style={{color:C.g400,fontFamily:"'DM Sans'",fontSize:14,margin:0}}>Here's what's happening with the Kent Schools Foundation board.</p>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(148px,1fr))",gap:14}}>
        <StatCard label="Upcoming Meetings" value={upcoming.length} sub="Next: May 15" icon="📅" accent="#006600"/>
        <StatCard label="Open Tasks" value={pending.length} sub={`${highP.length} high priority`} icon="✅" accent="#ffc200"/>
        <StatCard label="Pending Votes" value={openP.length} sub="Need your vote" icon="🗳️" accent="#006600"/>
        <StatCard label="Saved Minutes" value={store.savedMinutes.length} sub="In documents" icon="📝" accent="#003d00"/>
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
          {[["🎥","Start Video","#DC2626","video"],["🤖","AI Minutes","#006600","minutes"],["🗳️","Create Poll","#ffc200","polls"],["🎨","Slide Outline","#003d00","slides"],["📁","Documents","#475569","documents"]].map(([icon,label,color,nav])=>(
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
        <SectionHeader title="Meetings" action={null}/>
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
  const icons={Finance:"💰",Governance:"⚖️",Minutes:"📝",Grants:"🎓",Communications:"📢"};
  const allDocs=[...docs,...store.savedMinutes.map(m=>({id:"m"+m.id,name:`AI Minutes – ${m.title}`,category:"Minutes",size:"—",uploaded:m.date,uploader:"AI Generated",driveUrl:null}))];
  return (
    <div style={{display:"flex",flexDirection:"column",gap:20}}>
      <div>
        <h2 style={{fontFamily:"'Playfair Display'",color:C.navy,fontSize:24,margin:"0 0 4px"}}>Document Center</h2>
        <p style={{color:C.g600,fontFamily:"'DM Sans'",fontSize:13,margin:0}}>Click any document to open it directly in Google Drive.</p>
      </div>
      <div style={{display:"flex",gap:7,flexWrap:"wrap"}}>
        {cats.map(c=><button key={c} onClick={()=>setFilter(c)} style={{padding:"6px 14px",borderRadius:20,border:`1px solid ${filter===c?"#006600":"rgba(0,102,0,0.2)"}`,background:filter===c?"#006600":C.white,color:filter===c?"#fff":C.g600,fontFamily:"'DM Sans'",fontWeight:500,fontSize:12,cursor:"pointer"}}>{c}</button>)}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:13}}>
        {allDocs.map(doc=>(
          <a key={doc.id} href={doc.driveUrl||"#"} target={doc.driveUrl?"_blank":"_self"} rel="noopener noreferrer"
            style={{textDecoration:"none",display:"flex",flexDirection:"column",gap:11,background:C.white,borderRadius:14,border:"1px solid rgba(0,102,0,0.15)",boxShadow:"0 2px 12px rgba(0,102,0,0.05)",padding:16,cursor:"pointer",transition:"all 0.15s"}}
            onMouseEnter={e=>{e.currentTarget.style.boxShadow="0 4px 20px rgba(0,102,0,0.15)";e.currentTarget.style.borderColor="rgba(0,102,0,0.4)";e.currentTarget.style.transform="translateY(-1px)";}}
            onMouseLeave={e=>{e.currentTarget.style.boxShadow="0 2px 12px rgba(0,102,0,0.05)";e.currentTarget.style.borderColor="rgba(0,102,0,0.15)";e.currentTarget.style.transform="translateY(0)";}}>
            <div style={{display:"flex",gap:11,alignItems:"flex-start"}}>
              <div style={{fontSize:26,flexShrink:0}}>{icons[doc.category]||"📄"}</div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontWeight:600,fontFamily:"'DM Sans'",color:C.navy,fontSize:13,lineHeight:1.3}}>{doc.name}</div>
                <div style={{fontSize:11,color:C.g400,fontFamily:"'DM Sans'",marginTop:2}}>{doc.uploader} · {doc.uploaded}</div>
              </div>
              {doc.driveUrl&&<span style={{fontSize:16,flexShrink:0,color:"#006600",opacity:0.6}}>↗</span>}
            </div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <span style={{background:"#f0f7f0",color:"#006600",padding:"2px 9px",borderRadius:20,fontSize:11,fontWeight:600,fontFamily:"'DM Sans'"}}>{doc.category}</span>
              <span style={{fontSize:11,color:doc.driveUrl?C.teal:C.g400,fontFamily:"'DM Sans'",fontWeight:doc.driveUrl?500:400}}>
                {doc.driveUrl?"Open in Drive →":"Saved locally"}
              </span>
            </div>
          </a>
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
      <SectionHeader title="Task Manager" action={null}/>
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

// ─── Governance ───────────────────────────────────────────────────────────────
function Governance() {
  const [filter, setFilter] = useState("All");
  const cats = ["All", "Job Descriptions", "Commitment Forms"];
  const docs = filter === "All" ? GOVERNANCE_DOCS : GOVERNANCE_DOCS.filter(d => d.category === filter);
  const signed = COMMITMENT_STATUS.filter(m => m.signed).length;
  const tagColors = { Current: ["#E8F5EE", C.green], Template: ["#E8F0FE", "#2563EB"], Signed: ["#E8F5EE", C.green], Pending: ["#FFF3DC", "#B07A00"] };

  return (
    <div style={{display:"flex",flexDirection:"column",gap:24}}>
      <div>
        <h2 style={{fontFamily:"'Playfair Display'",color:C.navy,fontSize:26,margin:"0 0 4px"}}>Governance</h2>
        <p style={{color:C.g400,fontFamily:"'DM Sans'",fontSize:14,margin:0}}>Job descriptions, commitment forms, and board governance documents — linked directly from Google Drive.</p>
      </div>

      {/* Commitment status summary */}
      <Card style={{borderLeft:`4px solid ${signed===COMMITMENT_STATUS.length?C.green:C.gold}`}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:18}}>
          <div>
            <h3 style={{fontFamily:"'Playfair Display'",color:C.navy,fontSize:18,margin:"0 0 4px"}}>2026 Commitment Form Status</h3>
            <p style={{color:C.g400,fontFamily:"'DM Sans'",fontSize:13,margin:0}}>{signed} of {COMMITMENT_STATUS.length} board members have signed · <a href="https://drive.google.com/file/d/15_jZYZI5jX-_4L7l5QJ2fsZOvb3Tg64G/view" target="_blank" rel="noopener noreferrer" style={{color:C.teal,textDecoration:"none",fontWeight:600}}>Download blank form →</a></p>
          </div>
          <div style={{textAlign:"right"}}>
            <div style={{fontSize:28,fontWeight:700,fontFamily:"'Playfair Display'",color:signed===COMMITMENT_STATUS.length?C.green:C.gold}}>{Math.round((signed/COMMITMENT_STATUS.length)*100)}%</div>
            <div style={{fontSize:11,color:C.g400,fontFamily:"'DM Sans'"}}>Complete</div>
          </div>
        </div>
        {/* Progress bar */}
        <div style={{height:8,background:C.g100,borderRadius:4,overflow:"hidden",marginBottom:18}}>
          <div style={{height:"100%",width:`${(signed/COMMITMENT_STATUS.length)*100}%`,background:signed===COMMITMENT_STATUS.length?C.green:C.gold,borderRadius:4,transition:"width .5s"}}/>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:9}}>
          {COMMITMENT_STATUS.map(m => (
            <div key={m.name} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 14px",background:m.signed?"#F0FDF4":C.g100,borderRadius:9}}>
              <Av i={m.avatar} size={32} color={m.signed?C.green:C.g400}/>
              <div style={{flex:1}}>
                <div style={{fontWeight:600,fontFamily:"'DM Sans'",color:C.navy,fontSize:13}}>{m.name}</div>
                <div style={{fontSize:11,color:C.g400,fontFamily:"'DM Sans'"}}>{m.role}</div>
              </div>
              {m.signed ? (
                <div style={{display:"flex",alignItems:"center",gap:6}}>
                  <span style={{fontSize:16}}>✅</span>
                  <span style={{fontSize:12,color:C.green,fontFamily:"'DM Sans'",fontWeight:600}}>Signed {m.date}</span>
                </div>
              ) : (
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <span style={{background:"#FFF3DC",color:"#B07A00",padding:"3px 10px",borderRadius:20,fontSize:11,fontWeight:600,fontFamily:"'DM Sans'"}}>Pending</span>
                  <a href="https://drive.google.com/file/d/15_jZYZI5jX-_4L7l5QJ2fsZOvb3Tg64G/view" target="_blank" rel="noopener noreferrer" style={{fontSize:11,color:C.teal,fontFamily:"'DM Sans'",fontWeight:600,textDecoration:"none"}}>Send Form →</a>
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Document filter */}
      <div style={{display:"flex",gap:8}}>
        {cats.map(c=><button key={c} onClick={()=>setFilter(c)} style={{padding:"6px 14px",borderRadius:20,border:`1px solid ${filter===c?C.navy:C.g200}`,background:filter===c?C.navy:C.white,color:filter===c?"#fff":C.g600,fontFamily:"'DM Sans'",fontWeight:500,fontSize:13,cursor:"pointer"}}>{c}</button>)}
      </div>

      {/* Documents */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:14}}>
        {docs.map(doc => {
          const [tagBg, tagCol] = tagColors[doc.tag] || [C.g100, C.g600];
          return (
            <Card key={doc.id} style={{display:"flex",flexDirection:"column",gap:14,padding:20}}>
              <div style={{display:"flex",gap:12,alignItems:"flex-start"}}>
                <div style={{width:44,height:44,borderRadius:12,background:doc.category==="Job Descriptions"?C.navy:C.teal,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>{doc.icon}</div>
                <div style={{flex:1}}>
                  <div style={{fontWeight:700,fontFamily:"'Playfair Display'",color:C.navy,fontSize:15,lineHeight:1.3}}>{doc.title}</div>
                  <div style={{fontSize:11,color:C.g400,fontFamily:"'DM Sans'",marginTop:3}}>Updated {doc.updated}</div>
                </div>
              </div>
              <p style={{fontFamily:"'DM Sans'",fontSize:13,color:C.g600,margin:0,lineHeight:1.6}}>{doc.description}</p>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <span style={{background:tagBg,color:tagCol,padding:"2px 10px",borderRadius:20,fontSize:11,fontWeight:600,fontFamily:"'DM Sans'"}}>{doc.tag}</span>
                <span style={{fontSize:11,color:C.g400,fontFamily:"'DM Sans'"}}>{doc.category}</span>
              </div>
              <div style={{display:"flex",gap:8}}>
                <a href={doc.driveUrl} target="_blank" rel="noopener noreferrer" style={{flex:1,padding:"8px",background:C.navy,color:"#fff",border:"none",borderRadius:6,fontFamily:"'DM Sans'",fontSize:12,cursor:"pointer",fontWeight:600,textAlign:"center",textDecoration:"none",display:"block"}}>
                  Open in Drive
                </a>
                <a href={doc.driveUrl} target="_blank" rel="noopener noreferrer" style={{flex:1,padding:"8px",background:C.g100,color:C.navy,border:"none",borderRadius:6,fontFamily:"'DM Sans'",fontSize:12,cursor:"pointer",fontWeight:500,textAlign:"center",textDecoration:"none",display:"block"}}>
                  Download
                </a>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

// ─── Members ──────────────────────────────────────────────────────────────────
function Members() {
  const [sel, setSel] = useState(null);
  const member = STATIC.members.find(m=>m.id===sel);
  return (
    <div style={{display:"flex",flexDirection:"column",gap:20}}>
      <SectionHeader title="Board Members" action={null}/>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:14}}>
        {STATIC.members.map(m=>(
          <Card key={m.id} style={{display:"flex",flexDirection:"column",gap:12,alignItems:"center",textAlign:"center",padding:22,cursor:"pointer",border:`2px solid ${sel===m.id?C.teal:C.g200}`}} >
            <Av i={m.avatar} size={52} color={m.committee==="Staff"?C.gold:C.navy}/>
            <div><div style={{fontWeight:700,fontFamily:"'Playfair Display'",color:C.navy,fontSize:16}}>{m.name}</div><div style={{fontSize:12,color:C.teal,fontFamily:"'DM Sans'",fontWeight:600,marginTop:2}}>{m.role}</div></div>
            <div style={{display:"flex",gap:5,flexWrap:"wrap",justifyContent:"center"}}>
              <span style={{background:m.committee==="Staff"?"#FFF3DC":C.g100,color:m.committee==="Staff"?"#B07A00":C.g600,borderRadius:12,padding:"3px 9px",fontSize:11,fontFamily:"'DM Sans'"}}>{m.committee}</span>
              <span style={{background:C.g100,color:C.g600,borderRadius:12,padding:"3px 9px",fontSize:11,fontFamily:"'DM Sans'"}}>Since {m.joined}</span>
            </div>
            <div style={{fontSize:12,color:C.g400,fontFamily:"'DM Sans'"}}>{m.email}</div>
            <Btn variant="secondary" style={{width:"100%"}} onClick={()=>setSel(sel===m.id?null:m.id)}>
              {sel===m.id?"Hide Bio ▲":"View Bio ▼"}
            </Btn>
            {sel===m.id&&m.bio&&(
              <div style={{textAlign:"left",background:C.g100,borderRadius:9,padding:"12px 14px",fontSize:12,color:C.g600,fontFamily:"'DM Sans'",lineHeight:1.6}}>
                {m.bio}
              </div>
            )}
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
      <SectionHeader title="Discussions" action={null}/>
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
      case "governance":   return <Governance/>;
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
          <div style={{padding:"20px 15px 15px",borderBottom:"1px solid rgba(255,255,255,0.15)"}}>
            <div style={{display:"flex",alignItems:"center",gap:9}}>
              <div style={{width:33,height:33,borderRadius:9,background:"#ffc200",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>⊞</div>
              <div><div style={{fontFamily:"'Playfair Display'",color:"#fff",fontSize:13,fontWeight:700,lineHeight:1}}>Kent Schools</div><div style={{color:"rgba(255,255,255,0.35)",fontSize:10,fontFamily:"'DM Sans'"}}>Foundation Board</div></div>
            </div>
          </div>
          <nav style={{flex:1,padding:"11px 8px",overflowY:"auto"}}>
            <div style={{fontSize:9,color:"rgba(255,255,255,0.27)",fontWeight:600,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:5,paddingLeft:7}}>Menu</div>
            {NAV.map(item=>(
              <button key={item.id} onClick={()=>setNav(item.id)} style={{width:"100%",display:"flex",alignItems:"center",gap:8,padding:"8px 9px",borderRadius:7,border:"none",background:nav===item.id?"rgba(255,194,0,0.18)":"transparent",color:nav===item.id?"#ffc200":"rgba(255,255,255,0.65)",fontFamily:"'DM Sans'",fontSize:12,fontWeight:nav===item.id?600:400,cursor:"pointer",textAlign:"left",borderLeft:nav===item.id?`3px solid #ffc200`:"3px solid transparent",marginBottom:1}}>
                <span>{item.icon}</span><span>{item.label}</span>
              </button>
            ))}
          </nav>
          <div style={{padding:"11px 12px 15px",borderTop:"1px solid rgba(255,255,255,0.08)"}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
              <Av i="AS" size={29} color="#ffc200"/>
              <div><div style={{fontFamily:"'DM Sans'",color:"#fff",fontSize:12,fontWeight:600}}>Alan Sutliff</div><div style={{fontSize:10,color:"rgba(255,255,255,0.35)",fontFamily:"'DM Sans'"}}>President</div></div>
            </div>
            <button onClick={logout} style={{width:"100%",background:"rgba(255,255,255,0.06)",border:"none",borderRadius:6,padding:"6px",color:"rgba(255,255,255,0.4)",fontFamily:"'DM Sans'",fontSize:11,cursor:"pointer"}}>Sign Out</button>
          </div>
        </div>
        {/* Main */}
        <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
          <div style={{background:C.white,borderBottom:`1px solid ${C.g200}`,padding:"11px 22px",display:"flex",alignItems:"center",flexShrink:0}}>
            <div style={{fontFamily:"'Playfair Display'",color:C.navy,fontSize:18,fontWeight:600}}>{label}</div>
          </div>
          <div style={{flex:1,overflowY:"auto",padding:22}}>{renderPage()}</div>
        </div>
      </div>
    </>
  );
}
