// app/sign-in/page.tsx
"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export default function SignInPage() {
  const { data: session } = useSession();

  return (
    <div>
      <h1>Sign In Page</h1>
      {session ? (
        <div>
          <p>Signed in as {session.user?.email}</p>
          <button onClick={() => signOut()}>Sign out</button>
        </div>
      ) : (
        <div>
          <p>You are not signed in.</p>
          <button onClick={() => signIn("github")}>Sign in with GitHub</button>
          <button onClick={() => signIn("google")}>Sign in with Google</button>
        </div>
      )}
    </div>
  );
}
