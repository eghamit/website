import type { Module } from './types';

const r = String.raw;

export const foundations: Module = {
  id: 'foundations',
  title: 'Prerequisite',
  icon: '🧱',
  description:
    'Start here. What machine learning is and why it works, what a dataset is and how it is represented mathematically, the types of data, and the linear algebra, calculus and probability you need before any algorithm makes sense.',
  lessons: [
    // ================================================================
    {
      slug: 'what-is-machine-learning',
      title: 'What is Machine Learning?',
      summary:
        'A precise definition of machine learning, how it differs from traditional programming, and how it sits inside AI and deep learning.',
      intro: {
        definition:
          'Machine learning (ML) is the study of algorithms that improve their performance at a task automatically through experience (data), rather than by being explicitly programmed with rules.',
        whyItMatters:
          'It is the paradigm behind modern AI — the reason computers can now recognise speech, translate languages, recommend content and drive cars — problems no one can write exhaustive rules for.',
        whenToUse: [
          'The very first idea to understand before any algorithm',
          'To frame what "learning from data" actually means',
          'To place ML correctly relative to AI and deep learning',
        ],
      },
      objectives: [
        'State a formal definition of machine learning',
        'Contrast ML with traditional rule-based programming',
        'Locate ML within AI, and deep learning within ML',
      ],
      blocks: [
        { type: 'heading', text: 'A working definition' },
        {
          type: 'p',
          text: r`In traditional programming a human writes explicit **rules** that turn inputs into outputs. In **machine learning**, we instead give the computer **examples** (data) of inputs and their desired outputs, and an algorithm discovers the rules by itself.`,
        },
        {
          type: 'table',
          headers: ['', 'Traditional programming', 'Machine learning'],
          rows: [
            ['You supply', 'Rules + data', 'Data + answers'],
            ['Computer produces', 'Answers', 'Rules (a model)'],
            ['Good when', 'The logic is known and stable', 'The logic is unknown or too complex'],
          ],
        },
        {
          type: 'note',
          variant: 'intuition',
          title: "Tom Mitchell's classic definition (1997)",
          text: r`*"A computer program is said to **learn** from experience $E$ with respect to some class of tasks $T$ and performance measure $P$, if its performance at tasks in $T$, as measured by $P$, improves with experience $E$."*`,
        },
        {
          type: 'p',
          text: r`For a spam filter: the **task** $T$ is classifying emails as spam/not-spam, the **experience** $E$ is a collection of labelled emails, and the **performance** $P$ might be classification accuracy. Learning means accuracy goes **up** as the filter sees more labelled email.`,
        },
        { type: 'heading', text: 'AI ⊃ ML ⊃ Deep Learning' },
        {
          type: 'list',
          items: [
            r`**Artificial Intelligence (AI)** — the broad goal of making machines act intelligently (includes rule-based expert systems, search, planning).`,
            r`**Machine Learning (ML)** — a *subset* of AI where behaviour is learned from data rather than hand-coded.`,
            r`**Deep Learning (DL)** — a *subset* of ML using many-layered neural networks (the last module of this course).`,
          ],
        },
        { type: 'math', tex: r`\text{Deep Learning} \subset \text{Machine Learning} \subset \text{Artificial Intelligence}` },
        {
          type: 'note',
          variant: 'tip',
          title: 'The core promise',
          text: r`A model that learns from data can **generalise** — perform well on new, unseen inputs it was never explicitly told about. Generalisation, not memorisation, is the whole game.`,
        },
      ],
    },

    // ================================================================
    {
      slug: 'why-machine-learning',
      title: 'Why Machine Learning?',
      summary:
        'The problems ML solves that rules cannot, where it delivers value, and — just as important — when you should not use it.',
      intro: {
        definition:
          'The motivation for machine learning: it lets us solve problems where the rules are unknown, too numerous, or constantly changing — by learning them from data instead.',
        whyItMatters:
          'Knowing when ML is the right tool (and when a simple rule or lookup is better) saves enormous effort and prevents misusing a powerful but data-hungry approach.',
        whenToUse: [
          'Deciding whether a problem is a good fit for ML at all',
          'Justifying ML over hand-written rules to others',
          'Recognising the data and feedback a problem must provide',
        ],
        whenNotToUse: [
          'A few clear, stable rules already solve the problem',
          'You have little or no relevant data',
          'Mistakes are unacceptable and the model cannot be explained/audited',
        ],
      },
      objectives: [
        'Explain why some problems resist explicit programming',
        'List where ML creates value',
        'Judge when ML is the wrong tool',
      ],
      blocks: [
        { type: 'heading', text: 'When rules break down' },
        {
          type: 'p',
          text: r`Consider writing rules to recognise a handwritten digit. Every person writes a "7" differently; enumerating all the pixel patterns by hand is hopeless. ML sidesteps this: show the algorithm thousands of labelled digits and it learns the patterns itself.`,
        },
        {
          type: 'p',
          text: r`ML is the right tool when **at least one** of these holds:`,
        },
        {
          type: 'list',
          items: [
            r`**No known rules** — the mapping from input to output is too complex to specify (vision, speech, language).`,
            r`**Too many rules** — hand-writing and maintaining them does not scale (spam, fraud).`,
            r`**Changing environment** — the pattern drifts over time and the system must adapt (recommendations, markets).`,
            r`**Personalisation** — a different rule is needed per user or context.`,
          ],
        },
        { type: 'heading', text: 'Where ML delivers value' },
        {
          type: 'table',
          headers: ['Domain', 'Example task'],
          rows: [
            ['Vision', 'Face recognition, medical image diagnosis'],
            ['Language', 'Translation, sentiment analysis, chatbots'],
            ['Recommendation', 'Products, movies, music you might like'],
            ['Finance', 'Fraud detection, credit scoring'],
            ['Healthcare', 'Disease risk prediction from records'],
          ],
        },
        {
          type: 'note',
          variant: 'warning',
          title: 'When NOT to use ML',
          text: r`If a handful of clear rules already work, use them — they are simpler, faster and auditable. ML also needs **representative data**; without it, a model learns the wrong thing. And in high-stakes settings, an unexplainable model can be worse than a transparent rule.`,
        },
        {
          type: 'note',
          variant: 'intuition',
          title: 'The trade you are making',
          text: r`ML replaces *"I must specify every rule"* with *"I must collect good data and choose a good model"*. You trade explicit logic for data and computation.`,
        },
      ],
    },

    // ================================================================
    {
      slug: 'types-of-machine-learning',
      title: 'Types of Machine Learning',
      summary:
        'The map of the field: supervised, unsupervised and reinforcement learning (plus semi- and self-supervised), and where each course module fits.',
      intro: {
        definition:
          'Machine learning is organised by the kind of feedback the algorithm learns from: labelled targets (supervised), structure in unlabelled data (unsupervised), or rewards from actions (reinforcement).',
        whyItMatters:
          'Every algorithm you will meet belongs to one of these families; knowing the taxonomy tells you what data you need and which methods are even applicable.',
        whenToUse: [
          'Classifying any ML problem before choosing a method',
          'Deciding what kind of data/feedback you must collect',
          'Navigating the rest of this course',
        ],
      },
      objectives: [
        'Distinguish supervised, unsupervised and reinforcement learning',
        'Map sub-tasks (classification, regression, clustering…) to each',
        'Recognise semi- and self-supervised learning',
      ],
      blocks: [
        {
          type: 'table',
          headers: ['Paradigm', 'Data / feedback', 'Goal', 'Example'],
          rows: [
            ['Supervised', 'Labelled: (x, y)', 'Predict y for new x', 'Spam detection'],
            ['Unsupervised', 'Unlabelled: x only', 'Find structure', 'Customer segmentation'],
            ['Reinforcement', 'Rewards from actions', 'Learn a policy', 'Game playing, robotics'],
          ],
        },
        {
          type: 'diagram',
          kind: 'ml-taxonomy',
          caption: 'The three main paradigms of machine learning and their sub-tasks.',
        },
        { type: 'heading', text: 'Supervised learning' },
        {
          type: 'p',
          text: r`Learns a mapping from inputs to **known outputs**. Two sub-types: **classification** (discrete label — spam/not-spam) and **regression** (continuous value — house price). This is **Module 2**.`,
        },
        { type: 'heading', text: 'Unsupervised learning' },
        {
          type: 'p',
          text: r`No labels — the algorithm finds structure on its own: **clustering** (group similar points), **dimensionality reduction** (compress features), and **association** (co-occurrence rules). This is **Module 3**.`,
        },
        { type: 'heading', text: 'Reinforcement learning' },
        {
          type: 'p',
          text: r`An **agent** takes actions in an **environment** and receives **rewards**; it learns a **policy** that maximises long-term reward through trial and error (e.g. AlphaGo, robot control). It is beyond this introductory course but completes the picture.`,
        },
        {
          type: 'note',
          variant: 'info',
          title: 'In between: semi- and self-supervised',
          text: r`**Semi-supervised** learning uses a small amount of labelled data with a large amount of unlabelled data. **Self-supervised** learning invents labels from the data itself (e.g. predict a hidden word) — the engine behind modern large language models.`,
        },
        {
          type: 'note',
          variant: 'tip',
          title: 'How to tell them apart',
          text: r`Ask: *do I have target labels?* Yes → supervised. No → unsupervised. *Am I learning from rewards for actions over time?* → reinforcement.`,
        },
      ],
    },

    // ================================================================
    {
      slug: 'datasets-and-representation',
      title: 'Datasets & Their Representation',
      summary:
        'What a dataset is, its instances/features/labels, and how it is written mathematically — as a set of tuples, a design matrix X ∈ ℝ^{m×n} and a target vector.',
      intro: {
        definition:
          'A dataset is a collection of examples (instances), each described by features and, in supervised learning, an associated target. Mathematically it is a set of feature-vectors arranged as a design matrix.',
        whyItMatters:
          'Every algorithm consumes data in this matrix/vector form; understanding the notation is the difference between reading ML maths fluently and being lost in it.',
        whenToUse: [
          'Reading any ML formula involving X, y, x⁽ⁱ⁾ or xⱼ',
          'Organising raw data into a model-ready table',
          'Understanding train/validation/test splits',
        ],
      },
      objectives: [
        'Define instance, feature, feature vector and target',
        'Write a dataset in set/tuple and matrix form',
        'Interpret the design matrix and feature space',
      ],
      blocks: [
        { type: 'heading', text: 'The vocabulary' },
        {
          type: 'list',
          items: [
            r`**Instance / example / sample** — one row of the dataset (one observation).`,
            r`**Feature / attribute** — one measured property (a column), $x_j$.`,
            r`**Feature vector** — all features of one instance, $\mathbf{x} = (x_1, x_2, \dots, x_n)$.`,
            r`**Label / target** — the value to predict, $y$ (supervised learning only).`,
            r`**$m$** — number of instances; **$n$** — number of features.`,
          ],
        },
        { type: 'heading', text: 'Set / tuple notation' },
        {
          type: 'p',
          text: r`A supervised dataset $D$ is a **set of input–output pairs**, where the superscript $(i)$ indexes the $i$-th instance:`,
        },
        { type: 'math', tex: r`D = \big\{\,(\mathbf{x}^{(i)},\, y^{(i)})\,\big\}_{i=1}^{m}, \qquad \mathbf{x}^{(i)} \in \mathcal{X} \subseteq \mathbb{R}^{n}, \quad y^{(i)} \in \mathcal{Y}` },
        {
          type: 'p',
          text: r`$\mathcal{X}$ is the **feature space** (all possible inputs) and $\mathcal{Y}$ is the **label space**. For regression $\mathcal{Y} = \mathbb{R}$; for binary classification $\mathcal{Y} = \{0, 1\}$; for $K$ classes $\mathcal{Y} = \{1, 2, \dots, K\}$. An **unsupervised** dataset is just $D = \{\mathbf{x}^{(i)}\}_{i=1}^{m}$ — no $y$.`,
        },
        { type: 'heading', text: 'The design matrix' },
        {
          type: 'p',
          text: r`Stacking the $m$ feature vectors as rows gives the **design (data) matrix** $\mathbf{X}$, and the targets form a **column vector** $\mathbf{y}$:`,
        },
        { type: 'math', tex: r`\mathbf{X} = \begin{bmatrix} x_1^{(1)} & x_2^{(1)} & \cdots & x_n^{(1)} \\ x_1^{(2)} & x_2^{(2)} & \cdots & x_n^{(2)} \\ \vdots & \vdots & \ddots & \vdots \\ x_1^{(m)} & x_2^{(m)} & \cdots & x_n^{(m)} \end{bmatrix} \in \mathbb{R}^{m \times n}, \qquad \mathbf{y} = \begin{bmatrix} y^{(1)} \\ y^{(2)} \\ \vdots \\ y^{(m)} \end{bmatrix} \in \mathbb{R}^{m}` },
        {
          type: 'diagram',
          kind: 'design-matrix',
          caption: 'The design matrix: each row is one instance x⁽ⁱ⁾, each column one feature.',
        },
        {
          type: 'note',
          variant: 'tip',
          title: 'Rows vs columns',
          text: r`**Row $i$** = one instance $\mathbf{x}^{(i)}$. **Column $j$** = one feature across all instances. This "rows = examples, columns = features" convention is universal in ML libraries.`,
        },
        {
          type: 'example',
          title: 'Write a tiny dataset in matrix form',
          problem: r`Three students, features (hours, attendance %), target Pass(1)/Fail(0): $S_1=(2,60)\to 0$, $S_2=(4,70)\to 1$, $S_3=(5,80)\to 1$. Give $D$, $\mathbf{X}$ and $\mathbf{y}$, with $m$ and $n$.`,
          solution: [
            { type: 'p', text: r`Here $m=3$ instances and $n=2$ features.` },
            { type: 'math', tex: r`D = \{((2,60),0),\ ((4,70),1),\ ((5,80),1)\}` },
            { type: 'math', tex: r`\mathbf{X} = \begin{bmatrix} 2 & 60 \\ 4 & 70 \\ 5 & 80 \end{bmatrix} \in \mathbb{R}^{3\times 2}, \qquad \mathbf{y} = \begin{bmatrix} 0 \\ 1 \\ 1 \end{bmatrix}` },
            { type: 'p', text: r`The feature $x_1$ (hours) is column 1; instance $\mathbf{x}^{(2)} = (4,70)$ is row 2.` },
          ],
          answer: 'X ∈ ℝ³ˣ², y ∈ ℝ³, m = 3, n = 2',
        },
        {
          type: 'note',
          variant: 'info',
          title: 'Splitting the data',
          text: r`Before modelling, $D$ is split into a **training set** (fit the model), a **validation set** (tune choices) and a **test set** (final, untouched estimate of real-world performance) — typically around 60/20/20 or 80/20.`,
        },
      ],
    },

    // ================================================================
    {
      slug: 'types-of-data-and-features',
      title: 'Types of Data & Features',
      summary:
        'Structured vs unstructured data, the four measurement scales, numerical vs categorical features, and how each is represented as numbers a model can use.',
      intro: {
        definition:
          'Data comes in different types — numerical, categorical, text, image — measured on different scales; feature representation is the process of turning each into the numeric vectors ML models require.',
        whyItMatters:
          'Algorithms only consume numbers. Knowing a feature’s type dictates how you encode it, which distance/impurity measures are valid, and whether you must scale it.',
        whenToUse: [
          'Deciding how to encode a column (one-hot, ordinal, scale)',
          'Choosing valid distance or similarity measures',
          'Preparing structured or unstructured data for a model',
        ],
      },
      objectives: [
        'Separate structured from unstructured data',
        'Classify features by measurement scale',
        'Represent categorical, text and image data as vectors',
      ],
      blocks: [
        { type: 'heading', text: 'Structured vs unstructured' },
        {
          type: 'list',
          items: [
            r`**Structured** — organised in rows and columns (a spreadsheet/table): numbers and categories. Most classical ML.`,
            r`**Unstructured** — no fixed tabular form: text, images, audio, video. Usually needs conversion into vectors (features) first, often via deep learning.`,
          ],
        },
        { type: 'heading', text: 'Measurement scales (Stevens)' },
        {
          type: 'table',
          headers: ['Scale', 'Meaning', 'Example', 'Valid operations'],
          rows: [
            ['Nominal', 'Categories, no order', 'Colour, city', '= , ≠ (counts, mode)'],
            ['Ordinal', 'Ordered categories', 'Low/Med/High', 'Order (<, >), median'],
            ['Interval', 'Ordered, equal gaps, no true zero', 'Temperature (°C)', '+ , − , mean'],
            ['Ratio', 'Interval + true zero', 'Height, price, count', 'All, including × , ÷'],
          ],
        },
        { type: 'heading', text: 'Numerical vs categorical features' },
        {
          type: 'list',
          items: [
            r`**Numerical** — **discrete** (counts: number of rooms) or **continuous** (measurements: height $\in \mathbb{R}$).`,
            r`**Categorical** — **nominal** (unordered: brand) or **ordinal** (ordered: rating). **Binary** is a special two-value case.`,
          ],
        },
        { type: 'heading', text: 'Turning features into numbers' },
        {
          type: 'p',
          text: r`A **nominal** feature with $K$ categories is **one-hot encoded** into a $K$-dimensional 0/1 vector (exactly one entry is 1):`,
        },
        { type: 'math', tex: r`\text{colour} = \text{Green} \;\longmapsto\; (\underbrace{0}_{\text{Red}},\ \underbrace{1}_{\text{Green}},\ \underbrace{0}_{\text{Blue}})` },
        {
          type: 'list',
          items: [
            r`**Ordinal** → integer codes that respect order (Low=1, Med=2, High=3).`,
            r`**Text** → a **bag-of-words** count vector, TF–IDF weights, or a dense **embedding** vector.`,
            r`**Image** → a tensor of pixel intensities of shape $H \times W \times C$ (height × width × colour channels), often flattened or fed to a convolutional network.`,
          ],
        },
        {
          type: 'note',
          variant: 'warning',
          title: 'Why the type matters',
          text: r`Never one-hot an **ordinal** feature (you throw away the order); never treat a **nominal** code as a number (the model would invent a fake ordering). And numeric features on different ranges must be **scaled** for distance-based methods (k-NN, k-means, SVM).`,
        },
        {
          type: 'example',
          title: 'Encode a mixed-type row',
          problem: r`Encode the record {Size: "Large" (Small<Medium<Large), Colour: "Blue" (Red/Green/Blue), Price: 120} into a numeric feature vector.`,
          solution: [
            { type: 'p', text: r`**Size** is ordinal → Small=1, Medium=2, **Large=3**.` },
            { type: 'p', text: r`**Colour** is nominal → one-hot $(\text{Red},\text{Green},\text{Blue}) = (0,0,1)$.` },
            { type: 'p', text: r`**Price** is ratio/continuous → keep as $120$ (scale later if needed).` },
            { type: 'math', tex: r`\mathbf{x} = (\,3,\ 0,\ 0,\ 1,\ 120\,)` },
          ],
          answer: 'x = (3, 0, 0, 1, 120)',
        },
      ],
    },

    // ================================================================
    {
      slug: 'linear-algebra-for-ml',
      title: 'Linear Algebra for ML',
      summary:
        'Scalars, vectors, matrices and tensors; the dot product, matrix multiplication and norms — the language every model is written in.',
      intro: {
        definition:
          'Linear algebra is the mathematics of vectors and matrices; in ML, data, model parameters and predictions are all vectors/matrices, and computation is their multiplication.',
        whyItMatters:
          'A prediction wᵀx, a dataset X, a distance ‖x−y‖ — all are linear-algebra operations. Without it, formulas for regression, PCA, SVMs and neural nets are unreadable.',
        whenToUse: [
          'Reading any model of the form ŷ = wᵀx + b or ŷ = Xβ',
          'Computing distances, projections and norms',
          'Understanding PCA, SVMs and neural-network layers',
        ],
      },
      objectives: [
        'Identify scalars, vectors, matrices and tensors',
        'Compute dot products and matrix–vector products',
        'Use the L1 and L2 norms',
      ],
      blocks: [
        { type: 'heading', text: 'The objects' },
        {
          type: 'table',
          headers: ['Object', 'Dimension', 'ML meaning', 'Notation'],
          rows: [
            ['Scalar', '0-D', 'A single value (a weight, a label)', 'a ∈ ℝ'],
            ['Vector', '1-D', 'One instance / a set of weights', 'x ∈ ℝⁿ'],
            ['Matrix', '2-D', 'The dataset (design matrix)', 'X ∈ ℝᵐˣⁿ'],
            ['Tensor', 'n-D', 'Images, batches (n ≥ 3)', '𝓧'],
          ],
        },
        { type: 'heading', text: 'Dot product' },
        {
          type: 'p',
          text: r`The **dot (inner) product** of two vectors multiplies matching entries and sums them, returning a single scalar. It is the heart of a linear model — the weighted sum of features:`,
        },
        { type: 'math', tex: r`\mathbf{w}^\top\mathbf{x} = \sum_{j=1}^{n} w_j x_j = w_1x_1 + w_2x_2 + \cdots + w_nx_n` },
        { type: 'heading', text: 'Matrix–vector product' },
        {
          type: 'p',
          text: r`Multiplying the whole dataset $\mathbf{X} \in \mathbb{R}^{m\times n}$ by a weight vector $\boldsymbol\beta \in \mathbb{R}^{n}$ produces **all $m$ predictions at once** — this is why ML is fast:`,
        },
        { type: 'math', tex: r`\hat{\mathbf{y}} = \mathbf{X}\boldsymbol\beta \in \mathbb{R}^{m}, \qquad \hat{y}^{(i)} = \sum_{j=1}^{n} X_{ij}\,\beta_j` },
        {
          type: 'note',
          variant: 'info',
          title: 'Shapes must match',
          text: r`An $(m\times n)$ matrix times an $(n\times 1)$ vector gives an $(m\times 1)$ vector: the **inner** dimensions ($n$) must agree, and the **outer** dimensions ($m,1$) form the result.`,
        },
        { type: 'heading', text: 'Norms (vector length)' },
        {
          type: 'p',
          text: r`A **norm** measures the size of a vector. The **L2 (Euclidean)** norm is straight-line length; the **L1 (Manhattan)** norm sums absolute values. Norms give distances (L2 between $\mathbf{x}$ and $\mathbf{y}$ is $\lVert\mathbf{x}-\mathbf{y}\rVert_2$) and power regularization.`,
        },
        { type: 'math', tex: r`\lVert\mathbf{x}\rVert_2 = \sqrt{\sum_{j=1}^{n} x_j^2}, \qquad \lVert\mathbf{x}\rVert_1 = \sum_{j=1}^{n} |x_j|` },
        {
          type: 'example',
          title: 'Dot product and norm',
          problem: r`Let $\mathbf{w}=(2,-1,3)$ and $\mathbf{x}=(1,4,2)$. Compute $\mathbf{w}^\top\mathbf{x}$ and $\lVert\mathbf{w}\rVert_2$.`,
          solution: [
            { type: 'p', text: r`**Dot product.** $2(1) + (-1)(4) + 3(2) = 2 - 4 + 6 = 4.$` },
            { type: 'p', text: r`**L2 norm.** $\sqrt{2^2 + (-1)^2 + 3^2} = \sqrt{4+1+9} = \sqrt{14} \approx 3.74.$` },
          ],
          answer: 'wᵀx = 4, ‖w‖₂ = √14 ≈ 3.74',
        },
      ],
    },

    // ================================================================
    {
      slug: 'calculus-for-ml',
      title: 'Calculus for ML',
      summary:
        'Derivatives, partial derivatives, the gradient vector and the chain rule — the machinery that lets models learn by minimising a loss.',
      intro: {
        definition:
          'Calculus is the mathematics of change; in ML, the derivative of a loss function tells us how to adjust each parameter to reduce error, which is exactly how models are trained.',
        whyItMatters:
          'Gradient descent — the optimiser behind linear/logistic regression and every neural network — is pure calculus. The gradient points the way downhill on the loss surface.',
        whenToUse: [
          'Understanding gradient descent and training',
          'Deriving update rules for parameters',
          'Following backpropagation in neural networks',
        ],
      },
      objectives: [
        'Interpret a derivative as a slope / rate of change',
        'Compute partial derivatives and assemble the gradient',
        'Apply the chain rule to composed functions',
      ],
      blocks: [
        { type: 'heading', text: 'The derivative' },
        {
          type: 'p',
          text: r`The **derivative** $f'(x)$ of a function is its instantaneous **rate of change** — the slope of the tangent line. Formally it is the limit of the average rate of change:`,
        },
        { type: 'math', tex: r`f'(x) = \frac{df}{dx} = \lim_{h\to 0}\frac{f(x+h)-f(x)}{h}` },
        {
          type: 'p',
          text: r`A positive slope means the function is increasing; **zero slope** marks a maximum, minimum or flat point — which is exactly what optimisation hunts for.`,
        },
        {
          type: 'table',
          headers: ['Function f(x)', 'Derivative f′(x)'],
          rows: [
            ['c (constant)', '0'],
            ['xⁿ', 'n·xⁿ⁻¹'],
            ['eˣ', 'eˣ'],
            ['ln x', '1 / x'],
            ['c·g(x)', 'c·g′(x)'],
            ['g(x) + h(x)', 'g′(x) + h′(x)'],
          ],
        },
        { type: 'heading', text: 'Partial derivatives & the gradient' },
        {
          type: 'p',
          text: r`Loss functions depend on **many** parameters. A **partial derivative** $\frac{\partial f}{\partial x_j}$ measures the slope in the direction of one variable, holding the others fixed. Collecting all partials gives the **gradient**, a vector pointing in the direction of **steepest increase**:`,
        },
        { type: 'math', tex: r`\nabla f = \left(\frac{\partial f}{\partial x_1},\ \frac{\partial f}{\partial x_2},\ \dots,\ \frac{\partial f}{\partial x_n}\right)` },
        {
          type: 'note',
          variant: 'intuition',
          title: 'Why the minus sign in gradient descent',
          text: r`The gradient points **uphill**; to *minimise* a loss we step in the **opposite** direction, $\theta \leftarrow \theta - \eta\,\nabla J$. That single idea trains almost every model in this course.`,
        },
        {
          type: 'diagram',
          kind: 'gradient-descent',
          caption: 'Gradient descent: each step moves the parameter downhill toward the minimum.',
        },
        { type: 'heading', text: 'The chain rule' },
        {
          type: 'p',
          text: r`For a **composition** $f(g(x))$, the chain rule multiplies the outer and inner derivatives. It is the engine of **backpropagation**, where error is passed backward through layer after layer:`,
        },
        { type: 'math', tex: r`\frac{d}{dx}f\big(g(x)\big) = f'\big(g(x)\big)\cdot g'(x)` },
        {
          type: 'example',
          title: 'A gradient and a chain-rule derivative',
          problem: r`(a) For $f(x,y) = x^2 + 3xy$, find $\nabla f$. (b) For $L(w) = (wx - y)^2$ with $x,y$ constant, find $\frac{dL}{dw}$.`,
          solution: [
            { type: 'p', text: r`**(a) Partials.** $\frac{\partial f}{\partial x} = 2x + 3y$ and $\frac{\partial f}{\partial y} = 3x$, so $\nabla f = (2x+3y,\ 3x)$.` },
            { type: 'p', text: r`**(b) Chain rule.** Outer $u^2 \to 2u$, inner $u = wx-y \to x$. So $\frac{dL}{dw} = 2(wx-y)\cdot x$.` },
            { type: 'p', text: r`This is precisely the gradient that trains linear regression by gradient descent.` },
          ],
          answer: '∇f = (2x+3y, 3x); dL/dw = 2(wx−y)x',
        },
      ],
    },

    // ================================================================
    {
      slug: 'statistics',
      title: 'Statistics',
      summary:
        'Descriptive statistics for a sample — mean, variance, standard deviation, covariance and the correlation coefficient — the five quantities that reappear directly in the closed-form solution of linear regression.',
      intro: {
        definition:
          'Descriptive statistics summarise a sample with a few numbers: where it is centred (mean), how spread out it is (variance, standard deviation), and how two variables move together (covariance, correlation).',
        whyItMatters:
          'Mean and variance drive feature scaling; covariance, variance and correlation are exactly the ingredients of the least-squares slope, and they underpin PCA, evaluation and much of statistical ML.',
        whenToUse: [
          'Summarising or standardising features before modelling',
          'Measuring how strongly two variables move together',
          'Deriving the closed-form slope of simple linear regression',
        ],
      },
      objectives: [
        'Compute the mean, variance and standard deviation of a sample',
        'Compute the covariance of paired data and interpret its sign',
        'Compute the Pearson correlation coefficient and read its scale',
      ],
      blocks: [
        {
          type: 'p',
          text: r`Let $x_1,\dots,x_m$ be a **sample** — a list of $m$ observed numbers. Descriptive statistics compress that list into a few meaningful quantities. The five below are all we need to describe one variable, a pair of variables, and — later — to solve linear regression in closed form.`,
        },
        { type: 'heading', text: 'Mean' },
        {
          type: 'p',
          text: r`The **mean** (average) is the balance point of the sample:`,
        },
        { type: 'math', tex: r`\bar{x} = \frac{1}{m}\sum_{i=1}^{m} x_i` },
        { type: 'heading', text: 'Variance' },
        {
          type: 'p',
          text: r`The (population) **variance** measures spread about the mean — the average squared deviation:`,
        },
        { type: 'math', tex: r`\mathrm{Var}(x) = \frac{1}{m}\sum_{i=1}^{m} (x_i - \bar{x})^2` },
        {
          type: 'note',
          variant: 'info',
          title: 'Population vs sample variance',
          text: r`The **unbiased sample variance** divides by $m-1$ instead of $m$. Dividing by $m$ gives the *population* variance used throughout these notes; the $m-1$ version corrects the slight underestimate you get when the mean is itself estimated from the same data.`,
        },
        { type: 'heading', text: 'Standard deviation' },
        {
          type: 'p',
          text: r`The **standard deviation** is the square root of the variance, back in the original units of $x$:`,
        },
        { type: 'math', tex: r`\sigma_x = \sqrt{\mathrm{Var}(x)}` },
        {
          type: 'note',
          variant: 'tip',
          title: 'Direct link to feature scaling',
          text: r`The mean and standard deviation are exactly the quantities in **z-score standardization** $z = \dfrac{x-\bar x}{\sigma_x}$, which puts every feature on a comparable scale for distance-based models and speeds up gradient descent.`,
        },
        { type: 'heading', text: 'Covariance' },
        {
          type: 'p',
          text: r`For **paired data** $(x_i, y_i)$, the **covariance** measures how the two variables vary together:`,
        },
        { type: 'math', tex: r`\mathrm{Cov}(x,y) = \frac{1}{m}\sum_{i=1}^{m} (x_i - \bar{x})(y_i - \bar{y})` },
        {
          type: 'p',
          text: r`Covariance is **positive** when the two variables tend to increase together, **negative** when one rises as the other falls, and near **zero** when there is no linear relationship. Its size depends on the units of $x$ and $y$, which is why we normalise it next.`,
        },
        { type: 'heading', text: 'Correlation coefficient' },
        {
          type: 'p',
          text: r`The **Pearson correlation coefficient** normalises covariance to the range $[-1, 1]$, giving a unit-free measure of linear association:`,
        },
        {
          type: 'math',
          tex: r`r = \frac{\mathrm{Cov}(x,y)}{\sigma_x\,\sigma_y} = \frac{\sum_{i}(x_i-\bar{x})(y_i-\bar{y})}{\sqrt{\sum_{i}(x_i-\bar{x})^2}\,\sqrt{\sum_{i}(y_i-\bar{y})^2}}`,
        },
        {
          type: 'p',
          text: r`Here $r = +1$ is a perfect increasing line, $r = -1$ a perfect decreasing line, and $r = 0$ no linear relationship.`,
        },
        {
          type: 'note',
          variant: 'intuition',
          title: 'Why these five matter',
          text: r`These five quantities reappear **directly** in the closed-form solution of simple linear regression: the least-squares slope is $\theta_1 = \dfrac{\mathrm{Cov}(x,y)}{\mathrm{Var}(x)} = r\,\dfrac{\sigma_y}{\sigma_x}$, and the intercept is $\theta_0 = \bar y - \theta_1\bar x$.`,
        },
        {
          type: 'example',
          title: 'Compute all five by hand',
          problem: r`For the paired data $x=(1,2,3,4,5)$ and $y=(1,3,2,5,4)$, find $\bar x,\bar y$, $\mathrm{Var}(x)$, $\sigma_x$, $\mathrm{Cov}(x,y)$ and the correlation $r$.`,
          solution: [
            { type: 'p', text: r`**Step 1 — means.** $\bar x = \dfrac{1+2+3+4+5}{5}=3$, $\;\bar y = \dfrac{1+3+2+5+4}{5}=3$.` },
            { type: 'p', text: r`**Step 2 — deviations.**` },
            {
              type: 'table',
              headers: [r`$x_i$`, r`$y_i$`, r`$x_i-\bar x$`, r`$y_i-\bar y$`, r`$(x_i-\bar x)^2$`, r`$(y_i-\bar y)^2$`, r`$(x_i-\bar x)(y_i-\bar y)$`],
              rows: [
                ['1', '1', '−2', '−2', '4', '4', '4'],
                ['2', '3', '−1', '0', '1', '0', '0'],
                ['3', '2', '0', '−1', '0', '1', '0'],
                ['4', '5', '1', '2', '1', '4', '2'],
                ['5', '4', '2', '1', '4', '1', '2'],
                ['', '', '', r`$\sum$`, '10', '10', '8'],
              ],
            },
            { type: 'p', text: r`**Step 3 — variance and standard deviation.** $\mathrm{Var}(x)=\dfrac{10}{5}=2$, so $\sigma_x=\sqrt{2}\approx 1.414$; likewise $\sigma_y=\sqrt{2}$.` },
            { type: 'p', text: r`**Step 4 — covariance.** $\mathrm{Cov}(x,y)=\dfrac{8}{5}=1.6$ (positive → $x$ and $y$ rise together).` },
            { type: 'p', text: r`**Step 5 — correlation.** $r=\dfrac{\mathrm{Cov}(x,y)}{\sigma_x\sigma_y}=\dfrac{1.6}{\sqrt{2}\cdot\sqrt{2}}=\dfrac{1.6}{2}=0.8$ — a strong positive linear association.` },
          ],
          answer: 'x̄=ȳ=3, Var(x)=2, σₓ=√2, Cov(x,y)=1.6, r=0.8',
        },
      ],
    },

    // ================================================================
    {
      slug: 'probability-and-statistics-for-ml',
      title: 'Probability for ML',
      summary:
        'Random events and probabilities, conditional probability and Bayes’ theorem, and the normal distribution — the tools for reasoning about uncertainty, Naive Bayes and evaluation.',
      intro: {
        definition:
          'Probability quantifies uncertainty: it lets ML models reason about how likely events are, update beliefs from evidence, and describe noise with distributions.',
        whyItMatters:
          'Conditional probability and Bayes’ theorem are the whole basis of the Naive Bayes classifier and probabilistic reasoning, and the normal distribution underlies many models and outlier rules.',
        whenToUse: [
          'Reasoning about likelihoods and updating beliefs (Bayes)',
          'Building probabilistic classifiers such as Naive Bayes',
          'Modelling noise and interpreting uncertainty in evaluation',
        ],
      },
      objectives: [
        'Use conditional probability and independence',
        'Apply Bayes’ theorem to update a prior into a posterior',
        'Recognise the normal distribution and its parameters',
      ],
      blocks: [
        {
          type: 'p',
          text: r`**Probability** quantifies uncertainty — how likely an event is. It is the language ML uses to reason about noisy data, likelihoods and beliefs. *(For summarising data with means, variances and correlation, see the [Statistics](#/learn/statistics) lesson.)*`,
        },
        { type: 'heading', text: 'Probability basics' },
        {
          type: 'list',
          items: [
            r`A probability lies in $[0,1]$; the probabilities of all outcomes sum to 1.`,
            r`**Conditional probability** — the chance of $A$ given that $B$ happened: $\ P(A\mid B) = \dfrac{P(A\cap B)}{P(B)}$.`,
            r`**Independence** — $A,B$ are independent if $P(A\cap B) = P(A)\,P(B)$.`,
          ],
        },
        { type: 'heading', text: "Bayes' theorem" },
        {
          type: 'p',
          text: r`Bayes' theorem inverts a conditional probability — it updates a **prior** belief into a **posterior** after seeing evidence. It is the foundation of the Naive Bayes classifier:`,
        },
        { type: 'math', tex: r`P(A\mid B) = \frac{P(B\mid A)\,P(A)}{P(B)} \qquad \Big(\text{posterior} = \frac{\text{likelihood}\,\times\,\text{prior}}{\text{evidence}}\Big)` },
        { type: 'heading', text: 'What each term means' },
        {
          type: 'p',
          text: r`Read $A$ as the **hypothesis** (the thing you want to know, e.g. *"the patient is sick"*) and $B$ as the **evidence** you observe (e.g. *"the test is positive"*). Each of the four pieces has a job:`,
        },
        {
          type: 'diagram',
          kind: 'bayes-terms',
          caption: 'Bayes as a flow: multiply the prior by the likelihood, then normalise by the evidence to get the updated (posterior) belief.',
        },
        {
          type: 'table',
          headers: ['Term', 'Symbol', 'What it means'],
          rows: [
            ['Prior', 'P(A)', 'Your belief in the hypothesis A **before** seeing any evidence — the base rate.'],
            ['Likelihood', 'P(B∣A)', 'How well the hypothesis explains the evidence: the chance of seeing B **if** A were true.'],
            ['Evidence', 'P(B)', 'How likely the observation B is overall, across every hypothesis — a normalising total.'],
            ['Posterior', 'P(A∣B)', 'Your **updated** belief in A **after** taking the evidence into account.'],
          ],
          caption: 'The four terms of Bayes’ theorem.',
        },
        {
          type: 'note',
          variant: 'intuition',
          title: 'One sentence to remember it',
          text: r`Start with what you believed (**prior**), multiply by how well the hypothesis predicts what you saw (**likelihood**), and divide by how surprising the observation was overall (**evidence**) — the result is your revised belief (**posterior**).`,
        },
        {
          type: 'p',
          text: r`The **evidence** is what makes the posterior a valid probability. It is computed by summing the likelihood-times-prior over *all* hypotheses (here, sick and well) — this is the **law of total probability**:`,
        },
        { type: 'math', tex: r`P(B) = P(B\mid A)\,P(A) + P(B\mid \lnot A)\,P(\lnot A)` },
        {
          type: 'example',
          title: 'Label every term (disease test)',
          problem: r`A test is 90% accurate for a disease affecting 1% of people; it returns positive. Identify the prior, likelihood, evidence and posterior, then compute how worried you should be. (Assume $P(+\mid\text{sick})=0.9$, $P(+\mid\text{well})=0.1$.)`,
          solution: [
            { type: 'p', text: r`**Prior** — belief before the test: $P(\text{sick})=0.01$ (only 1% of people are sick).` },
            { type: 'p', text: r`**Likelihood** — how well *"sick"* explains a positive test: $P(+\mid\text{sick})=0.9$.` },
            { type: 'p', text: r`**Evidence** — chance of a positive test for *anyone*, by the law of total probability: $P(+) = \underbrace{0.9\times 0.01}_{\text{sick}} + \underbrace{0.1\times 0.99}_{\text{well}} = 0.009 + 0.099 = 0.108$.` },
            { type: 'p', text: r`**Posterior** — updated belief after the positive test:` },
            { type: 'math', tex: r`P(\text{sick}\mid +) = \frac{P(+\mid\text{sick})\,P(\text{sick})}{P(+)} = \frac{0.9 \times 0.01}{0.108} = \frac{0.009}{0.108} \approx 0.083` },
            { type: 'p', text: r`Only about **8.3%** — because the disease is rare (a small **prior**), most positives are false alarms even with a good test. This *base-rate* effect is exactly what Bayes' theorem captures.` },
          ],
          answer: 'prior 0.01 · likelihood 0.9 · evidence 0.108 · posterior ≈ 8.3%',
        },
        {
          type: 'example',
          title: 'The same four terms (spam filter)',
          problem: r`Historically 40% of email is spam. The word *"free"* appears in 80% of spam but only 10% of genuine mail. A new email contains *"free"*. Is it more likely spam or not?`,
          solution: [
            { type: 'p', text: r`**Prior** $P(\text{spam})=0.4$. **Likelihood** $P(\text{"free"}\mid\text{spam})=0.8$.` },
            { type: 'p', text: r`**Evidence** $P(\text{"free"}) = 0.8\times 0.4 + 0.1\times 0.6 = 0.32 + 0.06 = 0.38$.` },
            { type: 'math', tex: r`P(\text{spam}\mid\text{"free"}) = \frac{0.8 \times 0.4}{0.38} = \frac{0.32}{0.38} \approx 0.84` },
            { type: 'p', text: r`**Posterior** $\approx 84\%$ — seeing *"free"* raises the spam belief from a **40% prior** to an **84% posterior**. Chaining this update word-by-word (assuming words are independent) is precisely the **Naive Bayes** classifier.` },
          ],
          answer: 'P(spam | "free") ≈ 84%',
        },
        { type: 'heading', text: 'The normal distribution' },
        {
          type: 'p',
          text: r`Many natural quantities follow the bell-shaped **normal (Gaussian)** distribution, fully described by its mean $\mu$ and variance $\sigma^2$. It underlies Gaussian mixture models, many statistical tests, and the $|z|>3$ outlier rule.`,
        },
        { type: 'math', tex: r`f(x) = \frac{1}{\sqrt{2\pi\sigma^2}}\,\exp\!\left(-\frac{(x-\mu)^2}{2\sigma^2}\right)` },
      ],
    },

    // ================================================================
    {
      slug: 'the-ml-workflow',
      title: 'The ML Workflow & Terminology',
      summary:
        'The end-to-end pipeline from problem framing to deployment, and the key vocabulary — model, parameters vs hyperparameters, training vs inference — used throughout the course.',
      intro: {
        definition:
          'The ML workflow is the repeatable sequence of steps — frame, collect, prepare, train, evaluate, tune, deploy — that turns a problem and raw data into a working, monitored model.',
        whyItMatters:
          'Algorithms are only one step; most real ML effort is data preparation and honest evaluation. A shared vocabulary lets you follow every later lesson precisely.',
        whenToUse: [
          'Planning any ML project end to end',
          'Knowing which stage a technique belongs to',
          'Speaking the standard ML vocabulary correctly',
        ],
      },
      objectives: [
        'List the stages of the ML pipeline in order',
        'Distinguish parameters from hyperparameters',
        'Define training, inference and generalisation',
      ],
      blocks: [
        { type: 'heading', text: 'The pipeline' },
        {
          type: 'steps',
          items: [
            r`**Frame the problem** — what are you predicting, and which metric defines success?`,
            r`**Collect data** — gather representative, labelled (if supervised) examples.`,
            r`**Explore (EDA)** — inspect distributions, correlations and missing values.`,
            r`**Prepare** — clean, handle missing values, **encode** categoricals, **scale** numerics, and **split** into train/validation/test.`,
            r`**Choose a model** — pick an algorithm suited to the data and task.`,
            r`**Train** — fit the model's parameters on the training set.`,
            r`**Evaluate** — measure performance on held-out data with the right metric.`,
            r`**Tune** — search hyperparameters (cross-validation) and iterate.`,
            r`**Deploy & monitor** — serve predictions and watch for drift over time.`,
          ],
        },
        {
          type: 'note',
          variant: 'warning',
          title: 'Where the time goes',
          text: r`In practice, steps 2–4 (getting and preparing good data) dominate the effort. A great model on bad data loses to a simple model on good data.`,
        },
        {
          type: 'diagram',
          kind: 'ml-pipeline',
          caption: 'The end-to-end ML workflow — and the loop back to iterate.',
        },
        { type: 'heading', text: 'Parameters vs hyperparameters' },
        {
          type: 'table',
          headers: ['', 'Parameters', 'Hyperparameters'],
          rows: [
            ['Set by', 'The training algorithm (learned)', 'You, before training'],
            ['Examples', 'Weights β, bias b', 'Learning rate η, k in k-NN, tree depth'],
            ['Tuned via', 'Gradient descent / fitting', 'Validation / cross-validation'],
          ],
        },
        { type: 'heading', text: 'Essential vocabulary' },
        {
          type: 'list',
          items: [
            r`**Model** — the function $f_\theta$ mapping inputs to predictions, with parameters $\theta$.`,
            r`**Training (learning)** — choosing $\theta$ so predictions match the training targets.`,
            r`**Inference (prediction)** — using the trained model on new inputs.`,
            r`**Generalisation** — performing well on unseen data (the real goal).`,
            r`**Overfitting / underfitting** — too complex (memorises noise) / too simple (misses the pattern).`,
          ],
        },
        {
          type: 'note',
          variant: 'tip',
          title: 'You are ready',
          text: r`With data represented as $\mathbf{X},\mathbf{y}$, the linear-algebra to compute $\mathbf{w}^\top\mathbf{x}$, the calculus to minimise a loss, and the probability to reason about uncertainty, you now have every prerequisite. On to **Supervised Learning**.`,
        },
      ],
    },
  ],
};
