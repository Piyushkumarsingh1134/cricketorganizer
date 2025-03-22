import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md fixed top-4 left-1/2 transform -translate-x-1/2 w-[90%] max-w-[1100px] z-50 rounded-lg px-6 py-2">
      <div className="flex justify-between items-center">
        {/* CricketOrg Logo */}
        <div className="text-2xl font-bold text-blue-600">🏏 CricketOrg</div>

        {/* Tournaments Link */}
        <Link
          to="/Tournament" // ✅ Fixed: Use `to` instead of `=`
          className="border-2 border-blue-600 text-blue-600 px-5 py-1.5 rounded-md hover:bg-blue-600 hover:text-white transition text-base"
        >
          Tournament
        </Link> {/* ✅ Fixed: Properly closed `<Link>` */}
      </div>
    </nav>
  );
}

  
  
  
  
  
  
  
  