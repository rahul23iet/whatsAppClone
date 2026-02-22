"use client"

import App from "next/app";
import Cookies from "js-cookie";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";


export const user_service = "http://localhost:5000"
export const chat_service = "http://localhost:3002"

export interface User {
    _id: string;
    name: string;
    email: string;
}

export interface Chat {
    _id: string;
    users: string[];
    latestMessage: {
        text: string;
        sender: string;
    };
    createdAt: string;
    updatedAt: string;
    unseenCount?: number;
}

export interface Chats {
    _id: string;
    user: User;
    chat: Chat;
}

interface AppContextType {
    user: User | null;
    loading: boolean;
    isAuth: boolean;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
    setIsAuth: React.Dispatch<React.SetStateAction<boolean>>;
    logOutUser: () => Promise<void>;
    fetchChats: () => Promise<void>;
    fetchUsers: () => Promise<void>;
    chats: Chat[] | null;
    users: User[] | null;
    setChats: React.Dispatch<React.SetStateAction<Chat[] | null>>;

}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
    children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => { 
    const [user, setUser] = useState<User | null>(null);
    const [isAuth, setIsAuth] = useState(false);
    const [loading, setLoading] = useState(true);

    async function fetchUser() {
        try {
            const token = Cookies.get("token");
            const { data } = await axios.get(`${user_service}/api/v1/me`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setUser(data);
            setIsAuth(true);
            setLoading(false);
        }
        catch (error) {
            setIsAuth(false);
            setLoading(false);
        }
    }


    async function logoutUser() {
        Cookies.remove("token");
        setUser(null);
        setIsAuth(false);
        toast.success("Logged out successfully");
    }

    const [chats, setChats] = useState<Chat[] | null >(null);
    async function fetchChats() {
        try{ 
            const token = Cookies.get("token");
            console.log("Fetching chats with token:======>>>>", token);
            const { data } = await axios.get(`${chat_service}/api/v1/chat/all`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setChats(data.chats);

        }
        catch(error){
            console.error("Error fetching chats:", error);
        }
    }


    const [users, setUsers] = useState<User[] | null>(null);
    async function fetchUsers() {
       try{

            const token = Cookies.get("token");
            const { data } = await axios.get(`${user_service}/api/v1/user/all`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
          setUsers(data.users);
       }
       catch(error){
        console.error("Error fetching users:", error);
       }

    }




    useEffect(() => {
        fetchUser();
        fetchChats();
        fetchUsers();
    }, []);

    return (
        <AppContext.Provider value={{ user, setUser, isAuth, setIsAuth, loading, logOutUser: logoutUser, fetchChats, fetchUsers, chats, users, setChats }}>
            {children}
            <Toaster />  
        </AppContext.Provider>
    );
}


export const useAppData = (): AppContextType => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error("useAppData must be used within an AppProvider");
    }
    return context;
}


