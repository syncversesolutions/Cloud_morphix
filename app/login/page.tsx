"use client";

import { useState, FormEvent } from "react";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  User,
} from "firebase/auth";
import { auth, googleProvider, db } from "../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleEmailLogin = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user: User = userCredential.user;

      if (!user.email) {
        throw new Error("User email is null.");
      }

      const dashboardRef = doc(db, "dashboards", user.email);
      const dashboardSnap = await getDoc(dashboardRef);

      if (dashboardSnap.exists()) {
        const lookerUrl = dashboardSnap.data().lookerUrl;
        router.push(`/dashboards?url=${encodeURIComponent(lookerUrl)}`);
      } else {
        alert("No Looker dashboard found for this user.");
      }
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user: User = result.user;

      if (!user.email) {
        throw new Error("User email is null.");
      }

      const dashboardRef = doc(db, "dashboards", user.email);
      const dashboardSnap = await getDoc(dashboardRef);

      if (dashboardSnap.exists()) {
        const lookerUrl = dashboardSnap.data().lookerUrl;
        router.push(`/dashboard?url=${encodeURIComponent(lookerUrl)}`);
      } else {
        alert("No Looker dashboard found for this user.");
      }
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleEmailLogin} className="bg-white p-8 rounded shadow w-80">
        <h2 className="text-xl font-semibold mb-4">Login</h2>
        <input
          type="email"
          placeholder="Email"
          className="mb-2 w-full p-2 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="mb-4 w-full p-2 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700"
        >
          Sign In
        </button>
      </form>

      <div className="mt-4">
        <button
          onClick={handleGoogleSignIn}
          className="bg-red-500 text-white py-2 px-6 rounded hover:bg-red-600"
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
}
