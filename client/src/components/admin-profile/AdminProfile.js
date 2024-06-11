// import "./UserProfile.css";
import { NavLink, Outlet } from "react-router-dom";

function AdminProfile() {
  return (
    <>
     <NavLink to='recipes' className='fs-1 text-center nav-link mt-4'>Recipes</NavLink>
      <Outlet />
    </>
  );
}

export default AdminProfile;