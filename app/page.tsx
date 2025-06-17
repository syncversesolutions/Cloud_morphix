' use client'
import { db } from './firebaseConfig'
import { collection, addDoc } from 'firebase/firestore/lite';
import React from 'react';
//import Image from "next/image";
//import styles from "./page.module.css";


async function addDataToFireStore(name: any, email: any, message: any) {
  try{
    const docRef = await addDoc(collection(db, "message"), {
      name: name,
      email: email,
      message: message,
    });
    console.log("Document written with ID: ", docRef.id);
    return true;
  } catch (error) {
    console.error("Error adding document", error)
    return false;
  }
  
}


export default function Home() {
   return (
    <><main className='flex min-h-screen flex-col items-center p-24'>
    <h1 className="text-5xl font-bold m-10">
       Add Data to Firebase
     </h1>
     </main></>
  )
}
