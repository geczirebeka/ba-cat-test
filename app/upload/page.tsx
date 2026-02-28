import { uploadCat } from "../lib/actions";

export default function UploadPage() {

    return (
        <form action={uploadCat}>
            <label htmlFor="cat_picture">Upload a cat picture</label>
            <input 
                type="file" 
                id="cat_picture" 
                name="cat_picture" 
                accept=".png, .jpg, .jpeg, .gif"
            />
            <button type="submit">
                Upload
            </button>
        </form>  
    )
}