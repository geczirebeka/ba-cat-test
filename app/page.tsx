import Image from 'next/image'
import Link from 'next/link';
import CatList from './components/CatList';

const imagesData = fetch('https://api.thecatapi.com/v1/images/?limit=10&order=DESC', {
    headers: {
        'x-api-key': process.env.API_KEY ?? '',
        'Content-Type': 'application/json',
    },
    cache: 'no-store',
}).then(res => res.json())

const favouritesData = fetch('https://api.thecatapi.com/v1/favourites', {
    headers: {
        'x-api-key': process.env.API_KEY ?? '',
        'Content-Type': 'application/json',
    },
    cache: 'no-store',
}).then(res => res.json())

export default async function Home() {
  const [imagesResult, favouritesResult] = await Promise.allSettled([imagesData, favouritesData])


  if (imagesResult.status === 'rejected') {
      throw new Error('Failed to fetch cats')
  }

  const cats = await imagesResult.value
  const favourites = favouritesResult.status === 'fulfilled' 
      ? await favouritesResult.value
      : []

  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">My cats</h1>
        <Link 
          href="/upload"
          className="border border-gray-800 text-gray-800 text-sm font-semibold px-4 py-2 rounded-md hover:bg-gray-800 hover:text-white transition-colors"
        >
        Upload a cat
        </Link>
      </div>
      <CatList cats={cats} initialFavourites={favourites} />
    </main>
  );
}
