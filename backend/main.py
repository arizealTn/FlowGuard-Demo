from datetime import datetime
from pathlib import Path
import re
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="FlowGuard API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

INSIGHTS = [
    {
        "id": "supplier-price",
        "severity": "critical",
        "category": "Suppliers",
        "title": "Supplier price increase detected",
        "description": "A key supplier increased the average unit cost of fast-moving items.",
        "impact": 7712,
        "impact_label": "estimated monthly impact",
        "evidence": [
            {"label": "Previous average unit cost", "value": "₹42.00"},
            {"label": "Current average unit cost", "value": "₹48.22"},
            {"label": "Observed increase", "value": "+14.8%"},
            {"label": "Monthly affected volume", "value": "1,240 units"},
        ],
        "explanation": "The supplier's current pricing is materially above the prior baseline. Because the affected items are fast-moving, the change can compound into recurring margin pressure.",
        "recommendation": "Review the supplier quote, negotiate a volume price or compare a second supplier before the next replenishment cycle.",
    },
    {
        "id": "dead-stock",
        "severity": "warning",
        "category": "Inventory",
        "title": "Dead stock is tying up cash",
        "description": "18 products have had no movement for more than 60 days.",
        "impact": 21600,
        "impact_label": "inventory value at risk",
        "evidence": [
            {"label": "Items without movement", "value": "18"},
            {"label": "No-movement threshold", "value": ">60 days"},
            {"label": "Inventory value", "value": "₹21,600"},
        ],
        "explanation": "Capital is sitting in products that are not generating sales. This reduces available working capital and increases the probability of discounting or write-offs.",
        "recommendation": "Create a clearance bundle, move the products closer to checkout, or stop replenishment until stock normalizes.",
    },
    {
        "id": "expense-anomaly",
        "severity": "warning",
        "category": "Financial",
        "title": "Operating expense is above baseline",
        "description": "A recurring expense category is 18.2% above its three-month baseline.",
        "impact": 8450,
        "impact_label": "estimated annualized impact",
        "evidence": [
            {"label": "Current monthly expense", "value": "₹14,200"},
            {"label": "Three-month baseline", "value": "₹12,000"},
            {"label": "Variance", "value": "+18.3%"},
        ],
        "explanation": "The utilities category is running above its recent baseline. The increase is large enough to deserve review rather than being treated as ordinary month-to-month noise.",
        "recommendation": "Review the latest bills, check for tariff or usage changes, and set a monthly alert threshold.",
    },
]

DOCUMENTS = [
    {"name": "September Sales.csv", "type": "CSV", "status": "Processed", "date": "Oct 8, 2026"},
    {"name": "Inventory Snapshot.xlsx", "type": "XLSX", "status": "Processed", "date": "Oct 8, 2026"},
    {"name": "Supplier Invoice 1042.pdf", "type": "PDF", "status": "Processed", "date": "Oct 7, 2026"},
]

ACTIONS = [
    {"title": "Review Assam Foods pricing", "owner": "Tanmoy", "status": "In Progress", "due": "Oct 10"},
    {"title": "Clear dead stock candidates", "owner": "Store manager", "status": "Suggested", "due": "Oct 14"},
]

DATA = {
    "sales": [
        {"date":"2026-09-30","product":"Rice 5kg","units":84,"revenue":5880,"margin":21},
        {"date":"2026-09-29","product":"Sunflower Oil","units":52,"revenue":4940,"margin":17},
        {"date":"2026-09-28","product":"Tea 250g","units":38,"revenue":2660,"margin":24},
        {"date":"2026-09-27","product":"Biscuits","units":91,"revenue":3640,"margin":26},
    ],
    "inventory": [
        {"product":"Rice 5kg","units":84,"value":5880,"last_sold":"Today","status":"Healthy"},
        {"product":"Premium Atta","units":120,"value":8400,"last_sold":"12 days ago","status":"Healthy"},
        {"product":"Imported Sauce","units":72,"value":7200,"last_sold":"74 days ago","status":"Dead stock"},
        {"product":"Gift Basket","units":60,"value":6000,"last_sold":"82 days ago","status":"Dead stock"},
    ],
    "expenses": [
        {"date":"2026-09-30","category":"Utilities","amount":14200,"baseline":12000,"variance":18.3},
        {"date":"2026-09-28","category":"Transport","amount":8600,"baseline":8100,"variance":6.2},
        {"date":"2026-09-25","category":"Packaging","amount":5100,"baseline":5300,"variance":-3.8},
    ],
    "customers": [
        {"customer":"Walk-in","orders":220,"revenue":68000,"last_order":"Today","segment":"Core"},
        {"customer":"Hotel Green","orders":14,"revenue":18400,"last_order":"2 days ago","segment":"Wholesale"},
        {"customer":"Cafe North","orders":9,"revenue":11200,"last_order":"6 days ago","segment":"Wholesale"},
    ],
    "suppliers": [
        {"supplier":"Assam Foods Co.","items":12,"spend":52200,"change":14.8,"status":"Review"},
        {"supplier":"NorthEast Distributors","items":8,"spend":33800,"change":3.2,"status":"Stable"},
        {"supplier":"Jorhat Packaging","items":5,"spend":16400,"change":-1.1,"status":"Stable"},
    ],
}

