import Link from "next/link";

const HomePage = () => {
  return (
    <main className='mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center px-6 text-white'>
      <div className='w-full rounded-xl border border-primary-grey-100 bg-primary-black p-10 shadow-xl'>
        <p className='text-sm uppercase tracking-widest text-primary-green'>Professional Setup</p>
        <h1 className='mt-3 text-4xl font-bold'>Tigma Collaboration Platform</h1>
        <p className='mt-4 max-w-2xl text-primary-grey-300'>
          Realtime canvas editor with account authentication and MongoDB-backed APIs.
        </p>

        <div className='mt-8 flex flex-wrap gap-4'>
          <Link
            href='/login'
            className='rounded-md bg-primary-green px-6 py-3 font-semibold text-primary-black'
          >
            Login
          </Link>
          <Link
            href='/signup'
            className='rounded-md border border-primary-grey-300 px-6 py-3 font-semibold text-primary-grey-300'
          >
            Create Account
          </Link>
          <Link
            href='/dashboard'
            className='rounded-md border border-primary-grey-100 px-6 py-3 font-semibold text-white'
          >
            Dashboard
          </Link>
        </div>
      </div>
    </main>
  );
};

export default HomePage;
