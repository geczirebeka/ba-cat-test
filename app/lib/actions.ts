'use server'

import { redirect } from "next/navigation";

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

export async function uploadCat(
    _pervState: string | null,
    formData: FormData
): Promise<string | null> {
    const file = formData.get('cat_picture') as File

    if (!file || file.size === 0) {
        return 'Please select a file to upload.'
    }

    if (!ACCEPTED_TYPES.includes(file.type)) {
        return 'File must be a JPEG, PNG, GIF image.'
    }

    if (file.size > MAX_SIZE) {
        return 'File must be under 5MB.'
    }

    const catApiForm = new FormData();
    catApiForm.append('file', file, file.name);

    let response: Response;
    try {
        response = await fetch('https://api.thecatapi.com/v1/images/upload', {
            method: 'POST',
            headers: {'x-api-key': process.env.API_KEY ?? ''},
            body: catApiForm
        });
    } catch (err) {
        console.error('Upload error:', err);
        return 'Network error. Please check your connection and try again.'
    }

    if (!response.ok) {
        const rawError = await response.text()
        let message: string
        try {
            const parsed = JSON.parse(rawError)
            message = parsed?.message ?? rawError
        } catch {
            message = rawError
        }

        console.error('CatAPI error:', response.status, message)
        if (response.status === 400 && message) return message
        return 'Something went wrong. Please try again.'
    }
    
    redirect('/')
}

export async function favouriteCat(imageId: string): Promise<{ id: number } | string> {
    try {
        const response = await fetch('https://api.thecatapi.com/v1/favourites', {
            method: 'POST',
            headers: {
                'x-api-key': process.env.API_KEY ?? '',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ image_id: imageId }),
        })

        if (!response.ok) {
            const rawError = await response.text()
            console.error('Favourite error:', response.status, rawError)
            return 'Failed to favourite cat. Please try again.'
        }

        const data = await response.json()
        return { id: data.id }
    } catch (err) {
        console.error('Favourite error:', err)
        return 'Network error. Please try again.'
    }
}

export async function unfavouriteCat(favouriteId: number): Promise<string | null> {
    try {
        const response = await fetch(`https://api.thecatapi.com/v1/favourites/${favouriteId}`, {
            method: 'DELETE',
            headers: { 'x-api-key': process.env.API_KEY ?? '' },
        })

        if (!response.ok) {
            console.error('Unfavourite error:', response.status)
            return 'Failed to unfavourite cat. Please try again.'
        }

        return null
    } catch (err) {
        console.error('Unfavourite error:', err)
        return 'Network error. Please try again.'
    }
}

export async function voteOnCat(imageId: string, value: 1 | 0): Promise<string | null> {
    try {
        const response = await fetch('https://api.thecatapi.com/v1/votes', {
            method: 'POST',
            headers: {
                'x-api-key': process.env.API_KEY ?? '',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ image_id: imageId, value }),
        })

        if (!response.ok) {
            const rawError = await response.text()
            console.error('Vote error:', response.status, rawError)
            return 'Failed to vote. Please try again.'
        }

        return null
    } catch (err) {
        console.error('Vote error:', err)
        return 'Network error. Please try again.'
    }
}