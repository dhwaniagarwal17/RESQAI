import { NavLink } from "react-router-dom";
import { Home, Siren, FileText, Shield, Users } from "lucide-react";

export default function Navbar({ role }) {
  const links = role === "admin"
    ? [["/admin", "Dashboard", Home], ["/admin", "All Incidents", FileText]]
    : role === "rescue"
      ? [["/rescue", "My Jobs", Shield]]
      : [["/reporter", "Home", Home], ["/reporter#report", "Report an Incident", Siren], ["/reporter#mine", "My Reports", FileText]];

  return (
    <nav className="nav-bar">
      {links.map(([to, label, Icon]) => (
        <NavLink key={label} to={to} className={({ isActive }) => isActive ? "active" : ""}>
          <Icon size={17} /> {label}
        </NavLink>
      ))}
    </nav>
  );
}