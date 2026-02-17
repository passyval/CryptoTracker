import { NavLink } from "react-router-dom";

const NAVBAR_ITEM = [
  {
    label: "Home",
    to: "/",
  },
  {
    label: "Preferiti",
    to: "/bookmarks",
  },
  {
    label: "Portafoglio",
    to: "/wallet",
  },
];

const Navbar = () => {
  return (
    <nav className="ml-2">
      <ul className="flex">
        {NAVBAR_ITEM.map(({ label, to }) => (
          <li key={label}>
            <NavLink to={to} className="nav-btn">
              {label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navbar;
