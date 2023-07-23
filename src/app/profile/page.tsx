"use client";
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {toast} from 'react-hot-toast';
import {useState} from 'react';


export default function ProfilePage() {
    const router = useRouter();
    const [data, setData] = useState("nothing");
    const logout = async() => {
        try {
           await axios.get("/api/users/logout");
           toast.success('Logout successfull');
           router.push('/login');
        } catch (error: any) {
            console.log(error.message);
            toast.error(error.message);
        } finally {

        }
    }

    const getUserDetails = async() => {
        try {
            const response = await axios.get('/api/users/me');
            console.log(response.data)
            setData(response.data.data._id);
        } catch (error) {
            
        }
    }
    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            <h1>Profile</h1>
            <hr />
            <p>Profile Page</p>
            <h2 className='p-3 rounded bg-green-600'>{data === 'nothing'? "Nothing": <Link href={`/profile/${data}`}> {data}
            </Link> }</h2>
            <hr />
            <button
            onClick={logout}
            className="bg-blue-500 mt-4 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >Logout</button>
            <button
            onClick={getUserDetails}
            className="bg-green-900 mt-4 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >Get User details</button>
        </div>
    )
}