
import Hero from "./Hero";
import Navbar from "../components/Navbar";
import styles from "../styles/Home.module.css";
import Link from "next/link";
import Footer from "./Footer";

export default function Home() {
    return (
       <>
         {/* Add the Navbar */}
         <Navbar />
         <Hero />
         <Footer />
       </>
    )
}