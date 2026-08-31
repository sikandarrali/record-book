# Record Book

Record Book is a mobile-first multilingual (English/Urdu), installable Progressive Web App for tracking books, records, diaries, and shared groups.

<p>
  <a href="https://rb.sikandar.info/">
    <img alt="Demo" src="https://img.shields.io/badge/Demo-0B6DFD?style=for-the-badge&logo=vercel&logoColor=white" />
  </a>
</p>

## Features

- **Books & Records** — create books and log monetary records inside them
- **Diaries** — a dedicated diary feature for freeform entries
- **Groups & Sharing** — create groups and share books/diaries with family or friends, join groups via invite links
- **Multiple Currencies** — support for PKR, Euro, and US Dollar with correct currency formatting
- **Multilingual** — English and Urdu, including Urdu-specific date/text handling
- **Theming** — multiple themes with light/dark mode support
- **PWA / Mobile-first** — installable app with pull-to-refresh
- **Auth** — session-based authentication backed by Appwrite

## Tech Stack

**Framework**
- [Next.js 14](https://nextjs.org/) (App Router) — [react.org](https://react.dev/) / React 18
- [@ducanh2912/next-pwa](https://github.com/DuCanhGH/next-pwa) — Progressive Web App support

**Backend / Data**
- [Appwrite](https://appwrite.io/) (`appwrite` client SDK + `node-appwrite` server SDK) — auth, database, and users
- [node-mailjet](https://github.com/mailjet/mailjet-apiv3-nodejs) — transactional email

**Internationalization**
- [next-intl](https://next-intl-docs.vercel.app/) and [next-international](https://next-international.vercel.app/) — routing and message translation
- [Localazy](https://localazy.com/) — translation management (see `localazy.json`)

**UI**
- [Tailwind CSS](https://tailwindcss.com/)
- [Shadcn](https://ui.shadcn.com/)
- [Lucide React](https://lucide.dev/) — icons
- [Framer Motion](https://www.framer.com/motion/) — animation
- [Lottie React](https://github.com/Gamote/lottie-react) — Lottie animations

**Forms & Data**
- [Formik](https://formik.org/) — form state management
- [Yup](https://github.com/jquense/yup) — schema validation
- [date-fns](https://date-fns.org/) — date utilities
- [Axios](https://axios-http.com/) — HTTP client

**Tooling**
- ESLint (`eslint-config-next`)
- PostCSS + Tailwind CLI pipeline
- Webpack (via Next.js build)

## Changelog

See [CHANGELOG.md](./CHANGELOG.md) for release history.
