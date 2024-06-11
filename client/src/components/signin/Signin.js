import { useState } from "react";
import "./Signin.css";
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { userAuthorLoginThunk } from "../../redux/slices/userAuthorSlice";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function Signin() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { isPending, currentUser, loginUserStatus, errorOccurred, errMsg } =
    useSelector((state) => state.userAuthoruserAuthorLoginReducer);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [passwordVisible, setPasswordVisible] = useState(false);

  function onSignUpFormSubmit(userCred) {
    dispatch(userAuthorLoginThunk(userCred));
  }

  useEffect(() => {
    if (loginUserStatus) {
      if (currentUser.userType === "author") {
        navigate("/author-profile");
      } else if (currentUser.userType === "user") {
        navigate("/user-profile");
      } else {
        navigate("/admin-profile");
      }
    }
  }, [loginUserStatus, currentUser, navigate]);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div className="container">
      <div className="row justify-content-center mt-5">
        <div className="col-lg-4 col-md-6 col-sm-6">
          <div className="card shadow">
            <div className="card-title text-center border-bottom">
              <h2 className="p-3">Signin</h2>
            </div>
            <div className="card-body">
              {errorOccurred && (
                <p className="text-center" style={{ color: "var(--crimson)" }}>
                  {errMsg}
                </p>
              )}
              <form onSubmit={handleSubmit(onSignUpFormSubmit)}>
                <div className="mb-4">
                  <label
                    htmlFor="user"
                    className="form-check-label me-3"
                    style={{
                      fontSize: "1.2rem",
                      color: "var(--light-dark-grey)",
                    }}
                  >
                    Login as
                  </label>
                  <div className="form-check form-check-inline">
                    <input
                      type="radio"
                      className="form-check-input"
                      id="author"
                      value="author"
                      {...register("userType", { required: "User type is required" })}
                    />
                    <label htmlFor="author" className="form-check-label">
                      Author
                    </label>
                  </div>
                  <div className="form-check form-check-inline">
                    <input
                      type="radio"
                      className="form-check-input"
                      id="user"
                      value="user"
                      {...register("userType", { required: "User type is required" })}
                    />
                    <label htmlFor="user" className="form-check-label">
                      User
                    </label>
                  </div>
                  <div className="form-check form-check-inline">
                    <input
                      type="radio"
                      className="form-check-input"
                      id="admin"
                      value="admin"
                      {...register("userType", { required: "User type is required" })}
                    />
                    <label htmlFor="admin" className="form-check-label">
                      Admin
                    </label>
                  </div>
                </div>
                {errors.userType && <p className="text-danger">{errors.userType.message}</p>}
                <div className="mb-4">
                  <label htmlFor="username" className="form-label">
                    Username
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="username"
                    {...register("username", { required: "Username is required" })}
                  />
                  {errors.username && <p className="text-danger">{errors.username.message}</p>}
                </div>
                <div className="mb-4">
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  <div className="input-group">
                    <input
                      type={passwordVisible ? "text" : "password"}
                      className="form-control"
                      id="password"
                      {...register("password", { required: "Password is required" })}
                    />
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={togglePasswordVisibility}
                    >
                      {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  {errors.password && <p className="text-danger">{errors.password.message}</p>}
                </div>
                <div className="text-end">
                  <button type="submit" className="text-light" disabled={isPending}>
                    {isPending ? "Logging in..." : "Login"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signin;
