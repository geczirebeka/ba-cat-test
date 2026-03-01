import { renderHook, act } from '@testing-library/react'
import { calculateScore } from './CatList'
import { favouriteCat, unfavouriteCat } from '../lib/actions'
import { useFavourites } from '../hooks/useFavourites'

describe('calculateScore', () => {
    it('returns 0 when there are no votes', () => {
        expect(calculateScore([], 'cat1')).toBe(0)
    })

    it('returns 1 for a single upvote', () => {
        const votes = [{ id: 1, image_id: 'cat1', value: 1 as const }]
        expect(calculateScore(votes, 'cat1')).toBe(1)
    })

    it('returns -1 for a single downvote', () => {
        const votes = [{ id: 1, image_id: 'cat1', value: 0 as const }]
        expect(calculateScore(votes, 'cat1')).toBe(-1)
    })

    it('calculates score correctly with mixed votes', () => {
        const votes = [
            { id: 1, image_id: 'cat1', value: 1 as const },
            { id: 2, image_id: 'cat1', value: 1 as const },
            { id: 3, image_id: 'cat1', value: 0 as const },
        ]
        expect(calculateScore(votes, 'cat1')).toBe(1)
    })

    it('only counts votes for the given image', () => {
        const votes = [
            { id: 1, image_id: 'cat1', value: 1 as const },
            { id: 2, image_id: 'cat2', value: 1 as const },
            { id: 3, image_id: 'cat2', value: 1 as const },
        ]
        expect(calculateScore(votes, 'cat1')).toBe(1)
        expect(calculateScore(votes, 'cat2')).toBe(2)
    })
})

jest.mock('../lib/actions', () => ({
    favouriteCat: jest.fn(),
    unfavouriteCat: jest.fn(),
    voteOnCat: jest.fn(),
}))

describe('useFavourites', () => {
    beforeEach(() => jest.clearAllMocks())

    it('adds a cat to favourites with the real id on success', async () => {
        (favouriteCat as jest.Mock).mockResolvedValue({ id: 232562842 })

        const { result } = renderHook(() => useFavourites([]))

        await act(async () => {
            await result.current.handleFavourite('cat1')
        })

        expect(favouriteCat).toHaveBeenCalledWith('cat1')
        expect(result.current.favourites['cat1']).toBe(232562842)
    })

    it('removes a cat from favourites on success', async () => {
        (unfavouriteCat as jest.Mock).mockResolvedValue(null)

        const { result } = renderHook(() => useFavourites([{ id: 232562842, image_id: 'cat1' }]))

        await act(async () => {
            await result.current.handleFavourite('cat1')
        })

        expect(unfavouriteCat).toHaveBeenCalledWith(232562842)
        expect(result.current.favourites['cat1']).toBeUndefined()
    })

    it('reverts if unfavouriting fails', async () => {
        (unfavouriteCat as jest.Mock).mockResolvedValue('Network error. Please try again.')

        const { result } = renderHook(() => useFavourites([{ id: 232562842, image_id: 'cat1' }]))

        await act(async () => {
            await result.current.handleFavourite('cat1')
        })

        expect(result.current.favourites['cat1']).toBe(232562842)
    })

    it('reverts if favouriting fails', async () => {
        (favouriteCat as jest.Mock).mockResolvedValue('Network error. Please try again.')

        const { result } = renderHook(() => useFavourites([]))

        await act(async () => {
            await result.current.handleFavourite('cat1')
        })

        expect(result.current.favourites['cat1']).toBeUndefined()
    })
})