import React from "react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-8 mt-10">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* About Section */}
        <div>
          <h3 className="text-xl font-bold mb-3">About Us</h3>
          <p className="text-gray-400">
            We provide a platform to manage and organize tennis cricket tournaments with ease.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-xl font-bold mb-3">Quick Links</h3>
          <ul className="space-y-2">
            <li><a href="/tournaments" className="hover:text-blue-400 transition">Tournaments</a></li>
            <li><a href="/teams" className="hover:text-blue-400 transition">Teams</a></li>
            <li><a href="/contact" className="hover:text-blue-400 transition">Contact</a></li>
            <li><a href="/privacy-policy" className="hover:text-blue-400 transition">Privacy Policy</a></li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700 mt-6 pt-4 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} Tennis Cricket Organizer. All rights reserved.
      </div>
    </footer>
  );
}
