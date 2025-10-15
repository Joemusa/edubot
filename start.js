const fs = require('fs');
const path = require('path');

const mainPath = path.join(__dirname, 'cloud', 'main.js');

if (fs.existsSync(mainPath)) {
    require(mainPath);
} else {
    console.error(`Error: File not found at ${mainPath}`);
    console.error('Please ensure cloud/main.js exists.');
    process.exit(1);
}
