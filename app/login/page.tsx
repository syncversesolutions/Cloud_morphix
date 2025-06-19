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

      if (!user.email) throw new Error("User email is null.");

      const dashboardRef = doc(db, "dashboards", user.email);
      const dashboardSnap = await getDoc(dashboardRef);

      if (dashboardSnap.exists()) {
        const lookerUrl = dashboardSnap.data().lookerUrl;
        router.push("/dashboard");
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

      if (!user.email) throw new Error("User email is null.");

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">Cloud Morphix</h2>
        <form onSubmit={handleEmailLogin} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
            <input
              type="email"
              id="email"
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              id="password"
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-200"
          >
            Sign In
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-2 text-gray-500">Or</span>
          </div>
        </div>

        <button
          onClick={handleGoogleSignIn}
          className="w-full py-2 px-4 flex items-center justify-center border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition duration-200"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            className="w-5 h-5 mr-2"
          />
          <span className="text-sm font-medium text-gray-700">Sign in with Google</span>
        </button>
      </div>
    </div>
  );
}
