const fs = require('fs');
const files = [
  'app/admin/whatsapp-settings/page.tsx',
  'app/admin/website-settings/page.tsx',
  'app/admin/profil-settings/page.tsx',
  'app/admin/ppdb-settings/page.tsx',
  'app/admin/popup-settings/page.tsx',
  'app/admin/konsultasi-settings/page.tsx',
  'app/admin/home-settings/page.tsx',
  'app/admin/footer-settings/page.tsx',
];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');

  // Replace the firebase auth check with localStorage check
  content = content.replace(
    /\/\/ Cek auth dulu\s+const \{ auth \} = await import\('@\/lib\/firebase'\)\s*\n\s*const user = auth\?\.currentUser\s*\n\s*\n?\s*if \(!user\) \{\s*\n\s*toast\.error\('Sesi habis\. Silakan login ulang\.'\)\s*\n\s*setTimeout\(\(\) => \{\s*\n\s*window\.location\.href = '\/admin\/login'\s*\n\s*\}, 1500\)\s*\n\s*return\s*\n\s*\}/g,
    `// Cek auth dari localStorage
      const adminUserStr = typeof window !== 'undefined' ? localStorage.getItem('admin_user') : null;
      if (!adminUserStr) {
        toast.error('Sesi habis. Silakan login ulang.')
        setTimeout(() => {
          window.location.href = '/admin/login'
        }, 1500)
        return
      }
      const adminUser = JSON.parse(adminUserStr)`
  );

  // Also replace updatedBy: user.email with adminUser.email
  content = content.replace(/updatedBy: user\.email/g, 'updatedBy: adminUser.email');
  content = content.replace(/updatedBy: user\?\.email/g, 'updatedBy: adminUser.email');

  fs.writeFileSync(file, content);
  console.log(`Fixed: ${file}`);
}
console.log('All done!');
