"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { signup } from "@/lib/api";

const SignupPage = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signup({ name, email, password });
      router.push("/dashboard");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unable to create account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className='flex min-h-screen items-center justify-center px-6 py-10 text-white'>
      <div className='w-full max-w-md rounded-xl border border-primary-grey-100 bg-primary-black p-8'>
        <h1 className='text-3xl font-bold'>Create Account</h1>
        <p className='mt-2 text-sm text-primary-grey-300'>
          Start using your professional collaborative canvas workspace.
        </p>

        <form onSubmit={handleSubmit} className='mt-6 flex flex-col gap-4'>
          <input
            type='text'
            required
            minLength={2}
            placeholder='Full name'
            value={name}
            onChange={(event) => setName(event.target.value)}
            className='rounded-md border border-primary-grey-100 bg-primary-grey-200 px-4 py-3 text-white outline-none focus:border-primary-green'
          />
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
            minLength={8}
            placeholder='Password'
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className='rounded-md border border-primary-grey-100 bg-primary-grey-200 px-4 py-3 text-white outline-none focus:border-primary-green'
          />
          <p className='text-xs text-primary-grey-300'>
            Use at least 8 chars with uppercase, lowercase, and a number.
          </p>

          {error ? <p className='text-sm text-red-400'>{error}</p> : null}

          <button
            type='submit'
            disabled={loading}
            className='rounded-md bg-primary-green px-4 py-3 font-semibold text-primary-black disabled:opacity-70'
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <p className='mt-5 text-sm text-primary-grey-300'>
          Already have an account?{" "}
          <Link href='/login' className='font-semibold text-primary-green'>
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
};

export default SignupPage;
