import Image from 'next/image'

export default async function Home() {
  const url = `https://api.thecatapi.com/v1/images/?limit=100`;

  const data = await fetch(url, { headers: {
    'x-api-key': process.env.API_KEY ?? '',
    'Content-Type': 'application/json',
  }})
  const cats = await data.json()

  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8">My cats</h1>
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
