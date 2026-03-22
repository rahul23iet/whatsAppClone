
"use client";
import React, { useEffect, useState } from "react";
import { useAppData, User } from "../context/AppContext";
import { useRouter } from "next/navigation";
import Loading from "../components/Loading";
import ChatSidebar from "../components/ChatSidebar";
import Cookies from "js-cookie";
import axios from "axios";
import toast from "react-hot-toast";
import ChatHeader from "../components/ChatHeader";

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

async function fetchChat(){
  try{
    const token = Cookies.get("token");
    const { data } = await axios.get(`${process.env.chat_service}/api/v1/message/${selectedUser}`,{
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });

    setMessages(data.messages);
    setUser(data.user);
    await fetchChats();

  }
  catch(error){
    console.log(error);
    toast.error("Failed to fetch chat");
  }
}






    async function createChat(u:User){
      try{
      
        const token = Cookies.get("token");
        const { data } = await axios.post(`${process.env.chat_service}/api/v1/chat/new`,{
          userId: loggedInUser?._id,
          otherUserId: u._id
        },{
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });

        setSelectedUser(data.chatId);
        setShowAllUser(false);
        await fetchChats();

      }
      catch(error){

      }
    }


    useEffect(() => {
      if(selectedUser){
        fetchChat();
      }
    }, [selectedUser]);



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
             handleLogout={handleLogout}
             createChat={createChat}
             />
      <div className="flex-1 flex items-center justify-between p-4 backdrop-blur-xl bg-white/5 border border-white/10">
      <ChatHeader 
       user={user}
       setSidebarOpen={setSidebarOpen}
        isTyping={isTyping}
         />
      </div>
    </div>
  
  );
}