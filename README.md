# PaperSight AI 🚀

![PaperSight AI Banner](public/ps_home_page.png)

### *Your intelligent research companion. Summarize PDFs in seconds.*

Welcome to **PaperSight AI**! We're here to make your reading life a whole lot easier. Whether you're a researcher drowning in journals or a student cramming for finals, PaperSight AI uses the magic of Google's Gemini AI to turn those lengthy PDF documents into concise, digestible summaries. It's smart, it's fast, and it looks pretty good doing it.

---

## 🌟 Why PaperSight AI?

We've packed this app with features to help you get to the point, faster.

*   **Smart Summaries**: Upload any PDF, and let our AI agents (powered by Google Gemini) do the heavy lifting. You get the key points, no fluff.
*   **Unified Upload Experience**: Whether you're on the homepage or the dedicated upload page, the experience is smooth, consistent, and fast.
*   **Trial Mode**: Just browsing? You can separate the gold from the noise without even logging in. Try it out, generate a summary, and see what we can do.
*   **Knowledge Base**: Check out our blog for tips, updates, and insights from the PaperSight team.
*   **Modern & Sleek**: We believe tools should be beautiful. Enjoy a dark-themed, responsive UI built with Tailwind CSS and Framer Motion that feels as good as it looks.
*   **Secure & Private**: Your documents are yours. We use Clerk for secure authentication and reputable storage solutions to keep your data safe.

## 🛠️ The Tech Stack

We're running on a modern stack to ensure speed, reliability, and developer happiness.

*   **Framework**: [Next.js 16+](https://nextjs.org/) (App Router)
*   **Language**: TypeScript
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [Shadcn UI](https://ui.shadcn.com/)
*   **Animations**: [Framer Motion](https://www.framer.com/motion/)
*   **AI Engine**: [Google Gemini API](https://ai.google.dev/)
*   **Auth**: [Clerk](https://clerk.com/)
*   **File Storage**: [UploadThing](https://uploadthing.com/)
*   **Database**: PostgreSQL (via Neon / Serverless)

## 🚀 Getting Started

Want to run this locally? Let's get you set up.

### Prerequisites

*   Node.js 18+
*   A package manager (npm, pnpm, yarn, or bun)

### Installation

1.  **Clone the repo:**
    ```bash
    git clone https://github.com/FazlulKarimC/PaperSight_AI.git
    cd papersight_ai
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or pnpm install, yarn, etc.
    ```

3.  **Set up environment variables:**
    Copy `.env.example` to `.env.local` and fill in your keys. You'll need credentials for Clerk, UploadThing, and Google Gemini.
    ```bash
    cp .env.example .env.local
    ```

4.  **Run it:**
    ```bash
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) and start summarizing!

## 📂 Project Structure

Here's a quick tour of how we organized things:

*   `app/`: Main application logic (App Router).
    *   `dashboard/`: User's saved summaries.
    *   `upload/`: The dedicated upload zone.
    *   `blog/`: Our neat little CMS for articles.
*   `components/`: Reusable UI blocks (Buttons, Cards, Inputs).
*   `actions/`: Server actions for that sweet, sweet server-side logic.
*   `lib/` & `utils/`: Helpers, database connections, and AI clients.
*   `public/`: Where the static assets live.

## 🤝 Contributing

Got an idea? Found a bug? We'd love your help! Use the issue tracker to discuss changes or submit a PR. Let's make this tool even better together.

## 📧 Contact

Questions or just want to say hi? Drop us a line at `fazlul0127@gmail.com`.

---

*PaperSight AI - Reading, reimagined.*
