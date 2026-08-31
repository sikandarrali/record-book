# Graph Report - record-book  (2026-09-01)

## Corpus Check
- 178 files · ~64,164 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 809 nodes · 2212 edges · 113 communities (48 shown, 65 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 5 edges (avg confidence: 0.5)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `b11fbc2f`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- useAuth
- utils.js
- Changelog
- cn
- Navbar.jsx
- Providers.jsx
- What You Must Do When Invoked
- routes.js
- alert-dialog.jsx
- use-toast.js
- package.json
- r
- components.json
- removeExtraSpaces
- constructor
- z
- dependencies
- DarkModeToggle.jsx
- tt
- workbox-f1770938.js
- toggle-group.jsx
- UITextInput.jsx
- context-menu.jsx
- a
- graphify reference: extra exports and benchmark
- manifest.json
- select.jsx
- v
- card.jsx
- dialog.jsx
- graphify reference: query, path, explain
- CreatedUpdatedBy.jsx
- alert.jsx
- { useI18n, useScopedI18n, I18nProviderClient, useChangeLocale, useCurrentLocale }
- graphify reference: add a URL and watch a folder
- graphify reference: commit hook and native CLAUDE.md integration
- graphify reference: incremental update and cluster-only
- tabs.jsx
- reusableStyles.js
- graphify reference: GitHub clone and cross-repo merge
- graphify reference: transcribe video and audio
- .eslintrc.json
- compilerOptions
- ThemeSwitcher.js
- postcss.config.mjs
- async
- axios
- class-variance-authority
- CLAUDE.md
- .claude/CLAUDE.md
- extraction-spec.md
- clsx
- cmdk
- cookies-next
- date-fns
- @ducanh2912/next-pwa
- formik
- framer-motion
- holy-loader
- js-cookie
- .mcp.json
- next
- next.config.mjs
- @next/font
- next-international
- next-intl
- node-appwrite
- node-mailjet
- pulltorefreshjs
- @radix-ui/react-accordion
- @radix-ui/react-alert-dialog
- @radix-ui/react-context-menu
- @radix-ui/react-dialog
- @radix-ui/react-dropdown-menu
- @radix-ui/react-icons
- @radix-ui/react-label
- @radix-ui/react-popover
- @radix-ui/react-progress
- @radix-ui/react-select
- @radix-ui/react-separator
- @radix-ui/react-switch
- @radix-ui/react-tabs
- @radix-ui/react-toast
- @radix-ui/react-toggle
- @radix-ui/react-tooltip
- react
- react-day-picker
- react-dom
- react-number-format
- react-pull-to-refresh
- react-responsive
- react-toastify
- sharp
- sonner
- tailwind-merge
- tailwindcss-animate
- vaul
- yup
- tailwind.config.js

## God Nodes (most connected - your core abstractions)
1. `cn()` - 190 edges
2. `useAuth()` - 74 edges
3. `UIText()` - 59 edges
4. `Button` - 36 edges
5. `Changelog` - 29 edges
6. `useData()` - 27 edges
7. `ToastOptions` - 22 edges
8. `UISheet()` - 20 edges
9. `r` - 17 edges
10. `db` - 16 edges

## Surprising Connections (you probably didn't know these)
- `RootLayout()` --calls--> `cn()`  [EXTRACTED]
  app/[locale]/layout.js → lib/utils.js
- `MenuItem()` --calls--> `cn()`  [EXTRACTED]
  components/nav/Navbar.jsx → lib/utils.js
- `AlertDialogOverlay` --calls--> `cn()`  [EXTRACTED]
  components/ui/alert-dialog.jsx → lib/utils.js
- `AlertTitle` --calls--> `cn()`  [EXTRACTED]
  components/ui/alert.jsx → lib/utils.js
- `AlertDescription` --calls--> `cn()`  [EXTRACTED]
  components/ui/alert.jsx → lib/utils.js

## Import Cycles
- None detected.

## Communities (113 total, 65 thin omitted)

### Community 0 - "useAuth"
Cohesion: 0.09
Nodes (66): Page(), Page(), Page(), Page(), Page(), Page(), Home(), Home() (+58 more)

### Community 1 - "utils.js"
Cohesion: 0.13
Nodes (30): Settings(), account, AppContext, useApp(), EditFontSize(), EditLanguage(), EditTheme(), ClearFieldButton() (+22 more)

### Community 2 - "Changelog"
Cohesion: 0.06
Nodes (33): 1.0, 2.0, 3.0, 3.1, 3.2, 3.2.1, 3.2.1.1, 3.3 (+25 more)

### Community 3 - "cn"
Cohesion: 0.10
Nodes (24): Page(), CommandSeparator, CommandShortcut(), DrawerContent, DrawerDescription, DrawerFooter(), DrawerHeader(), DrawerOverlay (+16 more)

### Community 4 - "Navbar.jsx"
Cohesion: 0.12
Nodes (20): EditGroup(), EditGroupSchema, removeExtraSpaces(), Logo(), MenuItem(), Navbar(), Sidebar(), BookType() (+12 more)

### Community 5 - "Providers.jsx"
Cohesion: 0.11
Nodes (17): fontSans, fontUrdu, fontUrduHeading, metadata, OG_IMAGE, RootLayout(), AppProvider(), AuthProvider() (+9 more)

### Community 6 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (24): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+16 more)

### Community 7 - "routes.js"
Cohesion: 0.13
Nodes (18): DecodeUserId(), allProtectedPaths, allPublicPaths, HOMEPAGE_ROUTE, LOCALE_HOME_ROUTE, LOCALE_NEUTRAL_ROUTES(), LOCALE_PROTECTED_ROUTES(), LOCALE_PUBLIC_ROUTES() (+10 more)

### Community 8 - "alert-dialog.jsx"
Cohesion: 0.24
Nodes (14): DeleteGroup(), DeleteGroupMember(), LeaveGroup(), UIDialogFooter(), AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription (+6 more)

### Community 9 - "use-toast.js"
Cohesion: 0.17
Nodes (18): Toast, ToastAction, ToastClose, ToastDescription, ToastTitle, toastVariants, ToastViewport, Toaster() (+10 more)

### Community 10 - "package.json"
Cohesion: 0.10
Nodes (19): eslint, eslint-config-next, devDependencies, eslint, eslint-config-next, postcss, tailwindcss, webpack (+11 more)

### Community 11 - "r"
Cohesion: 0.25
Nodes (5): et(), m(), r, st, U()

### Community 12 - "components.json"
Cohesion: 0.14
Nodes (13): aliases, components, utils, rsc, $schema, style, tailwind, baseColor (+5 more)

### Community 13 - "removeExtraSpaces"
Cohesion: 0.27
Nodes (7): DiaryRecordSchema, DiarySchema, PageSchema, ProfileSchema, RecordSchema, removeExtraSpaces(), SearchSchema

### Community 14 - "constructor"
Cohesion: 0.18
Nodes (5): constructor(), deleteCacheAndMetadata(), h(), J, p()

### Community 16 - "dependencies"
Cohesion: 0.15
Nodes (13): appwrite, lottie-react, lucide-react, next-themes, dependencies, appwrite, lottie-react, lucide-react (+5 more)

### Community 17 - "DarkModeToggle.jsx"
Cohesion: 0.23
Nodes (11): DarkModeToggle(), modes, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuRadioItem, DropdownMenuSeparator (+3 more)

### Community 19 - "workbox-f1770938.js"
Cohesion: 0.26
Nodes (7): b(), get(), i, k(), s, T(), y

### Community 20 - "toggle-group.jsx"
Cohesion: 0.31
Nodes (7): BookTypeToggleGroup(), RecordTypeToggleGroup(), ToggleGroup, ToggleGroupContext, ToggleGroupItem, Toggle, toggleVariants

### Community 21 - "UITextInput.jsx"
Cohesion: 0.44
Nodes (6): NumberInputFieldWithLabel(), UINumberInput(), UITextArea(), UITextInput(), isStringUrdu(), isFontSizeAllowed()

### Community 22 - "context-menu.jsx"
Cohesion: 0.20
Nodes (9): ContextMenuCheckboxItem, ContextMenuContent, ContextMenuItem, ContextMenuLabel, ContextMenuRadioItem, ContextMenuSeparator, ContextMenuShortcut(), ContextMenuSubContent (+1 more)

### Community 24 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 25 - "manifest.json"
Cohesion: 0.22
Nodes (8): background_color, display, icons, name, orientation, short_name, start_url, theme_color

### Community 26 - "select.jsx"
Cohesion: 0.25
Nodes (7): SelectContent, SelectItem, SelectLabel, SelectScrollDownButton, SelectScrollUpButton, SelectSeparator, SelectTrigger

### Community 28 - "card.jsx"
Cohesion: 0.29
Nodes (6): Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle

### Community 29 - "dialog.jsx"
Cohesion: 0.29
Nodes (6): DialogContent, DialogDescription, DialogFooter(), DialogHeader(), DialogOverlay, DialogTitle

### Community 30 - "graphify reference: query, path, explain"
Cohesion: 0.33
Nodes (5): For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal), Step 1 — Traversal

