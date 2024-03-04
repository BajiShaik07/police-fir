import { useRef, useState } from "react";
import { FaBars, FaTimes, FaSearch } from "react-icons/fa";
import "./Navbar.css";
import logo from '../../public/logo.jpg'
import { NavLink } from "react-router-dom";

function Navbar() {
  const navRef = useRef();
  const [isNavVisible, setIsNavVisible] = useState(false);

  const toggleNavbar = () => {
    setIsNavVisible(!isNavVisible);
  };

  const closeNavbar = () => {
    setIsNavVisible(false);
  };

  const handleNavLinkClick = () => {
    closeNavbar();
  };

  return (
    <header>
      <img src={logo} alt="" className='logo'/>
      <nav ref={navRef} className={isNavVisible ? "responsive_nav" : ""}>
        <NavLink to='/' onClick={handleNavLinkClick}>Home</NavLink>
        <NavLink to='/signup' onClick={handleNavLinkClick}>SignUp</NavLink>
        <NavLink to='/complaint' onClick={handleNavLinkClick}>Complaints</NavLink>
        <NavLink to='/about' onClick={handleNavLinkClick}>About Me</NavLink>
        {/* Add the search bar and icon here */}
        <div className="search-bar">
          <input type="text" placeholder="Search..." />
          <FaSearch />
        </div>
        <button
          className="nav-btn nav-close-btn"
          onClick={closeNavbar}>
          <FaTimes />
        </button>
      </nav>
      <button
        className="nav-btn"
        onClick={toggleNavbar}>
        <FaBars />
      </button>
    </header>
  );
}

export default Navbar;
