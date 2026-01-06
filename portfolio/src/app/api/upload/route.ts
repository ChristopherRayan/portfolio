import { NextRequest, NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';
import { auth } from '@/lib/auth';

export async function POST(req: NextRequest) {
  // Allow public uploads for contact form
  // const session = await auth();
  // if (!session) {
  //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  // }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Check for Cloudinary credentials
    const hasCloudinary = process.env.CLOUDINARY_CLOUD_NAME && 
                          process.env.CLOUDINARY_API_KEY && 
                          process.env.CLOUDINARY_API_SECRET;

    if (hasCloudinary) {
        // Upload to Cloudinary stream
        const result = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { folder: 'portfolio' },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          uploadStream.end(buffer);
        });
        return NextResponse.json(result);
    } else {
        // Fallback: Local Storage (for development)
        const fs = require('fs');
        const path = require('path');
        
        // Ensure public/uploads exists
        const uploadDir = path.join(process.cwd(), 'public', 'uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        // Generate unique filename
        // preserving extension
        const originalName = file.name || 'file';
        const ext = path.extname(originalName) || '.jpg'; // default to jpg if unknown? or just use name
        // safer to generate random name to avoid collisions
        const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}${ext}`;
        const filepath = path.join(uploadDir, filename);

        // Write file
        fs.writeFileSync(filepath, buffer);

        // Return URL accessible via public folder
        // Note: In Next.js, public/uploads/xyz is accessible at /uploads/xyz
        const fileUrl = `/uploads/${filename}`;
        
        console.log('Saved file locally:', fileUrl);
        return NextResponse.json({ secure_url: fileUrl });
    }

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
