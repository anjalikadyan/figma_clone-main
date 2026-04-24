"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { signin } from "@/lib/api";

const LoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signin({ email, password });
      router.push("/dashboard");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unable to login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className='flex min-h-screen items-center justify-center px-6 py-10 text-white'>
      <div className='w-full max-w-md rounded-xl border border-primary-grey-100 bg-primary-black p-8'>
        <h1 className='text-3xl font-bold'>Login</h1>
        <p className='mt-2 text-sm text-primary-grey-300'>
          Access your dashboard and collaborate in realtime.
        </p>

        <form onSubmit={handleSubmit} className='mt-6 flex flex-col gap-4'>
          <input
            type='email'
            required
            placeholder='Email'
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className='rounded-md border border-primary-grey-100 bg-primary-grey-200 px-4 py-3 text-white outline-none focus:border-primary-green'
          />
          <input
            type='password'
            required
            minLength={6}
            placeholder='Password'
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className='rounded-md border border-primary-grey-100 bg-primary-grey-200 px-4 py-3 text-white outline-none focus:border-primary-green'
          />

          {error ? <p className='text-sm text-red-400'>{error}</p> : null}

          <button
            type='submit'
            disabled={loading}
            className='rounded-md bg-primary-green px-4 py-3 font-semibold text-primary-black disabled:opacity-70'
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className='mt-5 text-sm text-primary-grey-300'>
          New here?{" "}
          <Link href='/signup' className='font-semibold text-primary-green'>
            Create an account
          </Link>
        </p>
        <p className='mt-2 text-sm text-primary-grey-300'>
          Forgot password?{" "}
          <Link href='/forgot-password' className='font-semibold text-primary-green'>
            Reset it
          </Link>
        </p>
      </div>
    </main>
  );
};

export default LoginPage;
