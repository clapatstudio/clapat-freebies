# ASCII Cursor Trail

A cursor trail that paints a snake of random ASCII characters wherever the pointer moves. Pure vanilla JavaScript, no dependencies. Cells are pooled and recycled for performance, and fast movements are gap-filled so the trail never breaks apart.

Part of [ClaPat Freebies](https://github.com/clapatstudio/clapat-freebies) · [Live components on CodePen](https://codepen.io/clapat)

## Demo

**[▶ Live demo](https://clapatstudio.github.io/clapat-freebies/ascii-cursor-trail/)** — move the mouse across the page.

Or open `index.html` locally in your browser.

## Usage

Copy `trail.css` and `trail.js` into your project, then add a full-screen container with the class `trail-section`:

```html
<link rel="stylesheet" href="trail.css">

<section class="trail-section">
    <!-- your content -->
</section>

<script src="trail.js"></script>
```

The trail is drawn inside `.trail-section`, so it only reacts to the pointer over that element. Make the section as large as you want the effect to cover.

## Configuration

Tweak the `config` object at the top of `trail.js`:

| Option | Default | What it does |
|--------|---------|--------------|
| `cellSize` | `18` | Size of each character cell, in pixels |
| `chars` | `A–Z 0–9 …` | The pool of characters drawn |
| `poolSize` | `260` | Max cells on screen at once (recycled) |
| `trailLife` | `0.55` | How long, in seconds, a cell stays alive |
| `thickness` | `3` | Extra cells scattered around each point |
| `spread` | `1.4` | How far the scattered cells can land |
| `maxStepFill` | `14` | Cells drawn between two fast pointer samples |

Colors live in `trail.css` — change `background-color` and `color` on `.trail-cell` for your own palette.

## License

MIT — free for personal and commercial use. For the complete portfolio system, see [ClaPat Templates](https://www.clapat-templates.com) (HTML) or [ClaPat Themes](https://www.clapat-themes.com) (WordPress).
