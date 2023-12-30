import { Outlet } from "react-router-dom";
import NavBar from "./Components/NavBar";

// Layout Component
export function Layout() {
  return (
    <>
      <NavBar />
      <Outlet />
    </>
  );
}
