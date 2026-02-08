
import { writeFile, mkdir } from 'fs/promises';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';

export async function POST(request: NextRequest) {
    const data = await request.formData();
    const file: File | null = data.get('file') as unknown as File;

    if (!file) {
        return NextResponse.json({ success: false, message: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Simple filename sanitization
    const filename = Date.now() + '-' + file.name.replace(/[^a-zA-Z0-9.-]/g, '');
    const uploadDir = path.join(process.cwd(), 'public/uploads');

    try {
        await mkdir(uploadDir, { recursive: true });
        await writeFile(path.join(uploadDir, filename), buffer);
        return NextResponse.json({ success: true, url: `/uploads/${filename}` });
    } catch (error) {
        console.error('Upload Error', error);
        return NextResponse.json({ success: false, message: 'Server error uploading file' }, { status: 500 });
    }
}
