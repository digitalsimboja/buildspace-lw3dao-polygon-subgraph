import { useEffect } from "react";
import { useRouter } from "next/router";
import { useAccount } from "wagmi";
import { useColorModeValue } from "@chakra-ui/react";
import Footer from "../components/Footer";
import Hero from "../components/Hero";
import Navbar from "../components/Navbar";

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

      <Navbar bg={useColorModeValue("white", "gray.800")} />
      <Hero />
      <Footer />
    </>
  );
}
