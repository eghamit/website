import type { Module } from './types';

const r = String.raw;

export const mlp: Module = {
  id: 'mlp',
  title: 'Multilayer Perceptron (MLP)',
  icon: '🕸️',
  description:
    'From a single artificial neuron to a full multilayer network: activation functions, forward propagation, and the complete chain-rule derivation of backpropagation — with a step-by-step worked example.',
  lessons: [
    // ================================================================
    {
      slug: 'artificial-neuron',
      title: 'The Single Artificial Neuron',
      summary:
        'The building block of every neural network: a weighted sum of inputs plus a bias, passed through a non-linear activation.',
      intro: {
        definition:
          'An artificial neuron computes a weighted sum of its inputs, adds a bias to form the net input z, and passes z through a non-linear activation φ to produce its output a = φ(z).',
        whyItMatters:
          'It is the atomic unit of every neural network; understanding one neuron precisely makes the whole multilayer network — and backpropagation — just repetition and bookkeeping.',
        whenToUse: [
          'As the foundation before assembling any neural network',
          'To see how weights, bias and activation combine into one output',
          'To connect the perceptron to the multilayer perceptron',
        ],
      },
      objectives: [
        'Write a neuron as a = φ(wᵀx + b)',
        'Distinguish the net input z from the activation a',
        'Explain why a single neuron is not enough',
      ],
      blocks: [
        { type: 'heading', text: 'One neuron, one formula' },
        {
          type: 'p',
          text: r`A single artificial neuron takes inputs $x_1,\dots,x_n$, multiplies each by a **weight** $w_k$, adds a **bias** $b$ to form the **net input** $z$, and passes it through a non-linear **activation function** $\varphi$ to produce the **output** (activation) $a$:`,
        },
        { type: 'math', tex: r`z = \sum_{k} w_k x_k + b = \mathbf{w}^\top\mathbf{x} + b, \qquad a = \varphi(z)` },
        {
          type: 'diagram',
          kind: 'neuron',
          caption: 'The neuron: weighted sum of inputs + bias → net input z → activation a = φ(z).',
        },
        {
          type: 'table',
          headers: ['Symbol', 'Name', 'Role'],
          rows: [
            ['xₖ', 'Input', 'A feature fed to the neuron'],
            ['wₖ', 'Weight', 'Importance of that input (learned)'],
            ['b', 'Bias', 'A learned offset / threshold'],
            ['z', 'Net input (pre-activation)', 'Weighted sum + bias'],
            ['φ', 'Activation function', 'Adds non-linearity'],
            ['a', 'Activation (output)', 'a = φ(z), sent onward'],
          ],
        },
        {
          type: 'note',
          variant: 'intuition',
          title: 'Weighted sum, then a squash',
          text: r`Think of $z$ as the neuron "adding up the evidence" (each input scaled by how much it trusts it, plus a baseline bias), and $\varphi$ as deciding **how strongly to fire** given that evidence.`,
        },
        { type: 'heading', text: 'Why one neuron is not enough' },
        {
          type: 'p',
          text: r`A single neuron with a step or sigmoid activation is just a **linear classifier** — its decision boundary $\mathbf{w}^\top\mathbf{x}+b=0$ is a straight line/hyperplane. It cannot solve problems that are not linearly separable, the classic example being **XOR**.`,
        },
        {
          type: 'note',
          variant: 'info',
          title: 'The fix: stack neurons into layers',
          text: r`Connecting many neurons into **layers** — a **multilayer perceptron** — and using **non-linear** activations lets the network represent arbitrarily complex functions. The rest of this module builds exactly that, and shows how such a network learns its weights.`,
        },
        {
          type: 'example',
          title: 'Compute a neuron’s output',
          problem: r`A sigmoid neuron has weights $\mathbf{w}=(0.5,-0.4)$, bias $b=0.1$ and input $\mathbf{x}=(2,3)$. Find $z$ and $a$.`,
          solution: [
            { type: 'p', text: r`**Net input.** $z = 0.5(2) + (-0.4)(3) + 0.1 = 1.0 - 1.2 + 0.1 = -0.1.$` },
            { type: 'p', text: r`**Activation.** $a = \sigma(-0.1) = \dfrac{1}{1+e^{0.1}} \approx 0.475.$` },
          ],
          answer: 'z = −0.1, a ≈ 0.475',
        },
      ],
    },

    // ================================================================
    {
      slug: 'activation-functions',
      title: 'Activation Functions: What, When & Why',
      summary:
        'Why non-linearity is essential, the sigmoid/tanh/ReLU/leaky-ReLU functions and their derivatives, when to use each, and the vanishing-gradient problem.',
      intro: {
        definition:
          'An activation function φ is the non-linear function applied to a neuron’s net input; it decides the neuron’s output and, crucially, its derivative drives learning during backpropagation.',
        whyItMatters:
          'Without a non-linear activation, stacking layers collapses into a single linear map — no more powerful than one neuron. The choice of activation also governs training speed and the vanishing-gradient problem.',
        whenToUse: [
          'Choosing hidden-layer activations (ReLU by default)',
          'Choosing an output activation (sigmoid/softmax for classification)',
          'Diagnosing slow or stalled training (saturation)',
        ],
      },
      objectives: [
        'Explain WHY non-linearity is required',
        'State sigmoid, tanh, ReLU and leaky ReLU with their derivatives',
        'Choose WHEN to use each and recognise vanishing gradients',
      ],
      blocks: [
        { type: 'heading', text: 'Why — non-linearity is the whole point' },
        {
          type: 'p',
          text: r`If every neuron were linear ($\varphi(z)=z$), a stack of layers would compose linear maps into **one** linear map — the network could only draw straight boundaries. The **non-linear** activation is what lets depth build up complex, curved functions. Its **derivative** $\varphi'$ also appears at every step of backpropagation.`,
        },
        { type: 'heading', text: 'What — the common activations' },
        {
          type: 'table',
          headers: ['Name', '$\\varphi(z)$', "$\\varphi'(z)$", 'Range'],
          rows: [
            ['Sigmoid', r`$\frac{1}{1+e^{-z}}$`, r`$\sigma(z)\big(1-\sigma(z)\big) = a(1-a)$`, r`$(0,\,1)$`],
            ['Tanh', r`$\frac{e^{z}-e^{-z}}{e^{z}+e^{-z}}$`, r`$1-\tanh^2(z)$`, r`$(-1,\,1)$`],
            ['ReLU', r`$\max(0,\,z)$`, r`$1$ if $z>0$, else $0$`, r`$[0,\,\infty)$`],
            ['Leaky ReLU', r`$\max(\alpha z,\,z)$`, r`$1$ if $z>0$, else $\alpha$`, r`$(-\infty,\,\infty)$`],
          ],
        },
        { type: 'math', tex: r`\sigma(z) = \frac{1}{1+e^{-z}} \quad\Longrightarrow\quad \sigma'(z) = \sigma(z)\big(1-\sigma(z)\big) = a\,(1-a)` },
        {
          type: 'diagram',
          kind: 'sigmoid-derivative',
          caption: 'Sigmoid and its derivative. σ′ peaks at only 0.25 and vanishes for large |z|.',
        },
        {
          type: 'diagram',
          kind: 'relu',
          caption: 'ReLU passes positive inputs unchanged and clips negatives to 0 — derivative 1 for z > 0.',
        },
        {
          type: 'note',
          variant: 'tip',
          title: 'A gift for hand computation',
          text: r`The sigmoid derivative is **self-referential**: once you know $a=\sigma(z)$ from the forward pass, $\sigma'(z)=a(1-a)$ needs no re-evaluation. This is why sigmoid networks are convenient to work by hand.`,
        },
        { type: 'heading', text: 'When — which to use where' },
        {
          type: 'list',
          items: [
            r`**Hidden layers → ReLU** (or Leaky ReLU). It is fast, does not saturate for $z>0$, and its derivative of 1 on the positive side keeps gradients healthy in deep networks.`,
            r`**Binary output → Sigmoid**, so the output reads as a probability in $(0,1)$.`,
            r`**Multi-class output → Softmax**, giving a probability per class that sums to 1.`,
            r`**Tanh** — a zero-centred alternative to sigmoid for hidden units (older networks); still saturates.`,
            r`**Leaky ReLU** — use when plain ReLU units "die" (get stuck outputting 0).`,
          ],
        },
        { type: 'heading', text: 'The vanishing-gradient problem' },
        {
          type: 'note',
          variant: 'warning',
          title: 'Why sigmoids struggle in deep nets',
          text: r`The sigmoid derivative peaks at only $0.25$ (at $z=0$) and is $\approx 0$ for large $|z|$. In a deep sigmoid/tanh network, backpropagation multiplies many such small numbers, so gradients in early layers **vanish** and those layers barely learn. **ReLU** (derivative 1 on the positive side) is the standard remedy.`,
        },
        {
          type: 'example',
          title: 'Sigmoid derivative from the activation',
          problem: r`A sigmoid neuron output is $a=\sigma(z)=0.75$. Find $\sigma'(z)$.`,
          solution: [
            { type: 'p', text: r`$\sigma'(z) = a(1-a) = 0.75(1-0.75) = 0.75 \times 0.25 = 0.1875.$` },
          ],
          answer: "σ′(z) = 0.1875",
        },
      ],
    },

    // ================================================================
    {
      slug: 'mlp-forward-propagation',
      title: 'The MLP: Architecture & Forward Propagation',
      summary:
        'Fully-connected layers, the layer-indexed notation (Wˡ, bˡ, zˡ, aˡ), forward propagation in vector form, and the loss functions that measure error.',
      intro: {
        definition:
          'A multilayer perceptron (MLP) is a fully-connected feedforward network of neurons arranged in an input layer, one or more hidden layers and an output layer; forward propagation evaluates it layer by layer.',
        whyItMatters:
          'Hidden layers with non-linear activations overcome the single neuron’s linear limit, making the MLP a universal function approximator and the foundation of deep learning.',
        whenToUse: [
          'Modelling non-linear input–output relationships',
          'Understanding the notation used by backpropagation',
          'Computing a network’s prediction (the forward pass)',
        ],
      },
      objectives: [
        'Describe the layered, fully-connected architecture',
        'Read the layer-indexed weight/bias/activation notation',
        'Run forward propagation and state the loss functions',
      ],
      blocks: [
        { type: 'heading', text: 'Architecture' },
        {
          type: 'p',
          text: r`An MLP has an **input layer**, one or more **hidden layers**, and an **output layer**. Every neuron in one layer connects to every neuron in the next ("**fully connected**"), and each hidden/output neuron has its own bias. A network written **2–2–1** has 2 inputs, one hidden layer of 2 neurons, and 1 output.`,
        },
        {
          type: 'diagram',
          kind: 'mlp-2-2-1',
          caption: 'A fully-connected 2–2–1 MLP: every neuron connects to every neuron in the next layer.',
        },
        { type: 'heading', text: 'Notation' },
        {
          type: 'p',
          text: r`Index layers by $l = 1,\dots,L$ (with $l=L$ the output layer). For layer $l$:`,
        },
        {
          type: 'list',
          items: [
            r`$w^{l}_{jk}$ — weight from the $k$-th neuron in layer $l-1$ to the $j$-th neuron in layer $l$.`,
            r`$b^{l}_{j}$ — bias of the $j$-th neuron in layer $l$.`,
            r`$z^{l}_{j} = \sum_{k} w^{l}_{jk}\,a^{l-1}_{k} + b^{l}_{j}$ — the **net input** (pre-activation).`,
            r`$a^{l}_{j} = \varphi(z^{l}_{j})$ — the **activation**, with $a^{0}_{k} = x_k$ (the inputs).`,
          ],
        },
        {
          type: 'p',
          text: r`In **vector form**, with weight matrix $\mathbf{W}^{l}$ and bias vector $\mathbf{b}^{l}$:`,
        },
        { type: 'math', tex: r`\mathbf{z}^{l} = \mathbf{W}^{l}\mathbf{a}^{l-1} + \mathbf{b}^{l}, \qquad \mathbf{a}^{l} = \varphi(\mathbf{z}^{l})` },
        { type: 'heading', text: 'Forward propagation' },
        {
          type: 'p',
          text: r`**Forward propagation** evaluates the network layer by layer: start with $\mathbf{a}^{0}=\mathbf{x}$, compute $\mathbf{z}^{1},\mathbf{a}^{1}$, then $\mathbf{z}^{2},\mathbf{a}^{2}$, and so on to the output $\mathbf{a}^{L}$. This produces the prediction and — crucially — **stores every $z^{l}_{j}$ and $a^{l}_{j}$**, which backpropagation will reuse.`,
        },
        { type: 'heading', text: 'Loss functions' },
        {
          type: 'p',
          text: r`A **loss** $E$ measures how wrong the outputs are. For **regression**, the mean squared error (the $\tfrac12$ is a convenience that cancels the exponent on differentiation):`,
        },
        { type: 'math', tex: r`E = \frac{1}{2}\sum_{j}\big(a^{L}_{j} - y_{j}\big)^2` },
        {
          type: 'p',
          text: r`For **classification** the outputs are probabilities and the natural loss is **cross-entropy** — small when the predicted probability of the correct class is near 1, and unbounded as it approaches 0 (a confident wrong answer is punished heavily):`,
        },
        { type: 'math', tex: r`\text{binary: } E = -\big[y\log\hat y + (1-y)\log(1-\hat y)\big], \qquad \text{multi-class: } E = -\sum_{c=1}^{C} y_c \log \hat y_c` },
        {
          type: 'note',
          variant: 'tip',
          title: 'A neat pairing',
          text: r`Cross-entropy pairs beautifully with sigmoid/softmax outputs: the output error simplifies to the same clean form $\delta^{L} = \hat{\mathbf y} - \mathbf y$ that squared error gives — which the next lesson derives.`,
        },
        {
          type: 'example',
          title: 'Forward pass through a 2–2–1 network',
          problem: r`Inputs $x_1=0.05,\ x_2=0.10$; hidden weights $w_1{=}0.15, w_2{=}0.20$ (to $h_1$), $w_3{=}0.25, w_4{=}0.30$ (to $h_2$); hidden biases $b_{h}=0.35$; output weights $w_5{=}0.40, w_6{=}0.45$; output bias $b_o=0.60$; sigmoid activation. Compute $h_1,h_2,o$.`,
          solution: [
            {
              type: 'table',
              headers: ['Neuron', 'Net input z', 'Activation a = σ(z)'],
              rows: [
                ['h₁', '0.15(0.05)+0.20(0.10)+0.35 = 0.3775', '0.593270'],
                ['h₂', '0.25(0.05)+0.30(0.10)+0.35 = 0.3925', '0.596884'],
                ['o', '0.40(0.593270)+0.45(0.596884)+0.60 = 1.105906', '0.751365'],
              ],
            },
            { type: 'p', text: r`With target $t=0.01$, the loss is $E=\tfrac12(0.751365-0.01)^2 = 0.274811$. These stored values feed directly into backpropagation.` },
          ],
          answer: 'h₁ = 0.593270, h₂ = 0.596884, o = 0.751365',
        },
      ],
    },

    // ================================================================
    {
      slug: 'backpropagation',
      title: 'Backpropagation: Derivation & Worked Example',
      summary:
        'The full chain-rule derivation — the error signal δ, the weight-gradient rule, the output error, and the backward recursion for hidden layers — the algorithm, its variants, and a complete worked example in tables.',
      intro: {
        definition:
          'Backpropagation is the algorithm that computes the gradient of the loss with respect to every weight and bias in one backward sweep, by applying the chain rule from the output layer inward.',
        whyItMatters:
          'It makes training deep networks feasible: all gradients cost about one extra forward pass, versus one forward pass per weight for naive finite differences. It is the workhorse behind essentially all modern deep learning.',
        whenToUse: [
          'Training any differentiable neural network',
          'Deriving the gradient for a weight buried deep in a network',
          'Understanding why gradients shrink toward early layers',
        ],
        whenNotToUse: [
          'Non-differentiable activations or losses',
          'When a simpler model with a closed-form solution suffices',
        ],
      },
      objectives: [
        'Define the error signal δ and the weight-gradient rule',
        'Derive the output error and the hidden-layer backward recursion',
        'Execute one full backprop update by hand',
      ],
      blocks: [
        { type: 'heading', text: 'Learning as optimisation' },
        {
          type: 'p',
          text: r`Training is supervised: given inputs with known targets and a loss $E$, we adjust every weight and bias by **gradient descent**, $\;w \leftarrow w - \eta\,\frac{\partial E}{\partial w}$. This needs $\frac{\partial E}{\partial w}$ for **every** weight — possibly millions, buried several layers deep. **Backpropagation** computes all of them efficiently in one backward sweep using the chain rule.`,
        },
        {
          type: 'note',
          variant: 'info',
          title: 'Parameters vs hyperparameters',
          text: r`Backprop updates the **parameters** — the weights $w$ and biases $b$. Quantities you fix beforehand — the learning rate $\eta$, the number of layers/neurons, the activation choice — are **hyperparameters**. Backprop computes gradients; gradient descent uses them (and $\eta$) to move the parameters.`,
        },
        { type: 'heading', text: 'The key idea: the error signal δ' },
        {
          type: 'p',
          text: r`The loss depends on a weight only through its neuron's net input, which feeds its activation, which feeds the next layer, and so on. The chain rule threads the derivative back along this path. Define, for each neuron, the **error signal** — the sensitivity of the loss to that neuron's net input:`,
        },
        { type: 'math', tex: r`\delta^{l}_{j} := \frac{\partial E}{\partial z^{l}_{j}}` },
        { type: 'heading', text: '1 · Gradient of a weight in terms of δ' },
        {
          type: 'p',
          text: r`Because $z^{l}_{j} = \sum_{k} w^{l}_{jk} a^{l-1}_{k} + b^{l}_{j}$ depends on $w^{l}_{jk}$ directly, the chain rule gives:`,
        },
        { type: 'math', tex: r`\frac{\partial E}{\partial w^{l}_{jk}} = \frac{\partial E}{\partial z^{l}_{j}}\,\frac{\partial z^{l}_{j}}{\partial w^{l}_{jk}} = \delta^{l}_{j}\,a^{l-1}_{k}, \qquad \frac{\partial E}{\partial b^{l}_{j}} = \delta^{l}_{j}` },
        {
          type: 'note',
          variant: 'intuition',
          title: 'Read it in words',
          text: r`Every weight gradient is **(error signal at its head)** $\times$ **(activation at its tail)**. The bias gradient is just the error signal. So once we have every $\delta$, all gradients follow immediately.`,
        },
        { type: 'heading', text: '2 · Error signal at the output layer' },
        {
          type: 'p',
          text: r`An output neuron $j$ affects the loss only through its own activation $a^{L}_{j}=\varphi(z^{L}_{j})$, so:`,
        },
        { type: 'math', tex: r`\delta^{L}_{j} = \frac{\partial E}{\partial z^{L}_{j}} = \frac{\partial E}{\partial a^{L}_{j}}\,\varphi'(z^{L}_{j})` },
        {
          type: 'p',
          text: r`For the MSE loss, $\frac{\partial E}{\partial a^{L}_{j}} = a^{L}_{j}-y_{j}$, so the output error takes the clean form:`,
        },
        { type: 'math', tex: r`\boxed{\;\delta^{L}_{j} = \big(a^{L}_{j} - y_{j}\big)\,\varphi'(z^{L}_{j})\;}` },
        { type: 'heading', text: '3 · Error signal at a hidden layer (the backward recursion)' },
        {
          type: 'p',
          text: r`A hidden neuron $j$ never feeds the loss directly — it affects it **only through the next layer**. It sends its activation $a^{l}_{j}$ to every neuron $i$ of layer $l+1$, so the multivariate chain rule **sums its effect through all of them**:`,
        },
        { type: 'math', tex: r`\delta^{l}_{j} = \frac{\partial E}{\partial z^{l}_{j}} = \sum_{i}\underbrace{\frac{\partial E}{\partial z^{l+1}_{i}}}_{\delta^{l+1}_{i}}\,\frac{\partial z^{l+1}_{i}}{\partial z^{l}_{j}} = \sum_{i}\delta^{l+1}_{i}\,\frac{\partial z^{l+1}_{i}}{\partial z^{l}_{j}}` },
        {
          type: 'p',
          text: r`The first factor is exactly $\delta^{l+1}_{i}$ — **already computed** for the next layer (this reuse is what makes backprop efficient). For the second factor, since $z^{l+1}_{i} = \sum_{k} w^{l+1}_{ik}\,\varphi(z^{l}_{k}) + b^{l+1}_{i}$ depends on $z^{l}_{j}$ only through $\varphi(z^{l}_{j})$, every term vanishes except $k=j$:`,
        },
        { type: 'math', tex: r`\frac{\partial z^{l+1}_{i}}{\partial z^{l}_{j}} = w^{l+1}_{ij}\,\varphi'(z^{l}_{j})` },
        {
          type: 'p',
          text: r`Substituting gives the **backward recursion** — the heart of backpropagation:`,
        },
        { type: 'math', tex: r`\boxed{\;\delta^{l}_{j} = \Big(\sum_{i} w^{l+1}_{ij}\,\delta^{l+1}_{i}\Big)\,\varphi'(z^{l}_{j})\;}` },
        {
          type: 'diagram',
          kind: 'backprop-flow',
          caption: 'Errors propagate backward through the same weights used in the forward pass.',
        },
        {
          type: 'note',
          variant: 'intuition',
          title: 'How to read the recursion',
          text: r`**$\sum_i w^{l+1}_{ij}\delta^{l+1}_{i}$** — gather the error signals of the neurons this neuron feeds, each weighted by the very connection it sent forward (push hard on a badly-wrong neuron → inherit more blame). **$\varphi'(z^{l}_{j})$** — scale by this neuron's own activation slope; a saturated neuron ($\varphi'\approx 0$) can barely change the output, so its error is tiny. Errors literally propagate **backward through the same weights** used in the forward pass.`,
        },
        { type: 'heading', text: '4 · Vector form' },
        {
          type: 'p',
          text: r`Collecting neurons into vectors (with $\odot$ the element-wise product), the whole derivation compresses to four lines — the $(\mathbf{W}^{l+1})^\top$ makes precise "send the error back through the weights":`,
        },
        { type: 'math', tex: r`\delta^{L} = \nabla_{\mathbf a}E \odot \varphi'(\mathbf{z}^{L}), \qquad \delta^{l} = \big((\mathbf{W}^{l+1})^\top \delta^{l+1}\big)\odot \varphi'(\mathbf{z}^{l})` },
        { type: 'math', tex: r`\nabla_{\mathbf{W}^{l}}E = \delta^{l}\,(\mathbf{a}^{l-1})^\top, \qquad \nabla_{\mathbf{b}^{l}}E = \delta^{l}` },
        { type: 'heading', text: 'The backpropagation algorithm' },
        {
          type: 'steps',
          items: [
            r`**Forward pass.** Set $\mathbf{a}^{0}=\mathbf{x}$; for $l=1,\dots,L$ compute $\mathbf{z}^{l}=\mathbf{W}^{l}\mathbf{a}^{l-1}+\mathbf{b}^{l}$ and $\mathbf{a}^{l}=\varphi(\mathbf{z}^{l})$; store all $\mathbf{z}^{l},\mathbf{a}^{l}$.`,
            r`**Output error.** $\delta^{L} = (\mathbf{a}^{L}-\mathbf{y})\odot\varphi'(\mathbf{z}^{L})$.`,
            r`**Backward pass.** For $l=L-1,\dots,1$: $\ \delta^{l} = \big((\mathbf{W}^{l+1})^\top\delta^{l+1}\big)\odot\varphi'(\mathbf{z}^{l})$.`,
            r`**Gradients.** $\nabla_{\mathbf{W}^{l}}E = \delta^{l}(\mathbf{a}^{l-1})^\top$, $\ \nabla_{\mathbf{b}^{l}}E = \delta^{l}$.`,
            r`**Update.** $\mathbf{W}^{l} \leftarrow \mathbf{W}^{l} - \eta\,\nabla_{\mathbf{W}^{l}}E$, $\ \mathbf{b}^{l} \leftarrow \mathbf{b}^{l} - \eta\,\nabla_{\mathbf{b}^{l}}E$. Repeat until the loss converges.`,
          ],
        },
        { type: 'heading', text: 'Variants' },
        {
          type: 'table',
          headers: ['Choice', 'Idea'],
          rows: [
            ['Batch GD', 'Average the gradient over the whole training set per update — stable but slow.'],
            ['Stochastic (SGD)', 'Update after each example — noisy but fast; noise can escape poor minima.'],
            ['Mini-batch GD', 'Update after a small batch (32–256) — the practical default.'],
            ['Momentum / RMSProp / Adam', 'Better optimisers that reuse the same backprop gradients; Adam is the usual default.'],
          ],
        },

        // ---------------- Worked example ----------------
        { type: 'heading', text: 'Worked example — one full step (2–2–1 sigmoid)' },
        {
          type: 'p',
          text: r`We train the network of the previous lesson for one step. **Setup:** $x_1{=}0.05,\ x_2{=}0.10$; $w_1{=}0.15,w_2{=}0.20$ (→$h_1$), $w_3{=}0.25,w_4{=}0.30$ (→$h_2$); $b_{h_1}{=}b_{h_2}{=}0.35$; $w_5{=}0.40,w_6{=}0.45$ (→$o$); $b_o{=}0.60$; sigmoid activation; target $t=0.01$; loss $E=\tfrac12(o-t)^2$; learning rate $\eta=0.5$.`,
        },
        {
          type: 'example',
          title: 'Backpropagation, step by step',
          problem: r`Perform one forward pass, one backward pass, update all nine parameters, and verify the loss decreased.`,
          solution: [
            { type: 'p', text: r`**Step 1 — Forward pass.** (activations stored for reuse)` },
            {
              type: 'table',
              headers: ['Neuron', 'Net input z', 'Activation a = σ(z)'],
              rows: [
                ['h₁', '0.3775', '0.593270'],
                ['h₂', '0.3925', '0.596884'],
                ['o', '1.105906', '0.751365'],
              ],
            },
            { type: 'p', text: r`Loss $E = \tfrac12(0.751365-0.01)^2 = 0.274811$.` },
            { type: 'p', text: r`**Step 2 — Output error & its gradients** using $\delta_o=(o-t)\,o(1-o)$ and $\partial E/\partial w = \delta_o \cdot h$:` },
            {
              type: 'table',
              headers: ['Quantity', 'Computation', 'Value'],
              rows: [
                ['δₒ', '(0.751365 − 0.01)(0.751365)(0.248635)', '0.138499'],
                ['∂E/∂w₅', 'δₒ · h₁ = 0.138499 × 0.593270', '0.082167'],
                ['∂E/∂w₆', 'δₒ · h₂ = 0.138499 × 0.596884', '0.082668'],
                ['∂E/∂bₒ', '= δₒ', '0.138499'],
              ],
            },
            { type: 'p', text: r`**Step 3 — Hidden errors & gradients.** With one output, $\delta_h = \delta_o\,w_{(h\to o)}\,h(1-h)$, and $\partial E/\partial w = \delta_h \cdot x$:` },
            {
              type: 'table',
              headers: ['Quantity', 'Computation', 'Value'],
              rows: [
                ['δₕ₁', '0.138499 × 0.40 × 0.593270 × 0.406730', '0.013368'],
                ['δₕ₂', '0.138499 × 0.45 × 0.596884 × 0.403116', '0.014996'],
                ['∂E/∂w₁', 'δₕ₁ · x₁', '0.000668'],
                ['∂E/∂w₂', 'δₕ₁ · x₂', '0.001337'],
                ['∂E/∂w₃', 'δₕ₂ · x₁', '0.000750'],
                ['∂E/∂w₄', 'δₕ₂ · x₂', '0.001500'],
              ],
            },
            { type: 'p', text: r`**Step 4 — Update every parameter** with $w \leftarrow w - \eta\,\partial E/\partial w$ ($\eta=0.5$):` },
            {
              type: 'table',
              headers: ['Param', 'Old', 'Gradient', 'New'],
              rows: [
                ['w₁', '0.15', '0.000668', '0.149666'],
                ['w₂', '0.20', '0.001337', '0.199332'],
                ['w₃', '0.25', '0.000750', '0.249625'],
                ['w₄', '0.30', '0.001500', '0.299250'],
                ['w₅', '0.40', '0.082167', '0.358916'],
                ['w₆', '0.45', '0.082668', '0.408666'],
                ['b_h₁', '0.35', '0.013368', '0.343316'],
                ['b_h₂', '0.35', '0.014996', '0.342502'],
                ['bₒ', '0.60', '0.138499', '0.530751'],
              ],
            },
            { type: 'p', text: r`**Step 5 — Verify the loss decreased.** A forward pass with the updated weights gives $o'=0.728352$, so $E' = \tfrac12(0.728352-0.01)^2 = 0.258015 < 0.274811 = E$. ✓ One step reduced the error, exactly as gradient descent promises.` },
            {
              type: 'note',
              variant: 'intuition',
              title: 'Notice the gradient shrinkage',
              text: r`$\partial E/\partial w_5 \approx 0.082$ but $\partial E/\partial w_1 \approx 0.0007$ — over 100× smaller. The hidden gradients carry the extra factors $w_5\,h_1(1-h_1)$ and the tiny input $x_1=0.05$, shrinking them. This is an early glimpse of the **vanishing-gradient** effect as we move back through a network.`,
            },
          ],
          answer: "E: 0.274811 → 0.258015 (loss decreased ✓)",
        },
        { type: 'heading', text: 'From-scratch implementation (NumPy)' },
        {
          type: 'code',
          language: 'python',
          code: r`import numpy as np
sig  = lambda z: 1 / (1 + np.exp(-z))
dsig = lambda a: a * (1 - a)          # σ'(z) in terms of a = σ(z)

x = np.array([[0.05], [0.10]]); t = np.array([[0.01]]); eta = 0.5
W1 = np.array([[0.15, 0.20], [0.25, 0.30]]); b1 = np.array([[0.35], [0.35]])
W2 = np.array([[0.40, 0.45]]);               b2 = np.array([[0.60]])

# forward
a1 = sig(W1 @ x + b1)                 # hidden activations
a2 = sig(W2 @ a1 + b2)                # output
E  = 0.5 * np.sum((a2 - t) ** 2)      # 0.274811...

# backward
d2 = (a2 - t) * dsig(a2)              # output error signal
d1 = (W2.T @ d2) * dsig(a1)           # hidden error signal
gW2, gb2 = d2 @ a1.T, d2             # gradients
gW1, gb1 = d1 @ x.T,  d1

# update
W2 -= eta * gW2; b2 -= eta * gb2
W1 -= eta * gW1; b1 -= eta * gb1
print("loss:", E)`,
          caption: 'Reproduces the by-hand numbers: δₒ = 0.1385, updated w₅ = 0.3589, and so on.',
        },
        {
          type: 'note',
          variant: 'tip',
          title: 'The big picture',
          text: r`Perceptron → artificial neuron → activation functions → MLP & forward propagation → loss → **backpropagation** (error signal δ, output error, backward recursion) → gradient descent → updated weights. You now have the complete pipeline that underlies all of deep learning.`,
        },
      ],
    },

    // ==================================================================
    {
      slug: 'mlp-backprop-worked-example-3-2-2-1',
      title: 'Worked Example: Backpropagation in a 3–2–2–1 Network',
      summary:
        'One complete training iteration worked entirely by hand — forward propagation, the squared error, full backpropagation of the error signal δ through every layer, all gradients, and the gradient-descent parameter updates for a 3–2–2–1 MLP with sigmoid activations (η = 0.5).',
      intro: {
        definition:
          'A fully worked, one-iteration training pass for a 3–2–2–1 multilayer perceptron: forward propagation, error, backpropagation of the δ signal, gradients and the gradient-descent weight/bias updates.',
        whyItMatters:
          'Doing every arithmetic step by hand — once — turns backpropagation from a formula into something you can trace neuron by neuron, which is the fastest way to truly understand how a network learns.',
        whenToUse: [
          'Checking a backprop implementation against known-good numbers',
          'Learning exactly how the error signal flows backward through layers',
          'Revising for an exam that asks for a manual forward/backward pass',
        ],
      },
      objectives: [
        'Run forward propagation layer by layer to the output',
        'Compute the squared error for the training example',
        'Backpropagate the local error signal δ through every layer',
        'Compute all weight and bias gradients and apply the gradient-descent update',
      ],
      blocks: [
        {
          type: 'p',
          text: r`Consider a fully connected multilayer perceptron with **three input neurons, two neurons in the first hidden layer, two neurons in the second hidden layer, and one output neuron (3–2–2–1)**.`,
        },
        {
          type: 'diagram',
          kind: 'mlp-3-2-2-1',
          caption: 'The 3–2–2–1 network. Layers l = 1 and l = 2 are hidden; l = L = 3 is the output.',
        },
        { type: 'p', text: r`For a single training example, the input vector and desired output are` },
        { type: 'math', tex: r`\mathbf{x}=\begin{bmatrix}0.6\\ -0.2\\ 0.8\end{bmatrix},\qquad y=1.` },
        { type: 'heading', text: 'Initial weights and biases' },
        { type: 'p', text: r`**Input layer → first hidden layer**` },
        { type: 'math', tex: r`W^{1}=\begin{bmatrix}w_{11}^{1} & w_{12}^{1} & w_{13}^{1}\\ w_{21}^{1} & w_{22}^{1} & w_{23}^{1}\end{bmatrix}=\begin{bmatrix}0.4 & -0.5 & 0.2\\ -0.3 & 0.8 & 0.1\end{bmatrix},\qquad \mathbf{b}^{1}=\begin{bmatrix}0.1\\ -0.2\end{bmatrix}` },
        { type: 'p', text: r`**First hidden layer → second hidden layer**` },
        { type: 'math', tex: r`W^{2}=\begin{bmatrix}w_{11}^{2} & w_{12}^{2}\\ w_{21}^{2} & w_{22}^{2}\end{bmatrix}=\begin{bmatrix}0.7 & -0.4\\ -0.6 & 0.9\end{bmatrix},\qquad \mathbf{b}^{2}=\begin{bmatrix}0.05\\ 0.1\end{bmatrix}` },
        { type: 'p', text: r`**Second hidden layer → output layer**` },
        { type: 'math', tex: r`W^{3}=\begin{bmatrix}w_{11}^{3} & w_{12}^{3}\end{bmatrix}=\begin{bmatrix}0.8 & -1.1\end{bmatrix},\qquad b_1^{3}=0.2` },
        { type: 'heading', text: 'Activation, error and learning rate' },
        { type: 'p', text: r`Every hidden and output neuron uses the sigmoid activation, whose derivative is convenient:` },
        { type: 'math', tex: r`a=\phi(z)=\frac{1}{1+e^{-z}},\qquad \phi'(z)=\phi(z)\bigl(1-\phi(z)\bigr)=a(1-a)` },
        { type: 'p', text: r`The error for the training example and the learning rate are` },
        { type: 'math', tex: r`E=\frac{1}{2}\sum_j\left(a_j^L-y_j\right)^2,\qquad \eta=0.5` },
        { type: 'p', text: r`One complete training iteration consists of four steps:` },
        {
          type: 'steps',
          items: [
            r`**Forward propagation** — $z_j^l=\sum_k w_{jk}^l a_k^{l-1}+b_j^l$, then $a_j^l=\sigma(z_j^l)$.`,
            r`**Error** — $E=\dfrac{1}{2}\sum_j(a_j^L-y_j)^2$.`,
            r`**Backpropagation** — output signal $\delta_j^L=(a_j^L-y_j)a_j^L(1-a_j^L)$; hidden signal $\delta_j^l=\bigl(\sum_r w_{rj}^{l+1}\delta_r^{l+1}\bigr)a_j^l(1-a_j^l)$; gradients $\dfrac{\partial E}{\partial w_{jk}^l}=\delta_j^l a_k^{l-1}$ and $\dfrac{\partial E}{\partial b_j^l}=\delta_j^l$.`,
            r`**Parameter update** — $\theta^{\mathrm{new}}=\theta^{\mathrm{old}}-\eta\,\dfrac{\partial E}{\partial\theta}$ for every weight and bias.`,
          ],
        },

        // ---- 1. Forward propagation ----
        { type: 'heading', text: '1. Forward propagation' },
        { type: 'p', text: r`**First hidden layer ($l=1$).** $\ z_j^{1}=\sum_{k=1}^{3}w_{jk}^{1}a_k^{0}+b_j^{1}$, $\ a_j^{1}=\sigma(z_j^{1})=\dfrac{1}{1+e^{-z_j^{1}}}$.` },
        {
          type: 'table',
          headers: [r`Neuron $j$`, r`Net input calculation`, r`Activation output`],
          rows: [
            ['1', r`$\begin{aligned} z_1^{1} &= w_{11}^{1}a_1^{0}+w_{12}^{1}a_2^{0}+w_{13}^{1}a_3^{0}+b_1^{1}\\ &=(0.4)(0.6)+(-0.5)(-0.2)+(0.2)(0.8)+0.1\\ &=0.6000 \end{aligned}$`, r`$a_1^{1}=0.6457$`],
            ['2', r`$\begin{aligned} z_2^{1} &= w_{21}^{1}a_1^{0}+w_{22}^{1}a_2^{0}+w_{23}^{1}a_3^{0}+b_2^{1}\\ &=(-0.3)(0.6)+(0.8)(-0.2)+(0.1)(0.8)+(-0.2)\\ &=-0.4600 \end{aligned}$`, r`$a_2^{1}=0.3870$`],
          ],
        },
        { type: 'p', text: r`**Second hidden layer ($l=2$).** $\ z_j^{2}=\sum_{k=1}^{2}w_{jk}^{2}a_k^{1}+b_j^{2}$.` },
        {
          type: 'table',
          headers: [r`Neuron $j$`, r`Net input calculation`, r`Activation output`],
          rows: [
            ['1', r`$\begin{aligned} z_1^{2} &= w_{11}^{2}a_1^{1}+w_{12}^{2}a_2^{1}+b_1^{2}\\ &=(0.7)(0.64566)+(-0.4)(0.38699)+0.05\\ &=0.34717 \end{aligned}$`, r`$a_1^{2}=0.58593$`],
            ['2', r`$\begin{aligned} z_2^{2} &= w_{21}^{2}a_1^{1}+w_{22}^{2}a_2^{1}+b_2^{2}\\ &=(-0.6)(0.64566)+(0.9)(0.38699)+0.10\\ &=0.06090 \end{aligned}$`, r`$a_2^{2}=0.51522$`],
          ],
        },
        { type: 'p', text: r`**Output layer ($L=3$).** $\ z_j^{3}=\sum_{k=1}^{2}w_{jk}^{3}a_k^{2}+b_j^{3}$.` },
        {
          type: 'table',
          headers: [r`Neuron $j$`, r`Net input calculation`, r`Activation output`],
          rows: [
            ['1', r`$\begin{aligned} z_1^{3} &= w_{11}^{3}a_1^{2}+w_{12}^{3}a_2^{2}+b_1^{3}\\ &=(0.8)(0.58593)+(-1.1)(0.51522)+0.2\\ &=0.10200 \end{aligned}$`, r`$a_1^{3}=0.52548$`],
          ],
        },

        // ---- 2. Error ----
        { type: 'heading', text: '2. Error calculation' },
        { type: 'math', tex: r`E=\frac{1}{2}\sum_j\left(a_j^L-y_j\right)^2=\frac{1}{2}\left(a_1^3-y_1\right)^2=\frac{1}{2}\left(0.52548-1\right)^2=0.11258` },

        // ---- 3. Backprop: output layer ----
        { type: 'heading', text: '3. Backpropagation — output layer (L = 3)' },
        { type: 'p', text: r`**Stage 1 — local error signal.** $\ \delta_1^L=(a_1^L-y_1)\phi'(z_1^L)=(a_1^L-y_1)a_1^L(1-a_1^L)$.` },
        {
          type: 'table',
          headers: [r`Neuron $j$`, r`Local error signal $\delta_j^3=(a_j^3-y_j)a_j^3(1-a_j^3)$`],
          rows: [
            ['1', r`$\begin{aligned} \delta_1^3 &= (a_1^3-y_1)a_1^3(1-a_1^3)\\ &=(0.52548-1)(0.52548)(1-0.52548)\\ &=-0.11832 \end{aligned}$`],
          ],
        },
        { type: 'p', text: r`**Stage 2 — gradient calculation.** $\ \dfrac{\partial E}{\partial w_{jk}^{l}}=\delta_j^l a_k^{l-1}$, $\ \dfrac{\partial E}{\partial b_j^l}=\delta_j^l$.` },
        {
          type: 'table',
          headers: [r`$j$`, r`$k$`, r`$a_k^{l-1}$`, r`Gradient $\dfrac{\partial E}{\partial w_{jk}^{l}}=\delta_j^l a_k^{l-1}$`],
          rows: [
            ['1', '1', r`$a_1^2=0.58593$`, r`$\begin{aligned} \frac{\partial E}{\partial w_{11}^3}=\delta_1^3a_1^2 &=(-0.11832)(0.58593)\\ &=-0.069327 \end{aligned}$`],
            ['1', '2', r`$a_2^2=0.51522$`, r`$\begin{aligned} \frac{\partial E}{\partial w_{12}^3}=\delta_1^3a_2^2 &=(-0.11832)(0.51522)\\ &=-0.06096 \end{aligned}$`],
            ['1', '—', r`$1$`, r`$\dfrac{\partial E}{\partial b_1^3}=\delta_1^3=-0.11832$`],
          ],
        },
        { type: 'p', text: r`**Stage 3 — parameter update.** $\ \theta^{\mathrm{new}}=\theta^{\mathrm{old}}-\eta\,\dfrac{\partial E}{\partial\theta}$ with $\eta=0.5$.` },
        {
          type: 'table',
          headers: [r`$j$`, r`$k$`, r`Old parameter`, r`Parameter update $\theta^{\mathrm{new}}$`],
          rows: [
            ['1', '1', r`$w_{11}^{3,\mathrm{old}}=0.8$`, r`$\begin{aligned} w_{11}^{3,\mathrm{new}} &=0.8-0.5(-0.069327)\\ &=0.8346635 \end{aligned}$`],
            ['1', '2', r`$w_{12}^{3,\mathrm{old}}=-1.1$`, r`$\begin{aligned} w_{12}^{3,\mathrm{new}} &=-1.1-0.5(-0.06096)\\ &=-1.06952 \end{aligned}$`],
            ['1', '—', r`$b_1^{3,\mathrm{old}}=0.2$`, r`$\begin{aligned} b_1^{3,\mathrm{new}} &=0.2-0.5(-0.11832)\\ &=0.25916 \end{aligned}$`],
          ],
        },

        // ---- 3. Backprop: second hidden layer ----
        { type: 'heading', text: '3. Backpropagation — second hidden layer (l = 2)' },
        { type: 'p', text: r`**Stage 1 — local error signal.** $\ \delta_j^2=\bigl(\sum_{r=1}^{1} w_{rj}^{3}\delta_r^{3}\bigr)a_j^2(1-a_j^2)$.` },
        {
          type: 'table',
          headers: [r`Neuron $j$`, r`Local error signal $\delta_j^2=\bigl(\sum_{r} w_{rj}^{3}\delta_r^{3}\bigr)a_j^2(1-a_j^2)$`],
          rows: [
            ['1', r`$\begin{aligned} \delta_1^2 &= w_{11}^{3}\delta_1^{3}\,a_1^2(1-a_1^2)\\ &=(0.8)(-0.11832)(0.58593)(1-0.58593)\\ &=-0.022965 \end{aligned}$`],
            ['2', r`$\begin{aligned} \delta_2^2 &= w_{12}^{3}\delta_1^{3}\,a_2^2(1-a_2^2)\\ &=(-1.1)(-0.11832)(0.51522)(1-0.51522)\\ &=0.032508 \end{aligned}$`],
          ],
        },
        { type: 'p', text: r`**Stage 2 — gradient calculation.**` },
        {
          type: 'table',
          headers: [r`$j$`, r`$k$`, r`$a_k^{1}$`, r`Gradient $\dfrac{\partial E}{\partial w_{jk}^{2}}=\delta_j^2 a_k^{1}$`],
          rows: [
            ['1', '1', r`$a_1^1=0.64566$`, r`$\begin{aligned} \frac{\partial E}{\partial w_{11}^2}=\delta_1^2a_1^1 &=(-0.022965)(0.64566)\\ &=-0.014828 \end{aligned}$`],
            ['1', '2', r`$a_2^1=0.38699$`, r`$\begin{aligned} \frac{\partial E}{\partial w_{12}^2}=\delta_1^2a_2^1 &=(-0.022965)(0.38699)\\ &=-0.008887 \end{aligned}$`],
            ['1', '—', r`$1$`, r`$\dfrac{\partial E}{\partial b_1^2}=\delta_1^2=-0.022965$`],
            ['2', '1', r`$a_1^1=0.64566$`, r`$\begin{aligned} \frac{\partial E}{\partial w_{21}^2}=\delta_2^2a_1^1 &=(0.032508)(0.64566)\\ &=0.020989 \end{aligned}$`],
            ['2', '2', r`$a_2^1=0.38699$`, r`$\begin{aligned} \frac{\partial E}{\partial w_{22}^2}=\delta_2^2a_2^1 &=(0.032508)(0.38699)\\ &=0.012580 \end{aligned}$`],
            ['2', '—', r`$1$`, r`$\dfrac{\partial E}{\partial b_2^2}=\delta_2^2=0.032508$`],
          ],
        },
        { type: 'p', text: r`**Stage 3 — parameter update.**` },
        {
          type: 'table',
          headers: [r`$j$`, r`$k$`, r`Old parameter`, r`Parameter update $\theta^{\mathrm{new}}$`],
          rows: [
            ['1', '1', r`$w_{11}^{2,\mathrm{old}}=0.7$`, r`$\begin{aligned} w_{11}^{2,\mathrm{new}} &=0.7-0.5(-0.014828)\\ &=0.707414 \end{aligned}$`],
            ['1', '2', r`$w_{12}^{2,\mathrm{old}}=-0.4$`, r`$\begin{aligned} w_{12}^{2,\mathrm{new}} &=-0.4-0.5(-0.008887)\\ &=-0.3955565 \end{aligned}$`],
            ['1', '—', r`$b_1^{2,\mathrm{old}}=0.05$`, r`$\begin{aligned} b_1^{2,\mathrm{new}} &=0.05-0.5(-0.022965)\\ &=0.0614825 \end{aligned}$`],
            ['2', '1', r`$w_{21}^{2,\mathrm{old}}=-0.6$`, r`$\begin{aligned} w_{21}^{2,\mathrm{new}} &=-0.6-0.5(0.020989)\\ &=-0.6104945 \end{aligned}$`],
            ['2', '2', r`$w_{22}^{2,\mathrm{old}}=0.9$`, r`$\begin{aligned} w_{22}^{2,\mathrm{new}} &=0.9-0.5(0.012580)\\ &=0.893710 \end{aligned}$`],
            ['2', '—', r`$b_2^{2,\mathrm{old}}=0.1$`, r`$\begin{aligned} b_2^{2,\mathrm{new}} &=0.1-0.5(0.032508)\\ &=0.083746 \end{aligned}$`],
          ],
        },

        // ---- 3. Backprop: first hidden layer ----
        { type: 'heading', text: '3. Backpropagation — first hidden layer (l = 1)' },
        { type: 'p', text: r`**Stage 1 — local error signal.** $\ \delta_j^1=\bigl(\sum_{r=1}^{2} w_{rj}^{2}\delta_r^{2}\bigr)a_j^1(1-a_j^1)$.` },
        {
          type: 'table',
          headers: [r`Neuron $j$`, r`Local error signal $\delta_j^1=\bigl(\sum_{r} w_{rj}^{2}\delta_r^{2}\bigr)a_j^1(1-a_j^1)$`],
          rows: [
            ['1', r`$\begin{aligned} \delta_1^1 &= \left(w_{11}^{2}\delta_1^{2}+w_{21}^{2}\delta_2^{2}\right)a_1^1(1-a_1^1)\\ &=\left[(0.7)(-0.022965)+(-0.6)(0.032508)\right](0.64566)(1-0.64566)\\ &=-0.00814017 \end{aligned}$`],
            ['2', r`$\begin{aligned} \delta_2^1 &= \left(w_{12}^{2}\delta_1^{2}+w_{22}^{2}\delta_2^{2}\right)a_2^1(1-a_2^1)\\ &=\left[(-0.4)(-0.022965)+(0.9)(0.032508)\right](0.38699)(1-0.38699)\\ &=0.009120 \end{aligned}$`],
          ],
        },
        { type: 'p', text: r`**Stage 2 — gradient calculation.**` },
        {
          type: 'table',
          headers: [r`$j$`, r`$k$`, r`$a_k^{0}$`, r`Gradient $\dfrac{\partial E}{\partial w_{jk}^{1}}=\delta_j^1 a_k^{0}$`],
          rows: [
            ['1', '1', r`$a_1^0=0.6$`, r`$\begin{aligned} \frac{\partial E}{\partial w_{11}^1}=\delta_1^1a_1^0 &=(-0.00814017)(0.6)\\ &=-0.004884 \end{aligned}$`],
            ['1', '2', r`$a_2^0=-0.2$`, r`$\begin{aligned} \frac{\partial E}{\partial w_{12}^1}=\delta_1^1a_2^0 &=(-0.00814017)(-0.2)\\ &=0.001628 \end{aligned}$`],
            ['1', '3', r`$a_3^0=0.8$`, r`$\begin{aligned} \frac{\partial E}{\partial w_{13}^1}=\delta_1^1a_3^0 &=(-0.00814017)(0.8)\\ &=-0.006512 \end{aligned}$`],
            ['1', '—', r`$1$`, r`$\dfrac{\partial E}{\partial b_1^1}=\delta_1^1=-0.00814017$`],
            ['2', '1', r`$a_1^0=0.6$`, r`$\begin{aligned} \frac{\partial E}{\partial w_{21}^1}=\delta_2^1a_1^0 &=(0.009120)(0.6)\\ &=0.005472 \end{aligned}$`],
            ['2', '2', r`$a_2^0=-0.2$`, r`$\begin{aligned} \frac{\partial E}{\partial w_{22}^1}=\delta_2^1a_2^0 &=(0.009120)(-0.2)\\ &=-0.001824 \end{aligned}$`],
            ['2', '3', r`$a_3^0=0.8$`, r`$\begin{aligned} \frac{\partial E}{\partial w_{23}^1}=\delta_2^1a_3^0 &=(0.009120)(0.8)\\ &=0.007296 \end{aligned}$`],
            ['2', '—', r`$1$`, r`$\dfrac{\partial E}{\partial b_2^1}=\delta_2^1=0.009120$`],
          ],
        },
        { type: 'p', text: r`**Stage 3 — parameter update.**` },
        {
          type: 'table',
          headers: [r`$j$`, r`$k$`, r`Old parameter`, r`Parameter update $\theta^{\mathrm{new}}$`],
          rows: [
            ['1', '1', r`$w_{11}^{1,\mathrm{old}}=0.4$`, r`$\begin{aligned} w_{11}^{1,\mathrm{new}} &=0.4-0.5(-0.004884)\\ &=0.402442 \end{aligned}$`],
            ['1', '2', r`$w_{12}^{1,\mathrm{old}}=-0.5$`, r`$\begin{aligned} w_{12}^{1,\mathrm{new}} &=-0.5-0.5(0.001628)\\ &=-0.500814 \end{aligned}$`],
            ['1', '3', r`$w_{13}^{1,\mathrm{old}}=0.2$`, r`$\begin{aligned} w_{13}^{1,\mathrm{new}} &=0.2-0.5(-0.006512)\\ &=0.203256 \end{aligned}$`],
            ['1', '—', r`$b_1^{1,\mathrm{old}}=0.1$`, r`$\begin{aligned} b_1^{1,\mathrm{new}} &=0.1-0.5(-0.00814017)\\ &=0.10407 \end{aligned}$`],
            ['2', '1', r`$w_{21}^{1,\mathrm{old}}=-0.3$`, r`$\begin{aligned} w_{21}^{1,\mathrm{new}} &=-0.3-0.5(0.005472)\\ &=-0.302736 \end{aligned}$`],
            ['2', '2', r`$w_{22}^{1,\mathrm{old}}=0.8$`, r`$\begin{aligned} w_{22}^{1,\mathrm{new}} &=0.8-0.5(-0.001824)\\ &=0.800912 \end{aligned}$`],
            ['2', '3', r`$w_{23}^{1,\mathrm{old}}=0.1$`, r`$\begin{aligned} w_{23}^{1,\mathrm{new}} &=0.1-0.5(0.007296)\\ &=0.096352 \end{aligned}$`],
            ['2', '—', r`$b_2^{1,\mathrm{old}}=-0.2$`, r`$\begin{aligned} b_2^{1,\mathrm{new}} &=-0.2-0.5(0.009120)\\ &=-0.204560 \end{aligned}$`],
          ],
        },
        {
          type: 'note',
          variant: 'tip',
          title: 'That is one full iteration',
          text: r`Forward pass → error $E=0.11258$ → backward pass (output, then hidden layers, propagating $\delta$ backward) → every weight and bias nudged by $-\eta\,\partial E/\partial\theta$. Repeating this for many examples and many iterations is exactly how the network learns.`,
        },
      ],
    },
  ],
};
