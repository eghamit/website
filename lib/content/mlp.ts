import type { Module } from './types';

const r = String.raw;

export const mlp: Module = {
  id: 'mlp',
  title: 'Multilayer Perceptron (MLP)',
  icon: '🕸️',
  description:
    'Stack neurons into hidden layers to learn non-linear functions: activation functions, forward propagation, and the backpropagation algorithm that trains the whole network.',
  lessons: [
    // ------------------------------------------------------------------
    {
      slug: 'mlp-architecture-and-activations',
      title: 'MLP Architecture & Activation Functions',
      summary:
        'Hidden layers, the sigmoid/tanh/ReLU activations, and forward propagation through the network.',
      objectives: [
        'Describe the layered architecture of an MLP',
        'Compare sigmoid, tanh and ReLU',
        'Run forward propagation by hand',
      ],
      blocks: [
        {
          type: 'p',
          text: r`A **Multilayer Perceptron** stacks neurons into layers: an **input layer**, one or more **hidden layers**, and an **output layer**. Every neuron connects to all neurons in the next layer (fully connected). The hidden layers are what let an MLP learn **non-linear** functions — including XOR.`,
        },
        {
          type: 'note',
          variant: 'intuition',
          title: 'Why non-linear activations are essential',
          text: r`Without a non-linear activation, stacking layers just composes linear maps into one linear map — no more powerful than a single perceptron. The non-linearity is what gives depth its power.`,
        },
        { type: 'heading', text: 'Activation functions' },
        { type: 'math', tex: r`\sigma(z) = \frac{1}{1+e^{-z}} \in (0,1) \qquad \tanh(z) = \frac{e^{z}-e^{-z}}{e^{z}+e^{-z}} \in (-1,1)` },
        { type: 'math', tex: r`\text{ReLU}(z) = \max(0,\,z)` },
        {
          type: 'table',
          headers: ['Activation', 'Range', 'Pros', 'Cons'],
          rows: [
            ['Sigmoid', '(0, 1)', 'Smooth, probability-like', 'Vanishing gradients, not zero-centred'],
            ['Tanh', '(−1, 1)', 'Zero-centred', 'Still saturates at extremes'],
            ['ReLU', '[0, ∞)', 'Fast, no saturation for z>0', 'Can "die" for z<0'],
          ],
        },
        {
          type: 'note',
          variant: 'tip',
          title: 'Default choices',
          text: r`Use **ReLU** (or variants like Leaky ReLU) in hidden layers. Use **sigmoid** for a binary-classification output and **softmax** for multi-class.`,
        },
        { type: 'heading', text: 'Forward propagation' },
        {
          type: 'p',
          text: r`**Forward propagation** passes the input through the layers to produce a prediction. For layer $\ell$ with weight matrix $\mathbf{W}^{[\ell]}$, bias $\mathbf{b}^{[\ell]}$ and activation $g$:`,
        },
        { type: 'math', tex: r`\mathbf{z}^{[\ell]} = \mathbf{W}^{[\ell]}\mathbf{a}^{[\ell-1]} + \mathbf{b}^{[\ell]}, \qquad \mathbf{a}^{[\ell]} = g\big(\mathbf{z}^{[\ell]}\big)` },
        {
          type: 'p',
          text: r`with $\mathbf{a}^{[0]}=\mathbf{x}$ the input and $\mathbf{a}^{[L]}=\hat{\mathbf y}$ the final output.`,
        },
        {
          type: 'example',
          title: 'Forward pass through one neuron',
          problem: r`A hidden neuron has weights $\mathbf{w}=(0.5,-0.4)$, bias $b=0.1$, and sigmoid activation. For input $\mathbf{x}=(2,3)$, compute its output.`,
          solution: [
            { type: 'p', text: r`**Net input.** $z = 0.5(2) + (-0.4)(3) + 0.1 = 1.0 - 1.2 + 0.1 = -0.1.$` },
            { type: 'p', text: r`**Activation.** $a = \sigma(-0.1) = \dfrac{1}{1+e^{0.1}} = \dfrac{1}{1+1.105} \approx 0.475.$` },
          ],
          answer: 'Neuron output ≈ 0.475',
        },
      ],
    },

    // ------------------------------------------------------------------
    {
      slug: 'backpropagation-and-gradient-descent',
      title: 'Backpropagation & Gradient Descent',
      summary:
        'The loss, the chain rule flowing backward, and how weights and biases are updated to train a network.',
      objectives: [
        'Compute the output error and loss',
        'Apply the chain rule to propagate gradients backward',
        'Update weights and biases with gradient descent',
      ],
      blocks: [
        {
          type: 'p',
          text: r`Training an MLP means finding the weights and biases that minimise a **loss**. **Backpropagation** is the efficient algorithm that computes the gradient of the loss with respect to *every* parameter, by applying the **chain rule** layer by layer from the output backward.`,
        },
        { type: 'heading', text: 'Step 1 — Loss' },
        {
          type: 'p',
          text: r`Measure the error between prediction $\hat{\mathbf y}$ and target $\mathbf y$. For regression, squared error; for classification, cross-entropy:`,
        },
        { type: 'math', tex: r`\mathcal{L} = \tfrac{1}{2}\lVert \hat{\mathbf y} - \mathbf y \rVert^2` },
        { type: 'heading', text: 'Step 2 — Backpropagate the error' },
        {
          type: 'p',
          text: r`Define the error signal $\boldsymbol\delta^{[\ell]} = \partial\mathcal{L}/\partial\mathbf{z}^{[\ell]}$. It starts at the output and flows backward, where $\odot$ is elementwise product and $g'$ the activation's derivative:`,
        },
        { type: 'math', tex: r`\boldsymbol\delta^{[L]} = (\hat{\mathbf y}-\mathbf y)\odot g'\big(\mathbf{z}^{[L]}\big)` },
        { type: 'math', tex: r`\boldsymbol\delta^{[\ell]} = \big(\mathbf{W}^{[\ell+1]\top}\boldsymbol\delta^{[\ell+1]}\big)\odot g'\big(\mathbf{z}^{[\ell]}\big)` },
        {
          type: 'p',
          text: r`The gradients for each layer's parameters then follow directly:`,
        },
        { type: 'math', tex: r`\frac{\partial\mathcal{L}}{\partial\mathbf{W}^{[\ell]}} = \boldsymbol\delta^{[\ell]}\,\mathbf{a}^{[\ell-1]\top}, \qquad \frac{\partial\mathcal{L}}{\partial\mathbf{b}^{[\ell]}} = \boldsymbol\delta^{[\ell]}` },
        {
          type: 'note',
          variant: 'tip',
          title: 'Handy derivatives',
          text: r`$\sigma'(z) = \sigma(z)\big(1-\sigma(z)\big)$, $\;\tanh'(z) = 1-\tanh^2(z)$, and $\;\text{ReLU}'(z)=1$ if $z>0$ else $0$. These plug straight into the $g'$ terms above.`,
        },
        { type: 'heading', text: 'Step 3 — Update the parameters' },
        {
          type: 'p',
          text: r`Take a gradient-descent step against each gradient, scaled by the learning rate $\eta$:`,
        },
        { type: 'math', tex: r`\mathbf{W}^{[\ell]} \leftarrow \mathbf{W}^{[\ell]} - \eta\,\frac{\partial\mathcal{L}}{\partial\mathbf{W}^{[\ell]}}, \qquad \mathbf{b}^{[\ell]} \leftarrow \mathbf{b}^{[\ell]} - \eta\,\frac{\partial\mathcal{L}}{\partial\mathbf{b}^{[\ell]}}` },
        {
          type: 'note',
          variant: 'info',
          title: 'The training loop',
          text: r`Forward propagate → compute loss → backpropagate gradients → update weights → repeat for many mini-batches and epochs. This single loop trains networks from a 2-neuron XOR solver to billion-parameter models.`,
        },
        {
          type: 'example',
          title: 'Output-layer gradient and update',
          problem: r`A linear output neuron predicts $\hat y = 0.8$ for a target $y = 1$. Its input activation from the previous layer is $a = 0.5$. With loss $\tfrac12(\hat y - y)^2$ and $\eta = 0.1$, find the weight gradient and the updated weight (current $w = 0.4$).`,
          solution: [
            { type: 'p', text: r`**Output error.** For a linear output, $\delta = \hat y - y = 0.8 - 1 = -0.2.$` },
            { type: 'p', text: r`**Weight gradient.** $\dfrac{\partial\mathcal L}{\partial w} = \delta\cdot a = (-0.2)(0.5) = -0.1.$` },
            { type: 'p', text: r`**Update.** $w \leftarrow 0.4 - 0.1(-0.1) = 0.4 + 0.01 = 0.41.$` },
            { type: 'p', text: r`The weight increased slightly, pushing the next prediction from 0.8 toward the target 1. Repeated over many examples, this is how the network learns.` },
          ],
          answer: 'gradient −0.1 → w updates 0.4 → 0.41',
        },
        {
          type: 'note',
          variant: 'intuition',
          title: 'The big picture',
          text: r`Perceptron → MLP architecture → forward propagation → loss → backpropagation → gradient descent → updated weights and biases. You now have the full pipeline that underlies all of deep learning.`,
        },
      ],
    },
  ],
};
