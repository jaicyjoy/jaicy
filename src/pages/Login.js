import { useForm } from "react-hook-form";
import { hashCompare } from "../Hash";
import React, { useState } from "react";
import { Link } from "react-router-dom";

function Login({ setUser }) {
  const [error, setError] = useState(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSub = async (data) => {
    const res = await fetch(
      "http://localhost:3004/users?username=" + data.username,
      {
        method: "GET",
        headers: { "Content-type": "application/json" },
      }
    );
    const newdata = await res.json();
    if (newdata.length > 0) {
      const compareResult = await hashCompare(data.password, newdata[0].password);
      if (compareResult) {
        setUser(newdata[0].id, newdata[0].name);
      } else setError("Invalid Credentials");
    } else setError("Invalid Credentials");
  };

  return (
    <div>
      <section className="login-section py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-12">
              <div className="login-panel panel panel-default">
                <div className="panel-heading">
                  <h3 className="panel-title">Login</h3>
                </div>
                <div className="panel-body">
                  <div className="card">
                    <div className="card-body">
                      <form onSubmit={handleSubmit(onSub)}>
                        <div className="form-group">
                          <label for="username">Username</label>
                          <input
                            type="text"
                            className="form-control"
                            {...register("username", {
                              required: "Name is Required ",
                            })}
                          />
                          {errors.username && (
                            <span className="text-danger">
                              {errors.username.message}
                            </span>
                          )}
                        </div>
                        <div className="form-group">
                          <label for="password">Password</label>
                          <input
                            type="password"
                            className="form-control"
                            {...register("password", {
                              required: "Password is Required ",
                            })}
                          />
                          {errors.password && (
                            <span className="text-danger">
                              {errors.password.message}
                            </span>
                          )}
                        </div>
                        <button
                          type="submit"
                          className="btn btn-primary btn-block"
                        >
                          Login
                        </button>
                        <span className="text-danger">{error}</span>
                      </form>

                      <br />
                      <Link to="/register">Create account</Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
export default Login;
