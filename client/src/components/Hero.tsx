import { Link } from "react-router-dom";
import cricketImage from "../assets/image/cricket.jpg";
import Navbar from "./Navbar";
import Footer from "../pages/footer";
import CustomerCarousel from "./Review";

export default function Hero() {
  return (
    <>
      <Navbar />
      <div className="w-[90%] max-w-[1100px] mx-auto bg-white">
        <div className="grid grid-cols-1 md:grid-cols-2 h-auto md:h-[600px]">
          <div className="flex flex-col justify-center p-10">
            <div>
              <p className="text-2xl font-semibold text-blue-700 text-center mb-8 leading-relaxed">
                "Every great tournament starts with a single match,
                and every champion was once a beginner.
                Organize, play, and make history!"
              </p>
            </div>

            <div className="flex justify-center gap-6">
              <Link
                to="/RegisterTeam"
                className="px-7 py-3 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition duration-300"
              >
                Get Started as Team
              </Link>
              <Link
                to="/register/organizer"
                className="px-7 py-3 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition duration-300"
              >
                Get Started as Organizer
              </Link>
            </div>
          </div>

          {/* Image: hidden on small screens, shown on md and above */}
          <div className="hidden md:flex justify-center items-end p-4 mt-20">
            <img
              src={cricketImage}
              alt="Cricket Tournament"
              className="w-full h-full object-cover self-end"
            />
          </div>
        </div>
      </div>
      <CustomerCarousel />
      {/* Footer can be added below if needed */}
      {/* <Footer /> */}
    </>
  );
}



