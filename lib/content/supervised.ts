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
        'The canonical supervised regression algorithm — from the linear model and squared-error loss to the closed-form normal equation, gradient descent, and two full hand-worked examples on the same dataset.',
      objectives: [
        'Formulate the linear model for one and many features using θ-notation',
        'Explain the mean-squared-error cost, why we square, and why it is convex',
        'Derive the closed-form solution both by scalar calculus and in matrix form',
        'Connect the slope to covariance, variance and correlation',
        'Run gradient descent by hand and compare it to the normal equation',
      ],
      blocks: [
        // ---------------------------------------------------------------
        { type: 'heading', text: 'Where linear regression fits' },
        {
          type: 'p',
          text: r`**Linear regression** is **supervised**, solves a **regression** task (continuous target), and uses a **parametric linear** model. Despite its simplicity it is the foundation for a huge part of statistics and machine learning: logistic regression, generalized linear models, ridge/lasso regularization, and even the final layer of many neural networks are direct descendants.`,
        },
        {
          type: 'p',
          text: r`In Mitchell's terms — *a program learns from experience $E$ at task $T$ measured by $P$* — the ingredients here are: $T$: predict a real-valued output from input features; $E$: a dataset of past $(\text{input},\text{output})$ pairs; $P$: a loss such as the mean squared error.`,
        },
        {
          type: 'table',
          headers: ['Regression', 'Classification'],
          rows: [
            ['Output is continuous ($y\\in\\mathbb{R}$)', 'Output is a discrete class label'],
            ['Example: price, temperature', 'Example: spam / not-spam'],
            ['Typical loss: squared error', 'Typical loss: cross-entropy'],
            ['Metric: RMSE, R²', 'Metric: accuracy, F1'],
          ],
          caption: 'Linear regression lives in the left column.',
        },

        // ---------------------------------------------------------------
        { type: 'heading', text: 'Problem formulation' },
        {
          type: 'p',
          text: r`Given training data $\{(\mathbf{x}^{(i)}, y^{(i)})\}_{i=1}^{m}$ we seek a function that predicts $y$ from $\mathbf{x}$ as accurately as possible **on unseen data**. The superscript $(i)$ indexes the $m$ examples and the subscript $j$ indexes the $n$ features, so $x^{(i)}_j$ is the $j$-th feature of the $i$-th example.`,
        },
        {
          type: 'list',
          items: [
            r`**Features** — the inputs $\mathbf{x}^{(i)}\in\mathbb{R}^{n}$ (also predictors, covariates, independent variables).`,
            r`**Target** — the output $y^{(i)}\in\mathbb{R}$ (also response or dependent variable).`,
            r`**Training data** — the $m$ observed pairs used to fit the model.`,
          ],
        },

        // ---------------------------------------------------------------
        { type: 'heading', text: 'The linear model' },
        {
          type: 'p',
          text: r`Linear regression assumes the target is (approximately) a linear function of the features plus an intercept. Writing the parameters as $\boldsymbol{\theta}$:`,
        },
        { type: 'math', tex: r`h_{\boldsymbol\theta}(\mathbf{x}) = \theta_0 + \theta_1 x_1 + \theta_2 x_2 + \cdots + \theta_n x_n` },
        {
          type: 'p',
          text: r`Introducing a dummy feature $x_0\equiv 1$ turns this into a compact **dot product** — one formula that works for any number of features:`,
        },
        { type: 'math', tex: r`h_{\boldsymbol\theta}(\mathbf{x}) = \sum_{j=0}^{n}\theta_j x_j = \boldsymbol{\theta}^\top \mathbf{x}, \qquad \boldsymbol\theta = \begin{bmatrix}\theta_0\\\vdots\\\theta_n\end{bmatrix},\;\; \mathbf{x}=\begin{bmatrix}1\\x_1\\\vdots\\x_n\end{bmatrix}` },
        {
          type: 'p',
          text: r`The single-feature case $n=1$ is **simple linear regression**, a straight line:`,
        },
        { type: 'math', tex: r`\boxed{\;\hat{y} = h_{\boldsymbol\theta}(x) = \theta_0 + \theta_1 x\;}` },
        {
          type: 'p',
          text: r`Here $\theta_0$ is the **intercept** (the value of $\hat y$ when $x=0$) and $\theta_1$ is the **slope** (the change in $\hat y$ per unit change in $x$). The function $h_{\boldsymbol\theta}$ is the **hypothesis**; evaluating it at a new input $x_\star$ gives the prediction $\hat y_\star=\theta_0+\theta_1 x_\star$. Learning means choosing $\boldsymbol\theta$ so predictions match the targets.`,
        },
        {
          type: 'diagram',
          kind: 'linear-fit',
          caption: 'Simple linear regression fits the line minimising the squared residuals (dashed) — the very dataset worked by hand below.',
        },

        // ---------------------------------------------------------------
        { type: 'heading', text: 'The loss function' },
        {
          type: 'p',
          text: r`To choose $\boldsymbol\theta$ we need a measure of how wrong the predictions are. The error (residual) of example $i$ is $h_{\boldsymbol\theta}(x^{(i)})-y^{(i)}$. The **mean squared error** cost function averages the squared residuals:`,
        },
        { type: 'math', tex: r`\boxed{\;J(\boldsymbol\theta)=\frac{1}{2m}\sum_{i=1}^{m}\bigl(h_{\boldsymbol\theta}(x^{(i)})-y^{(i)}\bigr)^2\;}` },
        { type: 'heading', text: 'Why square the error?' },
        {
          type: 'list',
          items: [
            r`**Sign removal.** Squaring makes positive and negative errors both count as "bad" and stops them cancelling.`,
            r`**Smoothness.** $(\cdot)^2$ is differentiable everywhere, unlike $|\cdot|$, so we can use calculus and gradient descent.`,
            r`**Penalizing large errors.** Big mistakes are penalized disproportionately, discouraging gross outliers.`,
            r`**Statistical justification.** Under Gaussian noise, minimizing squared error is exactly maximum-likelihood estimation.`,
          ],
        },
        {
          type: 'note',
          variant: 'info',
          title: 'Why divide by m (and by 2)?',
          text: r`Dividing by $m$ turns the *sum* of squared errors into a *mean*, so the cost — and a good learning rate — transfer across datasets of different sizes. The extra $\tfrac12$ is a convenience: differentiating the square brings down a factor of $2$ that cancels it, giving a cleaner gradient. Neither constant moves the minimizer: $\argmin_{\boldsymbol\theta}\tfrac{1}{2m}\sum_i(\cdot)^2 = \argmin_{\boldsymbol\theta}\sum_i(\cdot)^2.$`,
        },
        { type: 'heading', text: 'Convexity of the cost' },
        {
          type: 'p',
          text: r`As a function of $\boldsymbol\theta$, $J$ is a sum of squares of *affine* functions — a quadratic form. Its Hessian is $\nabla^2 J(\boldsymbol\theta)=\frac1m\mathbf{X}^\top\mathbf{X}$, which is positive semi-definite because $\mathbf{v}^\top\mathbf{X}^\top\mathbf{X}\mathbf{v}=\lVert\mathbf{X}\mathbf{v}\rVert^2\ge 0$ for every $\mathbf{v}$. So $J$ is **convex**: any stationary point is a *global* minimum with no spurious local minima. If $\mathbf{X}$ has full column rank the Hessian is positive definite and the minimizer is unique.`,
        },
        {
          type: 'note',
          variant: 'intuition',
          title: 'The cost is a bowl',
          text: r`Picture $J(\theta_0,\theta_1)$ as a convex paraboloid — a bowl — sitting over parameter space. Every optimisation method in this lesson is just a different way of reaching the single lowest point of that bowl.`,
        },

        // ---------------------------------------------------------------
        { type: 'heading', text: 'Closed form — simple linear regression' },
        {
          type: 'p',
          text: r`For one feature we can solve for $\theta_0,\theta_1$ exactly. Minimize the sum of squared errors $S(\theta_0,\theta_1)=\sum_i\bigl(y_i-\theta_0-\theta_1 x_i\bigr)^2$ (this is $2mJ$; the constant does not move the minimizer). At a minimum both partial derivatives vanish:`,
        },
        { type: 'math', tex: r`\frac{\partial S}{\partial\theta_0}=-2\sum_i\bigl(y_i-\theta_0-\theta_1 x_i\bigr)=0, \qquad \frac{\partial S}{\partial\theta_1}=-2\sum_i x_i\bigl(y_i-\theta_0-\theta_1 x_i\bigr)=0` },
        {
          type: 'p',
          text: r`Dividing by $-2$ gives the **two normal equations** for simple linear regression:`,
        },
        { type: 'math', tex: r`\sum_i y_i = m\,\theta_0+\theta_1\sum_i x_i, \qquad \sum_i x_i y_i = \theta_0\sum_i x_i+\theta_1\sum_i x_i^2` },
        {
          type: 'p',
          text: r`The first, divided by $m$, gives $\bar y=\theta_0+\theta_1\bar x$, so the fitted line always passes through the centroid $(\bar x,\bar y)$:`,
        },
        { type: 'math', tex: r`\boxed{\;\theta_0=\bar y-\theta_1\bar x\;}` },
        {
          type: 'p',
          text: r`Substituting back and using the identities $\sum_i x_i y_i-\bar y\sum_i x_i=\sum_i(x_i-\bar x)(y_i-\bar y)$ and $\sum_i x_i^2-\bar x\sum_i x_i=\sum_i(x_i-\bar x)^2$ yields the standard slope formula:`,
        },
        { type: 'math', tex: r`\boxed{\;\theta_1=\frac{\sum_i(x_i-\bar x)(y_i-\bar y)}{\sum_i(x_i-\bar x)^2}=\frac{S_{xy}}{S_{xx}}\;}` },
        {
          type: 'note',
          variant: 'tip',
          title: 'Slope = covariance ÷ variance = r · σ_y/σ_x',
          text: r`Dividing top and bottom of the slope by $m$ turns the sums into statistics: $\theta_1=\dfrac{\mathrm{Cov}(x,y)}{\mathrm{Var}(x)}$. And since $r=\dfrac{\mathrm{Cov}(x,y)}{\sigma_x\sigma_y}$, we get $\theta_1=r\,\dfrac{\sigma_y}{\sigma_x}$ — the slope is the correlation coefficient scaled by the ratio of standard deviations.`,
        },

        // ---------------------------------------------------------------
        { type: 'heading', text: 'Matrix formulation (any number of features)' },
        {
          type: 'p',
          text: r`Stack the examples as rows and prepend a column of ones (for the intercept) to form the **design matrix** $\mathbf{X}\in\mathbb{R}^{m\times(n+1)}$, and collect the targets into $\mathbf{y}$. Then all $m$ predictions at once are a single matrix–vector product:`,
        },
        { type: 'math', tex: r`\hat{\mathbf{y}}=\mathbf{X}\boldsymbol\theta, \qquad \mathbf{X}=\begin{bmatrix}1&x^{(1)}_1&\cdots&x^{(1)}_n\\ \vdots&\vdots&&\vdots\\ 1&x^{(m)}_1&\cdots&x^{(m)}_n\end{bmatrix}` },
        {
          type: 'p',
          text: r`The **residual vector** $\mathbf{r}=\mathbf{X}\boldsymbol\theta-\mathbf{y}$ collects all errors, and the sum of squared errors is exactly its dot product with itself, $\mathbf{r}^\top\mathbf{r}=\sum_i e_i^2$. So the cost in matrix form is`,
        },
        { type: 'math', tex: r`\boxed{\;J(\boldsymbol\theta)=\frac{1}{2m}(\mathbf{X}\boldsymbol\theta-\mathbf{y})^\top(\mathbf{X}\boldsymbol\theta-\mathbf{y})\;}` },
        { type: 'heading', text: 'Deriving the normal equation' },
        {
          type: 'p',
          text: r`Dropping the constant $\tfrac1m$, expand $2J=\boldsymbol\theta^\top\mathbf{X}^\top\mathbf{X}\boldsymbol\theta-2\,\boldsymbol\theta^\top\mathbf{X}^\top\mathbf{y}+\mathbf{y}^\top\mathbf{y}$ (the two cross terms are equal $1\times1$ scalars). Using the vector-calculus rules $\frac{\partial}{\partial\boldsymbol\theta}(\boldsymbol\theta^\top\mathbf{b})=\mathbf{b}$ and $\frac{\partial}{\partial\boldsymbol\theta}(\boldsymbol\theta^\top\mathbf{A}\boldsymbol\theta)=2\mathbf{A}\boldsymbol\theta$ for symmetric $\mathbf{A}=\mathbf{X}^\top\mathbf{X}$, the gradient is $2\mathbf{X}^\top\mathbf{X}\boldsymbol\theta-2\mathbf{X}^\top\mathbf{y}$. Setting it to zero gives the celebrated **normal equation**:`,
        },
        { type: 'math', tex: r`\mathbf{X}^\top\mathbf{X}\,\boldsymbol\theta = \mathbf{X}^\top\mathbf{y} \;\;\Longrightarrow\;\; \boxed{\;\boldsymbol\theta=(\mathbf{X}^\top\mathbf{X})^{-1}\mathbf{X}^\top\mathbf{y}\;}` },
        {
          type: 'note',
          variant: 'info',
          title: 'It reproduces the scalar equations',
          text: r`For the single-feature design matrix, $\mathbf{X}^\top\mathbf{X}=\begin{bmatrix}m&\sum x_i\\ \sum x_i&\sum x_i^2\end{bmatrix}$ and $\mathbf{X}^\top\mathbf{y}=\begin{bmatrix}\sum y_i\\ \sum x_i y_i\end{bmatrix}$ — exactly the two normal equations derived above. Because $J$ is convex, this stationary point is the unique global minimizer.`,
        },

        // ---------------------------------------------------------------
        { type: 'heading', text: 'Gradient descent' },
        {
          type: 'p',
          text: r`The closed form needs the inverse of the $(n+1)\times(n+1)$ matrix $\mathbf{X}^\top\mathbf{X}$, which costs $\mathcal{O}(n^3)$ and holds the whole matrix in memory. When $n$ or $m$ is very large that is impractical. **Gradient descent** avoids the inverse by repeatedly stepping downhill on the cost bowl.`,
        },
        { type: 'math', tex: r`\frac{\partial J}{\partial\theta_0}=\frac1m\sum_{i}\bigl(h_{\boldsymbol\theta}(x^{(i)})-y^{(i)}\bigr), \qquad \frac{\partial J}{\partial\theta_1}=\frac1m\sum_{i}\bigl(h_{\boldsymbol\theta}(x^{(i)})-y^{(i)}\bigr)x^{(i)}` },
        {
          type: 'p',
          text: r`In compact vector form $\nabla J(\boldsymbol\theta)=\frac1m\mathbf{X}^\top(\mathbf{X}\boldsymbol\theta-\mathbf{y})$. Repeat until convergence, updating **all parameters simultaneously**:`,
        },
        { type: 'math', tex: r`\boxed{\;\theta_j := \theta_j-\alpha\,\frac1m\sum_{i}\bigl(h_{\boldsymbol\theta}(x^{(i)})-y^{(i)}\bigr)x^{(i)}_j\;}` },
        {
          type: 'diagram',
          kind: 'gradient-descent',
          caption: 'Gradient descent steps opposite the gradient, sliding down the convex cost surface to its global minimum.',
        },
        {
          type: 'list',
          items: [
            r`The scalar $\alpha>0$ is the **learning rate**. Too **small** → very slow convergence; too **large** → the updates overshoot and $J$ oscillates or diverges.`,
            r`A good check is to plot $J$ versus iteration — it should fall smoothly and monotonically.`,
            r`**Feature scaling** (standardizing each feature to zero mean, unit variance) makes the bowl more circular and dramatically speeds convergence.`,
            r`Because $J$ is convex, gradient descent with a small enough $\alpha$ is guaranteed to reach the **same** global optimum as the normal equation.`,
          ],
        },

        // ---------------------------------------------------------------
        { type: 'heading', text: 'Worked example — closed form' },
        {
          type: 'example',
          title: 'Fit a line by hand (house-price data)',
          problem: r`A tiny house-price dataset has size $x$ (thousands of sq ft) and price $y$: $(1,1),(2,3),(3,2),(4,5),(5,4)$, with $m=5$. Fit $\hat y=\theta_0+\theta_1 x$ by least squares, then report the SSE and $R^2$.`,
          solution: [
            { type: 'p', text: r`**Step 1 — means.** $\bar x=\frac{1+2+3+4+5}{5}=3$, $\;\bar y=\frac{1+3+2+5+4}{5}=3$.` },
            { type: 'p', text: r`**Step 2 — deviations, covariance and variance.**` },
            {
              type: 'table',
              headers: ['xᵢ', 'yᵢ', 'xᵢ−x̄', 'yᵢ−ȳ', '(xᵢ−x̄)(yᵢ−ȳ)', '(xᵢ−x̄)²'],
              rows: [
                ['1', '1', '−2', '−2', '4', '4'],
                ['2', '3', '−1', '0', '0', '1'],
                ['3', '2', '0', '−1', '0', '0'],
                ['4', '5', '1', '2', '2', '1'],
                ['5', '4', '2', '1', '2', '4'],
                ['', '', '', 'Σ', 'Sₓᵧ = 8', 'Sₓₓ = 10'],
              ],
            },
            { type: 'p', text: r`Also $S_{yy}=\sum(y_i-\bar y)^2=4+0+1+4+1=10$, so $\mathrm{Cov}(x,y)=\frac{8}{5}=1.6$ and $\mathrm{Var}(x)=\frac{10}{5}=2$.` },
            { type: 'p', text: r`**Step 3 — slope and intercept.** $\theta_1=\dfrac{S_{xy}}{S_{xx}}=\dfrac{8}{10}=0.8=\dfrac{\mathrm{Cov}(x,y)}{\mathrm{Var}(x)}=\dfrac{1.6}{2}.$ Cross-check via correlation: $r=\dfrac{8}{\sqrt{10\cdot 10}}=0.8$, so $\theta_1=r\dfrac{\sigma_y}{\sigma_x}=0.8\cdot 1=0.8.$ Then $\theta_0=\bar y-\theta_1\bar x=3-0.8\times 3=0.6.$` },
            { type: 'p', text: r`**Step 4 — the fitted model and residuals.** $\hat y=0.6+0.8x$:` },
            {
              type: 'table',
              headers: ['xᵢ', 'ŷᵢ = 0.6+0.8xᵢ', 'eᵢ = yᵢ−ŷᵢ', 'eᵢ²'],
              rows: [
                ['1', '1.4', '−0.4', '0.16'],
                ['2', '2.2', '0.8', '0.64'],
                ['3', '3.0', '−1.0', '1.00'],
                ['4', '3.8', '1.2', '1.44'],
                ['5', '4.6', '−0.6', '0.36'],
                ['', '', 'Σeᵢ = 0', 'SSE = 3.60'],
              ],
            },
            { type: 'p', text: r`The residuals sum to zero — a general property of the least-squares fit (the first normal equation). The coefficient of determination is $R^2=1-\dfrac{\text{SSE}}{S_{yy}}=1-\dfrac{3.6}{10}=0.64=r^2$, confirming $R^2=r^2$ for simple linear regression.` },
          ],
          answer: 'ŷ = 0.6 + 0.8x, SSE = 3.6, R² = 0.64',
        },

        // ---------------------------------------------------------------
        { type: 'heading', text: 'Worked example — gradient descent' },
        {
          type: 'p',
          text: r`Now fit the **same** dataset iteratively so we can watch it approach the exact answer $(\theta_0,\theta_1)=(0.6,0.8)$. Start at $\theta_0=\theta_1=0$ with learning rate $\alpha=0.1$. Each iteration computes the cost $J=\frac{\sum e_i^2}{10}$ and gradients $g_0=\frac{\sum e_i}{5}$, $g_1=\frac{\sum e_i x_i}{5}$ (with $e_i=\hat y_i-y_i$), then updates $\theta_j:=\theta_j-\alpha g_j$.`,
        },
        {
          type: 'table',
          headers: ['Iter', 'θ₀', 'θ₁', 'J', 'g₀', 'g₁', 'θ₀ next', 'θ₁ next'],
          rows: [
            ['0', '0.0000', '0.0000', '5.5000', '−3.0000', '−10.6000', '0.3000', '1.0600'],
            ['1', '0.3000', '1.0600', '0.5428', '0.4800', '1.9600', '0.2520', '0.8640'],
            ['2', '0.2520', '0.8640', '0.3763', '−0.1560', '−0.3400', '0.2676', '0.8980'],
            ['3', '0.2676', '0.8980', '0.3703', '−0.0384', '0.0808', '0.2714', '0.8899'],
            ['4', '0.2714', '0.8899', '0.3698', '−0.0588', '0.0034', '0.2773', '0.8896'],
          ],
          caption: 'Batch gradient descent, α = 0.1. Reading top to bottom reproduces the whole optimisation by hand.',
        },
        {
          type: 'example',
          title: 'Read one iteration (iteration 0)',
          problem: r`With $\theta_0=\theta_1=0$, verify the cost, both gradients and the first update by hand.`,
          solution: [
            { type: 'p', text: r`All parameters start at zero, so every prediction $\hat y_i=0$ and each error is $e_i=\hat y_i-y_i=-y_i$: $\;(-1,-3,-2,-5,-4)$.` },
            { type: 'p', text: r`**Cost.** $\sum e_i^2=1+9+4+25+16=55$, so $J=\frac{55}{10}=5.5.$` },
            { type: 'p', text: r`**Gradients.** $g_0=\frac{\sum e_i}{5}=\frac{-15}{5}=-3.$ For $g_1$, $\sum e_i x_i=-1-6-6-20-20=-53$, so $g_1=\frac{-53}{5}=-10.6.$` },
            { type: 'p', text: r`**Update.** $\theta_0=0-0.1(-3)=0.3$ and $\theta_1=0-0.1(-10.6)=1.06$ — exactly the values heading iteration 1.` },
          ],
          answer: 'J = 5.5, g₀ = −3, g₁ = −10.6 → θ = (0.3, 1.06)',
        },
        {
          type: 'note',
          variant: 'intuition',
          title: 'Why the intercept lags',
          text: r`In one step the cost collapses from $5.5$ to $0.54$ and the slope $\theta_1$ locks onto $\approx 0.89$ within a few iterations, but the intercept $\theta_0$ drifts only slowly toward $0.6$. That is the classic symptom of **unscaled features**: because $x$ ranges over $1$–$5$ the cost bowl is elongated and gradient descent zig-zags. Standardizing $x$ first lets both parameters converge together. Given enough iterations the trajectory reaches the closed-form optimum $(0.6, 0.8)$ with minimum cost $J=\frac{3.6}{10}=0.36$.`,
        },

        // ---------------------------------------------------------------
        { type: 'heading', text: 'In code' },
        {
          type: 'code',
          language: 'python',
          caption: 'Closed form and gradient descent with NumPy.',
          code: `import numpy as np

# ----- Data -----
x = np.array([1, 2, 3, 4, 5], dtype=float)
y = np.array([1, 3, 2, 5, 4], dtype=float)
m = len(y)
X = np.column_stack([np.ones(m), x])          # design matrix with intercept column

# ----- 1) Closed form (normal equation) -----
theta_cf = np.linalg.solve(X.T @ X, X.T @ y)  # stable, avoids explicit inverse
print(f"Closed form:  theta0={theta_cf[0]:.4f}, theta1={theta_cf[1]:.4f}")  # 0.6000, 0.8000

# ----- 2) Gradient descent -----
theta = np.zeros(2)
alpha, iters = 0.1, 50
for _ in range(iters):
    err  = X @ theta - y                      # residual vector
    grad = (X.T @ err) / m                    # gradient
    theta -= alpha * grad                     # simultaneous update
print(f"Grad descent: theta0={theta[0]:.4f}, theta1={theta[1]:.4f}")`,
        },
        {
          type: 'code',
          language: 'python',
          caption: 'The same fit in three lines with scikit-learn.',
          code: `from sklearn.linear_model import LinearRegression
import numpy as np

x = np.array([1, 2, 3, 4, 5]).reshape(-1, 1)   # column of features
y = np.array([1, 3, 2, 5, 4])

model = LinearRegression().fit(x, y)
print("intercept theta0 =", model.intercept_)  # ~0.6
print("slope     theta1 =", model.coef_[0])     # ~0.8
print("R^2 =", model.score(x, y))               # 0.64`,
        },

        // ---------------------------------------------------------------
        { type: 'heading', text: 'Closed form vs gradient descent' },
        {
          type: 'table',
          headers: ['Closed form (normal equation)', 'Gradient descent'],
          rows: [
            ['Exact solution in one shot', 'Iterative approximation'],
            ['No learning rate to tune', 'Must choose a learning rate α'],
            ['Needs the inverse (XᵀX)⁻¹', 'No matrix inversion needed'],
            ['Cost O(n³) in the number of features', 'Cost O(k·mn) for k iterations; scales well'],
            ['Ideal for small feature sets', 'Suitable for very large / streaming data'],
            ['Fails if XᵀX is singular', 'Still works via variants and regularization'],
          ],
          caption: 'Rule of thumb: use the normal equation when features are few (n ≲ 10⁴); switch to (stochastic) gradient descent for high-dimensional or streaming data.',
        },

        // ---------------------------------------------------------------
        { type: 'heading', text: 'Assumptions & applications' },
        {
          type: 'note',
          variant: 'warning',
          title: 'Assumptions of ordinary least squares',
          text: r`**Linearity** — $\mathbb{E}[y]$ is linear in the parameters. **Independence** — the errors are independent. **Homoscedasticity** — errors have constant variance. **Normality** — for inference, errors are approximately normal with zero mean. **No perfect multicollinearity** — $\mathbf{X}$ has full column rank, so $\mathbf{X}^\top\mathbf{X}$ is invertible. Squared error is sensitive to outliers; a robust loss (e.g. Huber) resists them.`,
        },
        {
          type: 'list',
          items: [
            r`Predicting house prices from size, location and number of rooms.`,
            r`Forecasting sales or demand from advertising spend.`,
            r`Estimating expenditure from income.`,
            r`Modelling temperature vs energy consumption.`,
            r`Calibrating sensors (mapping raw readings to physical quantities).`,
          ],
        },

        // ---------------------------------------------------------------
        { type: 'heading', text: 'Practice' },
        {
          type: 'example',
          title: 'Effect of an outlier',
          problem: r`Take the dataset above but change $y_4$ from $5$ to $50$. Qualitatively, what happens to the slope?`,
          solution: [
            { type: 'p', text: r`The point $(4,50)$ has a huge positive deviation $y_4-\bar y$, injecting a large positive term into $S_{xy}$ and pulling the slope sharply upward. Squared-error loss is highly sensitive to outliers — a robust loss such as Huber would resist this.` },
          ],
          answer: 'The slope is pulled sharply up; OLS is not robust to outliers.',
        },
        {
          type: 'example',
          title: 'Another fit by hand',
          problem: r`Fit $\hat y=\theta_0+\theta_1 x$ to the points $(1,2),(2,3),(3,5),(4,4),(5,6)$, then predict $\hat y$ at $x=6$.`,
          solution: [
            { type: 'p', text: r`**Step 1 — means.** $\bar x=\dfrac{1+2+3+4+5}{5}=3$, $\;\bar y=\dfrac{2+3+5+4+6}{5}=4$.` },
            { type: 'p', text: r`**Step 2 — deviations and products.**` },
            {
              type: 'table',
              headers: ['xᵢ', 'yᵢ', 'xᵢ−x̄', 'yᵢ−ȳ', '(xᵢ−x̄)(yᵢ−ȳ)', '(xᵢ−x̄)²'],
              rows: [
                ['1', '2', '−2', '−2', '4', '4'],
                ['2', '3', '−1', '−1', '1', '1'],
                ['3', '5', '0', '1', '0', '0'],
                ['4', '4', '1', '0', '0', '1'],
                ['5', '6', '2', '2', '4', '4'],
                ['', '', '', 'Σ', 'Sₓᵧ = 9', 'Sₓₓ = 10'],
              ],
            },
            { type: 'p', text: r`**Step 3 — slope and intercept.** $\theta_1=\dfrac{S_{xy}}{S_{xx}}=\dfrac{9}{10}=0.9$ and $\theta_0=\bar y-\theta_1\bar x=4-0.9\times 3=1.3$.` },
            { type: 'p', text: r`**Step 4 — model and prediction.** $\hat y=1.3+0.9x$; at $x=6$, $\hat y=1.3+5.4=6.7$.` },
          ],
          answer: 'ŷ = 1.3 + 0.9x, prediction at x=6 is 6.7',
        },
        {
          type: 'list',
          ordered: true,
          items: [
            r`**Manual fit.** Fit $\hat y=\theta_0+\theta_1 x$ to $x=(2,4,6,8)$, $y=(3,7,5,10)$ using the covariance/variance formulas; report $\theta_0,\theta_1$ and $R^2$.`,
            r`**Prediction.** Using $\hat y=0.6+0.8x$, predict the price for size $x=6$ and give one reason such extrapolation may be unreliable.`,
            r`**Learning rate.** Run gradient descent with $\alpha\in\{0.01,0.1,0.4\}$; for which value does the cost diverge, and why?`,
            r`**Feature scaling.** Standardize $x$ to zero mean, unit variance, re-run five iterations, and compare how fast $\theta_0$ and $\theta_1$ converge against the unscaled case.`,
            r`**Ridge regression.** Modify the normal equation to $\boldsymbol\theta=(\mathbf{X}^\top\mathbf{X}+\lambda\mathbf{I})^{-1}\mathbf{X}^\top\mathbf{y}$ (do not penalize the intercept) and study the effect of $\lambda$ on the fitted slope.`,
          ],
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
          type: 'diagram',
          kind: 'sigmoid',
          caption: 'The sigmoid squashes any real score z into a probability in (0, 1).',
        },
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
        'A complete treatment: lazy instance-based learning, distance measures, the algorithm and decision rules, distance weighting, choosing k, variants, and five worked-by-hand examples (classification, feature scaling, multi-class and regression).',
      objectives: [
        'Explain why k-NN is a lazy, instance-based, non-parametric learner',
        'Use Euclidean, Manhattan, Minkowski, Hamming and cosine measures',
        'Apply the majority-vote and mean decision rules, and distance weighting',
        'Choose k via the bias–variance trade-off',
        'Work classification, feature-scaling and regression examples entirely by hand',
      ],
      blocks: [
        // ---- Background ----
        { type: 'heading', text: 'Background: where k-NN fits' },
        {
          type: 'p',
          text: r`**k-Nearest Neighbours (k-NN)** is a **supervised** algorithm — it needs labelled training data $\mathbf{x}=(x_1,\dots,x_n)\to y$. For **classification** $y$ is a discrete label (e.g. Pass/Fail); for **regression** $y$ is a real number (e.g. a house price). k-NN handles both, changing only the final aggregation step.`,
        },
        {
          type: 'note',
          variant: 'intuition',
          title: 'A lazy, instance-based learner',
          text: r`Most algorithms (linear/logistic regression, trees, neural networks) learn a model at training time and discard the data — they are **eager**. Basic k-NN builds **no model**: it simply stores the labelled examples and does all the work — distances, neighbour search, voting — only when a new point must be classified. Hence *lazy* (or *instance-based* / *memory-based*): $\text{new point} \to \text{distances} \to k\ \text{nearest} \to \text{vote / average} \to \text{prediction}$.`,
        },
        {
          type: 'p',
          text: r`**Applications:** recommendation systems, handwritten-digit and image recognition, medical diagnosis from patient measurements, credit scoring and anomaly detection, and nearest-neighbour imputation of missing values.`,
        },

        // ---- Distance measures ----
        { type: 'heading', text: 'Distance & similarity measures' },
        {
          type: 'p',
          text: r`k-NN is built entirely on a notion of "closeness". Let $\mathbf{x}=(x_1,\dots,x_n)$ and $\mathbf{y}=(y_1,\dots,y_n)$ be two observations.`,
        },
        { type: 'math', tex: r`\text{Euclidean }(L_2):\quad d(\mathbf{x},\mathbf{y}) = \sqrt{\sum_{k=1}^{n}(x_k-y_k)^2}`, caption: 'The straight-line distance; the default for numerical features.' },
        { type: 'math', tex: r`\text{Manhattan }(L_1):\quad d(\mathbf{x},\mathbf{y}) = \sum_{k=1}^{n}|x_k-y_k|` },
        { type: 'math', tex: r`\text{Minkowski }(L_p):\quad d(\mathbf{x},\mathbf{y}) = \Big(\sum_{k=1}^{n}|x_k-y_k|^p\Big)^{1/p}`, caption: 'Manhattan at p = 1, Euclidean at p = 2.' },
        {
          type: 'list',
          items: [
            r`**Hamming distance** — for categorical features, the number of positions at which $\mathbf{x}$ and $\mathbf{y}$ differ (binary/string data).`,
            r`**Cosine dissimilarity** — $d(\mathbf{x},\mathbf{y}) = 1 - \dfrac{\mathbf{x}^\top\mathbf{y}}{\lVert\mathbf{x}\rVert\,\lVert\mathbf{y}\rVert}$; measures angle rather than magnitude (common for text).`,
          ],
        },
        {
          type: 'note',
          variant: 'warning',
          title: 'Why feature scaling matters',
          text: r`Euclidean distance is dominated by features with a large numerical range. If "hours studied" ranges 1–6 but "attendance" ranges 50–80, then in $\sqrt{(\Delta\text{hours})^2+(\Delta\text{attendance})^2}$ the attendance term dwarfs hours — k-NN would effectively ignore hours. Scale first: **z-score** $z=\frac{x-\mu}{\sigma}$ (mean 0, variance 1) or **min–max** $x'=\frac{x-x_{\min}}{x_{\max}-x_{\min}}\in[0,1]$.`,
        },

        // ---- Algorithm ----
        { type: 'heading', text: 'The k-NN algorithm' },
        {
          type: 'steps',
          items: [
            r`Choose the number of neighbours $k$ and a distance metric.`,
            r`For a query point $\mathbf{x}_q$, compute the distance to **every** training point.`,
            r`Sort the distances and select the $k$ nearest points $N_k(\mathbf{x}_q)$.`,
            r`**Classification:** predict the majority class among $N_k$. **Regression:** predict the average target.`,
          ],
        },
        {
          type: 'diagram',
          kind: 'knn',
          caption: 'k-NN with k = 3: the query is classified by majority vote of its 3 nearest points.',
        },
        { type: 'heading', text: 'The decision rule' },
        { type: 'math', tex: r`\text{Classification: }\ \hat y = \operatorname{mode}\{\,y_i : i\in N_k(\mathbf{x}_q)\,\} = \arg\max_{c}\sum_{i\in N_k(\mathbf{x}_q)}\mathbb{1}(y_i=c)`, caption: '𝟙(·) is 1 when true, 0 otherwise.' },
        { type: 'math', tex: r`\text{Regression: }\ \hat y = \frac{1}{k}\sum_{i\in N_k(\mathbf{x}_q)} y_i` },
        { type: 'heading', text: 'Distance-weighted k-NN' },
        {
          type: 'p',
          text: r`Closer neighbours are usually more relevant, so weight each vote by $w_i = 1/d_i^2$ (or $1/d_i$). Weighting also breaks ties naturally.`,
        },
        { type: 'math', tex: r`\hat y_{\text{class}} = \arg\max_{c}\!\!\sum_{i\in N_k,\,y_i=c}\!\! w_i, \qquad \hat y_{\text{reg}} = \frac{\sum_{i\in N_k} w_i\,y_i}{\sum_{i\in N_k} w_i}` },
        {
          type: 'note',
          variant: 'tip',
          title: 'Choosing k (bias–variance trade-off)',
          text: r`**Small $k$** (e.g. $k=1$): very flexible, low bias, **high variance** — sensitive to noise and outliers. **Large $k$**: smoother boundary, **high bias, low variance** — may blur real structure. A common rule of thumb is $k\approx\sqrt{m}$ (with $m$ training points), tuned by cross-validation; for binary problems pick an **odd** $k$ to avoid tied votes.`,
        },
        {
          type: 'p',
          text: r`**Decision boundary & complexity.** k-NN induces a piecewise-linear boundary (for $k=1$, the boundaries of the Voronoi cells of the training points). It has **no training cost**, but each brute-force query costs $O(mn)$ — slow for large $m$.`,
        },

        // ---- Variants ----
        { type: 'heading', text: 'Types & variants' },
        {
          type: 'table',
          headers: ['Neighbour search', 'Idea and cost'],
          rows: [
            ['Brute force', 'Compare the query to all m points; O(mn) per query. Exact, fine for small data.'],
            ['k-d tree', 'Binary space partition on feature axes; ~O(log m) per query in low dimensions.'],
            ['Ball tree', 'Nested hyperspheres; better than k-d trees in higher dimensions.'],
          ],
          caption: 'All three return the same neighbours — they differ only in speed. In very high dimensions the "curse of dimensionality" makes points nearly equidistant and trees degrade toward brute force.',
        },
        {
          type: 'p',
          text: r`By task/weighting: **k-NN classification** (majority vote), **k-NN regression** (neighbour average), **distance-weighted k-NN** ($1/d^2$), and **radius-neighbours** (all points within a fixed radius $r$, good for varying density).`,
        },

        // ---- Example 1: binary classification ----
        {
          type: 'example',
          title: 'Example 1 — Binary classification by hand',
          problem: r`Predict whether a student **Passes** or **Fails** from $x_1=$ hours studied and $x_2=$ attendance (%). New student $X=(4,68)$, $k=3$, Euclidean distance.`,
          solution: [
            {
              type: 'table',
              headers: ['Student', 'Hours', 'Attendance', 'Class', 'd(X, Sⱼ)'],
              rows: [
                ['S1', '1', '50', 'Fail', '18.25'],
                ['S2', '2', '55', 'Fail', '13.15'],
                ['S3', '2', '60', 'Fail', '8.25'],
                ['S4', '3', '60', 'Fail', '8.06'],
                ['S5', '3', '65', 'Pass', '3.16'],
                ['S6', '4', '65', 'Pass', '3.00'],
                ['S7', '4', '70', 'Pass', '2.00'],
                ['S8', '5', '70', 'Pass', '2.24'],
                ['S9', '5', '75', 'Pass', '7.07'],
                ['S10', '6', '80', 'Pass', '12.17'],
              ],
            },
            { type: 'p', text: r`Each distance is $d(X,S_j)=\sqrt{(4-h_j)^2+(68-a_j)^2}$. e.g. $d(X,S7)=\sqrt{(4-4)^2+(68-70)^2}=\sqrt{4}=2.00$.` },
            { type: 'p', text: r`**Nearest 3:** the smallest distances are $2.00\,(S7),\ 2.24\,(S8),\ 3.00\,(S6)$ — all **Pass**.` },
            { type: 'p', text: r`**Vote:** $N(\text{Pass})=3,\ N(\text{Fail})=0 \Rightarrow \hat y = \textbf{Pass}$.` },
            {
              type: 'table',
              headers: ['k', 'Neighbours', 'Prediction'],
              rows: [
                ['1', 'S7', 'Pass'],
                ['3', 'S7, S8, S6', 'Pass'],
                ['5', 'S7, S8, S6, S5, S9', 'Pass'],
                ['7', 'S7, S8, S6, S5, S9, S4, S3', 'Pass (5 vs 2)'],
              ],
              caption: 'Effect of k — stable here because the classes are cleanly separated.',
            },
          ],
          answer: 'ŷ = Pass',
        },

        // ---- Example 2: z-score scaling ----
        {
          type: 'example',
          title: 'Example 2 — Feature scaling (z-score)',
          problem: r`Re-do Example 1 after **standardizing** both features with $z=\frac{x-\mu}{\sigma}$. Does scaling change the neighbour set?`,
          solution: [
            { type: 'p', text: r`**Statistics over the 10 students:** $\bar h=3.5,\ \sigma_h=1.5$; $\ \bar a=65,\ \sigma_a\approx 8.66$.` },
            { type: 'p', text: r`**Query** $X=(4,68)$ standardizes to $z_1=\frac{4-3.5}{1.5}=0.333,\ z_2=\frac{68-65}{8.66}=0.346$.` },
            {
              type: 'table',
              headers: ['Student', 'Class', 'Raw d', 'Scaled d'],
              rows: [
                ['S1', 'Fail', '18.25', '2.88'],
                ['S2', 'Fail', '13.15', '2.01'],
                ['S3', 'Fail', '8.25', '1.62'],
                ['S4', 'Fail', '8.06', '1.14'],
                ['S5', 'Pass', '3.16', '0.75'],
                ['S6', 'Pass', '3.00', '0.35'],
                ['S7', 'Pass', '2.00', '0.23'],
                ['S8', 'Pass', '2.24', '0.71'],
                ['S9', 'Pass', '7.07', '1.05'],
                ['S10', 'Pass', '12.17', '1.92'],
              ],
            },
            { type: 'p', text: r`**Nearest 3 (scaled):** $S7\,(0.23),\ S6\,(0.35),\ S8\,(0.71)$ — all Pass $\Rightarrow \hat y=\textbf{Pass}$.` },
            { type: 'p', text: r`Under raw distances the order was $\{S7,S8,S6\}$; after scaling $S6$ and $S8$ **swap** because standardization restored the influence of "hours". Here the class is unchanged, but on many datasets scaling changes the neighbour set — **always scale in practice**.` },
          ],
          answer: 'ŷ = Pass; neighbour order changes (S6 ↔ S8)',
        },

        // ---- Example 3: min-max ----
        {
          type: 'example',
          title: 'Example 3 — Min–max normalization',
          problem: r`Rescale instead with min–max $x'=\frac{x-x_{\min}}{x_{\max}-x_{\min}}\in[0,1]$ and re-classify $X=(4,68)$, $k=3$.`,
          solution: [
            { type: 'p', text: r`**Ranges:** $h'=\frac{h-1}{5},\ a'=\frac{a-50}{30}$, so the query becomes $X'=(0.6,\,0.6)$ since $\frac{4-1}{5}=0.6$ and $\frac{68-50}{30}=0.6$.` },
            {
              type: 'table',
              headers: ['Student', 'Class', 'Normalized d'],
              rows: [
                ['S7', 'Pass', '0.07'],
                ['S6', 'Pass', '0.10'],
                ['S8', 'Pass', '0.21'],
                ['S5', 'Pass', '0.22'],
                ['S9', 'Pass', '0.31'],
                ['S4', 'Fail', '0.33'],
                ['S3', 'Fail', '0.48'],
                ['S10', 'Pass', '0.57'],
                ['S2', 'Fail', '0.59'],
                ['S1', 'Fail', '0.85'],
              ],
              caption: 'Sorted by normalized distance.',
            },
            { type: 'p', text: r`**Nearest 3:** $S7\,(0.07),\ S6\,(0.10),\ S8\,(0.21)$ — all Pass $\Rightarrow \hat y=\textbf{Pass}$.` },
          ],
          answer: 'ŷ = Pass — same neighbours {S7, S6, S8} as z-score',
        },
        {
          type: 'table',
          headers: ['Standardization (z-score)', 'Min–max normalization'],
          rows: [
            ['x′ = (x−μ)/σ; mean 0, variance 1', 'x′ = (x−xmin)/(xmax−xmin); range [0,1]'],
            ['Unbounded; centred on the mean', 'Bounded to [0,1]; anchored to the extremes'],
            ['More robust to outliers (uses μ, σ)', 'Sensitive to outliers (one extreme sets a bound)'],
            ['Good default for distance-based methods', 'Handy when a bounded range is needed (pixels, NN inputs)'],
          ],
          caption: 'Both fix the "attendance dominates" problem; they differ in how.',
        },

        // ---- Example 4: multi-class ----
        {
          type: 'example',
          title: 'Example 4 — Multi-class classification (k = 7)',
          problem: r`A query $P=(6,5)$ sits amid three classes A, B, C (five points each). Classify it with $k=7$, Euclidean distance. (Squared distance $d^2=(6-x)^2+(5-y)^2$ suffices to rank.)`,
          solution: [
            {
              type: 'table',
              headers: ['Rank', 'Point', 'Class', 'd² ', 'd'],
              rows: [
                ['1', '(6, 3)', 'C', '4', '2.00'],
                ['2', '(8, 5)', 'B', '4', '2.00'],
                ['3', '(7, 7)', 'B', '5', '2.24'],
                ['4', '(8, 7)', 'B', '8', '2.83'],
                ['5', '(5, 2)', 'C', '10', '3.16'],
                ['6', '(9, 6)', 'B', '10', '3.16'],
                ['7', '(3, 7)', 'A', '13', '3.61'],
              ],
              caption: 'The seven nearest of the fifteen points.',
            },
            { type: 'p', text: r`**Counts among the 7:** $N(\text{B})=4\ \{(8,5),(7,7),(8,7),(9,6)\}$, $N(\text{C})=2\ \{(6,3),(5,2)\}$, $N(\text{A})=1\ \{(3,7)\}$.` },
            { type: 'p', text: r`**Vote:** Class B has the most (4 of 7) $\Rightarrow \hat y=\textbf{Class B}$.` },
            { type: 'p', text: r`Note the single closest point is a **tie** between C$(6,3)$ and B$(8,5)$ (both $d=2$), so 1-NN is ambiguous — yet B wins decisively at $k=3$ (2–1), $k=5$ (3–2) and $k=7$ (4–2–1). Majority voting is more robust than trusting the single nearest point.` },
          ],
          answer: 'ŷ = Class B',
        },

        // ---- Example 5: regression ----
        {
          type: 'example',
          title: 'Example 5 — k-NN regression',
          problem: r`Estimate a house price (lakh) from $x_1=$ rooms and $x_2=$ age. Query $Q=(5,10)$, $k=3$.`,
          solution: [
            {
              type: 'table',
              headers: ['House', 'Rooms', 'Age', 'Price', 'd(Q, ·)'],
              rows: [
                ['H1', '5', '11', '92', '1.00'],
                ['H2', '6', '11', '88', '1.41'],
                ['H3', '5', '8', '98', '2.00'],
                ['H4', '7', '12', '80', '2.83'],
                ['H5', '2', '9', '70', '3.16'],
                ['H6', '8', '14', '74', '5.00'],
              ],
            },
            { type: 'p', text: r`**Nearest 3:** H1, H2, H3 (prices 92, 88, 98).` },
            { type: 'p', text: r`**Simple average:** $\hat y=\frac{92+88+98}{3}=\frac{278}{3}\approx 92.67$ lakh.` },
            { type: 'p', text: r`**Distance-weighted** ($w_i=1/d_i^2$): weights $1,\ 0.5,\ 0.25$ (sum $1.75$); $\ \hat y=\frac{92(1)+88(0.5)+98(0.25)}{1.75}=\frac{160.5}{1.75}\approx 91.71$ lakh — leaning toward the closest house H1, as it should.` },
            { type: 'p', text: r`**Adding a third feature (area, sq ft)** with query $Q=(5,10,1500)$: **unscaled**, $(\Delta\text{area})^2$ runs into the thousands and dominates $d^2$, so the nearest become $\{H4,H1,H2\}$ and $\hat y=\frac{80+92+88}{3}\approx 86.67$ — a change caused purely by units, not information. After **standardizing** every feature, the nearest are again $\{H1,H2,H3\}$ and $\hat y\approx 92.67$. Always scale before combining features of different ranges.` },
          ],
          answer: 'Simple ŷ ≈ 92.67 lakh, weighted ≈ 91.71 lakh',
        },

        // ---- Pros/cons ----
        { type: 'heading', text: 'Advantages & disadvantages' },
        {
          type: 'table',
          headers: ['Advantages', 'Disadvantages'],
          rows: [
            ['Simple, intuitive, no training phase', 'Slow at prediction: O(mn) per query'],
            ['Naturally handles multi-class problems', 'Stores the entire dataset (high memory)'],
            ['Non-parametric (no distribution assumptions)', 'Sensitive to feature scaling & irrelevant features'],
            ['Adapts instantly to new data (just add points)', 'Degrades in high dimensions; must choose k'],
          ],
        },

        // ---- Code ----
        { type: 'heading', text: 'k-NN in Python (scikit-learn)' },
        {
          type: 'code',
          language: 'python',
          code: r`import numpy as np
from sklearn.neighbors import KNeighborsClassifier
from sklearn.preprocessing import StandardScaler

X = np.array([[1, 50], [2, 55], [2, 60], [3, 60], [3, 65],
              [4, 65], [4, 70], [5, 70], [5, 75], [6, 80]], dtype=float)
y = np.array([0, 0, 0, 0, 1, 1, 1, 1, 1, 1])   # 0 = Fail, 1 = Pass

# scale features, then fit KNN with k = 3
scaler = StandardScaler().fit(X)
knn = KNeighborsClassifier(n_neighbors=3).fit(scaler.transform(X), y)

q = scaler.transform([[4, 68]])
print("prediction:", knn.predict(q))        # -> [1] = Pass

# distance-weighted variant:
# KNeighborsClassifier(n_neighbors=3, weights="distance")`,
          caption: 'Scale first, then fit — the same k = 3 → Pass result as the worked example.',
        },

        // ---- Exercises ----
        {
          type: 'note',
          variant: 'info',
          title: 'Practice exercises',
          text: r`(1) Recompute the 3 nearest neighbours of $X=(4,68)$ using **Manhattan** distance — does the prediction change? (2) For neighbours $S7(2.00),S8(2.24),S6(3.00)$ (Pass) and a Fail neighbour at $d=1.5$, redo the vote with $w=1/d^2$ — which class wins? (3) With $m=10$, what does $k\approx\sqrt{m}$ suggest? (4) Explain why k-NN struggles when $n$ is very large even for fixed $m$ (curse of dimensionality).`,
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
          type: 'diagram',
          kind: 'gradient-descent-3d',
          caption:
            'The negative gradient −∇f points in the direction of steepest decrease of f(x, y), so each step slides downhill toward the minimum — shown both on the surface and on the contour plot below.',
        },
        {
          type: 'diagram',
          kind: 'gradient-descent',
          caption: 'In one dimension: each update steps the parameter downhill on the loss curve toward the minimum.',
        },
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
        {
          type: 'diagram',
          kind: 'fit-trio',
          caption: 'Underfitting (too simple), a good fit, and overfitting (memorising noise).',
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
        {
          type: 'diagram',
          kind: 'bias-variance',
          caption: 'Total error is bias² + variance; the sweet spot minimises their sum.',
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
        {
          type: 'diagram',
          kind: 'confusion-matrix',
          caption: 'The confusion matrix — the four outcomes every classification metric is built from.',
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
