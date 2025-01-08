import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { CgProfile } from "react-icons/cg";

const TestimonialSection = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      text: "TextTidy provides us value by transforming unstructured documents into clear, actionable insights. It makes document analysis efficient, especially during high-volume periods.",
      author: "Sarah Johnson",
      position: "Operations Director — Dataflow",
    },
    {
      text: "The AI-powered analysis has revolutionized how we handle document processing. What used to take hours now takes minutes.",
      author: "Michael Chen",
      position: "CTO — DocuTech",
    },
  ];

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) =>
      prev === testimonials.length - 1 ? 0 : prev + 1
    );
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) =>
      prev === 0 ? testimonials.length - 1 : prev - 1
    );
  };

  return (
    <div className="container mx-auto px-4 py-16 ">
      {/* Heading and Stats Section */}
      <div className="grid md:grid-cols-3 gap-8 mb-12">
        {/* Heading */}
        <div className="md:col-span-1">
          <h2 className="text-3xl md:text-4xl font-bold leading-tight">
            Don't just take it from us, but from our users
          </h2>
        </div>

        {/* Stats */}
        <div className="md:col-span-2 grid grid-cols-2 gap-8">
          {/* Users stat */}
          <div>
            <div className="text-4xl font-bold">2k+</div>
            <div className="text-gray-600">Happy Customers</div>
          </div>

          {/* Rating stat */}
          <div>
            <div className="flex items-center gap-2">
              <span className="text-4xl font-bold">4.8</span>
              <div className="flex -mt-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>
            </div>
            <div className="text-gray-600">
              From <span className="underline">1,533 ratings</span>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonial Carousel */}
      <div className="bg-gray-50 rounded-xl p-8 relative">
        <div className="max-w-3xl mx-auto">
          {/* Testimonial Content */}
          <blockquote className="text-xl md:text-2xl mb-8">
            "{testimonials[currentTestimonial].text}"
          </blockquote>

          {/* Author Info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <CgProfile className="w-12 h-12 rounded-full" />
              <div>
                <div className="font-semibold">
                  {testimonials[currentTestimonial].author}
                </div>
                <div className="text-gray-600">
                  {testimonials[currentTestimonial].position}
                </div>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex gap-2">
              <button
                onClick={prevTestimonial}
                className="p-2 rounded-lg border hover:bg-gray-100 transition-colors"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextTestimonial}
                className="p-2 rounded-lg border hover:bg-gray-100 transition-colors"
                aria-label="Next testimonial"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialSection;
