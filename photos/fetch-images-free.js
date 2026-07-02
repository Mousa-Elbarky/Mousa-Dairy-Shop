const fs = require('fs');
const path = require('path');

const INPUT_FILE  = path.join(__dirname, 'products.js');
const OUTPUT_FILE = path.join(__dirname, 'products_with_local_images.js');

function main() {
  console.log('📦 Reading products.js ...');
  if (!fs.existsSync(INPUT_FILE)) {
    console.error(`✗ Error: Could not find ${INPUT_FILE}`);
    process.exit(1);
  }

  let raw = fs.readFileSync(INPUT_FILE, 'utf8');
  let productsMatch = raw.match(/\[[\s\S]*?\]/);
  
  if (!productsMatch) {
    console.error('✗ Error: Could not find products array.');
    process.exit(1);
  }

  let productsJsonClean = productsMatch[0]
    .replace(/'/g, '"')
    .replace(/(\w+)\s*:/g, '"$1":')
    .replace(/,\s*([\]}])/g, '$1');

  let products = JSON.parse(productsJsonClean);
  console.log(`✅ Loaded ${products.length} products. Forcing ID.png paths...\n`);

  // هنا بنجبر الديفولت يروح لـ photos/id.png عشان المتصفح يبحث عنها الأول
  const results = products.map(p => {
    return {
      id: p.id,
      price: p.price,
      name: p.name, 
      image: `photos/${p.id}.png` // المسار اللي المتصفح هيجربه الأول
    };
  });

  const lines = results.map(p =>
    `    { id: ${p.id}, price: ${p.price}, name: '${p.name.replace(/'/g, "\\'")}', image: '${p.image}' }`
  );
  const output = `const products = [\n${lines.join(',\n')}\n];\n`;
  fs.writeFileSync(OUTPUT_FILE, output, 'utf8');
  
  console.log(`🎉 Done! File created with correct paths: ${OUTPUT_FILE}`);
}

main();