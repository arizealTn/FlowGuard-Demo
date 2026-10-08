const API_BASE = "https://flowguard-demo.onrender.com/api";
const state = {
  business: { name: "FreshMart", type: "Neighborhood Grocery", location: "Jorhat, Assam" },
  route: location.hash.slice(1) || "/",
  insights: [],
  documents: [],
  actions: [],
  dashboard: null
};

const icons = {
  grid: "▦", spark: "✦", file: "▤", data: "◫", action: "✓", report: "▥", bot: "◉", settings: "⚙", bell: "●",
  arrow: "→", upload: "↑", search: "⌕", menu: "☰", close: "×", check: "✓"
};

async function api(path, options={}) {
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      headers: { "Content-Type": "application/json", ...(options.headers || {}) },
      ...options
    });
    if (!res.ok) throw new Error(`API ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn("API unavailable:", err);
    throw err;
  }
}

function money(v) {
  return new Intl.NumberFormat("en-IN", { style:"currency", currency:"INR", maximumFractionDigits:0 }).format(v);
}
function number(v) { return new Intl.NumberFormat("en-IN").format(v); }
function esc(s="") {
  return String(s).replace(/[&<>"']/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[c]));
}

function motion(root=document) {
  const reveals = root.querySelectorAll(".reveal");
  const stagger = root.querySelectorAll("[data-stagger]");
  requestAnimationFrame(() => {
    reveals.forEach((el,i) => setTimeout(() => el.classList.add("in"), Math.min(i*35,220)));
    stagger.forEach((el,i) => setTimeout(() => el.classList.add("in"), Math.min(i*40,240)));
  });
  root.querySelectorAll("[data-count]").forEach(el => {
    countUp(el, Number(el.dataset.count), el.dataset.format || "number");
  });
}
function countUp(el, target, format="number") {
  const duration = 850;
  const start = performance.now();
  const from = Number(el.dataset.from || 0);
  const ease = t => 1-Math.pow(1-t,3);
  const render = v => {
    if (format==="money") el.textContent = money(v);
    else if (format==="percent") el.textContent = `${Math.round(v)}%`;
    else el.textContent = number(Math.round(v));
  };
  function frame(now) {
    const t=Math.min(1,(now-start)/duration);
    render(from+(target-from)*ease(t));
    if(t<1) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}
function toast(message, type="info") {
  const root=document.querySelector("#toast-root");
  if(!root)return;
  const el=document.createElement("div");
  el.className=`toast ${type}`;
  el.textContent=message;
  root.appendChild(el);
  setTimeout(()=>el.remove(),3200);
}

function navItem(path,label,icon) {
  const active = state.route===path || (path!=="/app/overview" && state.route.startsWith(path));
  return `<a class="nav-item ${active?"active":""}" href="#${path}"><span class="nav-icon">${icon}</span>${label}</a>`;
}

function appShell(content, title="Overview") {
  return `
  <div class="app-shell">
    <aside class="sidebar" id="sidebar">
      <div class="logo"><span class="logo-mark"></span>FlowGuard</div>
      <div class="side-label">Workspace</div>
      ${navItem("/app/overview","Overview",icons.grid)}
      ${navItem("/app/insights","Insights",icons.spark)}
      ${navItem("/app/documents","Documents",icons.file)}
      ${navItem("/app/data","Business Data",icons.data)}
      <div class="side-label">Execution</div>
      ${navItem("/app/actions","Actions",icons.action)}
      ${navItem("/app/reports","Reports",icons.report)}
      ${navItem("/app/analyst","AI Analyst",icons.bot)}
      <div class="sidebar-bottom">
        ${navItem("/app/settings","Settings",icons.settings)}
        <div class="side-label">Demo workspace</div>
        <div style="padding:10px 12px;color:#aaa79e;font-size:.72rem">FreshMart · Jorhat</div>
      </div>
    </aside>
    <main class="main-area">
      <header class="topbar">
        <div class="top-left">
          <button class="btn btn-icon btn-secondary mobile-menu" id="mobile-menu">${icons.menu}</button>
          <div class="business-chip"><span class="business-dot"></span><strong>${esc(state.business.name)}</strong><span class="muted">· Demo</span></div>
        </div>
        <div class="top-actions">
          <button class="btn btn-icon btn-secondary" onclick="toast('No new critical notifications','info')" aria-label="Notifications">${icons.bell}</button>
          <button class="btn btn-secondary btn-sm" onclick="location.hash='/app/analyst'">Ask Analyst</button>
          <div class="avatar">TN</div>
        </div>
      </header>
      ${content}
    </main>
  </div>`;
}

function landing() {
  return `
  <div class="landing">
    <nav class="landing-nav">
      <a class="logo" href="#/"><span class="logo-mark"></span>FlowGuard</a>
      <div class="nav-links">
        <a href="#/features">How it works</a><a href="#/features">Intelligence</a><a href="#/features">For SMBs</a>
      </div>
      <button class="btn btn-primary btn-sm" onclick="location.hash='/app/overview'">Open Demo ${icons.arrow}</button>
    </nav>
    <header class="hero">
      <div class="container hero-grid">
        <div class="hero-copy reveal">
          <div class="eyebrow">Business intelligence that leads to action</div>
          <h1 style="margin-top:16px">Stop guessing.<br><span style="color:var(--orange)">Know what needs attention.</span></h1>
          <p>FlowGuard turns scattered sales, inventory, expenses and supplier data into clear decisions, financial impact and next actions.</p>
          <div class="hero-actions">
            <button class="btn btn-orange" onclick="location.hash='/app/overview'">Explore the live demo ${icons.arrow}</button>
            <a class="btn btn-secondary" href="#features">See how it works</a>
          </div>
          <div class="hero-proof">
            <span><strong>Deterministic</strong> analysis</span>
            <span><strong>Evidence-backed</strong> insights</span>
            <span><strong>Action-oriented</strong> workflows</span>
          </div>
        </div>
        <div class="hero-visual reveal">
          <div class="dashboard-orb"></div>
          <div class="preview-window">
            <div class="preview-bar"><i class="dot"></i><i class="dot"></i><i class="dot"></i><span style="margin-left:auto;font-size:.65rem;color:var(--muted)">flowguard / overview</span></div>
            <div class="preview-body">
              <div class="preview-side">
                <div class="side-line" style="width:80%"></div><div class="side-line" style="width:68%"></div><div class="side-line" style="width:76%;background:#ffdfc9"></div><div class="side-line" style="width:60%"></div><div class="side-line" style="width:72%"></div>
              </div>
              <div class="preview-main">
                <div style="font-size:.72rem;color:var(--muted)">Business Health</div>
                <div style="font:800 2.4rem Manrope;margin-top:5px">78<span style="font-size:.85rem;color:var(--green);margin-left:8px">Good</span></div>
                <div class="mini-grid">
                  <div class="mini-card"><span>Revenue</span><strong>₹12.4K</strong></div>
                  <div class="mini-card"><span>Profit</span><strong>₹4.8K</strong></div>
                  <div class="mini-card"><span>Risk</span><strong style="color:var(--red)">₹58K</strong></div>
                </div>
                <div class="mini-chart"><div class="chart-line"></div></div>
                <div class="insight-strip"><b>Supplier price increase detected</b><span>₹7.7K/mo impact</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>

    <section class="section" id="features">
      <div class="container">
        <div class="eyebrow reveal">One operating layer</div>
        <h2 class="reveal" style="margin-top:12px">From raw business data to a decision you can act on.</h2>
        <div class="feature-grid" data-stagger>
          <div class="feature-card"><div class="feature-icon">01</div><h3>Find the leak</h3><p>Surface unusual costs, dead stock, margin pressure and customer changes before they become expensive.</p></div>
          <div class="feature-card"><div class="feature-icon">02</div><h3>Show the evidence</h3><p>Every important insight is paired with source data, calculations and a transparent explanation.</p></div>
          <div class="feature-card"><div class="feature-icon">03</div><h3>Turn it into action</h3><p>Convert an insight into a tracked action, supplier outreach, operational task or management report.</p></div>
        </div>
      </div>
    </section>

    <section class="section" style="padding-top:20px">
      <div class="container how-grid">
        <div>
          <div class="eyebrow reveal">How FlowGuard works</div>
          <h2 class="reveal" style="margin-top:12px">The business loop stays visible.</h2>
          <div class="steps" data-stagger style="margin-top:30px">
            <div class="step"><span class="step-number">1</span><div><h3>Connect data</h3><p>Upload sales, inventory, expenses and business documents.</p></div></div>
            <div class="step"><span class="step-number">2</span><div><h3>Analyze</h3><p>Normalize the data and run deterministic business checks.</p></div></div>
            <div class="step"><span class="step-number">3</span><div><h3>Understand</h3><p>See the evidence, financial impact and recommended response.</p></div></div>
            <div class="step"><span class="step-number">4</span><div><h3>Act</h3><p>Track what you did and keep the decision connected to the source.</p></div></div>
          </div>
        </div>
        <div class="risk-demo reveal">
          <div class="eyebrow" style="color:#ffad70">Attention center</div>
          <div class="risk-amount" data-count="58550" data-format="money">₹0</div>
          <p style="color:#aaa69e">estimated money at risk across detected issues</p>
          <div class="risk-bar" style="margin-top:24px"><i></i></div>
          <div class="risk-list">
            <div class="risk-row"><span>Supplier price increase</span><b>₹7,712/mo</b></div>
            <div class="risk-row"><span>Dead stock</span><b>₹21,600</b></div>
            <div class="risk-row"><span>Expense anomaly</span><b>₹8,450</b></div>
          </div>
        </div>
      </div>
    </section>

    <section class="cta">
      <div class="container">
        <div class="cta-box reveal">
          <div><div class="eyebrow" style="color:white">FreshMart demo workspace</div><h2 style="margin-top:10px">See the operating system in action.</h2><p>Explore the full dashboard, insights, actions, reports and AI Analyst.</p></div>
          <button class="btn" onclick="location.hash='/app/overview'">Enter FlowGuard ${icons.arrow}</button>
        </div>
      </div>
    </section>
  </div>`;
}

async function dashboard() {
  let d=state.dashboard;
  if(!d){ try{d=state.dashboard=await api("/dashboard")}catch{d={business_health:78,revenue:12450,profit:4800,money_at_risk:58550,revenue_change:8.4,profit_change:3.2,trend:[8200,9100,9700,10300,11200,12450]};}}
  return appShell(`
    <div class="page">
      <div class="page-head reveal"><div><div class="eyebrow">Overview</div><h2 style="margin-top:6px">Good afternoon. Here is what needs attention.</h2><p>FreshMart · September 2026 · Updated just now</p></div><div class="page-actions"><button class="btn btn-secondary btn-sm" onclick="location.hash='/app/documents'">${icons.upload} Upload data</button><button class="btn btn-primary btn-sm" onclick="location.hash='/app/analyst'">${icons.bot} Ask Analyst</button></div></div>
      <div class="metric-grid" data-stagger>
        ${metric("Business Health",d.business_health,"percent","Good", "green")}
        ${metric("Revenue",d.revenue,"money",`+${d.revenue_change}% vs last period`,"green")}
        ${metric("Operating Profit",d.profit,"money",`+${d.profit_change}% vs last period`,"green")}
        ${metric("Money at Risk",d.money_at_risk,"money","3 material issues","red")}
      </div>
      <div class="content-grid">
        <section class="card reveal"><div class="card-head"><div><h3>Revenue trend</h3><p>Six-month trajectory</p></div><span class="status done">Healthy</span></div><div class="chart-box"><canvas id="revenue-chart"></canvas></div></section>
        <section class="card reveal"><div class="card-head"><div><h3>Attention center</h3><p>Highest financial impact first</p></div><button class="btn btn-ghost btn-sm" onclick="location.hash='/app/insights'">View all ${icons.arrow}</button></div><div id="dashboard-insights" class="insight-list"><div class="skeleton" style="height:90px"></div><div class="skeleton" style="height:90px"></div></div></section>
      </div>
      <div class="section-grid">
        <section class="card reveal"><div class="card-head"><div><h3>Recent activity</h3><p>What changed in the workspace</p></div></div>${activityList()}</section>
        <section class="card reveal"><div class="card-head"><div><h3>Quick actions</h3><p>Move from insight to execution</p></div></div><div class="insight-list">
          <button class="action-card btn btn-secondary" onclick="location.hash='/app/documents'"><span class="action-meta"><span class="action-icon">${icons.upload}</span><span><b>Upload business data</b><br><small>CSV, XLSX or PDF</small></span></span>${icons.arrow}</button>
          <button class="action-card btn btn-secondary" onclick="location.hash='/app/reports'"><span class="action-meta"><span class="action-icon">${icons.report}</span><span><b>Generate report</b><br><small>Executive business summary</small></span></span>${icons.arrow}</button>
        </div></section>
      </div>
    </div>`, "Overview");
}

function metric(label,value,format,change,color){
  const fmt=format==="money"?"money":format==="percent"?"percent":"number";
  return `<div class="metric-card reveal"><div class="metric-label">${label}</div><div class="metric-value" data-count="${value}" data-format="${fmt}">0</div><div class="metric-change ${color==="red"?"down":""}">${change}</div></div>`;
}
function activityList(){
  return `<div class="insight-list">
    <div class="evidence-row"><span>Inventory analysis completed</span><small>12 min ago</small></div>
    <div class="evidence-row"><span>Supplier price change detected</span><small>24 min ago</small></div>
    <div class="evidence-row"><span>September sales imported</span><small>1 hr ago</small></div>
    <div class="evidence-row"><span>Monthly report generated</span><small>Yesterday</small></div>
  </div>`;
}

async function insights() {
  try{state.insights=await api("/insights")}catch{state.insights=demoInsights()}
  return appShell(`<div class="page">
    <div class="page-head reveal"><div><div class="eyebrow">Intelligence</div><h2>Insights</h2><p>Evidence-backed issues ranked by business impact.</p></div><button class="btn btn-primary btn-sm" onclick="location.hash='/app/analyst'">Ask Analyst</button></div>
    <div class="tabs"><button class="tab active">All</button><button class="tab">Critical</button><button class="tab">Financial</button><button class="tab">Inventory</button><button class="tab">Suppliers</button></div>
    <div class="insight-list" data-stagger>${state.insights.map(i=>insightCard(i)).join("")}</div>
  </div>`);
}
function demoInsights(){return[
{id:"supplier-price",severity:"critical",category:"Suppliers",title:"Supplier price increase detected",description:"A key supplier increased the average unit cost of fast-moving items.",impact:7712,impact_label:"estimated monthly impact"},
{id:"dead-stock",severity:"warning",category:"Inventory",title:"Dead stock is tying up cash",description:"18 products have had no movement for more than 60 days.",impact:21600,impact_label:"inventory value at risk"},
{id:"expense-anomaly",severity:"warning",category:"Financial",title:"Operating expense is above baseline",description:"A recurring expense category is 18.2% above its three-month baseline.",impact:8450,impact_label:"estimated annualized impact"}
]}
function insightCard(i){
  return `<article class="insight-item" onclick="location.hash='/app/insights/${i.id}'">
    <div class="insight-top"><span class="severity ${i.severity}">${i.severity}</span><span class="muted">${esc(i.category)}</span></div>
    <h4>${esc(i.title)}</h4><p>${esc(i.description)}</p><div class="insight-impact">${money(i.impact)} · ${i.impact_label}</div>
  </article>`;
}

async function insightDetail(id){
  let i;
  try{i=await api(`/insights/${encodeURIComponent(id)}`)}catch{i=demoInsights().find(x=>x.id===id)||demoInsights()[0]}
  return appShell(`<div class="page">
    <div class="page-head reveal"><div><button class="btn btn-ghost btn-sm" onclick="history.back()">← Back</button><div class="eyebrow" style="margin-top:15px">${esc(i.category)}</div><h2 style="margin-top:6px">${esc(i.title)}</h2><p>${esc(i.description)}</p></div></div>
    <div class="detail-grid">
      <div>
        <section class="detail-hero reveal"><span class="severity ${i.severity}">${i.severity}</span><div style="font:800 3.5rem Manrope;letter-spacing:-.06em;margin-top:16px">${money(i.impact)}</div><p>${esc(i.impact_label)}</p></section>
        <section class="card reveal" style="margin-top:16px"><div class="card-head"><div><h3>Evidence & calculation</h3><p>How FlowGuard reached the conclusion</p></div></div><div class="evidence">${(i.evidence||[]).map(e=>`<div class="evidence-row"><span>${esc(e.label)}</span><strong>${esc(e.value)}</strong></div>`).join("")}</div></section>
      </div>
      <div>
        <section class="card reveal"><h3>Why this matters</h3><p class="muted" style="margin-top:10px;font-size:.87rem">${esc(i.explanation||"This issue is material because it affects cash flow or margin and is supported by observed business data.")}</p><div class="recommendation"><b>Recommended action</b><p>${esc(i.recommendation||"Review the affected records and assign an owner to resolve the issue.")}</p></div><button class="btn btn-orange" style="width:100%;margin-top:14px" onclick="createAction('${i.id}')">Create action ${icons.arrow}</button></section>
      </div>
    </div>
  </div>`);
}

async function documents(){
  try{state.documents=await api("/documents")}catch{state.documents=[
    {name:"September Sales.csv",type:"CSV",status:"Processed",date:"Oct 8, 2026"},
    {name:"Inventory Snapshot.xlsx",type:"XLSX",status:"Processed",date:"Oct 8, 2026"},
    {name:"Supplier Invoice 1042.pdf",type:"PDF",status:"Processed",date:"Oct 7, 2026"}
  ]}
  return appShell(`<div class="page">
    <div class="page-head reveal"><div><div class="eyebrow">Data ingestion</div><h2>Documents</h2><p>Upload the records FlowGuard uses to understand the business.</p></div><button class="btn btn-primary btn-sm" onclick="document.querySelector('#file-input').click()">${icons.upload} Upload</button></div>
    <input id="file-input" type="file" hidden multiple accept=".csv,.xlsx,.xls,.pdf,.txt">
    <section class="upload reveal" id="dropzone"><div class="file-icon">${icons.upload}</div><h3>Drop business files here</h3><p>CSV, XLSX, PDF or TXT · Demo processing is enabled.</p><button class="btn btn-secondary" onclick="document.querySelector('#file-input').click()">Choose files</button></section>
    <section class="card reveal" style="margin-top:16px"><div class="card-head"><div><h3>Recent documents</h3><p>Processing history</p></div></div><div class="table-wrap"><table><thead><tr><th>Document</th><th>Type</th><th>Status</th><th>Date</th></tr></thead><tbody>${state.documents.map(d=>`<tr><td><b>${esc(d.name)}</b></td><td>${esc(d.type)}</td><td><span class="status done">${esc(d.status)}</span></td><td>${esc(d.date)}</td></tr>`).join("")}</tbody></table></div></section>
  </div>`);
}

async function dataPage(kind="sales"){
  let rows=[];
  try{rows=await api(`/data/${kind}`)}catch{rows=demoRows(kind)}
  const titles={sales:"Sales",inventory:"Inventory",expenses:"Expenses",customers:"Customers",suppliers:"Suppliers"};
  return appShell(`<div class="page">
    <div class="page-head reveal"><div><div class="eyebrow">Business data</div><h2>${titles[kind]||"Business Data"}</h2><p>Structured records used by FlowGuard analysis.</p></div><input class="search" placeholder="Search records..." oninput="filterTable(this.value)"></div>
    <div class="tabs">${Object.keys(titles).map(k=>`<button class="tab ${k===kind?"active":""}" onclick="location.hash='/app/data/${k}'">${titles[k]}</button>`).join("")}</div>
    <section class="card reveal"><div class="table-wrap"><table id="data-table"><thead>${tableHead(kind)}</thead><tbody>${rows.map(r=>tableRow(kind,r)).join("")}</tbody></table></div></section>
  </div>`);
}
function tableHead(k){
  const h={sales:["Date","Product","Units","Revenue","Margin"],inventory:["Product","Units","Value","Last sold","Status"],expenses:["Date","Category","Amount","Baseline","Variance"],customers:["Customer","Orders","Revenue","Last order","Segment"],suppliers:["Supplier","Items","Spend","Change","Status"]}[k]||[];
  return `<tr>${h.map(x=>`<th>${x}</th>`).join("")}</tr>`;
}
function tableRow(k,r){
  if(k==="sales")return `<tr><td>${r.date}</td><td>${r.product}</td><td>${r.units}</td><td>${money(r.revenue)}</td><td>${r.margin}%</td></tr>`;
  if(k==="inventory")return `<tr><td>${r.product}</td><td>${r.units}</td><td>${money(r.value)}</td><td>${r.last_sold}</td><td><span class="status ${r.status==="Healthy"?"done":"pending"}">${r.status}</span></td></tr>`;
  if(k==="expenses")return `<tr><td>${r.date}</td><td>${r.category}</td><td>${money(r.amount)}</td><td>${money(r.baseline)}</td><td style="color:${r.variance>0?"var(--red)":"var(--green)"}">${r.variance>0?"+":""}${r.variance}%</td></tr>`;
  if(k==="customers")return `<tr><td>${r.customer}</td><td>${r.orders}</td><td>${money(r.revenue)}</td><td>${r.last_order}</td><td>${r.segment}</td></tr>`;
  return `<tr><td>${r.supplier}</td><td>${r.items}</td><td>${money(r.spend)}</td><td style="color:${r.change>0?"var(--red)":"var(--green)"}">${r.change>0?"+":""}${r.change}%</td><td><span class="status ${r.change>8?"pending":"done"}">${r.status}</span></td></tr>`;
}
function demoRows(k){
  if(k==="sales")return[{date:"2026-09-30",product:"Rice 5kg",units:84,revenue:5880,margin:21},{date:"2026-09-29",product:"Sunflower Oil",units:52,revenue:4940,margin:17},{date:"2026-09-28",product:"Tea 250g",units:38,revenue:2660,margin:24},{date:"2026-09-27",product:"Biscuits",units:91,revenue:3640,margin:26}];
  if(k==="inventory")return[{product:"Rice 5kg",units:84,value:5880,last_sold:"Today",status:"Healthy"},{product:"Premium Atta",units:120,value:8400,last_sold:"12 days ago",status:"Healthy"},{product:"Imported Sauce",units:72,value:7200,last_sold:"74 days ago",status:"Dead stock"},{product:"Gift Basket",units:60,value:6000,last_sold:"82 days ago",status:"Dead stock"}];
  if(k==="expenses")return[{date:"2026-09-30",category:"Utilities",amount:14200,baseline:12000,variance:18.3},{date:"2026-09-28",category:"Transport",amount:8600,baseline:8100,variance:6.2},{date:"2026-09-25",category:"Packaging",amount:5100,baseline:5300,variance:-3.8}];
  if(k==="customers")return[{customer:"Walk-in",orders:220,revenue:68000,last_order:"Today",segment:"Core"},{customer:"Hotel Green",orders:14,revenue:18400,last_order:"2 days ago",segment:"Wholesale"},{customer:"Cafe North",orders:9,revenue:11200,last_order:"6 days ago",segment:"Wholesale"}];
  return[{supplier:"Assam Foods Co.",items:12,spend:52200,change:14.8,status:"Review"},{supplier:"NorthEast Distributors",items:8,spend:33800,change:3.2,status:"Stable"},{supplier:"Jorhat Packaging",items:5,spend:16400,change:-1.1,status:"Stable"}];
}
function filterTable(q){document.querySelectorAll("#data-table tbody tr").forEach(tr=>tr.style.display=tr.textContent.toLowerCase().includes(q.toLowerCase())?"":"none")}

async function actions(){
  try{state.actions=await api("/actions")}catch{state.actions=[{title:"Review Assam Foods pricing",owner:"Tanmoy",status:"In Progress",due:"Oct 10"},{title:"Clear dead stock candidates",owner:"Store manager",status:"Suggested",due:"Oct 14"}]}
  return appShell(`<div class="page"><div class="page-head reveal"><div><div class="eyebrow">Execution</div><h2>Actions</h2><p>Keep decisions connected to owners and outcomes.</p></div></div><div class="insight-list" data-stagger>${state.actions.map(a=>`<div class="card action-card"><span class="action-meta"><span class="action-icon">${icons.check}</span><span><b>${esc(a.title)}</b><br><small>Owner: ${esc(a.owner)} · Due ${esc(a.due)}</small></span></span><span class="status ${a.status==="In Progress"?"progress":"pending"}">${esc(a.status)}</span></div>`).join("")}</div></div>`);
}

async function reports(){
  return appShell(`<div class="page"><div class="page-head reveal"><div><div class="eyebrow">Management</div><h2>Reports</h2><p>Turn the current business picture into a concise management view.</p></div><button class="btn btn-primary btn-sm" onclick="toast('Executive report generated','success')">Generate report ${icons.arrow}</button></div>
  <div class="section-grid"><div class="card reveal"><h3>Executive summary</h3><p class="muted" style="margin-top:8px;font-size:.85rem">FreshMart is growing revenue while three material issues require attention: supplier cost inflation, dead stock and an elevated operating expense category.</p></div><div class="card reveal"><h3>Report modules</h3><div class="insight-list" style="margin-top:14px"><div class="evidence-row"><span>Business health</span><b>Included</b></div><div class="evidence-row"><span>Financial risks</span><b>Included</b></div><div class="evidence-row"><span>Inventory</span><b>Included</b></div><div class="evidence-row"><span>Actions</span><b>Included</b></div></div></div></div>
  <section class="card reveal" style="margin-top:16px"><div class="card-head"><div><h3>Recent reports</h3><p>Generated summaries</p></div></div><div class="table-wrap"><table><thead><tr><th>Report</th><th>Period</th><th>Status</th></tr></thead><tbody><tr><td>September Executive Summary</td><td>Sep 2026</td><td><span class="status done">Ready</span></td></tr><tr><td>Inventory Risk Review</td><td>Sep 2026</td><td><span class="status done">Ready</span></td></tr></tbody></table></div></section></div>`);
}

async function analyst(){
  return appShell(`<div class="page"><div class="page-head reveal"><div><div class="eyebrow">AI layer</div><h2>AI Analyst</h2><p>Ask questions about the business. Answers are grounded in the current workspace.</p></div></div>
  <div class="analyst"><section class="card chat reveal"><div id="messages" class="messages"><div class="message ai"><strong>FlowGuard Analyst</strong>I can explain the current business picture, risks and recommended actions. Ask me a question.</div></div><form class="chat-form" id="chat-form"><input id="chat-input" placeholder="Why is profit under pressure?" autocomplete="off"><button class="btn btn-primary">Ask</button></form></section>
  <aside class="card reveal"><h3>Suggested questions</h3><div class="suggestion-list" style="margin-top:14px"><button class="suggestion" data-q="Where am I losing money?">Where am I losing money?</button><button class="suggestion" data-q="Why did profit change?">Why did profit change?</button><button class="suggestion" data-q="Which supplier should I review?">Which supplier should I review?</button><button class="suggestion" data-q="What should I do first?">What should I do first?</button></div></aside></div></div>`);
}

async function settings(){
  return appShell(`<div class="page"><div class="page-head reveal"><div><div class="eyebrow">Workspace</div><h2>Settings</h2><p>Configure the business workspace.</p></div><button class="btn btn-primary btn-sm" onclick="toast('Settings saved','success')">Save changes</button></div>
  <div class="settings-grid"><div class="settings-nav"><button class="active">Business profile</button><button>Data sources</button><button>Notifications</button><button>Workspace</button></div><section class="card reveal"><div class="form-grid"><div class="field"><label>Business name</label><input value="FreshMart"></div><div class="field"><label>Business type</label><input value="Neighborhood Grocery"></div><div class="field"><label>Location</label><input value="Jorhat, Assam"></div><div class="field"><label>Currency</label><select><option>INR — Indian Rupee</option></select></div><div class="field full"><label>Business description</label><textarea>Local grocery business serving neighborhood customers and wholesale accounts.</textarea></div></div></section></div></div>`);
}

function dataIndex(){return dataPage("sales")}

async function createAction(id){
  try{await api("/actions",{method:"POST",body:JSON.stringify({insight_id:id})});toast("Action created","success")}catch{toast("Action created in demo workspace","success")}
  setTimeout(()=>location.hash="/app/actions",500);
}

async function handleUpload(files){
  for(const file of files){
    try{
      const fd=new FormData();fd.append("file",file);
      await fetch(`${API_BASE}/documents/upload`,{method:"POST",body:fd});
    }catch{}
  }
  toast(`${files.length} file${files.length>1?"s":""} added to processing queue`,"success");
  state.documents=null;
  render();
}

function setupGlobalEvents(){
  document.querySelector("#mobile-menu")?.addEventListener("click",()=>document.querySelector("#sidebar")?.classList.toggle("open"));
  const file=document.querySelector("#file-input");
  const drop=document.querySelector("#dropzone");
  file?.addEventListener("change",e=>handleUpload([...e.target.files]));
  drop?.addEventListener("dragover",e=>{e.preventDefault();drop.classList.add("drag")});
  drop?.addEventListener("dragleave",()=>drop.classList.remove("drag"));
  drop?.addEventListener("drop",e=>{e.preventDefault();drop.classList.remove("drag");handleUpload([...e.dataTransfer.files])});
  document.querySelector("#chat-form")?.addEventListener("submit",async e=>{
    e.preventDefault();const input=document.querySelector("#chat-input");const q=input.value.trim();if(!q)return;
    const box=document.querySelector("#messages");box.insertAdjacentHTML("beforeend",`<div class="message user">${esc(q)}</div>`);input.value="";
    const typing=document.createElement("div");typing.className="message ai";typing.innerHTML="<strong>FlowGuard Analyst</strong><span>Analyzing<span class='dots'>...</span></span>";box.appendChild(typing);box.scrollTop=box.scrollHeight;
    let answer;
    try{const r=await api("/analyst/query",{method:"POST",body:JSON.stringify({question:q})});answer=r.answer}catch{answer="The current demo shows a supplier price increase, dead stock and an elevated utilities expense. I would start with the supplier negotiation because it has a recurring monthly impact."}
    setTimeout(()=>{typing.innerHTML=`<strong>FlowGuard Analyst</strong>${esc(answer)}`;box.scrollTop=box.scrollHeight},450);
  });
  document.querySelectorAll(".suggestion").forEach(b=>b.addEventListener("click",()=>{const input=document.querySelector("#chat-input");input.value=b.dataset.q;input.focus()}));
  if(document.querySelector("#revenue-chart")) drawChart();
}

function drawChart(){
  const canvas=document.querySelector("#revenue-chart");if(!canvas)return;
  const dpr=devicePixelRatio||1, rect=canvas.getBoundingClientRect();canvas.width=rect.width*dpr;canvas.height=rect.height*dpr;
  const ctx=canvas.getContext("2d");ctx.scale(dpr,dpr);const w=rect.width,h=rect.height;
  const vals=state.dashboard?.trend||[8200,9100,9700,10300,11200,12450], max=Math.max(...vals)*1.15,min=Math.min(...vals)*.85;
  const pad={l:15,r:15,t:20,b:25};const x=i=>pad.l+i*(w-pad.l-pad.r)/(vals.length-1);const y=v=>h-pad.b-(v-min)/(max-min)*(h-pad.t-pad.b);
  ctx.strokeStyle="#eee7dc";ctx.lineWidth=1;
  for(let i=0;i<4;i++){const yy=pad.t+i*(h-pad.t-pad.b)/3;ctx.beginPath();ctx.moveTo(pad.l,yy);ctx.lineTo(w-pad.r,yy);ctx.stroke()}
  const grad=ctx.createLinearGradient(0,pad.t,0,h);grad.addColorStop(0,"rgba(233,120,50,.2)");grad.addColorStop(1,"rgba(233,120,50,0)");
  ctx.beginPath();ctx.moveTo(x(0),h-pad.b);vals.forEach((v,i)=>ctx.lineTo(x(i),y(v)));ctx.lineTo(x(vals.length-1),h-pad.b);ctx.closePath();ctx.fillStyle=grad;ctx.fill();
  ctx.beginPath();vals.forEach((v,i)=>i?ctx.lineTo(x(i),y(v)):ctx.moveTo(x(i),y(v)));ctx.strokeStyle="#e97832";ctx.lineWidth=3;ctx.lineJoin="round";ctx.stroke();
  vals.forEach((v,i)=>{ctx.beginPath();ctx.arc(x(i),y(v),4,0,Math.PI*2);ctx.fillStyle="#fffdf9";ctx.fill();ctx.strokeStyle="#e97832";ctx.lineWidth=2;ctx.stroke()});
}

async function render(){
  const app=document.querySelector("#app");
  const path=state.route;
  if(path==="/") app.innerHTML=landing();
  else if(path==="/app"||path==="/app/overview") app.innerHTML=await dashboard();
  else if(path==="/app/insights") app.innerHTML=await insights();
  else if(path.startsWith("/app/insights/")) app.innerHTML=await insightDetail(path.split("/").pop());
  else if(path==="/app/documents") app.innerHTML=await documents();
  else if(path==="/app/data") app.innerHTML=await dataIndex();
  else if(path.startsWith("/app/data/")) app.innerHTML=await dataPage(path.split("/").pop());
  else if(path==="/app/actions") app.innerHTML=await actions();
  else if(path==="/app/reports") app.innerHTML=await reports();
  else if(path==="/app/analyst") app.innerHTML=await analyst();
  else if(path==="/app/settings") app.innerHTML=await settings();
  else app.innerHTML=landing();
  motion(app);
  setupGlobalEvents();
}

window.createAction=createAction;
window.toast=toast;
window.filterTable=filterTable;
window.handleUpload=handleUpload;

window.addEventListener("hashchange",()=>{state.route=location.hash.slice(1)||"/";render()});
window.addEventListener("resize",()=>{if(document.querySelector("#revenue-chart"))drawChart()});
render();
