import type { Module } from './types';

const r = String.raw;

export const unsupervised: Module = {
  id: 'unsupervised',
  title: 'Unsupervised Learning',
  icon: '🧭',
  description:
    'Find structure in unlabelled data: clustering, dimensionality reduction, association rules and anomaly detection — no target variable required.',
  lessons: [
    // ------------------------------------------------------------------
    {
      slug: 'introduction-to-unsupervised-learning',
      title: 'Introduction & Distance Measures',
      summary:
        'Learning from unlabelled data, and the distance/similarity measures that make clustering possible.',
      objectives: [
        'Explain what unsupervised learning discovers',
        'Compute Euclidean, Manhattan and cosine distances',
        'Pick an appropriate similarity measure',
      ],
      blocks: [
        {
          type: 'p',
          text: r`**Unsupervised learning** works with **unlabelled data** — only the features $\mathbf{x}$, no target $y$. Instead of predicting a known answer, it uncovers hidden structure: groups (clustering), compact representations (dimensionality reduction), co-occurrence rules, or unusual points (anomalies).`,
        },
        {
          type: 'note',
          variant: 'intuition',
          title: 'Supervised vs unsupervised',
          text: r`Supervised learning is answering a question you already have answers for; unsupervised learning is asking *"what patterns are in here at all?"*`,
        },
        { type: 'heading', text: 'Distance & similarity measures' },
        {
          type: 'p',
          text: r`Almost every unsupervised method needs a notion of "how close are two points?". The three most common:`,
        },
        { type: 'math', tex: r`d_{\text{Euclidean}}(\mathbf{a},\mathbf{b}) = \sqrt{\sum_{j}(a_j-b_j)^2} \quad\text{(straight-line)}` },
        { type: 'math', tex: r`d_{\text{Manhattan}}(\mathbf{a},\mathbf{b}) = \sum_{j}|a_j-b_j| \quad\text{(city-block / L1)}` },
        { type: 'math', tex: r`\text{cosine sim}(\mathbf{a},\mathbf{b}) = \frac{\mathbf{a}\cdot\mathbf{b}}{\lVert\mathbf{a}\rVert\,\lVert\mathbf{b}\rVert} \quad\text{(angle, ignores magnitude)}` },
        {
          type: 'diagram',
          kind: 'distance-measures',
          caption: 'Euclidean (straight-line) vs Manhattan (city-block) distance between two points.',
        },
        {
          type: 'note',
          variant: 'tip',
          title: 'Which to use',
          text: r`**Euclidean** for compact numeric features; **Manhattan** when dimensions are independent or high-dimensional; **cosine** for text/embeddings where direction matters more than length.`,
        },
        {
          type: 'example',
          title: 'Three distances between two points',
          problem: r`Let $\mathbf{a}=(1,2)$ and $\mathbf{b}=(4,6)$. Compute the Euclidean and Manhattan distances, and the cosine similarity.`,
          solution: [
            { type: 'p', text: r`**Euclidean.** $\sqrt{(4-1)^2+(6-2)^2} = \sqrt{9+16} = \sqrt{25} = 5.$` },
            { type: 'p', text: r`**Manhattan.** $|4-1|+|6-2| = 3+4 = 7.$` },
            { type: 'p', text: r`**Cosine.** $\dfrac{1\cdot4 + 2\cdot6}{\sqrt{1^2+2^2}\,\sqrt{4^2+6^2}} = \dfrac{16}{\sqrt5\,\sqrt{52}} = \dfrac{16}{16.12} \approx 0.992.$ (Nearly parallel.)` },
          ],
          answer: 'Euclidean 5, Manhattan 7, cosine ≈ 0.992',
        },
      ],
    },

    // ------------------------------------------------------------------
    {
      slug: 'k-means-clustering',
      title: 'k-Means Clustering',
      summary:
        'Partition data into k clusters by iterating assign-and-update, with the elbow method and silhouette score.',
      objectives: [
        'Run the k-means assign/update loop',
        'Minimise within-cluster inertia',
        'Choose k with the elbow method and silhouette score',
      ],
      blocks: [
        {
          type: 'p',
          text: r`**k-Means** partitions data into $k$ clusters, each represented by its **centroid** (mean point). It alternates two steps until the assignments stop changing.`,
        },
        { type: 'heading', text: 'Algorithm (Lloyd’s)' },
        {
          type: 'steps',
          items: [
            r`**Initialise** $k$ centroids (e.g. random points or k-means++).`,
            r`**Assign** each point to its nearest centroid.`,
            r`**Update** each centroid to the mean of its assigned points.`,
            r`**Repeat** steps 2–3 until assignments no longer change (convergence).`,
          ],
        },
        {
          type: 'p',
          text: r`It minimises the **within-cluster sum of squares** (inertia), where $\boldsymbol\mu_{c}$ is the centroid of cluster $C_c$:`,
        },
        { type: 'math', tex: r`J = \sum_{c=1}^{k}\sum_{\mathbf{x}\in C_c} \lVert \mathbf{x} - \boldsymbol\mu_c \rVert^2` },
        {
          type: 'diagram',
          kind: 'kmeans',
          caption: 'k-Means assigns each point to its nearest centroid (◆); k = 3 clusters shown.',
        },
        { type: 'heading', text: 'Choosing k' },
        {
          type: 'p',
          text: r`**Elbow method:** plot inertia $J$ against $k$; it always falls, but the "elbow" where the drop sharply slows suggests a good $k$. **Silhouette score** measures how well each point fits its cluster versus the next-nearest, averaged over all points:`,
        },
        { type: 'math', tex: r`s(i) = \frac{b(i)-a(i)}{\max\{a(i),\,b(i)\}} \in [-1,\,1]` },
        {
          type: 'p',
          text: r`where $a(i)$ is the mean distance to points in its own cluster and $b(i)$ the mean distance to the nearest other cluster. Near $+1$ = well clustered; near $0$ = on a boundary; negative = probably misassigned.`,
        },
        {
          type: 'example',
          title: 'One iteration of k-means',
          problem: r`Points on a line: $2, 4, 10, 12$. Start with centroids $\mu_1=3,\ \mu_2=11$. Do one assign-and-update pass.`,
          solution: [
            { type: 'p', text: r`**Assign.** 2→μ₁ (|2−3|=1), 4→μ₁ (1), 10→μ₂ (1), 12→μ₂ (1). Clusters: {2,4} and {10,12}.` },
            { type: 'p', text: r`**Update.** $\mu_1 = \frac{2+4}{2}=3$, $\mu_2 = \frac{10+12}{2}=11$.` },
            { type: 'p', text: r`Centroids are unchanged → **converged**. Final clusters: {2,4} and {10,12}.` },
          ],
          answer: 'Clusters {2,4} and {10,12}',
        },
        {
          type: 'note',
          variant: 'warning',
          title: 'Limitations',
          text: r`You must fix $k$ in advance; results depend on initialisation (run several times, or use k-means++); and it assumes roughly spherical, equal-size clusters — it struggles with elongated or nested shapes.`,
        },
      ],
    },

    // ------------------------------------------------------------------
    {
      slug: 'hierarchical-clustering',
      title: 'Hierarchical Clustering',
      summary:
        'Build a tree of nested clusters (dendrogram) by agglomerative merging, with different linkage rules.',
      objectives: [
        'Contrast agglomerative and divisive approaches',
        'Apply single, complete and average linkage',
        'Read a dendrogram to pick clusters',
      ],
      blocks: [
        {
          type: 'p',
          text: r`**Hierarchical clustering** builds a whole hierarchy of clusters instead of a single partition — you cut it at any level to get the number of clusters you want. No $k$ needed up front.`,
        },
        {
          type: 'list',
          items: [
            r`**Agglomerative (bottom-up):** start with every point as its own cluster, repeatedly merge the two closest clusters.`,
            r`**Divisive (top-down):** start with one big cluster and recursively split it.`,
          ],
        },
        { type: 'heading', text: 'Linkage: distance between clusters' },
        {
          type: 'table',
          headers: ['Linkage', 'Cluster distance = ', 'Tendency'],
          rows: [
            ['Single', 'Distance of the two closest points', 'Long, chain-like clusters'],
            ['Complete', 'Distance of the two farthest points', 'Compact, equal-diameter clusters'],
            ['Average', 'Mean distance over all pairs', 'A balance of the two'],
            ['Ward', 'Increase in within-cluster variance', 'Minimises variance (popular)'],
          ],
        },
        { type: 'heading', text: 'The dendrogram' },
        {
          type: 'p',
          text: r`The merge history is drawn as a **dendrogram** — a tree whose height marks the distance at which clusters joined. A horizontal cut at some height yields that many clusters; cutting at the tallest gap is a natural choice.`,
        },
        {
          type: 'example',
          title: 'First merge with single linkage',
          problem: r`Points on a line: $A=1,\ B=2,\ C=4,\ D=7$. Which two merge first under single linkage, and what merges next?`,
          solution: [
            { type: 'p', text: r`**Pairwise distances.** AB=1, BC=2, CD=3, AC=3, BD=5, AD=6.` },
            { type: 'p', text: r`**First merge.** Smallest is AB=1 → cluster {A,B}.` },
            { type: 'p', text: r`**Next.** Distance {A,B}→C is min(AC,BC)=2; C→D is 3. Smallest is 2 → merge C into {A,B} giving {A,B,C}; finally D joins.` },
          ],
          answer: '{A,B} first, then C, then D',
        },
      ],
    },

    // ------------------------------------------------------------------
    {
      slug: 'dbscan',
      title: 'DBSCAN',
      summary:
        'Density-based clustering that finds arbitrary shapes and labels noise, using ε-neighbourhoods and minPts.',
      objectives: [
        'Define core, border and noise points',
        'Explain the ε and minPts parameters',
        'See why DBSCAN handles non-spherical clusters',
      ],
      blocks: [
        {
          type: 'p',
          text: r`**DBSCAN** (Density-Based Spatial Clustering of Applications with Noise) groups together points that are **densely packed** and marks points in sparse regions as **noise**. Unlike k-means it finds arbitrary shapes and needs no $k$.`,
        },
        { type: 'heading', text: 'Two parameters' },
        {
          type: 'list',
          items: [
            r`$\varepsilon$ (**eps**): the radius that defines a point's neighbourhood.`,
            r`**minPts**: the minimum number of points (including itself) required within $\varepsilon$ to be "dense".`,
          ],
        },
        { type: 'heading', text: 'Three kinds of point' },
        {
          type: 'table',
          headers: ['Type', 'Condition'],
          rows: [
            ['Core point', '≥ minPts points within its ε-neighbourhood'],
            ['Border point', 'Within ε of a core point, but not itself core'],
            ['Noise point', 'Neither core nor border — an outlier'],
          ],
        },
        {
          type: 'p',
          text: r`Clusters grow by connecting core points that are within $\varepsilon$ of each other (density-reachability), pulling in their border points. Everything left over is noise.`,
        },
        {
          type: 'example',
          title: 'Classify the points',
          problem: r`With $\varepsilon=1.5$ and minPts$=3$, on the 1-D points $1, 2, 2.5, 8$: which are core, border or noise?`,
          solution: [
            { type: 'p', text: r`**Point 2:** neighbours within 1.5 are {1, 2, 2.5} → 3 points ≥ minPts → **core**.` },
            { type: 'p', text: r`**Point 1:** neighbours {1, 2} → 2 < 3, but within ε of core point 2 → **border**.` },
            { type: 'p', text: r`**Point 2.5:** neighbours {2, 2.5} plus is within ε of core 2 → **border** (its own count is 2).` },
            { type: 'p', text: r`**Point 8:** no neighbours within 1.5 → **noise**. Cluster = {1, 2, 2.5}; 8 is an outlier.` },
          ],
          answer: 'Core: 2; Border: 1 & 2.5; Noise: 8',
        },
        {
          type: 'note',
          variant: 'tip',
          title: 'When to reach for DBSCAN',
          text: r`Great when clusters are irregularly shaped or the data has outliers you want flagged automatically. Weaker when clusters have very different densities (a single global $\varepsilon$ can't fit all).`,
        },
      ],
    },

    // ------------------------------------------------------------------
    {
      slug: 'gaussian-mixture-models',
      title: 'Gaussian Mixture Models',
      summary:
        'Soft, probabilistic clustering: model data as a mix of Gaussians and fit it with Expectation–Maximisation.',
      objectives: [
        'Write a mixture of Gaussians',
        'Understand soft (probabilistic) assignments',
        'Follow the EM algorithm at a high level',
      ],
      blocks: [
        {
          type: 'p',
          text: r`A **Gaussian Mixture Model (GMM)** assumes the data was generated by $K$ Gaussian distributions mixed together. Each point gets a **soft assignment** — a probability of belonging to each cluster — rather than the hard membership of k-means.`,
        },
        { type: 'math', tex: r`p(\mathbf{x}) = \sum_{k=1}^{K}\pi_k\,\mathcal{N}(\mathbf{x}\mid \boldsymbol\mu_k,\boldsymbol\Sigma_k), \qquad \sum_k \pi_k = 1` },
        {
          type: 'p',
          text: r`Here $\pi_k$ are **mixing weights**, and each Gaussian has its own mean $\boldsymbol\mu_k$ and covariance $\boldsymbol\Sigma_k$ — so clusters can be elliptical and different sizes, unlike k-means' spheres.`,
        },
        { type: 'heading', text: 'Expectation–Maximisation (EM)' },
        {
          type: 'steps',
          items: [
            r`**E-step:** given current parameters, compute each point's **responsibility** $\gamma_{ik}$ — the posterior probability it came from Gaussian $k$.`,
            r`**M-step:** re-estimate $\pi_k,\boldsymbol\mu_k,\boldsymbol\Sigma_k$ using those responsibilities as soft counts.`,
            r`**Repeat** until the log-likelihood stops increasing.`,
          ],
        },
        { type: 'math', tex: r`\gamma_{ik} = \frac{\pi_k\,\mathcal{N}(\mathbf{x}_i\mid\boldsymbol\mu_k,\boldsymbol\Sigma_k)}{\sum_{j}\pi_j\,\mathcal{N}(\mathbf{x}_i\mid\boldsymbol\mu_j,\boldsymbol\Sigma_j)}` },
        {
          type: 'note',
          variant: 'intuition',
          title: 'GMM vs k-means',
          text: r`k-means is the special case of a GMM with hard assignments and identical spherical covariances. GMMs are more flexible and give calibrated cluster probabilities, at the cost of more parameters to fit.`,
        },
        {
          type: 'example',
          title: 'Read a responsibility',
          problem: r`For a point, the (unnormalised) weighted densities are $\pi_1\mathcal N_1 = 0.6$ and $\pi_2\mathcal N_2 = 0.2$. What is its responsibility to cluster 1?`,
          solution: [
            { type: 'p', text: r`$\gamma_{i1} = \dfrac{0.6}{0.6+0.2} = 0.75.$ The point is 75% cluster 1, 25% cluster 2 — a **soft** assignment.` },
          ],
          answer: 'γ = 0.75 to cluster 1',
        },
      ],
    },

    // ------------------------------------------------------------------
    {
      slug: 'principal-component-analysis',
      title: 'Principal Component Analysis (PCA)',
      summary:
        'Linear dimensionality reduction that projects data onto directions of maximum variance via eigenvectors.',
      objectives: [
        'Explain PCA as variance maximisation',
        'Connect components to eigenvectors of the covariance matrix',
        'Choose how many components to keep',
      ],
      blocks: [
        {
          type: 'p',
          text: r`**PCA** reduces many correlated features to a few uncorrelated **principal components** — new axes that capture as much of the data's variance as possible. It is the workhorse of **dimensionality reduction**: fewer features, less noise, easier visualisation.`,
        },
        { type: 'heading', text: 'How it works' },
        {
          type: 'steps',
          items: [
            r`**Standardise** the features (zero mean, unit variance).`,
            r`Compute the **covariance matrix** $\boldsymbol\Sigma = \frac{1}{m}\mathbf{X}^\top\mathbf{X}$.`,
            r`Find its **eigenvectors** (directions) and **eigenvalues** (variance along each).`,
            r`Keep the top $d$ eigenvectors — the principal components — and project the data onto them.`,
          ],
        },
        { type: 'math', tex: r`\boldsymbol\Sigma\,\mathbf{v}_k = \lambda_k\,\mathbf{v}_k` },
        {
          type: 'diagram',
          kind: 'pca',
          caption: 'PCA finds orthogonal axes of maximum variance: PC1 (most spread), then PC2.',
        },
        {
          type: 'p',
          text: r`The eigenvector $\mathbf{v}_1$ with the largest eigenvalue $\lambda_1$ is the direction of greatest variance (PC1); $\mathbf{v}_2$ is the next, orthogonal to it, and so on. The **explained variance ratio** of keeping $d$ components is:`,
        },
        { type: 'math', tex: r`\text{explained} = \frac{\sum_{k=1}^{d}\lambda_k}{\sum_{k=1}^{n}\lambda_k}` },
        {
          type: 'example',
          title: 'How many components?',
          problem: r`Eigenvalues of a 4-feature dataset are $\lambda = (4,\,2,\,1,\,1)$. What fraction of variance do the first two components explain?`,
          solution: [
            { type: 'p', text: r`**Total variance.** $4+2+1+1 = 8.$` },
            { type: 'p', text: r`**Top two.** $4+2 = 6.$` },
            { type: 'p', text: r`**Explained.** $6/8 = 0.75$ → two components retain **75%** of the variance while halving the dimensions.` },
          ],
          answer: '75% with 2 of 4 components',
        },
        {
          type: 'note',
          variant: 'warning',
          title: 'Remember',
          text: r`PCA is **linear** and **unsupervised** — it ignores labels and can't capture curved structure. Always standardise first, or high-scale features hijack the components.`,
        },
      ],
    },

    // ------------------------------------------------------------------
    {
      slug: 't-sne-and-autoencoders',
      title: 't-SNE & Autoencoders',
      summary:
        'Non-linear dimensionality reduction: t-SNE for visualisation and autoencoders for learned compression.',
      objectives: [
        'Understand what t-SNE preserves and its limits',
        'Describe an autoencoder’s encoder–bottleneck–decoder',
        'Know when to use each over PCA',
      ],
      blocks: [
        { type: 'heading', text: 't-SNE' },
        {
          type: 'p',
          text: r`**t-SNE** (t-distributed Stochastic Neighbor Embedding) is a **non-linear** technique for visualising high-dimensional data in 2-D or 3-D. It converts distances into probabilities and places points so that **local neighbourhoods** are preserved — nearby points stay nearby.`,
        },
        {
          type: 'note',
          variant: 'warning',
          title: 'Read t-SNE plots carefully',
          text: r`t-SNE preserves *local* structure, not global geometry: cluster **sizes** and the **distances between** clusters are not meaningful, and it is sensitive to its *perplexity* setting. Use it to explore, not to measure.`,
        },
        { type: 'heading', text: 'Autoencoders' },
        {
          type: 'p',
          text: r`An **autoencoder** is a neural network trained to reconstruct its own input through a narrow **bottleneck**. The encoder compresses $\mathbf{x}$ into a low-dimensional code $\mathbf{z}$; the decoder rebuilds $\hat{\mathbf{x}}$ from it. The bottleneck is forced to learn an efficient representation.`,
        },
        { type: 'math', tex: r`\mathbf{z} = f_{\text{enc}}(\mathbf{x}), \quad \hat{\mathbf{x}} = f_{\text{dec}}(\mathbf{z}), \quad \mathcal{L} = \lVert \mathbf{x} - \hat{\mathbf{x}} \rVert^2` },
        {
          type: 'p',
          text: r`Because encoder and decoder can be deep and non-linear, autoencoders capture curved structure that PCA (a linear method) cannot. A linear autoencoder with squared loss in fact recovers PCA.`,
        },
        {
          type: 'table',
          headers: ['Method', 'Linear?', 'Best for'],
          rows: [
            ['PCA', 'Yes', 'Fast reduction, variance, preprocessing'],
            ['t-SNE', 'No', '2-D/3-D visualisation of clusters'],
            ['Autoencoder', 'No', 'Learned compression, denoising, anomaly detection'],
          ],
        },
        {
          type: 'note',
          variant: 'tip',
          title: 'Anomaly detection tie-in',
          text: r`An autoencoder trained on normal data reconstructs normal points well but anomalies poorly — a high **reconstruction error** flags an outlier (see the next lesson).`,
        },
      ],
    },

    // ------------------------------------------------------------------
    {
      slug: 'association-rule-learning',
      title: 'Association Rule Learning (Apriori)',
      summary:
        'Market-basket analysis: support, confidence and lift, and how Apriori prunes the search.',
      objectives: [
        'Define support, confidence and lift',
        'Apply the Apriori downward-closure principle',
        'Evaluate a rule numerically',
      ],
      blocks: [
        {
          type: 'p',
          text: r`**Association rule learning** finds relationships like *"customers who buy bread and butter also buy milk"* from transaction data. A rule is written $X \Rightarrow Y$ (antecedent ⇒ consequent).`,
        },
        { type: 'heading', text: 'Three metrics' },
        { type: 'math', tex: r`\text{Support}(X) = \frac{\text{transactions containing } X}{\text{total transactions}}` },
        { type: 'math', tex: r`\text{Confidence}(X\Rightarrow Y) = \frac{\text{Support}(X \cup Y)}{\text{Support}(X)}` },
        { type: 'math', tex: r`\text{Lift}(X\Rightarrow Y) = \frac{\text{Confidence}(X\Rightarrow Y)}{\text{Support}(Y)}` },
        {
          type: 'note',
          variant: 'intuition',
          title: 'Reading the metrics',
          text: r`**Support** = how frequent the itemset is. **Confidence** = how often $Y$ appears when $X$ does. **Lift** > 1 means $X$ and $Y$ occur together *more* than chance (a genuine association); lift = 1 means independent.`,
        },
        { type: 'heading', text: 'The Apriori principle' },
        {
          type: 'p',
          text: r`Checking every itemset is exponential. **Apriori** prunes using **downward closure**: *if an itemset is frequent, all its subsets are frequent* — equivalently, if $\{A,B\}$ is infrequent, no superset like $\{A,B,C\}$ can be frequent, so skip it. It builds frequent itemsets level by level.`,
        },
        {
          type: 'example',
          title: 'Evaluate a rule',
          problem: r`In 10 transactions: 6 contain {bread}, 4 contain {bread, milk}, and 5 contain {milk}. Evaluate the rule bread ⇒ milk.`,
          solution: [
            { type: 'p', text: r`**Support(bread ∪ milk).** $4/10 = 0.4.$` },
            { type: 'p', text: r`**Confidence.** $\dfrac{\text{Support(bread, milk)}}{\text{Support(bread)}} = \dfrac{0.4}{0.6} \approx 0.667.$` },
            { type: 'p', text: r`**Lift.** $\dfrac{0.667}{\text{Support(milk)}} = \dfrac{0.667}{0.5} = 1.33 > 1$ → a real, positive association.` },
          ],
          answer: 'Support 0.4, confidence 0.67, lift 1.33',
        },
      ],
    },

    // ------------------------------------------------------------------
    {
      slug: 'anomaly-detection',
      title: 'Anomaly / Outlier Detection',
      summary:
        'Spot rare, unusual points using statistical, distance and model-based methods.',
      objectives: [
        'Define anomalies and where they matter',
        'Use the z-score and IQR rules',
        'Survey distance- and model-based detectors',
      ],
      blocks: [
        {
          type: 'p',
          text: r`**Anomaly (outlier) detection** finds rare points that differ markedly from the majority — fraud, machine faults, network intrusions, sensor errors. Anomalies are, by definition, scarce, so we usually learn "normal" and flag deviations.`,
        },
        { type: 'heading', text: 'Statistical methods' },
        {
          type: 'p',
          text: r`For roughly normal data, the **z-score** measures how many standard deviations a point is from the mean; $|z| > 3$ is a common flag:`,
        },
        { type: 'math', tex: r`z = \frac{x - \mu}{\sigma}` },
        {
          type: 'p',
          text: r`The **IQR rule** is distribution-free: with quartiles $Q_1,Q_3$ and $\text{IQR}=Q_3-Q_1$, flag points outside $[\,Q_1 - 1.5\,\text{IQR},\; Q_3 + 1.5\,\text{IQR}\,]$.`,
        },
        { type: 'heading', text: 'Distance & model-based methods' },
        {
          type: 'list',
          items: [
            r`**k-NN / LOF:** points far from their neighbours (low local density) are anomalies.`,
            r`**Isolation Forest:** random splits isolate outliers in fewer cuts, giving them shorter tree paths.`,
            r`**One-class SVM:** learns a boundary around normal data; points outside are anomalies.`,
            r`**Autoencoder:** high reconstruction error signals an anomaly.`,
          ],
        },
        {
          type: 'example',
          title: 'Flag the outlier with z-scores',
          problem: r`A sensor reads $10, 12, 11, 13, 12, 50$. Using the mean and standard deviation, is 50 an outlier at the $|z|>3$ threshold?`,
          solution: [
            { type: 'p', text: r`**Mean.** $\mu = \frac{10+12+11+13+12+50}{6} = \frac{108}{6} = 18.$` },
            { type: 'p', text: r`**Std dev.** deviations²: $64,36,49,25,36,1024$; variance $=\frac{1234}{6}\approx 205.7$; $\sigma \approx 14.34.$` },
            { type: 'p', text: r`**z for 50.** $z = \frac{50-18}{14.34} \approx 2.23.$` },
            { type: 'p', text: r`At the strict $|z|>3$ rule it is not flagged — but note the single outlier **inflated** $\mu$ and $\sigma$, hiding itself. Robust methods (IQR, median) catch it; this masking effect is why method choice matters.` },
          ],
          answer: 'z ≈ 2.23 — masked by its own effect on μ, σ',
        },
      ],
    },
  ],
};
