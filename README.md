<div align="center">

<img src="https://img.shields.io/badge/Task-05-6F3BFD?style=for-the-badge&logoColor=white" />
<img src="https://img.shields.io/badge/Internship-Future%20Interns%202026-FFD200?style=for-the-badge&logoColor=black" />
<img src="https://img.shields.io/badge/Framework-React%2018%20+%20Vite-00C2FF?style=for-the-badge&logo=vite&logoColor=white" />
<img src="https://img.shields.io/badge/Database-MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" />
<img src="https://img.shields.io/badge/Status-Live-06E07F?style=for-the-badge&logoColor=white" />

<br /><br />

<pre>
 ██████╗███████╗ ██████╗  ██████╗     ██████╗  ██████╗ ██████╗ ████████╗ █████╗ ██╗     
██╔════╝██╔════╝██╔════╝ ██╔════╝     ██╔══██╗██╔═══██╗██╔══██╗╚══██╔══╝██╔══██╗██║     
█████╗  █████╗  ██║  ███╗██║  ███╗    ██████╔╝██║   ██║██████╔╝   ██║   ███████║██║     
██╔══╝  ██╔══╝  ██║   ██║██║   ██║    ██╔═══╝ ██║   ██║██╔══██╗   ██║   ██╔══██║██║     
███████╗██║     ╚██████╔╝╚██████╔╝    ██║     ╚██████╔╝██║  ██║   ██║   ██║  ██║███████╗
╚══════╝╚═╝      ╚═════╝  ╚═════╝     ╚═╝      ╚══════╝╚═╝  ╚═╝   ╚═╝   ╚═╝  ╚═╝╚══════╝
</pre>

# 💼 EFCG Portal — Emirates Finance Consulting Group

> **A high-end, production-ready wealth management and advisor dashboard built for the UAE market.**  
> Futuristic glassmorphism design. Dynamic FX volume tiers. Compound investment growth engines.

</div>

---

## 📝 Project Overview

This repository houses the complete full-stack wealth advisory and client ledger application for the **Emirates Finance Consulting Group (EFCG)**. 

Designed for financial advisors operating under UAE regulations, this application features a MERN-stack architecture with enterprise-grade caching, dynamic calculators, interactive visualizations, and automated compliance logging.

### 🏢 Advisory Details

| Parameter | Details |
| :--- | :--- |
| **Brand Name** | Emirates Finance Consulting Group (EFCG) |
| **Services Offered** | Currency Conversion, Investment Planning, Portfolio Audits |
| **Active Base** | Dubai, Abu Dhabi, Sharjah (United Arab Emirates) |
| **Compliance Level** | DFSA Compliant (Dubai Financial Services Authority) |

---

## 💡 Business Pitch & Value Proposition

### 1️⃣ The Problem
Wealth management practices in the region often depend on manual spreadsheet-based calculations for advisory pricing tiers and tax calculations. This creates operational friction, slower client onboarding, and compliance reporting gaps.

### 2️⃣ The Solution
A unified, real-time portal featuring a secure interface that gives advisors instant access to client operations:

| Feature | Business Impact |
| :--- | :--- |
| 💱 **Dynamic FX Fee Scale** | Automatically lowers conversion fees based on transaction volume to incentivize larger transactions. |
| 📈 **Three-Tier Growth Simulator** | Visualizes compound growth models (Conservative, Balanced, High Growth) with built-in UAE progressive corporate/profit taxes. |
| 🔒 **System Audit Ledger** | Real-time administrative logging of all conversions, investment quotes, and system API exceptions. |

### 3️⃣ Business Value
By digitalizing client ledgers and offering dynamic calculations in client meetings, EFCG advisors reduce quote generation time from **30 minutes to 30 seconds**, while building high trust through fully transparent calculations.

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React 18 · Vite · Tailwind CSS |
| **Backend** | Node.js · Express |
| **Database** | MongoDB (Mongoose ODM) |
| **Charts** | Recharts (Responsive SVG Canvas) |
| **Icons** | Lucide React |
| **Rate API** | Frankfurter API (with local MongoDB recovery cache) |

---

## ⚙️ Technical Architecture

### 🚀 Frontend & UI/UX

- **Design System** — Custom tailwind configuration with ambient backdrop orbs, glassmorphism containers, and button sweep animations.
- **Dynamic Color Themes** — Navigation, active selections, and calculators are color-mapped: Dashboard (Purple), FX Transfer (Teal), Investment (Gold), Client Records (Coral).
- **Responsive Navigation** — Mobile-first off-canvas sidebar with persistent layout wrappers.

