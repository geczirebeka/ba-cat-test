'use client'

import { useActionState } from "react";
import { uploadCat } from "../lib/actions";
import Link from "next/link";

export default function UploadPage() {
    const [error, formAction, isPending] = useActionState(uploadCat, null)

    return (
        <main className="max-w-md mx-auto mt-16 px-4">
            <Link 
                href="/"
                className="text-sm text-gray-500 hover:text-gray-800 transition-colors mb-6 inline-block"
            >
                ← Back
            </Link>
            <h1 className="text-2xl font-bold mb-6">Upload a cat</h1>
            <form action={formAction} className="flex flex-col gap-4">
                {error && (
                    <p className="text-red-500 text-small">{error}</p>
                )}
                <input
                type="file"
                id="cat_picture"
                name="cat_picture"
                accept=".png,.jpg,.jpeg,.gif"
                required
                className="border border-gray-300 rounded-md p-2 text-sm"
                />
                <button
                type="submit"
                disabled={isPending}
                className="bg-gray-800 text-white font-semibold py-2 px-4 rounded-md hover:bg-gray-700 transition-colors cursor-pointer"
                >
                {isPending ? 'Uploading...' : 'Upload'}
                </button>
            </form>
        </main>
    )
}