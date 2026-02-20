import { NavLink, Outlet } from "react-router";

const menuItems = [
  { path: PREFIX + "about", name: "О приложении" },
  { path: PREFIX + "city", name: "Погода в городах" },
];

export function Header() {
  return (
    <>
      <h1 className="header">Приложение 'Погода' (React)</h1>
      <div className="menu flex-container">
        {menuItems.map((item, id) => (
          <NavLink key={id} to={item.path} className="menu-item border">
            {item.name}
          </NavLink>
        ))}
      </div>
      <Outlet />
    </>
  );
}
