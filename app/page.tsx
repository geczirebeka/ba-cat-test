
export default async function Home() {
  const url = `https://api.thecatapi.com/v1/images/search?limit=20`;

  const data = await fetch(url, { headers: {
    'x-api-key': process.env.API_KEY ?? ''
  }})
  const cats = await data.json()

  return (
    <ul>
      {cats.map((cat) => (
        <li key={cat.id}>
          {cat.url}
        </li>
      ))}
    </ul>
  );
}
