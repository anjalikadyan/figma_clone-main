"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { AuthUser, getCurrentUser, logout, refreshSession } from "@/lib/api";

const DashboardPage = () => {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const response = await getCurrentUser();
        setUser(response.user);
      } catch {
        try {
          const refreshed = await refreshSession();
          setUser(refreshed.user);
        } catch {
          router.replace("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [router]);

  const handleLogout = async () => {
    await logout().catch(() => undefined);
    router.push("/login");
  };

  if (loading) {
    return (
      <main className='flex min-h-screen items-center justify-center text-white'>
        Loading dashboard...
      </main>
    );
  }

  return (
    <main className='mx-auto min-h-screen w-full max-w-6xl px-6 py-10 text-white'>
      <header className='flex flex-wrap items-center justify-between gap-4 rounded-xl border border-primary-grey-100 bg-primary-black p-6'>
        <div>
          <p className='text-sm text-primary-grey-300'>Signed in as</p>
          <h1 className='text-2xl font-bold'>{user?.name}</h1>
          <p className='text-sm text-primary-grey-300'>{user?.email}</p>
          <p className='text-sm text-primary-grey-300'>Role: {user?.role}</p>
        </div>
        <button
          type='button'
          onClick={handleLogout}
          className='rounded-md border border-primary-grey-100 px-4 py-2 text-sm font-semibold'
        >
          Logout
        </button>
      </header>

      <section className='mt-6 grid gap-4 md:grid-cols-3'>
        <article className='rounded-xl border border-primary-grey-100 bg-primary-black p-5'>
          <p className='text-sm text-primary-grey-300'>Workspace</p>
          <h2 className='mt-1 text-xl font-semibold'>Realtime Editor</h2>
          <p className='mt-3 text-sm text-primary-grey-300'>
            Launch your collaborative design board with Liveblocks sync.
          </p>
          <Link
            href='/editor'
            className='mt-4 inline-block rounded-md bg-primary-green px-4 py-2 font-semibold text-primary-black'
          >
            Open Editor
          </Link>
        </article>

        <article className='rounded-xl border border-primary-grey-100 bg-primary-black p-5'>
          <p className='text-sm text-primary-grey-300'>Security</p>
          <h2 className='mt-1 text-xl font-semibold'>JWT Authentication</h2>
          <p className='mt-3 text-sm text-primary-grey-300'>
            Token-based authentication with MongoDB user records.
          </p>
        </article>

        <article className='rounded-xl border border-primary-grey-100 bg-primary-black p-5'>
          <p className='text-sm text-primary-grey-300'>Database</p>
          <h2 className='mt-1 text-xl font-semibold'>MongoDB Connected</h2>
          <p className='mt-3 text-sm text-primary-grey-300'>
            Persisted accounts and API-backed document endpoints.
          </p>
        </article>

        {user?.role === "admin" ? (
          <article className='rounded-xl border border-primary-grey-100 bg-primary-black p-5'>
            <p className='text-sm text-primary-grey-300'>Admin</p>
            <h2 className='mt-1 text-xl font-semibold'>Admin Dashboard</h2>
            <p className='mt-3 text-sm text-primary-grey-300'>
              Access role-protected platform metrics and management tools.
            </p>
            <Link
              href='/admin/dashboard'
              className='mt-4 inline-block rounded-md border border-primary-green px-4 py-2 font-semibold text-primary-green'
            >
              Open Admin Dashboard
            </Link>
          </article>
        ) : null}
      </section>
    </main>
  );
};

export default DashboardPage;
