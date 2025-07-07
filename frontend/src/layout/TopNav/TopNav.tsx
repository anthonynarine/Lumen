// ✅ layout/TopNav/TopNav.tsx
import { Link } from "react-router-dom";
import { navWrapperClass, navContainerClass, logoLinkClass } from "./topNav.style"

const TopNav = () => {
  return (
    <header className={navWrapperClass}>
      <div className={navContainerClass}>
        <Link to="/" className={logoLinkClass}>
          Lumen
        </Link>
      </div>
    </header>
  );
};

export default TopNav;
