
"use client";
import React, { useEffect, useState } from "react";
import { useAppData } from "../context/AppContext";
import { useRouter } from "next/navigation";
import Loading from "../components/Loading";
import ChatSidebar from "../components/ChatSidebar";

interface Message {
  _id: string;
  chatId: string;
  sender: string;
  text?: string;
  imageUrl?: {
    url: string;
    publicId: string;
  };
  messageType: "text" | "image";
  seen: boolean;
  seenAt?: string | null;
  createdAt: string;

}


export default function ChatApp() {
  const { isAuth, loading , logOutUser, chats, user: loggedInUser, users, fetchChats,setChats} = useAppData();

const [ selectedUser, setSelectedUser] = useState<string|null>(null);
const [message , setMessage] = useState("");
const [siderbarOpen, setSidebarOpen] = useState(false);
const [messages, setMessages] = useState<Message[] | null>(null);
const [user, setUser] = useState<any>(null);
const [showAllUser, setShowAllUser] = useState(false);
const [isTyping, setIsTyping] = useState(false);
const [typingTimeOut, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);

















  const router = useRouter();
  useEffect(() => {
    if (!loading && !isAuth) {
      router.push("/login");
    }
  }, [isAuth, loading, router]);

   const handleLogout = () => logOutUser();
  if (loading) return <Loading />;
  if (!isAuth) return <Loading />;
  return (
    <div className="min-h-screen flex bg-gray-900 text-white relative overflow-hidden">
      <ChatSidebar 
      sidebarOpen={siderbarOpen}
       setSidebarOpen={setSidebarOpen}
        showAllUsers={showAllUser}
         setShowAllUsers={setShowAllUser}
          users={users}
           loggedInUser={loggedInUser} 
           chats={chats}
            selectedUser={selectedUser}
             setSelectedUser={setSelectedUser} 
             handleLogout={handleLogout}/>
    </div>
  
  );
}