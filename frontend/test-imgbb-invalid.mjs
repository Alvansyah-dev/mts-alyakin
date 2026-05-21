import fs from 'fs';

async function test() {
  const imgbbKey = '3d2dd4b825ab1634c42a9f06e8b3f6e4';
  
  const uploadForm = new FormData();
  uploadForm.append('image', "W29iamVjdCBPYmplY3Rd");

  const response = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbKey}`, {
    method: 'POST',
    body: uploadForm,
  });
  
  const result = await response.json();
  console.log(response.status, result);
}

test();
