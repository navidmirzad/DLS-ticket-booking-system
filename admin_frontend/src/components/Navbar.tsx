//

const Navbar = () => {
    return (
      <nav className="bg-gray-800 text-white px-6 py-4 shadow-md">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <a href="/" className="text-2xl font-bold hover:text-gray-300">
              Eventix - Admin Panel
            </a>
          </div>
  
          <div className="space-x-3">
            <button className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors" onClick={() => {
              localStorage.removeItem("token");
              window.location.href = "/login";
            }}>Logout</button>
          </div>
        </div>
      </nav>
    );
  };
  
  export default Navbar;
  