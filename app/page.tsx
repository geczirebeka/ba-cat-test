import Image from 'next/image'
import Link from 'next/link';

export default async function Home() {
  const url = `https://api.thecatapi.com/v1/images/?limit=100`;

  const data = await fetch(url, { headers: {
    'x-api-key': process.env.API_KEY ?? '',
    'Content-Type': 'application/json',
  }})
  const cats = await data.json()

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
      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 list-none p-0">
        {cats.map((cat) => (
          <li key={cat.id}>
            <div className="relative aspect-square rounded-lg overflow-hidden">
              <Image
                src={cat.url}
                alt="Cat picture"
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 960px) 50vw, 25vw"
                className="object-cover"
              />
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
