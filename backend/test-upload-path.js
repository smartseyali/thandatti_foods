const path = require('path');
const fs = require('fs');

// Simulate what happens in uploadController.js
const controllersDir = __dirname + '/src/controllers';
const backendDir = path.resolve(controllersDir, '../..');
const uploadPath = path.resolve(backendDir, '../public/assets/img/product');

console.log('=== UPLOAD PATH TEST ===');
console.log('Controllers directory:', controllersDir);
console.log('Backend directory:', backendDir);
console.log('Upload path:', uploadPath);
console.log('Upload path exists:', fs.existsSync(uploadPath));
console.log('Upload path is absolute:', path.isAbsolute(uploadPath));

// Test if we can write to it
if (fs.existsSync(uploadPath)) {
  try {
    const testFile = path.join(uploadPath, 'test-write.txt');
    fs.writeFileSync(testFile, 'test');
    console.log('✓ Directory is writable');
    fs.unlinkSync(testFile);
    console.log('✓ Test file deleted');
  } catch (error) {
    console.error('✗ Directory is NOT writable:', error.message);
  }
} else {
  console.log('Creating directory...');
  try {
    fs.mkdirSync(uploadPath, { recursive: true });
    console.log('✓ Directory created');
  } catch (error) {
    console.error('✗ Failed to create directory:', error.message);
  }
}

// Check what server.js uses
const serverDir = __dirname;
const serverPublicPath = path.join(serverDir, '../public/assets');
console.log('\n=== SERVER STATIC PATH ===');
console.log('Server directory:', serverDir);
console.log('Server public path:', path.resolve(serverPublicPath));
console.log('Server public path exists:', fs.existsSync(path.resolve(serverPublicPath)));

// Verify they match
const serverProductPath = path.join(path.resolve(serverPublicPath), 'img/product');
console.log('\n=== PATH VERIFICATION ===');
console.log('Upload path:', uploadPath);
console.log('Server product path:', serverProductPath);
console.log('Paths match:', uploadPath === serverProductPath);

