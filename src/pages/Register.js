import { useForm } from "react-hook-form";
import { toHash } from "../Hash";
import { useRef } from "react";
function Register({ setUser }) {

  const {
    register,
    handleSubmit,watch,
    formState: { errors },
  } = useForm();
  const password = useRef({});
  password.current = watch("password", "");
  const formSumbit = async (data) => {
    console.log(data);
    const user = {};
    user.name = data.name;
    user.email = data.email;
    user.username = data.username;
    user.date=new Date();
    console.log("photoooooooooo"+data.photo[0].name);

    let myPic=data.photo[0].name;
    const fileNameWithoutExtension = myPic.substring(0, myPic.lastIndexOf("."));

    user.photo=fileNameWithoutExtension;
    const hashed = await toHash(data.password);
    user.password = hashed;
    await fetch("http://localhost:3004/users", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(user),
    });
    const fetchuserid = await fetch(
      "http://localhost:3004/users?username=" + data.username,
      {
        method: "GET",
      }
    );
    const getuserid = await fetchuserid.json();
    setUser(getuserid[0].id,getuserid[0].name);
  };
  return (
    <div>
    <section className="login-section py-5">
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-12">
        <div className="login-panel panel panel-default">
        <div className="panel-heading">
          <h3 className="panel-title">Create Account</h3>
        </div>
        <div className="panel-body">
          <div className="card">
            
            <div className="card-body">
              <form  onSubmit={handleSubmit(formSumbit)}>
                <div className="form-group">
                  <label for="username">Name</label>
                  <input type="text" className="form-control"    {...register("name", { required: "Name is required" })}/>
                  {errors.name && <span className="text-danger">{errors.name.message}</span>}

                </div>
                
				 <div className="form-group">
                  <label for="email">Email</label>
                  <input type="text" className="form-control" {...register("email",{ required: "Email is required",pattern:{value:/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,message:"Invalid email"}})} />
				                    {errors.email && <span className="text-danger">{errors.email.message}</span>}

                </div>
                <div className="form-group">
                  <label for="photo">Photo</label>
                  <input type="file" className="form-control" {...register("photo")} />

                </div>   
				 <div className="form-group">
                  <label for="username">Username</label>
                  <input type="text" className="form-control"  {...register("username", { required: "Username is required" })}/>
				                    {errors.username && <span className="text-danger">{errors.username.message}</span>}

                </div>
				 <div className="form-group">
                  <label for="password">Password</label>
                  <input type="password" className="form-control" {...register("password", { required: "Password is required" })}/>
				                    {errors.password && <span className="text-danger">{errors.password.message}</span>}

                </div>
				<div className="form-group">
                  <label for="password">Confirm Password</label>
                  <input type="password" className="form-control" {...register("confirmPassword", {
            required: "Confirm Password is required", validate: value =>
            value === password.current || "Passwords do not match"
          })}/>
                  {errors.confirmPassword && <span className="text-danger">{errors.confirmPassword.message}</span>}
                </div>
                <button type="submit" className="btn btn-primary btn-block">Create</button>
				
              </form>
            </div>
          </div>
          </div></div>
        </div>
      </div>
    </div>
  </section>


    </div>
  );
}

export default Register;
