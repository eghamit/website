import type { Module } from './types';

const r = String.raw;

export const supervised: Module = {
  id: 'supervised',
  title: 'Supervised Learning',
  icon: '🎯',
  description:
    'Learn from labelled data: regression and classification, the models that power them, how they are trained, and how to measure whether they actually work.',
  lessons: [
    // ------------------------------------------------------------------
    {
      slug: 'introduction-to-supervised-learning',
      title: 'Introduction to Supervised Learning',
      summary:
        'What supervised learning is, the difference between features and targets, and how classification and regression differ.',
      objectives: [
        'Define supervised learning and the role of labelled data',
        'Distinguish features (inputs) from the target (output)',
        'Tell classification and regression problems apart',
      ],
      blocks: [
        {
          type: 'p',
          text: r`**Supervised learning** is the branch of machine learning where a model learns a mapping from inputs to outputs using **labelled examples** — data where the correct answer is already known. The goal is to generalise: to predict the right output for new, unseen inputs.`,
        },
        { type: 'heading', text: 'Data, features and targets' },
        {
          type: 'p',
          text: r`Each training example is a pair $(\mathbf{x}, y)$. The vector $\mathbf{x} = (x_1, x_2, \dots, x_n)$ holds the **features** (also called predictors or independent variables), and $y$ is the **target** (the label or dependent variable) we want to predict. A dataset of $m$ examples is written $\{(\mathbf{x}^{(i)}, y^{(i)})\}_{i=1}^{m}$.`,
        },
        {
          type: 'math',
          tex: r`\underbrace{\mathbf{x}^{(i)} \in \mathbb{R}^n}_{\text{features}} \;\longrightarrow\; \underbrace{y^{(i)}}_{\text{target}}`,
        },
        {
          type: 'p',
          text: r`A model is a function $f_\theta$ with parameters $\theta$ that produces a prediction $\hat{y} = f_\theta(\mathbf{x})$. **Training** means choosing $\theta$ so that predictions $\hat{y}$ are close to the true targets $y$ on the training data, in a way that also holds on new data.`,
        },
        { type: 'heading', text: 'Two kinds of problems' },
        {
          type: 'table',
          headers: ['Aspect', 'Regression', 'Classification'],
          rows: [
            ['Target type', 'Continuous number', 'Discrete category'],
            ['Example', 'Predict house price (₹)', 'Predict spam / not-spam'],
            ['Typical output', 'A real value', 'A class label or probability'],
            ['Common metric', 'RMSE, R²', 'Accuracy, F1-score'],
          ],
        },
        {
          type: 'note',
          variant: 'intuition',
          title: 'Rule of thumb',
          text: r`If the answer is *"how much / how many"* it is **regression**; if the answer is *"which category"* it is **classification**.`,
        },
        {
          type: 'example',
          title: 'Classify the problem',
          problem: r`For each task, decide regression or classification: (a) predict tomorrow's temperature; (b) decide if a tumour is benign or malignant; (c) estimate a used car's resale value; (d) recognise a handwritten digit 0–9.`,
          solution: [
            {
              type: 'list',
              items: [
                r`(a) Temperature is a continuous number → **regression**.`,
                r`(b) Two categories (benign/malignant) → **binary classification**.`,
                r`(c) A price is continuous → **regression**.`,
                r`(d) Ten discrete labels → **multi-class classification**.`,
              ],
            },
          ],
          answer: 'regression, classification, regression, classification',
        },
        {
          type: 'note',
          variant: 'info',
          title: 'The supervised workflow',
          text: r`Collect labelled data → split into train/validation/test → choose a model → train (fit parameters) → evaluate → tune → deploy. Every lesson in this module is a piece of that pipeline.`,
        },
      ],
    },

    // ------------------------------------------------------------------
    {
      slug: 'linear-regression',
      title: 'Linear & Multiple Linear Regression',
      summary:
        'Fit a straight line (or hyperplane) to data, with the normal equations, least squares, and a fully worked numeric example.',
      objectives: [
        'Write the linear regression model and its cost function',
        'Derive the closed-form least-squares solution',
        'Fit a line to data by hand',
      ],
      blocks: [
        {
          type: 'p',
          text: r`**Linear regression** models the target as a linear combination of the features. For a single feature this is a straight line; for many features it is a hyperplane.`,
        },
        { type: 'heading', text: 'The model' },
        { type: 'math', tex: r`\hat{y} = \beta_0 + \beta_1 x_1 + \beta_2 x_2 + \cdots + \beta_n x_n = \boldsymbol{\beta}^\top \mathbf{x}`, caption: 'With a leading 1 in x for the intercept β₀.' },
        {
          type: 'p',
          text: r`Here $\beta_0$ is the **intercept** (bias) and each $\beta_j$ is the **slope** (weight) telling us how much $\hat{y}$ changes per unit of feature $x_j$.`,
        },
        { type: 'heading', text: 'Cost function: least squares' },
        {
          type: 'p',
          text: r`We choose the coefficients that minimise the **residual sum of squares** — the total squared gap between predictions and truth. The mean version is the Mean Squared Error (MSE):`,
        },
        { type: 'math', tex: r`J(\boldsymbol{\beta}) = \frac{1}{2m}\sum_{i=1}^{m}\left(\hat{y}^{(i)} - y^{(i)}\right)^2 = \frac{1}{2m}\sum_{i=1}^{m}\left(\boldsymbol{\beta}^\top \mathbf{x}^{(i)} - y^{(i)}\right)^2` },
        { type: 'heading', text: 'Closed-form solution (normal equations)' },
        {
          type: 'p',
          text: r`Stacking all examples into a design matrix $\mathbf{X} \in \mathbb{R}^{m\times(n+1)}$ and targets $\mathbf{y}$, setting the gradient to zero gives the **normal equations**:`,
        },
        { type: 'math', tex: r`\boldsymbol{\beta} = \left(\mathbf{X}^\top \mathbf{X}\right)^{-1}\mathbf{X}^\top \mathbf{y}` },
        {
          type: 'note',
          variant: 'tip',
          title: 'For one feature',
          text: r`The slope and intercept reduce to the tidy formulas $\;\beta_1 = \dfrac{\sum (x_i-\bar x)(y_i-\bar y)}{\sum (x_i-\bar x)^2}\;$ and $\;\beta_0 = \bar y - \beta_1 \bar x.$`,
        },
        {
          type: 'example',
          title: 'Fit a line by hand',
          problem: r`Fit $\hat{y}=\beta_0+\beta_1 x$ to the points $(1,2),\,(2,3),\,(3,5),\,(4,4),\,(5,6)$.`,
          solution: [
            { type: 'p', text: r`**Step 1 — means.** $\bar x = \frac{1+2+3+4+5}{5}=3$, $\;\bar y = \frac{2+3+5+4+6}{5}=4$.` },
            {
              type: 'p',
              text: r`**Step 2 — deviations and products.** Compute $(x_i-\bar x)$ and $(y_i-\bar y)$:`,
            },
            {
              type: 'table',
              headers: ['xᵢ', 'yᵢ', 'xᵢ−x̄', 'yᵢ−ȳ', '(xᵢ−x̄)(yᵢ−ȳ)', '(xᵢ−x̄)²'],
              rows: [
                ['1', '2', '−2', '−2', '4', '4'],
                ['2', '3', '−1', '−1', '1', '1'],
                ['3', '5', '0', '1', '0', '0'],
                ['4', '4', '1', '0', '0', '1'],
                ['5', '6', '2', '2', '4', '4'],
                ['', '', '', 'Σ', '9', '10'],
              ],
            },
            { type: 'p', text: r`**Step 3 — slope.** $\beta_1 = \dfrac{9}{10} = 0.9.$` },
            { type: 'p', text: r`**Step 4 — intercept.** $\beta_0 = \bar y - \beta_1\bar x = 4 - 0.9\times 3 = 1.3.$` },
            { type: 'p', text: r`**Step 5 — model.** $\hat{y} = 1.3 + 0.9x$. For $x=6$ it predicts $\hat{y}=1.3+5.4=6.7$.` },
          ],
          answer: 'ŷ = 1.3 + 0.9x',
        },
        {
          type: 'note',
          variant: 'warning',
          title: 'Assumptions & caveats',
          text: r`Linear regression assumes a roughly linear relationship, independent errors with constant variance, and few extreme outliers (squared error is sensitive to them). When $\mathbf{X}^\top\mathbf{X}$ is not invertible (collinear features), use gradient descent or add regularization.`,
        },
      ],
    },

    // ------------------------------------------------------------------
    {
      slug: 'logistic-regression',
      title: 'Logistic Regression',
      summary:
        'A linear model for classification: the sigmoid, log-odds, cross-entropy loss, and decision boundaries.',
      objectives: [
        'Map a linear score to a probability with the sigmoid',
        'Interpret weights as log-odds',
        'Use cross-entropy loss and a decision threshold',
      ],
      blocks: [
        {
          type: 'p',
          text: r`Despite its name, **logistic regression** is a **classification** model. It computes a linear score and squashes it into a probability between 0 and 1 with the **sigmoid** (logistic) function.`,
        },
        { type: 'math', tex: r`\sigma(z) = \frac{1}{1+e^{-z}}, \qquad z = \boldsymbol{\beta}^\top \mathbf{x}` },
        {
          type: 'p',
          text: r`The output $\hat{p} = \sigma(z)$ is read as $P(y=1\mid \mathbf{x})$. We predict class 1 when $\hat p \ge 0.5$, which happens exactly when $z \ge 0$ — so the **decision boundary** is the line/hyperplane $\boldsymbol{\beta}^\top\mathbf{x}=0$.`,
        },
        { type: 'heading', text: 'Log-odds interpretation' },
        {
          type: 'p',
          text: r`Inverting the sigmoid shows the linear part models the **log-odds**: each weight $\beta_j$ is the change in log-odds per unit of $x_j$.`,
        },
        { type: 'math', tex: r`\ln\!\left(\frac{\hat p}{1-\hat p}\right) = \boldsymbol{\beta}^\top\mathbf{x}` },
        { type: 'heading', text: 'Loss function: binary cross-entropy' },
        {
          type: 'p',
          text: r`Squared error is non-convex for the sigmoid, so we train with **cross-entropy** (log loss), which is convex in $\boldsymbol\beta$:`,
        },
        { type: 'math', tex: r`J(\boldsymbol\beta) = -\frac{1}{m}\sum_{i=1}^{m}\Big[\,y^{(i)}\ln \hat p^{(i)} + (1-y^{(i)})\ln\!\big(1-\hat p^{(i)}\big)\Big]` },
        {
          type: 'p',
          text: r`Its gradient has the same clean form as linear regression, which is why gradient descent works so well:`,
        },
        { type: 'math', tex: r`\frac{\partial J}{\partial \beta_j} = \frac{1}{m}\sum_{i=1}^{m}\big(\hat p^{(i)} - y^{(i)}\big)\,x_j^{(i)}` },
        {
          type: 'example',
          title: 'Compute a prediction and its loss',
          problem: r`A model has $z = -1 + 2x$. For a point with $x=1.5$ and true label $y=1$, find the predicted probability and the cross-entropy loss.`,
          solution: [
            { type: 'p', text: r`**Step 1 — score.** $z = -1 + 2(1.5) = 2.$` },
            { type: 'p', text: r`**Step 2 — probability.** $\hat p = \sigma(2) = \dfrac{1}{1+e^{-2}} = \dfrac{1}{1+0.1353} \approx 0.881.$` },
            { type: 'p', text: r`**Step 3 — prediction.** Since $0.881 \ge 0.5$, predict class **1** (correct).` },
            { type: 'p', text: r`**Step 4 — loss.** With $y=1$: $\;-\ln(\hat p) = -\ln(0.881) \approx 0.127.$ A confident, correct prediction gives a small loss.` },
          ],
          answer: 'p̂ ≈ 0.881, loss ≈ 0.127',
        },
        {
          type: 'note',
          variant: 'info',
          title: 'Multi-class',
          text: r`For more than two classes, logistic regression generalises to **softmax regression**, which outputs a probability per class that sums to 1.`,
        },
      ],
    },

    // ------------------------------------------------------------------
    {
      slug: 'k-nearest-neighbors',
      title: 'k-Nearest Neighbors (k-NN)',
      summary:
        'A lazy, instance-based method that classifies by majority vote of the closest points. Includes a worked vote.',
      objectives: [
        'Describe the k-NN algorithm and why it is "lazy"',
        'Use distance to find neighbours',
        'Classify a query point by majority vote',
      ],
      blocks: [
        {
          type: 'p',
          text: r`**k-Nearest Neighbors** makes no assumptions and builds no model during training — it simply stores the data. To predict, it finds the $k$ closest training points to the query and lets them vote (classification) or average (regression). This is why it is called a **lazy** or **instance-based** learner.`,
        },
        { type: 'heading', text: 'Algorithm' },
        {
          type: 'steps',
          items: [
            r`Choose $k$ and a distance metric (usually Euclidean).`,
            r`Compute the distance from the query $\mathbf{x}$ to every training point.`,
            r`Select the $k$ points with the smallest distances.`,
            r`**Classification:** predict the majority class among them. **Regression:** predict their mean target.`,
          ],
        },
        { type: 'math', tex: r`d(\mathbf{x},\mathbf{x}') = \sqrt{\sum_{j=1}^{n}\left(x_j - x'_j\right)^2}` },
        {
          type: 'example',
          title: 'Classify with k = 3',
          problem: r`Training points (class in brackets): $A(1,1)[\,\bullet\,]$, $B(2,2)[\,\bullet\,]$, $C(3,3)[\,\circ\,]$, $D(6,6)[\,\circ\,]$. Classify the query $Q(2,3)$ with $k=3$.`,
          solution: [
            { type: 'p', text: r`**Step 1 — distances from $Q(2,3)$:**` },
            {
              type: 'table',
              headers: ['Point', 'Class', 'Distance to Q', 'Value'],
              rows: [
                ['A(1,1)', '●', r`$\sqrt{1^2+2^2}$`, '2.24'],
                ['B(2,2)', '●', r`$\sqrt{0^2+1^2}$`, '1.00'],
                ['C(3,3)', '○', r`$\sqrt{1^2+0^2}$`, '1.00'],
                ['D(6,6)', '○', r`$\sqrt{4^2+3^2}$`, '5.00'],
              ],
            },
            { type: 'p', text: r`**Step 2 — nearest 3:** B (1.00), C (1.00), A (2.24).` },
            { type: 'p', text: r`**Step 3 — vote:** classes are ●, ○, ● → two ● vs one ○.` },
            { type: 'p', text: r`**Prediction:** class **●**.` },
          ],
          answer: 'Class ● (filled)',
        },
        {
          type: 'note',
          variant: 'warning',
          title: 'Practical notes',
          text: r`Always **scale features** first — a large-range feature otherwise dominates the distance. Small $k$ → noisy, high-variance boundaries; large $k$ → smoother but can blur classes. Prediction is slow on big datasets because every query scans all data.`,
        },
      ],
    },

    // ------------------------------------------------------------------
    {
      slug: 'decision-trees',
      title: 'Decision Trees',
      summary:
        'Recursive splitting with entropy and information gain (and Gini), plus a hand-computed best split.',
      objectives: [
        'Explain how a tree splits data into pure regions',
        'Compute entropy, Gini and information gain',
        'Pick the best split by hand',
      ],
      blocks: [
        {
          type: 'p',
          text: r`A **decision tree** splits the feature space into rectangular regions by asking a sequence of yes/no questions. Each internal node tests one feature; each leaf assigns a prediction. Trees are highly interpretable — you can read the rules directly.`,
        },
        { type: 'heading', text: 'Measuring impurity' },
        {
          type: 'p',
          text: r`A good split makes the resulting groups **purer** (more dominated by one class). Two common impurity measures for a node with class proportions $p_1,\dots,p_C$:`,
        },
        { type: 'math', tex: r`\text{Entropy}(S) = -\sum_{c=1}^{C} p_c \log_2 p_c, \qquad \text{Gini}(S) = 1 - \sum_{c=1}^{C} p_c^{\,2}` },
        { type: 'heading', text: 'Information gain' },
        {
          type: 'p',
          text: r`A split on feature $A$ partitions $S$ into subsets $S_v$. The **information gain** is the drop in impurity, weighted by subset size. The tree greedily picks the split with the highest gain.`,
        },
        { type: 'math', tex: r`\text{Gain}(S,A) = \text{Entropy}(S) - \sum_{v}\frac{|S_v|}{|S|}\,\text{Entropy}(S_v)` },
        {
          type: 'example',
          title: 'Find the information gain of a split',
          problem: r`A node has 14 examples: 9 "Yes", 5 "No". Splitting on feature *Outlook* gives three branches — Sunny (2 Yes, 3 No), Overcast (4 Yes, 0 No), Rainy (3 Yes, 2 No). Compute the information gain.`,
          solution: [
            { type: 'p', text: r`**Parent entropy.** $-\tfrac{9}{14}\log_2\tfrac{9}{14} - \tfrac{5}{14}\log_2\tfrac{5}{14} = 0.940.$` },
            { type: 'p', text: r`**Sunny (2,3):** $-\tfrac{2}{5}\log_2\tfrac{2}{5}-\tfrac{3}{5}\log_2\tfrac{3}{5} = 0.971.$` },
            { type: 'p', text: r`**Overcast (4,0):** pure node → entropy $= 0.$` },
            { type: 'p', text: r`**Rainy (3,2):** by symmetry with Sunny $= 0.971.$` },
            { type: 'p', text: r`**Weighted child entropy.** $\tfrac{5}{14}(0.971)+\tfrac{4}{14}(0)+\tfrac{5}{14}(0.971) = 0.694.$` },
            { type: 'p', text: r`**Gain.** $0.940 - 0.694 = \mathbf{0.246}.$ The feature giving the largest such gain becomes the split.` },
          ],
          answer: 'Information gain ≈ 0.246',
        },
        {
          type: 'note',
          variant: 'warning',
          title: 'Overfitting',
          text: r`A fully grown tree can memorise the training set. Control it with **max depth**, **minimum samples per leaf**, or **pruning**. This weakness is exactly what random forests fix.`,
        },
      ],
    },

    // ------------------------------------------------------------------
    {
      slug: 'random-forests',
      title: 'Random Forests',
      summary:
        'An ensemble of decorrelated decision trees using bagging and random feature subsets to cut variance.',
      objectives: [
        'Explain bagging (bootstrap aggregation)',
        'See why random feature selection decorrelates trees',
        'Understand why the ensemble beats a single tree',
      ],
      blocks: [
        {
          type: 'p',
          text: r`A single decision tree has low bias but **high variance** — small data changes reshuffle it. A **random forest** averages many trees so their errors cancel, keeping the low bias while slashing variance.`,
        },
        { type: 'heading', text: 'Bagging' },
        {
          type: 'p',
          text: r`**Bagging** (bootstrap aggregating): build each tree on a **bootstrap sample** — $m$ points drawn *with replacement* from the training set. Combine predictions by majority vote (classification) or averaging (regression).`,
        },
        {
          type: 'p',
          text: r`If $B$ trees each have variance $\sigma^2$ and pairwise correlation $\rho$, the averaged prediction has variance:`,
        },
        { type: 'math', tex: r`\rho\,\sigma^2 + \frac{1-\rho}{B}\,\sigma^2` },
        {
          type: 'p',
          text: r`The second term vanishes as $B$ grows, but the first is capped by the correlation $\rho$. So the trick is to **reduce $\rho$**.`,
        },
        { type: 'heading', text: 'Random feature subsets' },
        {
          type: 'p',
          text: r`At each split a random forest considers only a random subset of features (commonly $\sqrt{n}$ of $n$ for classification). This stops every tree from keying on the same dominant feature, **decorrelating** the trees and pushing $\rho$ down.`,
        },
        {
          type: 'note',
          variant: 'tip',
          title: 'Free validation: OOB error',
          text: r`Each bootstrap sample omits about $1/e \approx 37\%$ of points. Those **out-of-bag** samples act as a built-in validation set, giving an honest error estimate without a separate holdout.`,
        },
        {
          type: 'example',
          title: 'Aggregate five trees',
          problem: r`Five trees classify one email as: spam, spam, ham, spam, ham. What does the forest predict, and how confident is it?`,
          solution: [
            { type: 'p', text: r`**Votes:** spam = 3, ham = 2.` },
            { type: 'p', text: r`**Majority:** spam. **Estimated probability:** $3/5 = 0.6$ for spam.` },
          ],
          answer: 'Spam, with probability 0.6',
        },
      ],
    },

    // ------------------------------------------------------------------
    {
      slug: 'support-vector-machines',
      title: 'Support Vector Machines (SVM)',
      summary:
        'Maximum-margin classifiers, the geometry of the margin, soft margins, and the kernel trick.',
      objectives: [
        'State the maximum-margin objective',
        'Identify support vectors and the margin width',
        'Explain kernels for non-linear data',
      ],
      blocks: [
        {
          type: 'p',
          text: r`A **Support Vector Machine** finds the hyperplane that separates two classes with the **widest possible margin** — the largest gap to the nearest points of either class. The points touching the margin are the **support vectors**; they alone determine the boundary.`,
        },
        { type: 'math', tex: r`\boldsymbol{w}^\top\mathbf{x} + b = 0 \quad\text{(decision boundary)}` },
        {
          type: 'p',
          text: r`With labels $y^{(i)}\in\{-1,+1\}$, a correctly classified point at least a margin away satisfies $y^{(i)}(\boldsymbol{w}^\top\mathbf{x}^{(i)}+b)\ge 1$. The margin width is $2/\lVert\boldsymbol w\rVert$, so maximising the margin means minimising $\lVert\boldsymbol w\rVert$.`,
        },
        { type: 'heading', text: 'Hard-margin optimisation' },
        { type: 'math', tex: r`\min_{\boldsymbol w,b}\; \tfrac{1}{2}\lVert\boldsymbol w\rVert^2 \quad\text{s.t.}\quad y^{(i)}\big(\boldsymbol w^\top\mathbf{x}^{(i)}+b\big)\ge 1\;\;\forall i` },
        { type: 'heading', text: 'Soft margin' },
        {
          type: 'p',
          text: r`Real data overlaps, so we allow slack $\xi_i\ge 0$ and penalise it. The constant $C$ trades off margin width against violations — small $C$ = wider, more tolerant margin; large $C$ = fewer mistakes, narrower margin.`,
        },
        { type: 'math', tex: r`\min_{\boldsymbol w,b,\boldsymbol\xi}\; \tfrac{1}{2}\lVert\boldsymbol w\rVert^2 + C\sum_{i=1}^{m}\xi_i` },
        { type: 'heading', text: 'The kernel trick' },
        {
          type: 'p',
          text: r`When classes are not linearly separable, a **kernel** $K(\mathbf{x},\mathbf{x}')$ computes inner products in a higher-dimensional space **without ever forming the coordinates there**, letting a linear SVM carve non-linear boundaries. The popular RBF (Gaussian) kernel:`,
        },
        { type: 'math', tex: r`K(\mathbf{x},\mathbf{x}') = \exp\!\left(-\gamma\,\lVert \mathbf{x}-\mathbf{x}'\rVert^2\right)` },
        {
          type: 'example',
          title: 'Margin width from weights',
          problem: r`An SVM learned $\boldsymbol w = (3,4)$ and $b=-1$. What is the margin width, and how is a point $\mathbf{x}=(1,1)$ classified?`,
          solution: [
            { type: 'p', text: r`**Norm.** $\lVert\boldsymbol w\rVert = \sqrt{3^2+4^2}=5.$` },
            { type: 'p', text: r`**Margin width.** $2/\lVert\boldsymbol w\rVert = 2/5 = 0.4.$` },
            { type: 'p', text: r`**Score.** $\boldsymbol w^\top\mathbf{x}+b = 3(1)+4(1)-1 = 6 > 0 \Rightarrow$ class $+1$.` },
          ],
          answer: 'Margin 0.4; point is class +1',
        },
      ],
    },

    // ------------------------------------------------------------------
    {
      slug: 'naive-bayes',
      title: 'Naive Bayes Classifier',
      summary:
        "Bayes' theorem with a conditional-independence shortcut, plus a full spam-classification example.",
      objectives: [
        "Apply Bayes' theorem to classification",
        'Understand the "naive" independence assumption',
        'Classify a document by hand with Laplace smoothing',
      ],
      blocks: [
        {
          type: 'p',
          text: r`**Naive Bayes** is a probabilistic classifier built on **Bayes' theorem**. It picks the class with the highest posterior probability given the features.`,
        },
        { type: 'math', tex: r`P(y\mid \mathbf{x}) = \frac{P(\mathbf{x}\mid y)\,P(y)}{P(\mathbf{x})}` },
        { type: 'heading', text: 'The naive assumption' },
        {
          type: 'p',
          text: r`Modelling the full joint $P(\mathbf{x}\mid y)$ is hard, so we *naively* assume features are **conditionally independent** given the class. The likelihood then factorises, and since $P(\mathbf{x})$ is the same for every class we can drop it:`,
        },
        { type: 'math', tex: r`\hat y = \arg\max_{y}\; P(y)\prod_{j=1}^{n} P(x_j\mid y)` },
        {
          type: 'note',
          variant: 'tip',
          title: 'Laplace smoothing',
          text: r`A feature value never seen with a class gives probability 0, which wipes out the whole product. Add-one (**Laplace**) smoothing fixes this: $P(x_j\mid y)=\dfrac{\text{count}+1}{\text{total}+V}$, where $V$ is the vocabulary size.`,
        },
        {
          type: 'example',
          title: 'Spam or ham?',
          problem: r`From training: $P(\text{spam})=0.5$, $P(\text{ham})=0.5$. Word likelihoods — $P(\text{"win"}\mid\text{spam})=0.6,\ P(\text{"win"}\mid\text{ham})=0.1$; $P(\text{"money"}\mid\text{spam})=0.5,\ P(\text{"money"}\mid\text{ham})=0.1$. Classify the message "win money".`,
          solution: [
            { type: 'p', text: r`**Spam score.** $0.5 \times 0.6 \times 0.5 = 0.15.$` },
            { type: 'p', text: r`**Ham score.** $0.5 \times 0.1 \times 0.1 = 0.005.$` },
            { type: 'p', text: r`**Compare.** $0.15 > 0.005$, so classify as **spam**.` },
            { type: 'p', text: r`**Normalised probability.** $\dfrac{0.15}{0.15+0.005} \approx 0.97$ chance of spam.` },
          ],
          answer: 'Spam (≈ 97%)',
        },
        {
          type: 'note',
          variant: 'info',
          title: 'Why it works so well',
          text: r`Even when the independence assumption is false, the class *ranking* is often still correct, so Naive Bayes is a fast, strong baseline — especially for text.`,
        },
      ],
    },

    // ------------------------------------------------------------------
    {
      slug: 'loss-functions-and-gradient-descent',
      title: 'Loss Functions & Gradient Descent',
      summary:
        'MSE and cross-entropy, and the optimisation algorithm that minimises them, with a step-by-step update.',
      objectives: [
        'Define MSE and cross-entropy loss',
        'State the gradient descent update rule',
        'Perform one gradient descent step by hand',
      ],
      blocks: [
        {
          type: 'p',
          text: r`A **loss (cost) function** measures how wrong the model is; **training** is the search for parameters that make it small. Two workhorses:`,
        },
        { type: 'heading', text: 'Mean Squared Error (regression)' },
        { type: 'math', tex: r`\text{MSE} = \frac{1}{m}\sum_{i=1}^{m}\big(\hat y^{(i)} - y^{(i)}\big)^2` },
        { type: 'heading', text: 'Cross-entropy (classification)' },
        { type: 'math', tex: r`\text{CE} = -\frac{1}{m}\sum_{i=1}^{m}\sum_{c=1}^{C} y_c^{(i)}\,\ln \hat p_c^{(i)}` },
        { type: 'heading', text: 'Gradient descent' },
        {
          type: 'p',
          text: r`**Gradient descent** minimises the loss by repeatedly stepping *downhill* — in the direction opposite the gradient. The **learning rate** $\eta$ sets the step size.`,
        },
        { type: 'math', tex: r`\theta_j \leftarrow \theta_j - \eta\,\frac{\partial J}{\partial \theta_j}` },
        {
          type: 'table',
          headers: ['Variant', 'Data per update', 'Trade-off'],
          rows: [
            ['Batch', 'All m examples', 'Stable but slow per step'],
            ['Stochastic (SGD)', 'One example', 'Fast, noisy path'],
            ['Mini-batch', 'A small batch (e.g. 32)', 'Best of both — the default'],
          ],
        },
        {
          type: 'example',
          title: 'One gradient descent step',
          problem: r`Minimise $J(\theta)=\theta^2$ starting at $\theta=4$ with learning rate $\eta=0.1$. Do two updates.`,
          solution: [
            { type: 'p', text: r`**Gradient.** $\dfrac{dJ}{d\theta}=2\theta.$` },
            { type: 'p', text: r`**Update 1.** $\theta \leftarrow 4 - 0.1(2\cdot 4) = 4 - 0.8 = 3.2.$` },
            { type: 'p', text: r`**Update 2.** $\theta \leftarrow 3.2 - 0.1(2\cdot 3.2) = 3.2 - 0.64 = 2.56.$` },
            { type: 'p', text: r`Each step moves $\theta$ toward the minimum at 0. Too large an $\eta$ would overshoot and diverge.` },
          ],
          answer: 'θ: 4 → 3.2 → 2.56 (heading to 0)',
        },
        {
          type: 'note',
          variant: 'warning',
          title: 'Choosing the learning rate',
          text: r`Too small → painfully slow convergence. Too large → the loss oscillates or blows up. Plot the loss over iterations; it should fall smoothly.`,
        },
      ],
    },

    // ------------------------------------------------------------------
    {
      slug: 'overfitting-bias-variance-regularization',
      title: 'Overfitting, Bias–Variance & Regularization',
      summary:
        'Why models fail to generalise, the bias–variance decomposition, and L1/L2 regularization as the cure.',
      objectives: [
        'Distinguish overfitting from underfitting',
        'State the bias–variance trade-off',
        'Apply L1 and L2 regularization',
      ],
      blocks: [
        {
          type: 'p',
          text: r`We split data into **training**, **validation** and **test** sets. Train fits parameters; validation tunes choices like model complexity; test gives a final, untouched estimate of real-world performance.`,
        },
        { type: 'heading', text: 'Underfitting vs overfitting' },
        {
          type: 'table',
          headers: ['', 'Underfitting', 'Overfitting'],
          rows: [
            ['Cause', 'Model too simple', 'Model too complex'],
            ['Train error', 'High', 'Very low'],
            ['Test error', 'High', 'High'],
            ['Symptom', 'Misses the pattern', 'Memorises noise'],
          ],
        },
        { type: 'heading', text: 'The bias–variance decomposition' },
        {
          type: 'p',
          text: r`Expected test error splits into three parts. **Bias** is error from wrong assumptions (too simple); **variance** is sensitivity to the particular training set (too complex); **irreducible noise** cannot be removed.`,
        },
        { type: 'math', tex: r`\mathbb{E}\big[(y-\hat f)^2\big] = \underbrace{\text{Bias}(\hat f)^2}_{\text{too simple}} + \underbrace{\text{Var}(\hat f)}_{\text{too complex}} + \underbrace{\sigma^2}_{\text{noise}}` },
        {
          type: 'note',
          variant: 'intuition',
          title: 'The trade-off',
          text: r`Increasing complexity lowers bias but raises variance. The best model sits at the sweet spot where their **sum** is smallest — not where either is individually zero.`,
        },
        { type: 'heading', text: 'Regularization' },
        {
          type: 'p',
          text: r`**Regularization** adds a penalty on large weights to the loss, discouraging complexity. **L2 (Ridge)** shrinks weights smoothly; **L1 (Lasso)** drives some weights to exactly zero, performing feature selection.`,
        },
        { type: 'math', tex: r`J_{\text{L2}} = J_0 + \lambda\sum_j \beta_j^2, \qquad J_{\text{L1}} = J_0 + \lambda\sum_j |\beta_j|` },
        {
          type: 'example',
          title: 'Diagnose the model',
          problem: r`A model scores 99% accuracy on training data but 72% on the test set. What is happening, and what would you try?`,
          solution: [
            { type: 'p', text: r`**Diagnosis.** A large train–test gap = **overfitting** (high variance).` },
            {
              type: 'list',
              items: [
                r`Add regularization (increase $\lambda$).`,
                r`Get more training data or use data augmentation.`,
                r`Reduce model complexity (fewer features, shallower tree).`,
                r`Use cross-validation to tune, and early stopping for iterative models.`,
              ],
            },
          ],
          answer: 'Overfitting — regularize / simplify / add data',
        },
      ],
    },

    // ------------------------------------------------------------------
    {
      slug: 'model-evaluation-metrics',
      title: 'Model Evaluation Metrics',
      summary:
        'Confusion matrix, accuracy/precision/recall/F1, regression metrics (MAE/MSE/RMSE/R²), cross-validation and tuning.',
      objectives: [
        'Read a confusion matrix',
        'Compute precision, recall and F1',
        'Use the right regression metric and cross-validation',
      ],
      blocks: [
        {
          type: 'p',
          text: r`Choosing the right metric matters as much as choosing the model — accuracy alone is misleading on imbalanced data.`,
        },
        { type: 'heading', text: 'Confusion matrix' },
        {
          type: 'table',
          headers: ['', 'Predicted +', 'Predicted −'],
          rows: [
            ['Actual +', 'TP (true positive)', 'FN (false negative)'],
            ['Actual −', 'FP (false positive)', 'TN (true negative)'],
          ],
        },
        { type: 'heading', text: 'Classification metrics' },
        { type: 'math', tex: r`\text{Accuracy} = \frac{TP+TN}{TP+TN+FP+FN}` },
        { type: 'math', tex: r`\text{Precision} = \frac{TP}{TP+FP}, \qquad \text{Recall} = \frac{TP}{TP+FN}` },
        { type: 'math', tex: r`F_1 = 2\cdot\frac{\text{Precision}\cdot\text{Recall}}{\text{Precision}+\text{Recall}}` },
        {
          type: 'note',
          variant: 'intuition',
          title: 'Precision vs recall',
          text: r`**Precision:** of those we flagged positive, how many truly are? (cost of false alarms). **Recall:** of all real positives, how many did we catch? (cost of misses). $F_1$ balances the two via their harmonic mean.`,
        },
        { type: 'heading', text: 'Regression metrics' },
        { type: 'math', tex: r`\text{MAE}=\frac{1}{m}\sum|\hat y_i - y_i|, \quad \text{RMSE}=\sqrt{\frac{1}{m}\sum(\hat y_i - y_i)^2}` },
        { type: 'math', tex: r`R^2 = 1 - \frac{\sum_i (y_i-\hat y_i)^2}{\sum_i (y_i-\bar y)^2}` },
        {
          type: 'p',
          text: r`$R^2$ is the fraction of variance explained: 1 is perfect, 0 is no better than predicting the mean. RMSE punishes large errors more than MAE.`,
        },
        {
          type: 'example',
          title: 'Metrics from a confusion matrix',
          problem: r`A test of 100 emails gives $TP=40$, $FP=10$, $FN=5$, $TN=45$. Find accuracy, precision, recall and $F_1$.`,
          solution: [
            { type: 'p', text: r`**Accuracy.** $\dfrac{40+45}{100} = 0.85.$` },
            { type: 'p', text: r`**Precision.** $\dfrac{40}{40+10} = 0.80.$` },
            { type: 'p', text: r`**Recall.** $\dfrac{40}{40+5} \approx 0.889.$` },
            { type: 'p', text: r`**F₁.** $2\cdot\dfrac{0.80\times 0.889}{0.80+0.889} \approx 0.842.$` },
          ],
          answer: 'Acc 0.85, P 0.80, R 0.889, F₁ 0.842',
        },
        { type: 'heading', text: 'Cross-validation & tuning' },
        {
          type: 'p',
          text: r`**k-fold cross-validation** splits data into $k$ folds, training on $k-1$ and testing on the held-out fold, rotating $k$ times and averaging. It gives a more reliable score than one split and underpins **hyperparameter tuning** (grid or random search over settings like $\lambda$, $k$, or tree depth).`,
        },
      ],
    },
  ],
};
