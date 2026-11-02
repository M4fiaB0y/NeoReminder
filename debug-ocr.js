const { createWorker } = require('tesseract.js');
const fs = require('fs');

async function test() {
  console.log("Starting OCR on test_routine.jpg...");
  const worker = await createWorker('eng');
  const ret = await worker.recognize('./test_routine.jpg');
  await worker.terminate();

  console.log("=== RAW OCR TEXT ===");
  console.log(ret.data.text);

  console.log("\n=== LINES WITH BBOX ===");
  ret.data.lines.forEach((line, idx) => {
    console.log(`[Line ${idx}] (${line.bbox.x0}, ${line.bbox.y0}) -> (${line.bbox.x1}, ${line.bbox.y1}): "${line.text.trim()}"`);
  });

  fs.writeFileSync('ocr_output.json', JSON.stringify({
    text: ret.data.text,
    lines: ret.data.lines.map(l => ({
      text: l.text.trim(),
      bbox: l.bbox
    }))
  }, null, 2));
}

test().catch(console.error);
