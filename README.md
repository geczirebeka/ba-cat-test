# Cat Gallery

A web app for uploading and managing your cat images, built with Next.js and the Cat API.

## Features

- Upload cat images
- View your uploaded cats in a responsive grid
- Favourite and unfavourite cats
- Vote cats up or down
- See a score for each cat based on votes

## Getting Started

### 1. Get a Cat API key

Sign up for a free API key at [thecatapi.com](https://thecatapi.com).

### 2. Set up environment variables

Create a `.env.local` file in the root of the project:

```bash
API_KEY=your_api_key_here
```

### 3. Install dependencies

```bash
npm install
```

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Running Tests

```bash
npm test
```

## Tech Stack

- [Next.js](https://nextjs.org) — React framework with App Router
- [Tailwind CSS](https://tailwindcss.com) — styling
- [The Cat API](https://thecatapi.com) — image storage, favourites, and votes
- [Jest](https://jestjs.io) — testing

## Project Structure

```
app/
  components/      # Client components
  hooks/           # Custom React hooks
  lib/             # Server actions
  upload/          # Upload page
  page.tsx         # Home page
```

## Possible Improvements

### Pagination

The Cat API returns a maximum of 10 images per request. Adding pagination or infinite scroll would let users browse all their uploaded images rather than just the most recent 10.

### Error boundaries

If the images fetch fails, the page currently throws an error with no user-friendly fallback. Adding a React error boundary would let you show a proper error state instead of a blank or crashed page.

### Loading states

The page fetches images, favourites and votes in parallel on the server, but there's no loading indicator while this happens. Using Next.js `loading.tsx` would show a skeleton or spinner while the data loads.

### Duplicate vote prevention

The Cat API allows the same image to be voted on multiple times. Adding local state to track which images have already been voted on, and disabling the vote buttons after voting, would prevent users from inflating scores.

### Testing coverage

Currently tests cover `calculateScore` and the `useFavourites` hook. The upload validation logic in `uploadCat` would also be worth testing as it has several branches — empty file, wrong file type, oversized file — that could be unit tested without needing to mock the Cat API.

### Image upload feedback

The upload page redirects immediately after a successful upload but gives no confirmation to the user that it worked. A success toast notification on the home page after being redirected would improve the experience.

## Code Improvements

### Component decomposition

The `CatList` component currently handles rendering, favouriting and voting all in one place. It would be cleaner to split it into smaller components with a single responsibility.

### Suspense and streaming

Currently the home page waits for all three API calls to complete before rendering anything. Using React Suspense would allow parts of the page to stream in as they resolve, so the cat images could show immediately while favourites and votes load separately.

### Server components vs client components

Currently `CatList` is a client component because it needs interactivity. With better decomposition, only the interactive parts need to be client components — the grid layout and image rendering could stay as server components.

### Extract API calls into a data layer

The fetch calls in `page.tsx` could be moved into a dedicated data layer, making them reusable and easier to test.
