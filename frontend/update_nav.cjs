const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = dir + '/' + file;
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walk(file));
        } else { 
            if (file.endsWith('.jsx')) results.push(file);
        }
    });
    return results;
}

const files = walk('./src/pages');
let changedCount = 0;

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;

    // Pattern 1: With span
    content = content.replace(/(<button[^>]*?onClick=\{\(\)\s*=>\s*navigate\()\'\/[^\']+\'(\)\}[^>]*?>\s*<ArrowLeft[^>]*?>\s*<span[^>]*?>)[^<]+(<\/span>\s*<\/button>)/g, '$1-1$2Go Back$3');

    // Pattern 2: Without span but with ArrowLeft
    content = content.replace(/(<button[^>]*?onClick=\{\(\)\s*=>\s*navigate\()\'\/[^\']+\'(\)\}[^>]*?>\s*<ArrowLeft[^>]*?>\s*)[^<]+(<\/button>)/g, '$1-1$2Go Back$3');

    // Pattern 3: Handle multi-step form logic
    content = content.replace(/(onClick=\{step === 1 \? \(\) => navigate\()\'\/[^\']+\'(\) : [^\}]+\})/g, '$1-1$2');

    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
        changedCount++;
        console.log('Updated: ' + file);
    }
});
console.log('Total files updated: ' + changedCount);
