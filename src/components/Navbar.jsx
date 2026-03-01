import { NavLink } from "react-router-dom";

const Navbar = () => {
  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("verifier");
    window.location.href = "/";
  };

  const navItems = [
    { to: "/dashboard", label: "Dashboard" },
    { to: "/top-tracks", label: "Tracks" },
    { to: "/top-artists", label: "Artists" },
    { to: "/mood", label: "Vibe" },
    { to: "/history", label: "Log" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full md:static md:w-[190px] md:h-screen bg-[#0A0A0A] flex flex-col justify-between z-50 shrink-0">
      <div className="p-6 pb-8">
        <h1 className="text-white font-extrabold text-2xl tracking-tighter mb-1">
          MOOD<span className="text-[#E8360D]">.</span>
        </h1>
        <p className="font-mono text-[#8A8480] text-[13px] tracking-[3px]">
          ANALYTICS
        </p>
      </div>

      <div className="flex-1 flex flex-col justify-center md:justify-start">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `block py-4 px-6 text-[16px] tracking-[2px] font-bold uppercase border-t border-[rgba(242,237,228,0.08)] transition-colors duration-200 ${
                isActive
                  ? "text-[#E8360D]"
                  : "text-[rgba(242,237,228,0.5)] hover:text-white"
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
        {/* Empty border for the last item to close the loop if needed, or just let it be */}
        <div className="border-t border-[rgba(242,237,228,0.08)]"></div>
      </div>

      <div className="p-6">
        <div className="font-mono text-[13px] text-[rgba(242,237,228,0.4)] tracking-widest leading-relaxed">
          MOODIFY™ <br />
          FEB 2026 <br />
          <button
            onClick={handleLogout}
            className="hover:text-white transition-colors text-left"
          >
            [ LOG OUT ]
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
