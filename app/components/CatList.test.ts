import { calculateScore } from './CatList'

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