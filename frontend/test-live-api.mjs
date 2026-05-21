import fs from 'fs';

async function test() {
  const url = 'https://mts-alyakin.vercel.app/api/upload/image';
  
  const uploadForm = new FormData();
  // We need to pass a File/Blob, but fetch in Node 18+ can take a Blob in FormData
  const blob = new Blob(["test"], { type: 'image/png' });
  uploadForm.append('image', blob, 'test.png');

  try {
    const response = await fetch(url, {
      method: 'POST',
      body: uploadForm,
    });
    
    const text = await response.text();
    console.log("Status:", response.status);
    console.log("Response:", text);
  } catch (e) {
    console.error(e);
  }
}

test();
