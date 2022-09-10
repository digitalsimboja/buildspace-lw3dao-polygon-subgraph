import Hero from "../components/Hero";
import Navbar from "../components/Navbar";
import styles from "../styles/Home.module.css";
import Link from "next/link";
import Footer from "../components/Footer";
import { useAccount, useProvider, useSigner } from "wagmi";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Home() {
  const router = useRouter();
  const { isConnected } = useAccount();
  const { address } = useAccount();

    
  async function showUserProfile() {
    if (address) {
      return router.push(`profiles/${address}`);

    }
  }

  async function goHome() {
    return router.push("/");
  }

  // When the page loads, check if user is connected, and if connected, route the user to the profile page
  useEffect(() => {
    if (isConnected) {
      showUserProfile();
    } else {
      goHome();
    }
  }, [isConnected])

  return (
    <>
      {/* Add the Navbar */}
   
      <Navbar />
      <Hero />
      <Footer />
    </>
  );
}
