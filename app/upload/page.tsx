'use client'

import { useActionState, useState } from "react";
import { uploadCat } from "../lib/actions";
import Link from "next/link";

export default function UploadPage() {
    const [error, formAction, isPending] = useActionState(uploadCat, null)
    const [fileName, setFileName] = useState<string | null>(null)

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
                <div className="flex items-center gap-3">
                    <label
                        htmlFor="cat_picture"
                        className="border border-gray-800 text-gray-800 text-sm font-semibold px-4 py-2 rounded-md hover:bg-gray-800 hover:text-white transition-colors cursor-pointer"
                    >
                        Choose a file
                    </label>
                    <span className="text-sm text-gray-500">
                        {fileName ?? 'No file chosen'}
                    </span>
                </div>
                <input
                    type="file"
                    id="cat_picture"
                    name="cat_picture"
                    accept=".png,.jpg,.jpeg,.gif"
                    required
                    className="sr-only"
                    onChange={(e) => setFileName(e.target.files?.[0]?.name ?? null)}
                />

                <button
                type="submit"
                disabled={isPending}
                className="border border-gray-800 text-gray-800 text-sm font-semibold px-4 py-2 rounded-md hover:bg-gray-800 hover:text-white transition-colors cursor-pointer"
                >
                {isPending ? 'Uploading...' : 'Upload'}
                </button>
            </form>
        </main>
    )
}