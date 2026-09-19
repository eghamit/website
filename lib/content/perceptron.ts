import type { Module } from './types';

const r = String.raw;

export const perceptron: Module = {
  id: 'perceptron',
  title: 'Perceptron Model',
  icon: '⚡',
  description:
    'The artificial neuron: architecture, the step activation, the learning rule that trains it, its convergence guarantee, and the famous XOR limitation that motivated deep networks.',
  lessons: [
    // ------------------------------------------------------------------
    {
      slug: 'the-perceptron',
      title: 'The Perceptron: Artificial Neuron',
      summary:
        'From biological neuron to the perceptron: weighted sum, bias, step activation and the linear decision boundary.',
      objectives: [
        'Relate biological and artificial neurons',
        'Compute the net input (weighted sum + bias)',
        'Apply the step activation and read the decision boundary',
      ],
      blocks: [
        {
          type: 'p',
          text: r`The **perceptron** (Rosenblatt, 1958) is the simplest artificial neuron and the ancestor of every modern neural network. It takes several inputs, forms a weighted sum, and fires a 0/1 output through a threshold.`,
        },
        { type: 'heading', text: 'Biological vs artificial neuron' },
        {
          type: 'table',
          headers: ['Biological neuron', 'Artificial neuron (perceptron)'],
          rows: [
            ['Dendrites receive signals', 'Inputs x₁…xₙ'],
            ['Synaptic strengths', 'Weights w₁…wₙ'],
            ['Cell body sums input', 'Net input z = Σ wᵢxᵢ + b'],
            ['Fires if above threshold', 'Step activation outputs 1 or 0'],
            ['Axon transmits output', 'Output ŷ'],
          ],
        },
        { type: 'heading', text: 'Architecture & net input' },
        {
          type: 'p',
          text: r`Each input $x_i$ has a **weight** $w_i$ (its importance) and the neuron has a **bias** $b$ (a threshold offset). The **net input** is the weighted sum:`,
        },
        { type: 'math', tex: r`z = \sum_{i=1}^{n} w_i x_i + b = \mathbf{w}^\top\mathbf{x} + b` },
        {
          type: 'diagram',
          kind: 'neuron',
          caption: 'A single artificial neuron: inputs are weighted and summed with a bias, then passed through φ.',
        },
        { type: 'heading', text: 'Step activation & output' },
        {
          type: 'p',
          text: r`A **step (threshold) activation** turns the net input into a binary decision:`,
        },
        { type: 'math', tex: r`\hat{y} = \begin{cases} 1 & \text{if } z \ge 0 \\ 0 & \text{if } z < 0 \end{cases}` },
        { type: 'heading', text: 'Decision boundary' },
        {
          type: 'p',
          text: r`The neuron switches output exactly where $z=0$, i.e. on the hyperplane $\mathbf{w}^\top\mathbf{x}+b=0$. In 2-D this is a straight **line** splitting the plane into a "1" side and a "0" side — the perceptron is a **linear classifier**.`,
        },
        {
          type: 'diagram',
          kind: 'linearly-separable',
          caption: 'A perceptron draws a single straight boundary wᵀx + b = 0 between the classes.',
        },
        {
          type: 'example',
          title: 'Build an AND gate',
          problem: r`Show that weights $w_1=w_2=1$ and bias $b=-1.5$ make a perceptron compute the logical AND of binary inputs.`,
          solution: [
            {
              type: 'table',
              headers: ['x₁', 'x₂', 'z = x₁+x₂−1.5', 'ŷ (z≥0?)', 'AND'],
              rows: [
                ['0', '0', '−1.5', '0', '0'],
                ['0', '1', '−0.5', '0', '0'],
                ['1', '0', '−0.5', '0', '0'],
                ['1', '1', '0.5', '1', '1'],
              ],
            },
            { type: 'p', text: r`The output matches AND on all four rows. The line $x_1+x_2=1.5$ is the decision boundary — only the point $(1,1)$ lands on its positive side.` },
          ],
          answer: 'w = (1,1), b = −1.5 implements AND',
        },
      ],
    },

    // ------------------------------------------------------------------
    {
      slug: 'perceptron-learning-rule',
      title: 'Perceptron Learning Rule & Its Limits',
      summary:
        'How a perceptron learns its weights, the convergence theorem, and why a single perceptron cannot solve XOR.',
      objectives: [
        'Apply the weight and bias update rules',
        'State the perceptron convergence theorem',
        'Explain the XOR problem and the need for hidden layers',
      ],
      blocks: [
        {
          type: 'p',
          text: r`The perceptron **learns** by looking at one example at a time and nudging its weights whenever it makes a mistake. The nudge is proportional to the error and the input.`,
        },
        { type: 'heading', text: 'The update rule' },
        {
          type: 'p',
          text: r`For a training example $(\mathbf{x}, y)$ with prediction $\hat y$, update every weight and the bias:`,
        },
        { type: 'math', tex: r`w_i \leftarrow w_i + \eta\,(y - \hat{y})\,x_i, \qquad b \leftarrow b + \eta\,(y - \hat{y})` },
        {
          type: 'p',
          text: r`$\eta$ is the **learning rate** (step size). Notice: if the prediction is correct, $y-\hat y = 0$ and nothing changes. If wrong, the weights shift toward the correct answer. One pass over all examples is an **epoch**; we repeat for several epochs.`,
        },
        {
          type: 'note',
          variant: 'info',
          title: 'Perceptron convergence theorem',
          text: r`If the data is **linearly separable**, the perceptron learning rule is guaranteed to find a separating boundary in a **finite** number of updates. If the data is *not* linearly separable, it never settles — it keeps cycling.`,
        },
        {
          type: 'example',
          title: 'One learning update',
          problem: r`A perceptron currently has $w=(-1,-1)$, $b=0$, learning rate $\eta=1$, step activation. It is shown $\mathbf{x}=(1,1)$ with true label $y=1$. Compute the prediction, the error, and the updated parameters.`,
          solution: [
            { type: 'p', text: r`**Net input.** $z = (-1)(1) + (-1)(1) + 0 = -2 \Rightarrow \hat y = 0$ (since $z<0$).` },
            { type: 'p', text: r`**Error.** $y - \hat y = 1 - 0 = 1$ — a misclassification, so we update.` },
            { type: 'p', text: r`**Update weights.** $w_1 = -1 + \eta(1)(x_1) = -1 + 1(1)(1) = 0$; likewise $w_2 = 0$.` },
            { type: 'p', text: r`**Update bias.** $b = 0 + \eta(1) = 1.$` },
            { type: 'p', text: r`**Check.** New params $w=(0,0),\,b=1$ give $z = 1 \ge 0 \Rightarrow \hat y = 1$ — the point is now classified correctly.` },
          ],
          answer: 'Error = 1 → w = (0,0), b = 1 (now correct)',
        },
        { type: 'heading', text: 'The XOR problem' },
        {
          type: 'p',
          text: r`A single perceptron can only draw a **straight line**, so it can only solve **linearly separable** problems. **XOR** is the classic counterexample:`,
        },
        {
          type: 'table',
          headers: ['x₁', 'x₂', 'XOR'],
          rows: [
            ['0', '0', '0'],
            ['0', '1', '1'],
            ['1', '0', '1'],
            ['1', '1', '0'],
          ],
        },
        {
          type: 'diagram',
          kind: 'xor',
          caption: 'XOR: the two classes sit on opposite diagonals — no single straight line separates them.',
        },
        {
          type: 'p',
          text: r`The two "1" points $(0,1),(1,0)$ and the two "0" points $(0,0),(1,1)$ sit on opposite diagonals — **no single line** can separate them. A single-layer perceptron therefore *cannot* learn XOR.`,
        },
        {
          type: 'note',
          variant: 'intuition',
          title: 'Why this mattered',
          text: r`This limitation (highlighted by Minsky & Papert, 1969) stalled neural-net research for years. The fix is to stack neurons into **hidden layers** — the Multilayer Perceptron — which can bend the boundary and solve XOR. That is exactly the next module.`,
        },
      ],
    },
  ],
};
