import Hero from "../components/Hero";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAccount } from "wagmi";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  const { isConnected } = useAccount();
  const { address } = useAccount();

  // When the page loads, check if user is connected, and if connected,
  // route the user to the profile page
  useEffect(() => {
    async function showUserProfile() {
      return router.push(`profiles/${address}`);
    }
    if (isConnected) {
      showUserProfile();
    } 
  }, [router, address, isConnected]);

  return (
    <>
      {/* Add the Navbar */}

      <Navbar />
      <Hero />
      <Footer />
    </>
  );
}
