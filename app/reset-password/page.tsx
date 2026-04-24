"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { resetPassword } from "@/lib/api";

const ResetPasswordPage = () => {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const response = await resetPassword({ token, password });
      setMessage(response.message);
      setTimeout(() => router.push("/login"), 1200);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to reset password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className='flex min-h-screen items-center justify-center px-6 py-10 text-white'>
      <div className='w-full max-w-md rounded-xl border border-primary-grey-100 bg-primary-black p-8'>
        <h1 className='text-3xl font-bold'>Reset Password</h1>
        <p className='mt-2 text-sm text-primary-grey-300'>
          Use the reset token and set a stronger password.
        </p>

        <form onSubmit={handleSubmit} className='mt-6 flex flex-col gap-4'>
          <input
            type='text'
            required
            placeholder='Reset token'
            value={token}
            onChange={(event) => setToken(event.target.value)}
            className='rounded-md border border-primary-grey-100 bg-primary-grey-200 px-4 py-3 text-white outline-none focus:border-primary-green'
          />
          <input
            type='password'
            required
            minLength={8}
            placeholder='New password'
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className='rounded-md border border-primary-grey-100 bg-primary-grey-200 px-4 py-3 text-white outline-none focus:border-primary-green'
          />
          <button
            type='submit'
            disabled={loading}
            className='rounded-md bg-primary-green px-4 py-3 font-semibold text-primary-black disabled:opacity-70'
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        {message ? <p className='mt-4 text-sm text-primary-green'>{message}</p> : null}
        {error ? <p className='mt-4 text-sm text-red-400'>{error}</p> : null}

        <p className='mt-5 text-sm text-primary-grey-300'>
          Need a token?{" "}
          <Link href='/forgot-password' className='font-semibold text-primary-green'>
            Forgot password
          </Link>
        </p>
      </div>
    </main>
  );
};

export default ResetPasswordPage;
