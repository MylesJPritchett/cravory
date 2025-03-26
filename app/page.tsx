"use client";

import { signOut, useSession } from "next-auth/react";
import Link from 'next/link';

export default function HomePage() {
  const { data: session } = useSession();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      {session?.user ? (
        <div>
          <h1 className="text-2xl">Welcome, {session.user.name}!</h1>
          <p>Email: {session.user.email}</p>
          <Link href="/search"> Search Recipes</Link>
          <Link href="/recipe/create"> Create Recipes</Link>
          <Link href="/food/create"> Create Food</Link>

          <button onClick={() => signOut()} className="mt-4 bg-red-500 text-white px-4 py-2">
            Sign Out
          </button>
        </div>
      ) : (
        <div><p>You are not signed in.</p>
          <Link href="/sign-in"> Sign In</Link>
        </div>
      )}
    </div>
  );
}
