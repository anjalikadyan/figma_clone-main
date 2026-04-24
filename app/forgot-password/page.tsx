"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

import { forgotPassword } from "@/lib/api";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setMessage("");
    setResetToken("");
    setLoading(true);

    try {
      const response = await forgotPassword({ email });
      setMessage(response.message);
      if (response.resetToken) {
        setResetToken(response.resetToken);
      }
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to process request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className='flex min-h-screen items-center justify-center px-6 py-10 text-white'>
      <div className='w-full max-w-md rounded-xl border border-primary-grey-100 bg-primary-black p-8'>
        <h1 className='text-3xl font-bold'>Forgot Password</h1>
        <p className='mt-2 text-sm text-primary-grey-300'>
          Enter your email to generate a password reset token.
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
          <button
            type='submit'
            disabled={loading}
            className='rounded-md bg-primary-green px-4 py-3 font-semibold text-primary-black disabled:opacity-70'
          >
            {loading ? "Generating token..." : "Generate Reset Token"}
          </button>
        </form>

        {message ? <p className='mt-4 text-sm text-primary-green'>{message}</p> : null}
        {error ? <p className='mt-4 text-sm text-red-400'>{error}</p> : null}

        {resetToken ? (
          <div className='mt-4 rounded-md border border-primary-grey-100 p-3 text-xs text-primary-grey-300'>
            <p>Development reset token:</p>
            <p className='mt-1 break-all text-primary-green'>{resetToken}</p>
          </div>
        ) : null}

        <p className='mt-5 text-sm text-primary-grey-300'>
          Have a token already?{" "}
          <Link href='/reset-password' className='font-semibold text-primary-green'>
            Reset password
          </Link>
        </p>
      </div>
    </main>
  );
};

export default ForgotPasswordPage;
