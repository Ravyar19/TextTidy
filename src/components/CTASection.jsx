import React from "react";

const CTASection = () => {
  return (
    <div className="relative bg-teal-950 py-24">
      {/* Grid Pattern Overlay */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(to right, #ffffff 1px, transparent 1px),
            linear-gradient(to bottom, #ffffff 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
        }}
      />

      {/* Content Container */}
      <div className="relative container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-12">
          Ready to get experience TextTidy?
        </h2>

        <div className="flex justify-center gap-4 flex-wrap">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg transition-colors">
            Get Started
          </button>
          <button className="bg-transparent hover:bg-teal-900 text-white border border-white px-8 py-3 rounded-lg transition-colors">
            Contact Sales
          </button>
        </div>
      </div>

      {/* Optional: Gradient Overlay for depth */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.2) 100%)",
        }}
      />
    </div>
  );
};

export default CTASection;
