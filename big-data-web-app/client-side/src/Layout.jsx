import { Outlet } from "react-router-dom";
import NavBar from "./NavBar";

// Layout Component
export function Layout() {
  return (
    <>
      <NavBar />
      <Outlet />
    </>
  );
}