### Community 31 - "CreatedUpdatedBy.jsx"
Cohesion: 0.70
Nodes (3): AccordionContent, AccordionItem, AccordionTrigger

### Community 32 - "alert.jsx"
Cohesion: 0.50
Nodes (4): Alert, AlertDescription, AlertTitle, alertVariants

### Community 34 - "graphify reference: add a URL and watch a folder"
Cohesion: 0.50
Nodes (3): For /graphify add, For --watch, graphify reference: add a URL and watch a folder

### Community 35 - "graphify reference: commit hook and native CLAUDE.md integration"
Cohesion: 0.50
Nodes (3): For git commit hook, For native CLAUDE.md integration, graphify reference: commit hook and native CLAUDE.md integration

### Community 36 - "graphify reference: incremental update and cluster-only"
Cohesion: 0.50
Nodes (3): For --cluster-only, For --update (incremental re-extraction), graphify reference: incremental update and cluster-only

### Community 37 - "tabs.jsx"
Cohesion: 0.50
Nodes (3): TabsContent, TabsList, TabsTrigger

### Community 38 - "reusableStyles.js"
Cohesion: 0.50
Nodes (3): SheetStylesFixedHeight, SheetStylesFlexibleHeight, SheetStylesMAxHeight90

## Knowledge Gaps
- **196 isolated node(s):** `extends`, `next/core-web-vitals`, `21st`, `fontSans`, `fontUrdu` (+191 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **65 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `cn` to `useAuth`, `utils.js`, `alert.jsx`, `Navbar.jsx`, `Providers.jsx`, `tabs.jsx`, `alert-dialog.jsx`, `use-toast.js`, `DarkModeToggle.jsx`, `toggle-group.jsx`, `UITextInput.jsx`, `context-menu.jsx`, `select.jsx`, `card.jsx`, `dialog.jsx`, `CreatedUpdatedBy.jsx`?**
  _High betweenness centrality (0.134) - this node is a cross-community bridge._
- **Why does `dependencies` connect `dependencies` to `package.json`, `async`, `axios`, `class-variance-authority`, `clsx`, `cmdk`, `cookies-next`, `date-fns`, `@ducanh2912/next-pwa`, `formik`, `framer-motion`, `holy-loader`, `js-cookie`, `next`, `@next/font`, `next-international`, `next-intl`, `node-appwrite`, `node-mailjet`, `pulltorefreshjs`, `@radix-ui/react-accordion`, `@radix-ui/react-alert-dialog`, `@radix-ui/react-context-menu`, `@radix-ui/react-dialog`, `@radix-ui/react-dropdown-menu`, `@radix-ui/react-icons`, `@radix-ui/react-label`, `@radix-ui/react-popover`, `@radix-ui/react-progress`, `@radix-ui/react-select`, `@radix-ui/react-separator`, `@radix-ui/react-switch`, `@radix-ui/react-tabs`, `@radix-ui/react-toast`, `@radix-ui/react-toggle`, `@radix-ui/react-tooltip`, `react`, `react-day-picker`, `react-dom`, `react-number-format`, `react-pull-to-refresh`, `react-responsive`, `react-toastify`, `sharp`, `sonner`, `tailwind-merge`, `tailwindcss-animate`, `vaul`, `yup`?**
  _High betweenness centrality (0.024) - this node is a cross-community bridge._
- **Why does `useAuth()` connect `useAuth` to `utils.js`, `cn`, `Navbar.jsx`, `Providers.jsx`, `UITextInput.jsx`?**
  _High betweenness centrality (0.018) - this node is a cross-community bridge._
- **What connects `extends`, `next/core-web-vitals`, `21st` to the rest of the system?**
  _196 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `useAuth` be split into smaller, more focused modules?**
  _Cohesion score 0.09436225509796081 - nodes in this community are weakly interconnected._
- **Should `utils.js` be split into smaller, more focused modules?**
  _Cohesion score 0.1322849213691027 - nodes in this community are weakly interconnected._
- **Should `Changelog` be split into smaller, more focused modules?**
  _Cohesion score 0.05714285714285714 - nodes in this community are weakly interconnected._