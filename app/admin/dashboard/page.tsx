"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { getAdminSummary, getCurrentUser, refreshSession, type AuthUser } from "@/lib/api";

type AdminMetrics = {
  usersCount: number;
  documentsCount: number;
  adminsCount: number;
};

const AdminDashboardPage = () => {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [metrics, setMetrics] = useState<AdminMetrics | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const me = await getCurrentUser();
        if (me.user.role !== "admin") {
          router.replace("/dashboard");
          return;
        }

        const summary = await getAdminSummary();
        setUser(me.user);
        setMetrics(summary.metrics);
      } catch {
        try {
          await refreshSession();
          const me = await getCurrentUser();
          if (me.user.role !== "admin") {
            router.replace("/dashboard");
            return;
          }
          const summary = await getAdminSummary();
          setUser(me.user);
          setMetrics(summary.metrics);
        } catch (requestError) {
          setError(requestError instanceof Error ? requestError.message : "Failed to load admin data.");
          router.replace("/login");
        }
      }
    };

    loadData();
  }, [router]);

  if (!user || !metrics) {
    return (
      <main className='flex min-h-screen items-center justify-center text-white'>
        {error || "Loading admin dashboard..."}
      </main>
    );
  }

  return (
    <main className='mx-auto min-h-screen w-full max-w-5xl px-6 py-10 text-white'>
      <h1 className='text-3xl font-bold'>Admin Dashboard</h1>
      <p className='mt-2 text-primary-grey-300'>
        Welcome, {user.name}. These metrics are protected by role-based access control.
      </p>

      <section className='mt-8 grid gap-4 md:grid-cols-3'>
        <article className='rounded-xl border border-primary-grey-100 bg-primary-black p-5'>
          <p className='text-sm text-primary-grey-300'>Total Users</p>
          <p className='mt-2 text-3xl font-bold'>{metrics.usersCount}</p>
        </article>
        <article className='rounded-xl border border-primary-grey-100 bg-primary-black p-5'>
          <p className='text-sm text-primary-grey-300'>Canvas Documents</p>
          <p className='mt-2 text-3xl font-bold'>{metrics.documentsCount}</p>
        </article>
        <article className='rounded-xl border border-primary-grey-100 bg-primary-black p-5'>
          <p className='text-sm text-primary-grey-300'>Admin Accounts</p>
          <p className='mt-2 text-3xl font-bold'>{metrics.adminsCount}</p>
        </article>
      </section>
    </main>
  );
};

export default AdminDashboardPage;