### ⚡ Backend & Data Processing

- **Dual-Cache Rate Manager** — Fetches real-time market conversion rates. Automatically flags warnings, fallbacks to cached DB values on error, and tries 3x automatic API retries.
- **Secured Authentication** — State-managed sessions with hashed passwords using bcrypt and custom role-based middleware limits.
- **Error Capture Engine** — Global Express middleware captures server failures, records stack traces, and catalogs reports under administration logs.

---

## 📂 Project Structure

```bash
efcg-app/
├── client/                     # ⚛️ React Vite Frontend
│   ├── src/
│   │   ├── components/         # Global Layout, Logo, and Shell elements
│   │   ├── context/            # AuthContext session provider
│   │   ├── pages/              # Landing, Login, Dashboard, Conversion, Investment, Admin pages
│   │   ├── utils/              # API and router helper settings
│   │   ├── index.css           # Global custom CSS system (animations, glows)
│   │   └── main.jsx
│   ├── tailwind.config.js      # Tailored brand colors, shadows, and keyframes
│   └── package.json
│
├── server/                     # 🟢 Node.js Express Backend
│   ├── models/                 # Mongoose Schemas (User, Client, Transaction, Quote, Logs)
│   ├── routes/                 # REST API Handlers (Auth, Dashboard, Rates, Admin)
│   ├── middleware/             # Role verification and Error interceptors
│   ├── server.js               # Entry point
│   └── package.json
└── README.md                   # 📄 You are here
```

---

## 🚀 Getting Started

### 📌 Prerequisites

- [Node.js](https://nodejs.org/) `v18+`
- [MongoDB](https://www.mongodb.com/) running locally or via MongoDB Atlas

---

### ⚙️ Installation

#### 1️⃣ Clone the Repository

```bash
git clone https://github.com/FutureInterns/EFCG-Portal.git
cd EFCG-Portal
```

#### 2️⃣ Server Setup

```bash
cd server
npm install
```

Create a `.env` file inside `server/` with the following variables:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/efcg
SESSION_SECRET=your_super_secret_session_key
```

Start the API Server:
```bash
node server.js
```
> ✅ Server running on `http://localhost:5000`

#### 3️⃣ Client Setup

```bash
cd ../client
npm install
```

Start the Vite Development Server:
```bash
npm run dev
```
> ✅ Client running on `http://localhost:3000` (or `http://localhost:3001`)

---

## 📌 Key Highlights

- ✅ **MERN Stack** fully styled in modern glassmorphism.
- ✅ **Dynamic FX Calculator** featuring a 4-tier pricing model.
- ✅ **3-Tier Investment Planner** demonstrating compound growth with tax deductions.
- ✅ **Secure Portal Auth** dividing privileges between Advisor and Admin roles.
- ✅ **Live API Cache Manager** with fallback support.
- ✅ **Interactive Charts** built using Recharts.
- ✅ **System Audit Trails** tracking transaction savings, quote creation, and database edits.

---


---

## 👨‍💻 Developer

<table>
  <tr>
    <td align="center">
      <b>Yasir Azam</b>
      <a href="https://github.com/Yasir941">
        <img src="https://img.shields.io/badge/GitHub-Yasir941-181717?style=for-the-badge&logo=github&logoColor=white" />
      </a>
      <br/><br/>
      <a href="https://www.linkedin.com/in/yasir-azam-1b6205320">
        <img src="https://img.shields.io/badge/LinkedIn-Yasir%20Azam-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white" />
      </a>
    </td>
  </tr>
</table>

---



---

<div align="center">

**💼 Premium Wealth Advisory · UAE Compliant · Powered by React & Express**

<br />

<img src="https://img.shields.io/badge/Built%20with-React-61DAFB?style=flat-square&logo=react&logoColor=black" />
<img src="https://img.shields.io/badge/Served%20with-Node-339933?style=flat-square&logo=node.js&logoColor=white" />
<img src="https://img.shields.io/badge/Stored%20in-MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white" />
<img src="https://img.shields.io/badge/Styled%20with-Tailwind-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" />

<br /><br />

*© 2026 EMIRATES FINANCE CONSULTING GROUP. All Rights Reserved.*

</div>
