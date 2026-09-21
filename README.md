# neuronode

A **static, offline-first** course on Machine Learning — theory, the mathematics
behind each method, solved examples and figures. It is plain **HTML / CSS /
JavaScript**: no server, no build step, no internet required to read it.

## ▶️ How to open it

**Just double-click `index.html`** (or drag it into any web browser).

That's it. Everything — all 5 modules and 35 lessons, the math, the figures,
search and dark mode — runs entirely from the file, offline.

> The math fonts and content are bundled in the `assets/` folder next to
> `index.html`, so keep that folder beside it if you move things around.

## What's inside

```
index.html            ← open this
assets/
  styles.css          ← all styling (light/dark)
  app.js              ← the small app: routing, sidebar, search, theme toggle
  content.js          ← the whole course, pre-rendered (generated)
  katex/              ← bundled math stylesheet + fonts (for offline math)
```

The course covers, in order:

1. **Foundations** — what ML is, datasets & their representation, types of data,
   and the linear algebra / calculus / probability you need.
2. **Supervised Learning** — regression, logistic regression, k-NN, trees,
   forests, SVM, Naive Bayes, loss & gradient descent, bias–variance, metrics.
3. **Unsupervised Learning** — k-means, hierarchical, DBSCAN, GMM, PCA, t-SNE,
   autoencoders, association rules, anomaly detection.
4. **Perceptron** — the artificial neuron, the learning rule, XOR.
5. **Multilayer Perceptron** — the neuron, activation functions, forward
   propagation, and the full backpropagation derivation with a worked example.

Every lesson has an **"At a glance"** card (definition · why · when to use), the
**mathematics** typeset with KaTeX, **worked examples**, and **figures**.

## Editing / regenerating (optional — only if you want to change content)

The page you open is generated from typed source in `lib/content/` (one file per
module) and the figure library in `components/Diagram.tsx`. To rebuild after an
edit you need [Node.js](https://nodejs.org):

```bash
npm install        # once
npm run build      # regenerates assets/content.js and the bundled math assets
```

Then reopen `index.html`. Other scripts: `npm test` (content-integrity checks),
`npm run typecheck`.

## Putting it online (optional)

Because it's static, you can host the folder anywhere — GitHub Pages, Netlify
drop, or any static host — and share a link. Nothing needs to run server-side.
