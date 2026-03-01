'use client'

import Image from 'next/image'
import { useState } from 'react'
import { favouriteCat, unfavouriteCat, voteOnCat } from '../lib/actions'
import { useFavourites } from '../hooks/useFavourites'

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

interface Vote {
    id: number
    image_id: string
    value: 1 | 0
}

interface Props {
    cats: Cat[]
    initialFavourites: Favourite[]
    initialVotes: Vote[]
}

export function calculateScore(votes: Vote[], imageId: string): number {
    return votes.reduce((score, vote) => {
        if (vote.image_id !== imageId) return score
        return score + (vote.value === 1 ? 1 : -1)
    }, 0)
}

export default function CatList({cats, initialFavourites, initialVotes}: Props) {
    const { favourites, handleFavourite } = useFavourites(initialFavourites)
    const [votes, setVotes] = useState<Vote[]>(initialVotes)

    const handleVote = async (imageId: string, value: 1 | 0) => {
        const optimisticVote: Vote = { id: -1, image_id: imageId, value }
        setVotes(prev => [...prev, optimisticVote])

        const error = await voteOnCat(imageId, value)
        if (error) {
            setVotes(prev => prev.filter(v => v !== optimisticVote))
        }
    }

    return (
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 list-none p-0">
            {cats.map((cat) => {
                const isFavourited = !!favourites[cat.id]
                const score = calculateScore(votes, cat.id)
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
                        <div className="mt-2 flex items-center justify-between px-1">
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleVote(cat.id, 1)}
                                    className="text-sm border border-gray-300 rounded px-2 py-1 hover:bg-gray-100 transition-colors"
                                    aria-label="Vote up"
                                >
                                    👍
                                </button>
                                <button
                                    onClick={() => handleVote(cat.id, 0)}
                                    className="text-sm border border-gray-300 rounded px-2 py-1 hover:bg-gray-100 transition-colors"
                                    aria-label="Vote down"
                                >
                                    👎
                                </button>
                            </div>
                            <span className="text-sm font-medium text-gray-700">
                                Score: {score}
                            </span>
                        </div>
                    </li>
                )
            })}
        </ul>
    )
}