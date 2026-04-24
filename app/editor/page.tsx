"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Room from "@/app/Room";
import { getCurrentUser, refreshSession } from "@/lib/api";

const EditorApp = dynamic(() => import("../App"), { ssr: false });

const EditorPage = () => {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const verifyUser = async () => {
      try {
        await getCurrentUser();
        setIsAuthorized(true);
      } catch {
        try {
          await refreshSession();
          setIsAuthorized(true);
        } catch {
          router.replace("/login");
        }
      }
    };

    verifyUser();
  }, [router]);

  if (!isAuthorized) {
    return (
      <main className='flex min-h-screen items-center justify-center text-white'>
        Verifying session...
      </main>
    );
  }

  return (
    <Room>
      <EditorApp />
    </Room>
  );
};

export default EditorPage;
