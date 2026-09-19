# ML Academy

An interactive, from-scratch course on **Machine Learning** — covering the
**theory**, the **mathematics behind each method**, and **fully worked solved
examples** you can follow by hand.

Built with Next.js 14 (App Router), TypeScript and Tailwind CSS, with all
mathematics typeset by [KaTeX](https://katex.org/).

![CI](https://img.shields.io/badge/CI-typecheck%20·%20lint%20·%20test%20·%20build-blue)

---

## What it covers

The curriculum follows a complete "Introduction to ML" syllabus across four
modules and ~25 lessons:

| Module | Topics |
| ------ | ------ |
| **🎯 Supervised Learning** | Intro & data · Linear/Multiple regression · Logistic regression · k-NN · Decision trees · Random forests · SVM · Naive Bayes · Loss functions & gradient descent · Overfitting, bias–variance & regularization · Evaluation metrics & cross-validation |
| **🧭 Unsupervised Learning** | Intro & distance measures · k-Means (elbow, silhouette) · Hierarchical · DBSCAN · Gaussian mixture models · PCA · t-SNE & autoencoders · Association rules (Apriori) · Anomaly detection |
| **⚡ Perceptron Model** | The artificial neuron · Net input, step activation & decision boundary · Learning rule · Convergence theorem · The XOR problem |
| **🕸️ Multilayer Perceptron** | Architecture & activations (sigmoid/tanh/ReLU) · Forward propagation · Backpropagation & gradient descent |

Every lesson includes **learning objectives**, **plain-language theory**, the
**mathematical model** (rendered with LaTeX), and at least one **solved numeric
example**.

## Features

- 📖 **Structured lessons** with sidebar navigation and prev/next flow.
- ➗ **Real mathematics** — display and inline LaTeX via KaTeX, rendered on the
  server for fast, flash-free pages.
- 🧪 **Solved examples** as first-class content blocks (problem → steps → answer).
- 🔎 **Full-text search** across every lesson.
- 🌗 **Light/dark mode**, responsive and accessible.
- ✅ **Tested** — a content-integrity suite checks unique slugs, navigation,
  search, and that *every* formula renders without a KaTeX error.

---

## Quick start

```bash
npm install
npm run dev
# open http://localhost:3000
```

### Scripts

| Script              | What it does                          |
| ------------------- | ------------------------------------- |
| `npm run dev`       | Start the dev server                  |
| `npm run build`     | Production build (standalone output)  |
| `npm run start`     | Serve the production build            |
| `npm run typecheck` | `tsc --noEmit`                        |
| `npm run lint`      | ESLint                                |
| `npm test`          | Vitest content-integrity suite        |

---

## How it’s built

Lessons are authored as **typed data**, not free-form MDX, so every lesson is
type-checked, searchable and rendered uniformly.

```
lib/content/
  types.ts          # Block/Lesson/Module model
  supervised.ts     # Module 1 content
  unsupervised.ts   # Module 2 content
  perceptron.ts     # Module 3 content
  mlp.ts            # Module 4 content
  index.ts          # aggregation, navigation & search index
  content.test.ts   # integrity tests
lib/math.ts         # KaTeX render helper (server-side)
components/
  BlockRenderer.tsx # renders each Block type (prose, math, notes, tables, examples…)
  InlineText.tsx    # inline markup: $math$ **bold** *italic* `code` [link](/x)
  Sidebar, SiteHeader, SearchBox, ThemeToggle …
app/
  page.tsx              # landing
  learn/page.tsx        # curriculum index
  learn/[slug]/page.tsx # a lesson (statically generated)
  search/page.tsx       # search results
  api/health/route.ts   # health probe
```

### Authoring a lesson

Add a lesson object to the relevant module file. A lesson is a list of **blocks**:

```ts
{
  slug: 'my-topic',
  title: 'My Topic',
  summary: 'One line for cards and search.',
  objectives: ['…'],
  blocks: [
    { type: 'p', text: r`Prose with $inline$ math and **bold**.` },
    { type: 'math', tex: r`E = mc^2` },
    { type: 'example', title: '…', problem: r`…`, solution: [ /* blocks */ ], answer: '…' },
  ],
}
```

`const r = String.raw` lets you write LaTeX with single backslashes. New lessons
appear in the sidebar, curriculum, search and prev/next automatically.

---

## Deployment

**Vercel** (easiest): import the repo and click Deploy — it auto-detects Next.js,
and no environment variables are required.

**Docker**

```bash
docker build -t ml-academy .
docker run -p 3000:3000 ml-academy
```

Uses Next.js `standalone` output and a non-root user, with a `HEALTHCHECK`
against `/api/health`.

## Tech stack

Next.js 14 · React 18 · TypeScript (strict) · Tailwind CSS · KaTeX ·
lucide-react · Vitest · ESLint · Docker · GitHub Actions.

## A note on accuracy

The content is written to be correct and teachable. If you spot an error in a
derivation or example, it lives in one place — the relevant `lib/content/*.ts`
file — and the test suite will re-verify every formula on the next run.
