import "./AuthorProfile.css";
import { NavLink, Outlet } from "react-router-dom";
import { useSelector } from 'react-redux';

function AuthorProfile() {
  let { currentUser } = useSelector(state => state.userAuthoruserAuthorLoginReducer);

  return (
    <div className="author-profile p-3">
      <ul className="nav justify-content-around fs-3">
        <li className="nav-item">
          <NavLink
            className="nav-link"
            to={`recipes-by-author/${currentUser.username}`}
            style={{ color: "var(--dark-green)" }}
          >
            Recipes
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink
            className="nav-link"
            to="new-recipe"
            style={{ color: "var(--dark-green)" }}
          >
            Add new
          </NavLink>
        </li>
      </ul>
      <Outlet />
    </div>
  );
}

export default AuthorProfile;
