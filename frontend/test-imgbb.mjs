import fs from 'fs';

async function test() {
  const imgbbKey = '3d2dd4b825ab1634c42a9f06e8b3f6e4';
  
  // Create a 1x1 transparent png
  const base64Image = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';

  const uploadForm = new FormData();
  uploadForm.append('image', base64Image);

  const response = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbKey}`, {
    method: 'POST',
    body: uploadForm,
  });
  
  const result = await response.json();
  console.log(result);
}

test();
