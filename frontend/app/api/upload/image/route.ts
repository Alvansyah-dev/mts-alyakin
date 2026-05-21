import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const imgbbKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
  if (!imgbbKey) {
    return NextResponse.json({ error: 'Missing ImgBB API key' }, { status: 500 });
  }

  const formData = await request.formData();
  const file = formData.get('image') as File;
  if (!file) {
    return NextResponse.json({ error: 'No image file provided' }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const base64Image = Buffer.from(bytes).toString('base64');

  const uploadForm = new FormData();
  uploadForm.append('image', base64Image);

  const response = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbKey}`, {
    method: 'POST',
    body: uploadForm,
  });
  const result = await response.json();

  if (!result.success) {
    return NextResponse.json({ error: 'ImgBB upload failed', details: result }, { status: 500 });
  }

  return NextResponse.json({ url: result.data.url }, { status: 200 });
}
