'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from "next-auth/react";

export default function Header() {
  const { data: session } = useSession();
  const pathname = usePathname();

  return (
    <header className="sticky top-0 flex justify-between items-center p-4 bg-gray-700 shadow-md">
      <div className="flex space-x-6">
        <Link
          href="/search"
          className={`px-4 py-2 rounded-t-lg ${pathname === '/search' ? 'bg-red-500 text-white' : 'text-white hover:bg-gray-600'}`}
        >
          Search
        </Link>
        <Link
          href="/recipe/create"
          className={`px-4 py-2 rounded-t-lg ${pathname === '/recipe/create' ? 'bg-red-500 text-white' : 'text-white hover:bg-gray-600'}`}
        >
          Create Recipe
        </Link>
        <Link
          href="/food/create"
          className={`px-4 py-2 rounded-t-lg ${pathname === '/food/create' ? 'bg-red-500 text-white' : 'text-white hover:bg-gray-600'}`}
        >
          Create Food
        </Link>
      </div>

      <nav className="flex items-center space-x-6">
        {session ? (
          <div className="flex items-center space-x-6">
            <span className="text-red-500">
              Welcome, {session.user?.name || session.user?.email}
            </span>
            <button
              onClick={() => signOut()}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-800">
              Sign out
            </button>
          </div>
        ) : (
          <Link href="/sign-in" className="px-4 py-2 text-red-600 hover:text-red-800">
            Sign In
          </Link>
        )}
      </nav>
    </header>
  );
}
