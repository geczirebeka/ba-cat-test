'use server'

import { redirect } from "next/navigation";

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

export async function uploadCat(
    formData: FormData
){
    const file = formData.get('cat_picture') as File

    if (!file || file.size === 0) {
        return 'Please select a file to upload.'
    }

    if (!ACCEPTED_TYPES.includes(file.type)) {
        return 'File must be a JPEG, PNG, GIF, or WebP image.'
    }

    if (file.size > MAX_SIZE) {
        return 'File must be under 5MB.'
    }

    const upstream = new FormData();
    upstream.append('file', file, file.name);

    let response: Response;
    try {
        response = await fetch('https://api.thecatapi.com/v1/images/upload', {
            method: 'POST',
            headers: {'x-api-key': process.env.API_KEY ?? ''},
            body: formData
        });
    } catch (err) {
        console.error('Upload error:', err);
        return 'Network error'
    }

    if (!response.ok) {
        const err = await response.json().catch(() => ({}))
        return err?.message ?? `Upload failed (${response.status})`
    }
    
    redirect('/')
}