import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Home from "./Home";
import { Link } from "react-router-dom";
function Posts({ userid, uname }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [selectedImage, setSelectedImage] = useState();
  const [tags, setTags] = useState([]);
  const [errMsg, setErrMsg] = useState(null);
  const [x, setX] = useState(null);
  const [y, setY] = useState(null);
  const [success, setSuccess] = useState(null);
  const [taggedUserid, setTaggedUserid] = useState(null);

  const handleClose = () => {
    console.log("dddddddddd");
    const myModall = document.getElementById("myModal");

    myModall.style.display = "none";
  };
  const [error, setError] = useState(null);
  useEffect(() => {
    const myImageInput = document.getElementById("myImage");
    myImageInput.addEventListener("change", (event) => {
      console.log(event.target.files[0]);
      setImage(event);
    });
    return () => {
       // myImageInput.removeEventListener("change");
    };
  }, [register]);
  async function setImage(event) {
    try {
      const imageFile = event.target.files[0];
      setSelectedImage(imageFile);
      console.log("selectedImage" + selectedImage);
    } catch (error) {
      console.log(error);
    }
  }
  const onSub = async (data) => {
    const fileNameWithoutExtension = selectedImage.name.substring(0, selectedImage.name.lastIndexOf("."));

    try {
      const post1 = {
        newpost: data.newPost,
        userid: userid,
        date: new Date(),
        filename: fileNameWithoutExtension,
      };
      const postUrl = await fetch("http://localhost:3004/posts", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(post1),
      });
      const resp = await postUrl.json();
      if (taggedUserid) {
        const post1 = {
          fromUserid: userid,
          postid: resp.id,
          toUserid: taggedUserid,
          x: x,
          y: y,
        };
        const postUrl = await fetch("http://localhost:3004/postTagMapping", {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify(post1),
        });
      }
      setSuccess(resp);
    } catch (error) {
      setError(error);
    }
  };
  if (success) return <Home userid={userid} uname={uname}></Home>;
  if (error) return <div>{error.message}</div>;
  const tagSub = async () => {
    const usercheckname = document.getElementById("usercheck").value;
    if (!usercheckname) {
      setErrMsg("Please Input");
      return false;
    }
    const users = await fetch(
      "http://localhost:3004/users?username=" + usercheckname,
      { method: "GET" }
    );
    const userlist = await users.json();
    let userCount = 0;
    userCount = userlist.length;
    if (userCount === 0) {
      setErrMsg("User Not Valid");
      return false;
    } else {
      setErrMsg("");
      setTaggedUserid(userlist[0].id);
      setTags([...tags, { x, y, usercheckname }]);
      handleClose();
    }
  };
  const handleImageClick = (event) => {
    setX(event.nativeEvent.offsetX);
    setY(event.nativeEvent.offsetY);
    const myModal = document.getElementById("myModal");
    myModal.style.display = "block";
  };
  return (
    <div>
      <div>
        <div className="modal" tabindex="-1" role="dialog" id="myModal">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  onClick={() => handleClose()}
                  aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
                <h5 className="modal-title">Tag user</h5>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label for="usercheck">Enter User</label>
                  <input type="test" id="usercheck" className="form-control" />
                </div>
                <span className="text-danger">{errMsg}</span>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-dismiss="modal"
                  onClick={() => handleClose()}>
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    tagSub();
                  }}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <section className="login-section py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-12">
              <div className="login-panel panel panel-default">
                <div className="panel-heading">
                  <h3 className="panel-title">New Post</h3>
                </div>
                <div className="panel-body">
                  <div className="card">
                    <div className="card-body">
                      <form onSubmit={handleSubmit(onSub)}>
                        <div className="form-group">
                          {selectedImage && (
                            <div>
                              <img
                                id="myImg"
                                width={"250px"}
                                src={URL.createObjectURL(selectedImage)}
                                onClick={handleImageClick}
                              />
                              {tags.map((tag, index) => (
                                <div
                                  key={index}
                                  style={{
                                    position: "absolute",
                                    left: tag.x,
                                    top: tag.y,
                                    backgroundColor: "white",
                                    border: "1px solid black",
                                    padding: "5px",
                                  }}
                                >
                                  <div>{tag.usercheckname}</div>
                                </div>
                              ))}
                              <br />
                              <button
                                onClick={() => {
                                  console.log("df");
                                  setSelectedImage(null);
                                  document.getElementById("myImage").value = "";
                                }}
                              >
                                Remove
                              </button>
                              &nbsp;&nbsp;Click on image to tag user
                              <br />
                              <br></br>
                            </div>
                          )}
                          <input
                            type="file"
                            id="myImage"
                            className="form-control"
                            {...register("newImage", {
                              required: "Upload an image",
                            })}
                          />
                          {errors.newImage && (
                            <span className="text-danger">
                              {errors.newImage.message}
                            </span>
                          )}
                        </div>
                        <div className="form-group">
                          <input
                            type="text"
                            className="form-control"
                            {...register("newPost")}
                          />
                        </div>
                        <button type="submit" className="btn btn-primary ">
                          Submit
                        </button>
                        &nbsp;&nbsp;
                        <span className="text-danger">{error}</span>
                      </form>
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

export default Posts;
