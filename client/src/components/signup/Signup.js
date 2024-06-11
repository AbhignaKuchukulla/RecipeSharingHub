import "./Signup.css";
import { useForm } from "react-hook-form";
import axios from "axios";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function Signup() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();
  const [err, setErr] = useState("");
  const [state, setState] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible(!confirmPasswordVisible);
  };

  async function onSignUpFormSubmit(userObj) {
    try {
      let res;
      if (userObj.userType === 'user') {
        res = await axios.post("http://localhost:4000/user-api/user", userObj);
      } else if (userObj.userType === 'author') {
        res = await axios.post("http://localhost:4000/author-api/author", userObj);
      } else {
        res = await axios.post("http://localhost:4000/admin-api/admin", userObj);
      }
      if (res.status === 201 || res.data.message.includes('created')) {
        setState(true);
        setSignupSuccess(true);
        setErr("");
        navigate('/signin');
      } else {
        setErr(res.data.message);
      }
    } catch (error) {
      setErr(error.response?.data?.message || "An error occurred");
    }
  }

  return (
    <div className="container">
      <div className="row justify-content-center mt-5">
        <div className="col-lg-4 col-md-6 col-sm-6">
          <div className="card shadow">
            <div className="card-title text-center border-bottom">
              {signupSuccess ? (
                <div>
                  <p className="lead fs-3 text-center display-4 text-success">
                    User registration success
                  </p>
                  <p className="text-center fs-6 text-secondary">
                    Proceed to <Link to="/signin">Login</Link>
                  </p>
                  <p className="text-center fs-6 text-secondary">
                    Back to <Link to="/">Home</Link>
                  </p>
                </div>
              ) : (
                <h2 className="p-3">Signup</h2>
              )}
            </div>
            <div className="card-body">
              {err.length !== 0 && (
                <p className="lead text-center text-danger">{err}</p>
              )}
              <form onSubmit={handleSubmit(onSignUpFormSubmit)}>
                {/* radio */}
                <div className="mb-4">
                  <label
                    htmlFor="user"
                    className="form-check-label me-3"
                    style={{
                      fontSize: "1.2rem",
                      color: "var(--light-dark-grey)",
                    }}
                  >
                    Register as
                  </label>
                  <div className="form-check form-check-inline">
                    <input
                      type="radio"
                      className="form-check-input"
                      id="author"
                      value="author"
                      {...register("userType", { required: true, disabled: state })}
                    />
                    <label
                      htmlFor="author"
                      className="form-check-label"
                      style={{ color: "var(--crimson)" }}
                    >
                      Author
                    </label>
                  </div>
                  <div className="form-check form-check-inline">
                    <input
                      type="radio"
                      className="form-check-input"
                      id="admin"
                      value="admin"
                      {...register("userType", { required: true, disabled: state })}
                    />
                    <label
                      htmlFor="admin"
                      className="form-check-label"
                      style={{ color: "var(--crimson)" }}
                    >
                      Admin
                    </label>
                  </div>
                  <div className="form-check form-check-inline">
                    <input
                      type="radio"
                      className="form-check-input"
                      id="user"
                      value="user"
                      {...register("userType", { required: true, disabled: state })}
                    />
                    <label
                      htmlFor="user"
                      className="form-check-label"
                      style={{ color: "var(--crimson)" }}
                    >
                      User
                    </label>
                  </div>
                </div>
                {errors.userType && (
                  <p className="text-danger">Please select a User type</p>
                )}
                <div className="mb-4">
                  <label htmlFor="fullName" className="form-label">
                    Full Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="fullName"
                    {...register("fullName", { required: true, disabled: state })}
                  />
                  {errors.fullName && (
                    <p className="text-danger">Full name is required</p>
                  )}
                </div>
                <div className="mb-4">
                  <label htmlFor="username" className="form-label">
                    Username
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="username"
                    {...register("username", {
                      required: true,
                      minLength: 4,
                      maxLength: 10,
                      disabled: state,
                    })}
                  />
                  {errors.username?.type === "required" && (
                    <p className="text-danger">User name is required</p>
                  )}
                  {errors.username?.type === "minLength" && (
                    <p className="text-danger">Min length should be 4</p>
                  )}
                  {errors.username?.type === "maxLength" && (
                    <p className="text-danger">Max length should be 10</p>
                  )}
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
                      {...register("password", { required: true, disabled: state })}
                    />
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={togglePasswordVisibility}
                    >
                      {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-danger">Please enter password</p>
                  )}
                </div>
                <div className="mb-4">
                  <label htmlFor="confirmPassword" className="form-label">
                    Confirm Password
                  </label>
                  <div className="input-group">
                    <input
                      type={confirmPasswordVisible ? "text" : "password"}
                      className="form-control"
                      id="confirmPassword"
                      {...register("confirmPassword", {
                        required: true,
                        validate: (value) =>
                          value === watch("password") || "Passwords do not match",
                        disabled: state,
                      })}
                    />
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={toggleConfirmPasswordVisibility}
                    >
                      {confirmPasswordVisible ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-danger">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>
                <div className="mb-4">
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    {...register("email", { required: true, disabled: state })}
                  />
                  {errors.email && (
                    <p className="text-danger">Please enter email</p>
                  )}
                </div>
                <div className="text-end">
                  <button type="submit" className="text-light" disabled={state}>
                    Register
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

export default Signup;
