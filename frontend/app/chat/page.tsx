
"use client";
import React, { useEffect } from "react";
import { useAppData } from "../context/AppContext";
import {useRouter } from "next/navigation";
import Loading from "../components/Loading";
export default function ChatApp() {
  const {isAuth, loading} = useAppData();
  const router = useRouter();
  useEffect(()=>{ 
    if(!loading && !isAuth){
        router.push("/login");
    }
  }, [isAuth, loading,router]);
  if(loading) return <Loading />;
  if(!isAuth) return <Loading />;
  return (
    <div>
     <h1 className="text-3xl font-bold text-white">Chat App</h1>
    </div>
  );
}