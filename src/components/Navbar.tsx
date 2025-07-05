// import React, { useEffect } from "react";

const Navbar = () => {
  return (
    <nav className="bg-teal-700 text-white h-20 flex justify-between items-center px-8">
      <div className="font-bold text-2xl">Travel Easy</div>
      <div className="font-semibold flex gap-5">
        <button>Home</button>
        <button>Trips</button>
        <button>Location</button>
      </div>
    </nav>
  );
};

export default Navbar;
