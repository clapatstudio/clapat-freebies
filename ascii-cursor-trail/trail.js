// ClaPat — ASCII Cursor Trail — https://www.clapat-templates.com
// Vanilla JS, no dependencies. MIT License.

/* --------------------------------------------------
   Config
-------------------------------------------------- */
const config = {
    cellSize: 18,
    fontScale: 0.5,
    chars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789X#$@&*%!?',
    poolSize: 260,        // DOM cells created once, then recycled
    trailLife: 0.55,      // seconds a cell stays alive
    thickness: 3,         // extra cells scattered around each point
    spread: 1.4,          // how far those extra cells can land, in cells
    scatterBias: 0.4,     // scattered cells die sooner than the core ones
    maxStepFill: 14       // cells drawn between two pointer samples, if it moved fast
};

const fontSize = config.cellSize * config.fontScale;
const container = document.querySelector('.trail-section');

/* --------------------------------------------------
   Pool — a fixed number of cells, reused forever
-------------------------------------------------- */
const grid = document.createElement('div');
grid.className = 'trail-grid';
container.appendChild(grid);

const slots = [];
const freeSlots = [];
let entries = [];

for (let i = 0; i < config.poolSize; i++) {
    const cell = document.createElement('div');
    cell.className = 'trail-cell';
    cell.style.width = config.cellSize + 'px';
    cell.style.height = config.cellSize + 'px';
    cell.style.fontSize = fontSize + 'px';
    grid.appendChild(cell);
    slots.push(cell);
    freeSlots.push(i);
}

function randomChar() {
    return config.chars[Math.floor(Math.random() * config.chars.length)];
}

function takeSlot() {
    if (freeSlots.length) return freeSlots.pop();

    // pool exhausted — the oldest cell gives up its slot
    const oldest = entries.shift();
    slots[oldest.slot].style.visibility = 'hidden';
    return oldest.slot;
}

/* --------------------------------------------------
   Painting
-------------------------------------------------- */
function addCell(col, row, bias) {
    if (col < 0 || row < 0) return;

    const index = takeSlot();
    const cell = slots[index];

    cell.style.left = (col * config.cellSize) + 'px';
    cell.style.top = (row * config.cellSize) + 'px';
    cell.style.visibility = 'visible';
    cell.textContent = randomChar();

    entries.push({
        slot: index,
        age: 0,
        threshold: bias + Math.random() * (1 - bias)
    });
}

function paintAt(col, row) {
    addCell(col, row, 0);

    for (let i = 0; i < config.thickness; i++) {
        const offsetCol = col + Math.round((Math.random() - 0.5) * 2 * config.spread);
        const offsetRow = row + Math.round((Math.random() - 0.5) * 2 * config.spread);
        if (offsetCol === col && offsetRow === row) continue;

        addCell(offsetCol, offsetRow, config.scatterBias);
    }
}

// a fast pointer skips cells, so fill the gap or the snake breaks apart
function paintLine(fromCol, fromRow, toCol, toRow) {
    const steps = Math.min(
        config.maxStepFill,
        Math.max(Math.abs(toCol - fromCol), Math.abs(toRow - fromRow))
    );

    for (let step = 1; step <= steps; step++) {
        const ratio = step / steps;
        paintAt(
            Math.round(fromCol + (toCol - fromCol) * ratio),
            Math.round(fromRow + (toRow - fromRow) * ratio)
        );
    }
}

/* --------------------------------------------------
   Pointer tracking
-------------------------------------------------- */
let lastCol = null;
let lastRow = null;

container.addEventListener('pointermove', function (event) {
    const bounds = container.getBoundingClientRect();
    const x = event.clientX - bounds.left;
    const y = event.clientY - bounds.top;
    if (x < 0 || y < 0 || x > bounds.width || y > bounds.height) return;

    const col = Math.floor(x / config.cellSize);
    const row = Math.floor(y / config.cellSize);
    if (col === lastCol && row === lastRow) return;

    if (lastCol === null) {
        paintAt(col, row);
    } else {
        paintLine(lastCol, lastRow, col, row);
    }

    lastCol = col;
    lastRow = row;
});

container.addEventListener('pointerleave', function () {
    // drop the anchor so the next entry does not draw a line across the element
    lastCol = null;
    lastRow = null;
});

/* --------------------------------------------------
   Life cycle — random threshold, not a fade
-------------------------------------------------- */
let lastTime = performance.now();

function tick(now) {
    const deltaSeconds = (now - lastTime) / 1000;
    lastTime = now;

    for (let i = entries.length - 1; i >= 0; i--) {
        const entry = entries[i];
        entry.age += deltaSeconds;
        const life = 1 - entry.age / config.trailLife;

        if (life <= 0) {
            slots[entry.slot].style.visibility = 'hidden';
            freeSlots.push(entry.slot);
            entries.splice(i, 1);
            continue;
        }

        slots[entry.slot].style.visibility = life > entry.threshold ? 'visible' : 'hidden';
    }

    requestAnimationFrame(tick);
}

requestAnimationFrame(tick);
