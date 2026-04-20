import React, { useEffect } from "react";
import { useLocation } from "react-router";
import Navbar from '../components/Navbar'
import Hero from '../sections/Hero'
import Collection from '../components/homecomponents/Collection'
import Products from '../sections/Products'
import Footer from '../sections/Footer'
import Design from '../components/homecomponents/Design'

function HomePage() {
    const { hash } = useLocation();

    useEffect(() => {
        if (!hash) return;
        const sectionId = hash.slice(1);
        const sectionEl = document.getElementById(sectionId);
        if (sectionEl) {
            setTimeout(() => {
                sectionEl.scrollIntoView({ behavior: "smooth", block: "start" });
            }, 0);
        }
    }, [hash]);

    return (
        <>
            <Navbar/>
            <Hero/>
            <Collection/>
            <Design/>
            <Products/>
            <Footer/>
        </>
    )
}

export default HomePage