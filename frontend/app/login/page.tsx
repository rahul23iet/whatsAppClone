"use client"
import { Mail, ArrowRight ,Loader2} from "lucide-react";
import React,{useReducer, useState} from "react";
import {useRouter } from "next/navigation";
import axios from 'axios'

export default function LoginPage() {
    const [email, setEmail]= useState<string>("");
    const [loading , setLoading] = useState<boolean>(false);
    const router = useRouter();
    const handleSubmit= async(e: React.FormEvent<HTMLElement>): Promise<void> =>{
        e.preventDefault();
        setLoading(true);
        try{
           const {data} = await axios.post('http://localhost:5000/api/v1/login' , {
            email,
           })
           console.log("====>>>data", data);
           router.push(`/verify?email=${email}`)
        }
        catch(error:any){
            console.log("===errrorrrrrr", error);
          alert(error?.response?.data?.message);
        }
        finally{
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
          <div className="w-full max-w-lg ">
            <div className="bg-gray-800 border border-gray-700 rounded-lg  p-3">
                <div className="text-center">
                    <div className="mx-auto w-20 h-20 bg-blue-600 rounded-lg flex items-center justify-center mb-6">
                        <Mail size={40} className="text-white" />
                    </div>
                    <h1 className="text-4xl text-white mb-3">Welcome to MeetingApp</h1>
                    <p className="text-gray-300 text-lg">Enter your email to continue your journey</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            className="w-full px-4 py-4 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter your email address"
                            value={email}
                            onChange={e=> setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <button
                            type="submit"
                            className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-4 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            disabled={loading}
                        >
                            {
                                loading?<div className="flex items-center justify-center gap-2">
                                    <Loader2 className="w-5 h-5" />
                                </div>: <div className="flex items-center justify-center gap-2">
                            <span>Send Verification Code</span>
                            <ArrowRight size={20} className="shrink-0" />
                            </div>
                            }
        
                        </button>
                    </div>
                </form>
            </div>
          </div>
        </div>
    );
}

