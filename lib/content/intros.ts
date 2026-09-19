import type { LessonIntro } from './types';

/**
 * Background "At a glance" cards keyed by lesson slug. Kept separate from the
 * lesson bodies so every topic gets the same definition / why / when scaffold,
 * merged onto the lesson in `index.ts`.
 */
export const intros: Record<string, LessonIntro> = {
  // ----------------------------- Supervised -----------------------------
  'introduction-to-supervised-learning': {
    definition:
      'Supervised learning trains a model on labelled examples — inputs paired with their known correct output — so it can predict the output for new, unseen inputs.',
    whyItMatters:
      'It is the most widely used form of ML in practice: spam filters, price prediction, medical diagnosis and recommendation all learn from historical labelled data to make a specific prediction.',
    whenToUse: [
      'You have labelled data (each example carries a known target)',
      'There is a clear thing you want to predict — a number or a category',
      'Past examples are representative of the cases you will face',
    ],
    whenNotToUse: [
      'No labels are available — use unsupervised learning instead',
      'The "correct answer" is not well defined or is too costly/noisy to label',
    ],
  },
  'linear-regression': {
    definition:
      'A model that predicts a continuous target as a linear (straight-line or hyperplane) combination of the input features.',
    whyItMatters:
      'It is the simplest, most interpretable regression method — each coefficient directly tells you how much the target moves per unit of a feature — and a fast baseline every other model is measured against.',
    whenToUse: [
      'The target is a continuous number',
      'The relationship with the features is roughly linear',
      'You want an interpretable, quick baseline',
    ],
    whenNotToUse: [
      'The relationship is strongly non-linear',
      'Data has heavy outliers (squared error is sensitive to them)',
      'Features are highly collinear (without adding regularization)',
    ],
  },
  'logistic-regression': {
    definition:
      'A linear model for classification: it computes a linear score and passes it through the sigmoid to output the probability of a class.',
    whyItMatters:
      'It gives interpretable weights and well-calibrated probabilities, making it the standard strong baseline for binary classification.',
    whenToUse: [
      'Binary classification (or multi-class via softmax)',
      'You want class probabilities, not just a label',
      'The classes are roughly separable by a straight boundary',
    ],
    whenNotToUse: [
      'The decision boundary is highly non-linear (without feature engineering)',
      'Features and classes have complex interactions a linear score cannot capture',
    ],
  },
  'k-nearest-neighbors': {
    definition:
      'A lazy, instance-based method that predicts from the k closest training points — majority vote for classification, average for regression.',
    whyItMatters:
      'It needs no training and makes no assumptions about the data, yet is a genuinely non-linear, multi-class-capable, and highly intuitive baseline.',
    whenToUse: [
      'Small-to-medium datasets with a meaningful distance metric',
      'Low-to-moderate number of (scaled) features',
      'You want a simple non-linear baseline with no training step',
    ],
    whenNotToUse: [
      'Large datasets — every prediction scans all the data (slow)',
      'High-dimensional data (the curse of dimensionality)',
      'Many irrelevant or unscaled features',
    ],
  },
  'decision-trees': {
    definition:
      'A model that predicts by asking a sequence of feature-threshold questions, recursively splitting the data into increasingly pure regions.',
    whyItMatters:
      'Trees are among the most interpretable models — you can read the decision rules directly — and they handle non-linearities and mixed feature types with almost no preprocessing.',
    whenToUse: [
      'You need a human-readable, explainable model',
      'Features are a mix of numeric and categorical',
      'The target depends on non-linear feature interactions',
    ],
    whenNotToUse: [
      'You need top accuracy and stability — a single tree overfits (use ensembles)',
      'The underlying relationship is very smooth (linear models fit better)',
    ],
  },
  'random-forests': {
    definition:
      'An ensemble that averages many decorrelated decision trees, each grown on a bootstrap sample using a random subset of features at each split.',
    whyItMatters:
      'Averaging cancels the high variance of individual trees, giving strong, robust accuracy on tabular data with very little tuning.',
    whenToUse: [
      'Tabular data where you want strong accuracy out of the box',
      'You want feature-importance insight and robustness to outliers',
      'Little time to tune hyperparameters',
    ],
    whenNotToUse: [
      'You need a single, human-readable rule set',
      'Very tight latency or memory budgets (many trees are heavy)',
    ],
  },
  'support-vector-machines': {
    definition:
      'A classifier that finds the separating hyperplane with the widest margin to the nearest points; kernels let it draw non-linear boundaries.',
    whyItMatters:
      'Maximising the margin gives strong generalisation, it is effective in high dimensions, and the kernel trick handles non-linear data elegantly.',
    whenToUse: [
      'Small-to-medium datasets with a clear margin of separation',
      'High-dimensional data such as text',
      'Non-linear boundaries needed (via an RBF or polynomial kernel)',
    ],
    whenNotToUse: [
      'Very large datasets (training scales poorly)',
      'You need probabilities directly, or classes overlap heavily with noise',
    ],
  },
  'naive-bayes': {
    definition:
      "A probabilistic classifier that applies Bayes' theorem while naively assuming the features are conditionally independent given the class.",
    whyItMatters:
      'The independence shortcut makes it extremely fast and effective even with little training data — a famously strong baseline for text.',
    whenToUse: [
      'Text classification and spam filtering',
      'High-dimensional, sparse features',
      'You need a very fast baseline or have limited training data',
    ],
    whenNotToUse: [
      'Features are strongly correlated and you need calibrated probabilities',
      'The independence assumption is badly violated in ways that affect ranking',
    ],
  },
  'loss-functions-and-gradient-descent': {
    definition:
      'A loss function measures how wrong a model is; gradient descent is the algorithm that iteratively adjusts parameters to make that loss small.',
    whyItMatters:
      'Together they are the optimisation engine behind most of machine learning and virtually all of deep learning — the concrete mechanism by which models "learn".',
    whenToUse: [
      'Any model trained by minimising a differentiable loss',
      'Linear/logistic regression, neural networks and beyond',
      'When no closed-form solution exists or the dataset is too large for one',
    ],
    whenNotToUse: [
      'A closed-form solution exists and is cheap (e.g. the normal equations)',
      'The objective is non-differentiable (needs a different optimiser)',
    ],
  },
  'overfitting-bias-variance-regularization': {
    definition:
      'A set of core ideas explaining why models fail to generalise — overfitting, underfitting, the bias–variance trade-off — and regularization, the main tool to control model complexity.',
    whyItMatters:
      'Generalising to unseen data is the entire point of ML; managing the bias–variance trade-off is the single most important skill across every model.',
    whenToUse: [
      'Diagnosing a gap between training and test performance',
      'Choosing model complexity or tuning regularization strength',
      'Deciding whether to gather more data or simplify the model',
    ],
  },
  'model-evaluation-metrics': {
    definition:
      'The metrics and procedures — confusion matrix, precision/recall/F1, MAE/RMSE/R² and cross-validation — used to measure how well a model performs.',
    whyItMatters:
      'You cannot improve or trust a model you cannot measure correctly, and the right metric depends entirely on the problem (accuracy is misleading on imbalanced data).',
    whenToUse: [
      'Evaluating any trained model before you rely on it',
      'Imbalanced classification → precision/recall/F1',
      'Regression → RMSE, MAE, R²; robust comparison → cross-validation',
    ],
  },

  // ---------------------------- Unsupervised ----------------------------
  'introduction-to-unsupervised-learning': {
    definition:
      'Learning structure directly from unlabelled data — there is no target variable, only the features.',
    whyItMatters:
      'Labels are often expensive or unavailable, so discovering groups, patterns and compact representations is valuable both on its own and as preprocessing for other models.',
    whenToUse: [
      'You have data but no labels',
      'You want to explore, segment, compress or find anomalies',
      'You need features or structure to feed a later supervised model',
    ],
    whenNotToUse: [
      'You have labels and a specific prediction target (use supervised learning)',
    ],
  },
  'k-means-clustering': {
    definition:
      'A clustering algorithm that partitions data into k groups, each represented by a centroid, by minimising within-cluster variance.',
    whyItMatters:
      'It is the fast, simple, scalable default for segmentation — grouping customers, images or documents into k coherent clusters.',
    whenToUse: [
      'Clusters are roughly spherical and similar in size',
      'You can estimate k (or search for it via the elbow/silhouette)',
      'Numeric, scaled features and possibly large data',
    ],
    whenNotToUse: [
      'Clusters are elongated, nested or of very different density',
      'k is genuinely unknown, or there are many outliers',
    ],
  },
  'hierarchical-clustering': {
    definition:
      'A method that builds a whole tree of nested clusters (a dendrogram) by repeatedly merging the closest clusters (or splitting the data).',
    whyItMatters:
      'It needs no pre-specified k and its dendrogram reveals structure at every scale, letting you cut it wherever makes sense.',
    whenToUse: [
      'Small-to-medium datasets',
      'You want a cluster hierarchy or a dendrogram to inspect',
      'You are unsure how many clusters exist',
    ],
    whenNotToUse: [
      'Large datasets — the cost grows at least quadratically',
      'You only need a single flat partition at scale (k-means is cheaper)',
    ],
  },
  dbscan: {
    definition:
      'A density-based clustering algorithm that groups densely packed points together and labels points in sparse regions as noise.',
    whyItMatters:
      'Unlike k-means it finds arbitrarily shaped clusters, needs no k, and flags outliers automatically.',
    whenToUse: [
      'Clusters have irregular, non-spherical shapes',
      'The data contains noise/outliers you want identified',
      'Cluster density is roughly uniform',
    ],
    whenNotToUse: [
      'Clusters have widely varying densities (one ε cannot fit all)',
      'High-dimensional data, or ε is hard to choose',
    ],
  },
  'gaussian-mixture-models': {
    definition:
      'A probabilistic model that treats the data as a mixture of several Gaussian distributions, fit with the EM algorithm, giving each point a soft (probabilistic) cluster membership.',
    whyItMatters:
      'It allows elliptical, different-sized clusters and calibrated membership probabilities — a more flexible, softer alternative to k-means.',
    whenToUse: [
      'Clusters overlap and you want soft/probabilistic assignments',
      'Clusters are elliptical rather than spherical',
      'You also want a density estimate of the data',
    ],
    whenNotToUse: [
      'Very high dimensions (covariance has too many parameters)',
      'Clusters are clearly non-Gaussian, or you need maximum speed/simplicity',
    ],
  },
  'principal-component-analysis': {
    definition:
      'A linear dimensionality-reduction technique that projects data onto the orthogonal directions (principal components) of greatest variance.',
    whyItMatters:
      'It compresses many correlated features into a few uncorrelated ones — reducing noise, speeding up models and enabling 2-D/3-D visualisation.',
    whenToUse: [
      'Many correlated numeric features',
      'Preprocessing/compression before another model',
      'Visualising high-dimensional data in 2-D or 3-D',
    ],
    whenNotToUse: [
      'The important structure is non-linear (use t-SNE or autoencoders)',
      'You must keep the original features interpretable',
    ],
  },
  't-sne-and-autoencoders': {
    definition:
      'Two non-linear dimensionality-reduction tools: t-SNE for visualising clusters in 2-D/3-D, and autoencoders — neural networks that compress data through a bottleneck and reconstruct it.',
    whyItMatters:
      'They capture curved structure that linear PCA cannot, revealing clusters (t-SNE) or learning compact, reusable representations (autoencoders).',
    whenToUse: [
      't-SNE: exploring/visualising clusters in high-dimensional data',
      'Autoencoders: non-linear compression, denoising, or anomaly detection',
      'You have enough data to train a neural network (for autoencoders)',
    ],
    whenNotToUse: [
      'Using t-SNE distances or axes as quantitative features (they are not meaningful)',
      'Little data, or when linear PCA already suffices',
    ],
  },
  'association-rule-learning': {
    definition:
      'A technique that mines frequent itemsets and "if X then Y" rules — scored by support, confidence and lift — from transaction data.',
    whyItMatters:
      'It surfaces interpretable co-occurrence patterns behind market-basket analysis, cross-selling and recommendations ("bought together").',
    whenToUse: [
      'Transactional / basket data of items per event',
      'You want human-readable association rules',
      'Categorical co-occurrence rather than numeric prediction',
    ],
    whenNotToUse: [
      'Continuous data or a predictive-accuracy goal',
      'Huge itemset spaces without efficient pruning',
    ],
  },
  'anomaly-detection': {
    definition:
      'The task of identifying rare points that differ markedly from the normal pattern of the data.',
    whyItMatters:
      'Fraud, equipment faults, intrusions and sensor errors are costly, rare, and usually unlabelled — so we learn "normal" and flag deviations.',
    whenToUse: [
      'Rare-event detection where most data is normal',
      'Few or no labelled examples of the anomalies',
      'Monitoring, fraud, fault and intrusion detection',
    ],
    whenNotToUse: [
      'You have balanced classes with plenty of labels (use supervised classification)',
      '"Normal" is ill-defined or drifts rapidly over time',
    ],
  },

  // ----------------------------- Perceptron -----------------------------
  'the-perceptron': {
    definition:
      'The simplest artificial neuron: it forms a weighted sum of its inputs plus a bias and passes it through a step threshold to output 0 or 1.',
    whyItMatters:
      'It is the historical and conceptual foundation of all neural networks, introducing weights, bias, activation and the decision boundary.',
    whenToUse: [
      'Learning the fundamental building block of neural networks',
      'Linearly separable binary classification',
      'Building intuition for weights, bias and thresholds',
    ],
    whenNotToUse: [
      'Data that is not linearly separable (e.g. XOR)',
      'Real-world tasks — use multilayer/modern networks',
    ],
  },
  'perceptron-learning-rule': {
    definition:
      'An error-driven rule that nudges the weights and bias whenever the perceptron misclassifies a point — guaranteed to converge if the data is linearly separable.',
    whyItMatters:
      'It shows concretely how a neuron learns, and its failure on XOR is exactly what motivated hidden layers and the multilayer perceptron.',
    whenToUse: [
      'Understanding how weight updates and learning rates work',
      'Linearly separable training data',
      'As a conceptual bridge toward backpropagation',
    ],
    whenNotToUse: [
      'Non-separable data — the rule never settles',
      'Practical modelling of complex, real datasets',
    ],
  },

  // -------------------------------- MLP --------------------------------
  'mlp-architecture-and-activations': {
    definition:
      'A feedforward neural network with one or more hidden layers and non-linear activation functions, able to approximate complex non-linear functions.',
    whyItMatters:
      'Hidden layers overcome the perceptron’s linear limit (solving XOR); the MLP is the foundation of deep learning and a universal function approximator.',
    whenToUse: [
      'Non-linear patterns that simpler models underfit',
      'Large datasets with vector/tabular inputs',
      'When you can afford training and tuning a network',
    ],
    whenNotToUse: [
      'Very small datasets (they overfit)',
      'You need interpretability, or linear/tree models already suffice',
    ],
  },
  'backpropagation-and-gradient-descent': {
    definition:
      'The algorithm that computes the gradient of the loss with respect to every weight by applying the chain rule backward through the network, so gradient descent can update them.',
    whyItMatters:
      'It is the training engine of virtually every neural network and all of modern deep learning.',
    whenToUse: [
      'Training any differentiable neural network',
      'Understanding how deep models actually learn',
      'Debugging training issues like vanishing gradients',
    ],
    whenNotToUse: [
      'Models with non-differentiable components (need other methods)',
      'When a simpler model with a closed-form solution is enough',
    ],
  },
};
