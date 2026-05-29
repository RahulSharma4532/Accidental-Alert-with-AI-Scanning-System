<div align="center">
  <img src="https://images.unsplash.com/photo-1549695627-2b7e12762a1f?auto=format&fit=crop&w=800&q=80" alt="AccidentAlert Banner" width="100%" style="border-radius: 12px; margin-bottom: 20px;" />
  
  <h1>🛡️ AccidentAlert | Smart Insurance & Emergency Platform</h1>
  <p><strong>Next-Generation Telematics, AI Damage Assessment, and Instant Insurance Settlement.</strong></p>

  <p>
    <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E" alt="Vite" />
    <img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" alt="NodeJS" />
  </p>
</div>

<br />

## 📖 Overview

**AccidentAlert** is an enterprise-grade, comprehensive platform designed to bridge the gap between emergency response, legal compliance, and rapid insurance claim settlement. By leveraging AI-driven visual damage scans and a multi-tiered dashboard ecosystem, AccidentAlert completely digitizes the traditionally tedious post-accident process.

Whether you are a distressed policyholder, an insurance provider evaluating risk, a legal mediator resolving disputes, or a system admin monitoring platform health—AccidentAlert provides a perfectly tailored, highly responsive interface for your exact needs.

---

## ✨ Key Features

### 🚀 For Users & Policyholders
*   **AI Visual Damage Scan:** Upload photos of vehicle damage to receive real-time, AI-estimated repair costs and severity mapping.
*   **SOS Emergency Broadcast:** One-tap emergency dispatch alerting family contacts, nearby network hospitals, and police.
*   **Legal Compliance Guide:** Built-in guidance on rights and immunities under the *Motor Vehicles Act 1988* (including Good Samaritan Protection and Hit & Run Solatium).
*   **Real-time Claim Tracking:** Track the exact status of filed claims through a sleek, responsive dashboard.

### 🏢 For Insurance Providers
*   **Automated Risk Scoring:** Review incoming claims alongside AI-generated fraud probability scores to prevent capital loss.
*   **Surveyor Network:** Dispatch certified surveyors to incident locations directly from the Insurer Dashboard.
*   **Instant Settlements:** Approve or reject claims with one click, triggering automated payout workflows.

### ⚖️ For Legal Mediators
*   **Mediation Hub:** A dedicated legal workspace to review deadlocked or disputed claims between users and insurers.
*   **Video Hearings:** Schedule and manage virtual hearings directly within the platform.
*   **Document Vault:** Secure access to police FIRs, medical reports, and timestamped incident telematics.

### 🛡️ For Super Admins
*   **Global Anomaly Shield:** Monitor platform-wide fraud detection alerts and system abuse metrics.
*   **Capital Flows Dashboard:** A master ledger auditing every financial transaction, premium payment, and claim payout.
*   **System Health:** Real-time metrics on API latency, database health, and active user traffic.

---

## 💻 Tech Stack & Architecture

This project is built using modern, highly scalable web technologies focused on premium aesthetics and lightning-fast performance:

*   **Frontend Framework:** React 18 powered by Vite for instant HMR and optimized builds.
*   **Styling & UI:** TailwindCSS, utilizing a custom "Glassmorphism" design system, dynamic `mesh-bg` gradients, and Lucide React icons.
*   **Routing & State:** React Router DOM for protected, role-based routing (Admin, Insurer, Mediator, User).
*   **Animations:** Framer Motion for buttery-smooth page transitions and micro-interactions.

---

## 📱 Fully Responsive Design

AccidentAlert is engineered with a **mobile-first mentality**. 
The complex desktop sidebars automatically transition into sleek, native-feeling slide-out overlays on tablets and smartphones. Every grid, chart, and table intelligently scales to ensure zero horizontal scrolling or broken layouts, regardless of screen size.

---

## 🚀 Getting Started

### Prerequisites
Make sure you have Node.js (v16+) installed on your machine.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/accident-insurance-platform.git
   cd accident-insurance-platform/frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open in browser:**
   Navigate to `http://localhost:5173` to view the platform.

---

## 🔒 Security & Roles

The platform relies on strict JWT-based authentication and role-based access control (RBAC).
*   Navigating to `/admin` without Super Admin credentials will instantly redirect you.
*   Dashboards strictly isolate data to ensure Insurers cannot view competitors' data, and Mediators only see assigned disputes.

---

<div align="center">
  <i>Built with ❤️ for a safer, faster, and more transparent insurance ecosystem.</i>
</div>
