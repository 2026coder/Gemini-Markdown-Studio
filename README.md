# Gemini Markdown Studio

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Angular](https://img.shields.io/badge/Angular-v21-dd0031.svg)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38bdf8.svg)
![Gemini API](https://img.shields.io/badge/AI-Gemini%202.5-8e75b2.svg)

**Gemini Markdown Studio** is a modern, responsive Markdown editor built with **Angular 21** and **Tailwind CSS**. It features a real-time preview, a mobile-first design, and powerful AI writing assistance powered by the **Google Gemini API**.

## 🚀 Features

### ✍️ Core Editing
- **Real-time Preview**: Instant rendering of Markdown to HTML.
- **Split-Pane Layout**: Classic editor/preview split on desktop.
- **Mobile Optimized**: Tabbed interface (Write/Preview) for seamless mobile editing.
- **Smart Toolbar**: One-click insertion for headers, bold, italic, code blocks, and links.
- **Syntax Highlighting**: Beautifully styled code blocks and typography.

### 🤖 AI-Powered Assistance
Integrated with Google's `gemini-2.5-flash` model to enhance your writing:
- **Fix Grammar**: Instantly correct spelling and grammatical errors.
- **Expand & Detail**: Turn brief notes into professional, expanded paragraphs.
- **Summarize**: Generate concise bulleted lists from long text.
- **Generate Templates**: Create full document structures (e.g., "Project README") from a single topic prompt.

## 🛠️ Tech Stack

- **Framework**: Angular v21 (Standalone Components, Signals, Zoneless)
- **Styling**: Tailwind CSS (v4)
- **AI**: Google GenAI SDK (`@google/genai`)
- **Markdown**: Marked.js
- **Sanitization**: DOMPurify
- **Deployment**: Cloudflare Pages
- **Package Manager**: Bun / NPM

## 📦 Installation & Setup

### Prerequisites
1. **Node.js** (v18+) or **Bun**
2. A **Google Gemini API Key**. Get one [here](https://aistudio.google.com/app/apikey).

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/gemini-markdown-studio.git
cd gemini-markdown-studio
```

### 2. Install Dependencies
```bash
npm install
# or
bun install
```

### 3. Environment Configuration
This application relies on an environment variable for the API key.
*   **Local Development**: You can hardcode the key temporarily in `src/services/ai.service.ts` or serve with an env var (depending on your builder setup).
*   **Production**: Set the `API_KEY` variable in your deployment platform (e.g., Cloudflare Pages dashboard).

### 4. Run Locally
```bash
npm start
# or
ng serve
```
Navigate to `http://localhost:4200`.

## 🚀 Building & Deployment

### Build for Production
```bash
npm run build
```
This generates static files in the `dist/` directory.

### Deploy to Cloudflare Pages
This project is configured for Cloudflare Pages via `wrangler.json`.

1.  **Login to Cloudflare**:
    ```bash
    npx wrangler login
    ```

2.  **Deploy**:
    ```bash
    npx wrangler pages deploy dist --project-name=gemini-markdown-studio
    ```

> **Important**: After deployment, go to your Cloudflare Pages dashboard > Settings > Environment variables and add your `API_KEY`.

## 📂 Project Structure

```
src/
├── app.component.ts       # Main logic (State, UI handling)
├── app.component.html     # Template (Toolbar, Editor, Preview)
├── services/
│   └── ai.service.ts      # Google GenAI integration logic
├── index.html             # Base HTML (CDN links for Tailwind/Marked)
├── main.ts                # Application bootstrap
└── ...
```

## 🔒 Security

- **HTML Sanitization**: All Markdown output is sanitized via `DOMPurify` to prevent XSS attacks.
- **Safe Environment**: API keys are accessed safely to prevent runtime crashes in browser environments.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
