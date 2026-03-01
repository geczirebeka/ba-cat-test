'use client'

import Image from 'next/image'
import { useState } from 'react'
import { favouriteCat, unfavouriteCat } from '../lib/actions'

interface Cat {
    id: string
    url: string
    width: number
    height: number
}

interface Favourite {
    id: number
    image_id: string
}

interface Props {
    cats: Cat[]
    initialFavourites: Favourite[]
}


export default function CatList({cats, initialFavourites}: Props) {

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
            // Optimistically add with a temporary id
            setFavourites(prev => ({ ...prev, [imageId]: -1 }))
            const result = await favouriteCat(imageId)
            if (typeof result === 'string') {
                setFavourites(prev => {
                    const updated = { ...prev }
                    delete updated[imageId]
                    return updated
                })
            } else {
                // Replace temp id with real one
                setFavourites(prev => ({ ...prev, [imageId]: result.id }))
            }
        }
    }

    return (
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 list-none p-0">
            {cats.map((cat) => {
                const isFavourited = !!favourites[cat.id]
                return (
                    <li key={cat.id}>
                        <div className="relative aspect-square rounded-lg overflow-hidden group">
                            <Image
                                src={cat.url}
                                alt="Cat picture"
                                fill
                                sizes="(max-width: 640px) 100vw, (max-width: 960px) 50vw, 25vw"
                                className="object-cover"
                            />
                            <button
                                onClick={() => handleFavourite(cat.id)}
                                className="absolute top-2 right-2 bg-white rounded-full p-1.5 shadow transition-opacity"
                                aria-label={isFavourited ? 'Unfavourite' : 'Favourite'}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    className="w-5 h-5"
                                    fill={isFavourited ? 'red' : 'none'}
                                    stroke={isFavourited ? 'red' : 'currentColor'}
                                    strokeWidth={2}
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                                </svg>
                            </button>
                        </div>
                    </li>
                )
            })}
        </ul>
    )
}