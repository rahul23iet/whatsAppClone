"use client"
import React , { useState,useRef, useEffect }from "react"
import {Lock, Loader2,ArrowRight, ChevronLeft} from "lucide-react"
import { useSearchParams } from "next/navigation";
import {useRouter } from "next/navigation";
import axios from "axios";
import Cookies from "js-cookie";

export default function  VerfiyPage() {
    const [loading, setLoading] = useState(false);
    const [otp, setOtp ] = useState(["","","","","",""]);
    const [error, setError] = useState<string>("");
    const [resendLoading, setResendLoading]=useState(false);
    const [timer ,setTimer] = useState(300);
 
     const inputRefs=useRef<Array<HTMLInputElement| null>>([]);
    
      const router = useRouter();
    
     useEffect(()=>{
        if(timer>0){
            const interval = setInterval(()=>{
                setTimer((prev)=>prev-1);
            },1000);

            return ()=>clearInterval(interval);
        }
     },[timer]);

    
    const handleInputChange = (index: number, value: string):void =>{
        console.log("====vaue=====>>",value )
        if(value.length > 1 ) return;
        const newOtp = [...otp];
        newOtp[index]=value;
        setOtp(newOtp);
        setError("");

        if(value && index<5){
            inputRefs.current[index+1]?.focus();
        }
    }

   const handleKeyDown = (index:number, e:React.KeyboardEvent<HTMLElement>):
   void=>{
    if(e.key==='Backspace' && !otp[index] && index>0){
       inputRefs.current[index-1]?.focus();
    }
   }

   const handlePaste = (e:React.ClipboardEvent<HTMLInputElement>): void =>{
    e.preventDefault();
    const pateData = e.clipboardData.getData("text");
    const digit = pateData.replace(/\D/g, "").slice(0,6);
    if(digit.length === 6 ){
        const newOtp = digit.split("");
        setOtp(newOtp)
        inputRefs.current[5]?.focus();
    }
   }

   const handleResendOtp = async ()=>{
    setResendLoading(true);
    setError("");
    try{
     const { data } = await axios.post(`http://localhost:5000/api/v1/login`,{
        email,
     })
     alert(data.message);
     setTimer(300);
    }
    catch(error:any){
       setError(error.response.data.message);
    }
    finally{
        setResendLoading(false);
    }
   }

    const searchParams = useSearchParams();
    const email:string = searchParams.get('email')||" ";
    const handleSubmit = async(e: React.FormEvent<HTMLFormElement>)=>{
         e.preventDefault();
         const otpString = otp.join("");
         if(otpString.length!==6){
            setError("Please Enter all 6 digit");
            return;
         }
         setError("");
         setLoading(true);
         try{
                const {data } = await axios.post("http://localhost:5000/api/v1/verify",{
                    email,
                    otp: otpString
                })
                alert(data.message)
                Cookies.set("token", data.token,{
                    expires:15,
                    secure:false,
                    path:"/"
                });
                setOtp(["","","","","",""]);
                inputRefs.current[0]?.focus();
         }
         catch(error:any){
            console.log("========>>>>>", error.response?.data?.message);
            setError(error?.response?.data?.message);
         }
         finally{
            setLoading(false);
         }
    }
    return (
       <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
          <div className="w-full max-w-lg ">
            <div className="bg-gray-800 border border-gray-700 rounded-lg  p-3">
                <div className="text-center mb-8 relative">
                    <button className="absolute top-0 left-0 p-2 text-gray-300 hover:text-white" onClick={()=> router.push('login')}>
                        <ChevronLeft className="w-6 h-6"/>


                    </button>

                    <div className="mx-auto w-20 h-20 bg-blue-600 rounded-lg flex items-center justify-center mb-6">
                        <Lock size={40} className="text-white" />
                    </div>
                    <h1 className="text-4xl text-white mb-3">Verify Your email</h1>
                    <p className="text-gray-300 text-lg">We have sent a 6-digit code to your email</p>
                    <p className="text-blue-400 font-medium">{email}</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-4 text-center">Enter Your 6 Digit Otp Here</label>
                        <div className="flex justify-center in-checked: space-x-3">
                           {
                             otp.map((digit, index)=>(
                                <input
                                  key={index}
                                  ref={(el: HTMLInputElement | null) =>{
                                    inputRefs.current[index] = el;
                                  }}
                                  type="text"
                                  maxLength={1}
                                  value={digit}
                                  onChange={e=> handleInputChange(index, e.target.value)}
                                  onKeyDown={e=>handleKeyDown(index, e)}
                                  onPaste={index==0? handlePaste:undefined}
                                  className="w-12 h-12 text-center text-x1 font-bold border-2 border-gray-600 rounder-lg bg-gray-700 text-white"
                                
                                />
                                
                             )
                            )
                        }
                        </div>
                    </div>
                    <div>
                        {
                            error && (
                                <div className="bg-red-900 border-red-700 rounded-lg p-3">
                                    <p className="text-red-300 text-sm text-center">{error}</p>
                                </div>

                            )
                        }
                        <button
                            type="submit"
                            className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-4 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            disabled={loading}
                        >
                            {
                                loading?<div className="flex items-center justify-center gap-2">
                                    <Loader2 className="w-5 h-5" />
                                    Verifying...
                                </div>: <div className="flex items-center justify-center gap-2">
                            <span>Verify</span>
                            <ArrowRight size={20} className="shrink-0" />
                            </div>
                            }
        
                        </button>
                    </div>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-gray-400 text-sm mb-4">Din't Receive the code ? </p>
                    {
                        timer>0? <p className="text-gray-400 text-sm">Resend Code in {timer} seconds</p>:<button className="text-blue-400 hover:text-blue-300 font-medium text-sm disabled:opacity-50" disabled={resendLoading} onClick={handleResendOtp}>{resendLoading?"sending...":"Resend code"}</button>
                    }
                </div>
            </div>
          </div>
        </div>
    )
}