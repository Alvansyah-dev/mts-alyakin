const fs = require('fs');
const files = [
  'app/admin/whatsapp-settings/page.tsx',
  'app/admin/website-settings/page.tsx',
  'app/admin/profil-settings/page.tsx',
  'app/admin/ppdb-settings/page.tsx',
  'app/admin/popup-settings/page.tsx',
  'app/admin/konsultasi-settings/page.tsx',
  'app/admin/home-settings/page.tsx',
  'app/admin/footer-settings/page.tsx'
];
for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/const\s+\{\s*getAuth\s*\}\s*=\s*await\s+import\('firebase\/auth'\)[\s\S]*?const\s+user\s*=\s*auth\.currentUser/, 
    "const { auth } = await import('@/lib/firebase')\n      const user = auth?.currentUser");
  fs.writeFileSync(file, content);
}
console.log('Done');
