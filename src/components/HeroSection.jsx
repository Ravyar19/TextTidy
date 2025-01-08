import HeroImage from "../assets/undraw_meeting_dunc.svg";

function HeroSection() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid md:grid-cols-2 gap-8 items-center">
        <div className="space-y-6">
          <div className="inline-flex items-center">
            <div className="w-1 h-4 bg-blue-600 mr-2"></div>
            <span className="text-sm text-blue-600">For Smart Students</span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
            TextTidy Smart document analyzer,{" "}
            <span className="block">Driven by your documents</span>
          </h1>
          <p className="text-gray-600 text-lg max-w-xl">
            Discover the power of AI-driven document analysis with TextTidy.
            Instantly process, organize, and extract valuable insights from your
            documents. Whether it’s PDFs, images, or text files, our smart
            solution streamlines your workflow with accurate data extraction,
            categorization, and summarization. Boost productivity, save time,
            and focus on what matters most.
          </p>
          <div className="flex flex-wrap gap-4">
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
              Get Started
            </button>
            <button className="bg-gray-100 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors">
              Contact Sales
            </button>
          </div>
        </div>
        <div className="relative mt-8 md:mt-0">
          <div className="relative">
            <img
              src={HeroImage}
              alt="Document Analysis Dashboard"
              className="rounded-lg w-full"
            />

            <div className="absolute -bottom-4 right-0 bg-gray-900 text-white p-4 rounded-lg shadow-lg ">
              <div className="text-3xl font-bold">16+</div>
              <p className="text-sm opacity-90">
                Document types supported for your needs
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeroSection;
