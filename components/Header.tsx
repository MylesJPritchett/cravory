'use client';

import Link from 'next/link';
import { signOut, useSession } from "next-auth/react";

export default function Header() {
  const { data: session } = useSession();  // Call the useSession hook here

  return (
    <header className="flex justify-between items-center p-4 bg-gray-700 shadow-md">
      <div>
        <Link href="/" className="text-xl font-bold text-red-500 hover:text-red-800">
          Cravory
        </Link>
      </div>
      <nav className="flex items-center space-x-4">
        {session ? (
          <div className="flex items-center space-x-4">
            <span className="text-red-500">
              Welcome, {session.user?.name || session.user?.email}
            </span>

            <button onClick={() => signOut()}>Sign out</button>
          </div>
        ) : (
          <Link href="/sign-in" className='text-red-600 hover:text-red-800'> Sign In</Link>
        )}
      </nav>
    </header>
  );
}
