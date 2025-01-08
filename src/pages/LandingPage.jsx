import React from "react";
import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import Testimonial from "../components/Testimonial";
import CTASection from "../components/CTASection";

const LandingPage = () => {
  return (
    <div>
      <Navbar />
      <HeroSection />
      <Testimonial />
      <CTASection />
    </div>
  );
};

export default LandingPage;
