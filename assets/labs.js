/*
 * Learning AI Can be Fun (LAICbF): laboratory registry
 * -----------------------------------------------------
 * This is the ONLY file you edit to add a laboratory.
 * The homepage cards, filters, search and the Prev/Next buttons inside each lab
 * are all generated from this list. The order here is the suggested learning order.
 *
 * Fields
 *   id          unique, lower-case, no spaces (used internally)
 *   title       name shown on the card and in the Prev/Next buttons
 *   file        path to the lab page, relative to index.html (labs/<name>.html)
 *   level       'Introductory' | 'Intermediate' | 'Advanced'
 *   topic       one broad topic, used by the Topic filter (e.g. 'Neural networks')
 *   preview     thumbnail style: neuron | gates | regions | backprop | clusters | anneal | genetic | swarm
 *               (anything else shows a neutral placeholder; see assets/app.js)
 *   tags        2 to 3 short phrases
 *   summary     one or two sentences
 *   objectives  exactly three "you will be able to ..." statements, written as
 *               sentences that complete "You will learn to:"
 */
window.LABS = [
  {
    id: 'simulated-annealing',
    title: 'Simulated Annealing Lab',
    file: 'labs/simulated-annealing-lab.html',
    level: 'Introductory',
    topic: 'Optimization',
    preview: 'anneal',
    tags: ['Local search', 'Cooling schedule', 'Travelling salesperson'],
    summary: 'Send a walker across a bumpy landscape and watch it sometimes accept a worse move, with a chance set by the temperature. Compare it with hill climbing, change the cooling schedule and shorten a travelling salesperson tour.',
    objectives: [
      'Explain why hill climbing gets stuck in a local minimum, and compute the chance of accepting a worse move.',
      'Predict how the temperature and the cooling schedule turn the search from a random walk into hill climbing.',
      'Judge a randomised algorithm from many trials, on a landscape and on a travelling salesperson tour.'
    ]
  },
  {
    id: 'genetic-algorithm',
    title: 'Genetic Algorithm Lab',
    file: 'labs/genetic-algorithm-lab.html',
    level: 'Introductory',
    topic: 'Optimization',
    preview: 'genetic',
    tags: ['Evolutionary computation', 'Selection and crossover', 'Mutation'],
    summary: 'Encode solutions as bit strings, then try selection, crossover and mutation one at a time before running a complete genetic algorithm and watching the best and average fitness climb.',
    objectives: [
      'Decode a bit-string chromosome and compute its fitness.',
      'Compare roulette-wheel and tournament selection, and one-point, two-point and uniform crossover.',
      'Explain what mutation, elitism and population size do in a full run of the algorithm.'
    ]
  },
  {
    id: 'pso',
    title: 'Particle Swarm Optimization Explorer',
    file: 'labs/pso-explorer.html',
    level: 'Intermediate',
    topic: 'Optimization',
    preview: 'swarm',
    tags: ['Swarm intelligence', 'Metaheuristics', 'Global search'],
    summary: 'Release a swarm on landscapes from a single valley to the very bumpy Rastrigin function, and watch inertia, personal memory and social pull decide where it settles.',
    objectives: [
      'Explain the update rule as the sum of an inertia, a cognitive and a social pull.',
      'Tune w, c₁ and c₂ and observe the balance between exploration and convergence.',
      'Recognise premature convergence on a local minimum and what causes it.'
    ]
  },
  {
    id: 'artificial-neurons',
    title: 'From Brain Cells to Artificial Neurons',
    file: 'labs/from-brain-cells-to-artificial-neurons.html',
    level: 'Introductory',
    topic: 'Neural networks',
    preview: 'neuron',
    tags: ['Artificial neuron', 'Weights and bias', 'Activation functions'],
    summary: 'Compare a biological neuron with an artificial one, part by part, then build intuition by changing the inputs, weights, bias and activation function.',
    objectives: [
      'Match each part of a biological neuron to its counterpart in an artificial neuron.',
      'Explain how inputs, weights and bias combine into the weighted sum z and then into the output y.',
      'Compare sigmoid, ReLU, tanh and step activation functions.'
    ]
  },
  {
    id: 'neuron-lab',
    title: 'Neuron Lab',
    file: 'labs/neuron-lab.html',
    level: 'Introductory',
    topic: 'Neural networks',
    preview: 'gates',
    tags: ['McCulloch–Pitts', 'Perceptron', 'Logic gates'],
    summary: 'Build logic gates with a McCulloch–Pitts neuron by choosing weights and a threshold, then train a perceptron on labelled points and see why XOR defeats a single neuron.',
    objectives: [
      'Set the weights and threshold of a McCulloch–Pitts neuron to implement AND, OR, NOT and other gates.',
      'Relate a neuron’s weights and threshold to a straight decision line in the input space.',
      'Train a perceptron with the update rule and explain why one neuron cannot learn XOR.'
    ]
  },
  {
    id: 'perceptron-lab',
    title: 'Perceptron Lab',
    file: 'labs/perceptron-lab.html',
    level: 'Intermediate',
    topic: 'Neural networks',
    preview: 'regions',
    tags: ['Heaviside neurons', 'Hidden layer', 'Decision regions'],
    summary: 'Draw lines, place labelled points and let the lab find the smallest network of step neurons that separates them, with every equation and weight derived step by step.',
    objectives: [
      'Turn a line drawn in the plane into the weights of a step-function (Heaviside) neuron.',
      'Combine hidden neurons and an output neuron to carve out regions such as a band or a triangle.',
      'Follow the derivation of the hidden and output weights, then test your own weights on the points.'
    ]
  },
  {
    id: 'backpropagation',
    title: 'Backpropagation, one step at a time',
    file: 'labs/backpropagation.html',
    level: 'Intermediate',
    topic: 'Neural networks',
    preview: 'backprop',
    tags: ['Backpropagation', 'Delta rule', 'Gradient descent'],
    summary: 'Step through one training round of a tiny network: the forward pass, the error, the delta of each neuron computed backward, and the weight updates that follow.',
    objectives: [
      'Follow the forward pass and measure the error with the loss E = ½Σ(t − o)².',
      'Compute the output deltas first, then the hidden delta that inherits blame from both outputs.',
      'Explain how the activation slope and the learning rate shape each update, and why a step function stops learning.'
    ]
  },
  {
    id: 'k-means',
    title: 'K-means Lab',
    file: 'labs/k-means-lab.html',
    level: 'Introductory',
    topic: 'Machine learning',
    preview: 'clusters',
    tags: ['Clustering', 'Unsupervised learning', 'K-means'],
    summary: 'Step through the assign and move loops of k-means, drag the centroids, compare random starts and use the inertia curve to choose k.',
    objectives: [
      'Predict where a centroid moves in the Move step and explain why.',
      'Show that the starting centroids change the result, and keep the run with the lowest inertia.',
      'Choose k from the inertia-versus-k curve and name the data shapes where k-means fails.'
    ]
  }
];
