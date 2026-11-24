# Learning AI Can be Fun (LIACbF)

Interactive virtual laboratories for artificial intelligence, by **Paulo Moura Oliveira**.

A static website: no build step, no server, no dependencies. Open `index.html` directly, or upload the folder to any web host (GitHub Pages, Netlify, Cloudflare Pages, a university server). The homepage and the labs follow the visitor's light or dark system setting.

Sister site: [Learning Control Can be Fun](https://mouraoliveira.github.io/Learning-Control-Can-be-Fun/) (feedback control systems). LIACbF uses the same structure.

## Laboratories

| # | Lab | Level | Topic |
|---|-----|-------|-------|
| 1 | From Brain Cells to Artificial Neurons | Introductory | Neural networks |
| 2 | Neuron Lab (McCulloch–Pitts and Perceptron) | Introductory | Neural networks |
| 3 | Perceptron Lab | Intermediate | Neural networks |
| 4 | Backpropagation, one step at a time | Intermediate | Neural networks |
| 5 | K-means Lab | Introductory | Machine learning |
| 6 | Simulated Annealing Lab | Introductory | Optimization |
| 7 | Genetic Algorithm Lab | Introductory | Optimization |
| 8 | Particle Swarm Optimization Explorer | Intermediate | Optimization |

The order is the suggested learning order. It is also the order of the cards and of the Prev/Next buttons.

Why this order: labs 1 to 4 build up the neuron, from a single unit to a trained network. Lab 5 steps away from neurons to learning from unlabelled data. Labs 6 to 8 are three search methods that grow in complexity. Annealing follows one walker, the genetic algorithm evolves a whole population with selection, crossover and mutation, and particle swarm optimization gives every member of the population a velocity and a memory.

## What is in the folder

```
index.html            homepage (hero demo, search and filters, lab cards, About)
assets/
  labs.js             the lab registry: the only file you edit to add a lab
  app.js              homepage logic and the card thumbnails
  site.css            homepage styles
  lab-nav.js          floating Home / Prev / Next button used inside each lab
labs/                 one self-contained HTML file per laboratory
templates/
  lab-template.html   starting point for a new lab
```

## Run it locally

Double-click `index.html`, or from this folder run `python3 -m http.server` and open <http://localhost:8000>.

## Publish on GitHub Pages

1. Create a repository (for example `Learning-AI-Can-be-Fun`) and upload the contents of this folder, with `index.html` at the top level.
2. In the repository go to **Settings → Pages**, choose **Deploy from a branch**, select `main` and `/ (root)`, and save.
3. After a minute the site is live at `https://<your-user>.github.io/<repository>/`.

## Add a laboratory

1. **Save the lab** as one HTML file in `labs/`, for example `labs/gradient-descent.html`. It must be self-contained (inline CSS and JavaScript). `templates/lab-template.html` is a ready starting point.
2. **Add two script tags** just before `</body>` of the lab, with `../` in front:
   ```html
   <script src="../assets/labs.js"></script>
   <script src="../assets/lab-nav.js"></script>
   ```
3. **Add one entry** to `window.LABS` in `assets/labs.js`. Place it where it belongs in the learning order:
   ```js
   {
     id: 'gradient-descent',
     title: 'Gradient Descent Lab',
     file: 'labs/gradient-descent.html',
     level: 'Intermediate',          // Introductory | Intermediate | Advanced
     topic: 'Optimization',          // used by the Topic filter
     preview: 'swarm',               // thumbnail style, see below
     tags: ['Gradient descent', 'Learning rate'],
     summary: 'One or two sentences about what the lab does.',
     objectives: [
       'First thing the student will be able to do.',
       'Second thing.',
       'Third thing.'
     ]
   }
   ```

That is all. The card, the search, the level and topic filters, the lab count in the hero, and the Prev/Next buttons inside every lab update automatically. A new `level` or `topic` value gets its own filter button.

### Thumbnails

`preview` picks one of the drawings in `assets/app.js` (object `PV`): `neuron`, `gates`, `regions`, `backprop`, `clusters`, `anneal`, `genetic`, `swarm`. Any other value shows a neutral placeholder. To draw a new one, add a function to `PV` that returns an SVG with a 240 × 120 viewBox, using the colour variables `--a`, `--b`, `--c`, `--d`, `--ink`, `--mute` and `--card` so it works in light and dark mode.

### The floating navigation

`assets/lab-nav.js` finds the current lab by its file name in `assets/labs.js`, so the file name in the registry must match the file in `labs/`. The button can be minimised by the visitor. Opening a lab with `?embed=1` (for example inside an iframe) hides it.

## Notes

- **Fonts.** The homepage uses system fonts only. Two labs (Backpropagation and K-means Lab) request Google Fonts and fall back to system fonts when offline.
- **Light and dark.** Labs should follow `prefers-color-scheme`, as the existing ones do.
- **Editing the About text and footer.** They are plain HTML at the bottom of `index.html`.
- **The Perceptron Lab file** was supplied with a duplicated outer `<html>` wrapper; it was removed so the file is a single valid document. Nothing else in the lab was changed.

## Credits

Created by Paulo Moura Oliveira. The laboratories and this site were developed with generative AI tools (Claude, by Anthropic), guided by the author.
