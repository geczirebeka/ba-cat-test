import { useState } from 'react'
import { favouriteCat, unfavouriteCat } from '../lib/actions'

interface Favourite {
    id: number
    image_id: string
}

export function useFavourites(initialFavourites: Favourite[]) {
    const [favourites, setFavourites] = useState<Record<string, number>>(
        Object.fromEntries(initialFavourites.map(f => [f.image_id, f.id]))
    )

    const handleFavourite = async (imageId: string) => {
        const existingFavouriteId = favourites[imageId]

        if (existingFavouriteId) {
            setFavourites(prev => {
                const updated = { ...prev }
                delete updated[imageId]
                return updated
            })
            const error = await unfavouriteCat(existingFavouriteId)
            if (error) {
                setFavourites(prev => ({ ...prev, [imageId]: existingFavouriteId }))
            }
        } else {
            setFavourites(prev => ({ ...prev, [imageId]: -1 }))
            const result = await favouriteCat(imageId)
            if (typeof result === 'string') {
                setFavourites(prev => {
                    const updated = { ...prev }
                    delete updated[imageId]
                    return updated
                })
            } else {
                setFavourites(prev => ({ ...prev, [imageId]: result.id }))
            }
        }
    }

    return { favourites, handleFavourite }
}