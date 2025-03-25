"use client";

import { useSession } from "next-auth/react";

export default function DashboardPage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "unauthenticated") {
    return <div>Please sign in</div>;
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <div>
        <p>Name: {session?.user?.name}</p>
        <p>Email: {session?.user?.email}</p>
        <img
          src={session?.user?.avatarUrl || session?.user?.image || ""}
          alt="Profile"
          width={50}
          height={50}
        />
      </div>
    </div>
  );
}