@app.get("/api/health")
def health():
    return {"status": "ok", "service": "flowguard-api"}

@app.get("/api/dashboard")
def dashboard():
    return {
        "business_health": 78,
        "revenue": 12450,
        "profit": 4800,
        "money_at_risk": 58550,
        "revenue_change": 8.4,
        "profit_change": 3.2,
        "trend": [8200, 9100, 9700, 10300, 11200, 12450],
    }

@app.get("/api/insights")
def insights():
    return INSIGHTS

@app.get("/api/insights/{insight_id}")
def insight(insight_id: str):
    for item in INSIGHTS:
        if item["id"] == insight_id:
            return item
    return INSIGHTS[0]

@app.get("/api/documents")
def documents():
    return DOCUMENTS

@app.post("/api/documents/upload")
async def upload_document(file: UploadFile = File(...)):
    ext = Path(file.filename or "").suffix.lower().replace(".", "").upper() or "FILE"
    return {
        "name": file.filename,
        "type": ext,
        "status": "Processing",
        "date": datetime.now().strftime("%b %-d, %Y") if __import__("os").name != "nt" else datetime.now().strftime("%b %#d, %Y"),
    }

@app.get("/api/data/{kind}")
def data(kind: str):
    return DATA.get(kind, [])

@app.get("/api/actions")
def actions():
    return ACTIONS

@app.post("/api/actions")
def create_action(payload: dict):
    insight_id = payload.get("insight_id", "unknown")
    return {"ok": True, "insight_id": insight_id, "status": "Suggested"}

@app.get("/api/reports")
def reports():
    return [
        {"name":"September Executive Summary","period":"Sep 2026","status":"Ready"},
        {"name":"Inventory Risk Review","period":"Sep 2026","status":"Ready"},
    ]

@app.post("/api/analyst/query")
def analyst_query(payload: dict):
    question = (payload.get("question") or "").lower()
    if "supplier" in question or "vendor" in question:
        answer = "Assam Foods Co. is the first supplier to review. Its observed cost increase is 14.8%, with an estimated ₹7,712 monthly impact on affected volume. The evidence points to a pricing change rather than a broad revenue decline."
    elif "profit" in question:
        answer = "Profit is currently ₹4,800 and is up 3.2% versus the prior period. The main pressure visible in the demo data is supplier cost inflation and an elevated utilities expense. The supplier issue is the most actionable recurring impact."
    elif "lose" in question or "risk" in question or "money" in question:
        answer = "The largest identified exposures are dead stock at ₹21,600, the supplier price increase at about ₹7,712 per month, and an operating expense variance with an estimated ₹8,450 annualized impact."
    elif "first" in question or "do" in question:
        answer = "Start with the supplier pricing issue because it creates a recurring monthly margin impact. Then address dead stock to release working capital."
    else:
        answer = "The current workspace shows healthy revenue growth, but three issues deserve attention: supplier price inflation, dead stock and elevated utilities expense. Ask about any of those areas for a more specific answer."
    return {"answer": answer, "sources": ["dashboard", "supplier records", "inventory records", "expense records"]}

@app.get("/api/settings")
def settings():
    return {
        "business_name": "FreshMart",
        "business_type": "Neighborhood Grocery",
        "location": "Jorhat, Assam",
        "currency": "INR",
    }
