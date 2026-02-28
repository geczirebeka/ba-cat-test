import { uploadCat } from "../lib/actions";

export default function UploadPage() {

    return (
        <main className="max-w-md mx-auto mt-16 px-4">
        <h1 className="text-2xl font-bold mb-6">Upload a cat</h1>
        <form action={uploadCat} className="flex flex-col gap-4">
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
            className="bg-gray-800 text-white font-semibold py-2 px-4 rounded-md hover:bg-gray-700 transition-colors cursor-pointer"
            >
            Upload
            </button>
        </form>
        </main>
    )
}