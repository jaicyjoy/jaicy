import React, { useState } from "react";
import Posts from "./Posts";
import Users from "./Users";
import ViewPosts from "./ViewPosts";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

function Home({ userid, uname }) {
  const [post, setPost] = useState(false);
  const [shouldReload, setShouldReload] = useState("");
  const newPost = () => {
    setPost(true);
  };
  const clicked=(val)=>{
console.log(val+"tttttttttttttt");

if(shouldReload==="")
  setShouldReload("s");
  else
  setShouldReload("");
  }
if(!userid) return <Link to='/login'>Click to Login</Link>
  if (post) return <Posts userid={userid} uname={uname} />;
  return (
    <div>
      <div className="container text-center">
        <div className="row">
          <div className="col-sm-9">
            <div className="row">
              <div className="col-sm-12">
                <div className="panel panel-default text-left">
                  <div className="panel-body">
                    <button
                      className="btn btn-primary btn-block"
                      onClick={newPost} >
                      Set a new post
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-sm-12"></div>
            </div>

            <div className="row">
              <div className="col-sm-12">
                <ViewPosts userid={userid} shouldReload={shouldReload}/>
              </div>
            </div>
          </div>
          <div className="col-sm-3 well">
            <div className="thumbnail">
              <p>
                <b> {uname}</b>
              </p>
              <p>
                <Link to="/profile">Profile</Link>
              </p>
            </div>
            <Users userid={userid} clicked={clicked} />
          </div>
        </div>
      </div>
      <footer className="container-fluid text-center">
        <p></p>
      </footer>
    </div>
  );
}
export default Home;
