const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

const envPath = path.resolve(process.cwd(), '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');

const match = envContent.match(/ADMIN_PASSWORD_HASH=(.*)/);
if (!match) {
    console.log('Could not find ADMIN_PASSWORD_HASH in .env.local');
    process.exit(1);
}

const hash = match[1].trim();
const password = 'admin123';

console.log('Loaded Hash:', hash);
console.log('Hash Length:', hash.length);
console.log('Password:', password);

bcrypt.compare(password, hash).then(isValid => {
    console.log('Is Valid?', isValid);
}).catch(err => {
    console.error('Error comparing:', err);
});
