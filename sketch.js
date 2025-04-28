let mic, fft;
let blocks = [];

function setup() {
  createCanvas(600, 400);
  mic = new p5.AudioIn();
  mic.start();
  fft = new p5.FFT(0.9, 16);
  fft.setInput(mic);

  // Block-Definitionen (x, y, Breite, Höhe)
  blocks = [
    { x: 100, y: 0, w: 40, h: 300 },  // 0: kleines ’i’
    { x: 160, y: 0, w: 40, h: 200 },  // 1: ’L’-Shape
    // 2+3: unser П+м–Shape, beide mit exakt gleicher Ausgangs-Höhe h=250
    { x: 250, y: 0, w: 40, h: 250 },  // linker Vertikal-Balken
    { x: 300, y: 0, w: 40, h: 250 },  // rechter Vertikal-Balken
    { x: 360, y: 0, w: 40, h: 300 }   // 4: letzter dynamischer Block
  ];
}

function draw() {
  background(255);
  let spectrum = fft.analyze();

  noStroke();
  fill(0);

  for (let i = 0; i < blocks.length; i++) {
    let b    = blocks[i];
    let band = spectrum[i % spectrum.length];
    let deltaH = map(band, 0, 255, -50, 50);

    // --- Block 0: kleines ’i’ -----------------------
    if (i === 0) {
      let dotSize = b.w;
      rect(b.x, b.y, dotSize, dotSize);
      let stemH = max(0, b.h + deltaH);
      let gap   = 10;
      rect(b.x, b.y + dotSize + gap, b.w, stemH);
    }
    // --- Block 1: L-Shape ---------------------------
    else if (i === 1) {
      let newH1 = max(0, b.h + deltaH);
      // vertikaler, wabernder Schaft
      rect(b.x, b.y, b.w, newH1);
      // statische Kopf-Leiste (Breite bis ganz rechts)
      let barHeight = b.w;
      let rightMost = blocks[4].x + blocks[4].w;
      rect(b.x, b.y, rightMost - b.x, barHeight);
    }
    // --- Block 2: цельный ’П+м’-Shape ---------------
    else if (i === 2) {
      // Durchschnitt der beiden Bänder 2 und 3
      let band2   = spectrum[2];
      let band3   = spectrum[3];
      let bandAvg = (band2 + band3) / 2;
      let newH    = max(0, b.h + map(bandAvg, 0, 255, -50, 50));

      // Koordinaten
      let x1  = blocks[2].x;
      let x2  = blocks[3].x;
      let w   = b.w;
      let fullW = (x2 + w) - x1;

      // 1) Obere Leiste
      rect(x1, 0, fullW, w);
      // 2) Untere Leiste
      rect(x1, newH - w, fullW, w);
      // 3) Linke Vertikale
      rect(x2, 0, w, newH);
      // 4) Rechte Vertikale
      rect(x2, 0, w, newH);
    }
    // --- Block 3: wird von Block 2 gemalt -----------
    else if (i === 3) {
      continue;
    }
    // --- Block 4: ganz normal ----------------------
    else {
      let newH4 = max(0, b.h + deltaH);
      rect(b.x, b.y, b.w, newH4);
    }
  }
}
