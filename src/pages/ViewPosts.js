import React, { useState, useEffect } from "react";
import beach from "../images/beach.jpg";
import cat from "../images/cat.jpg";
import nature from "../images/nature.jpg";
import rose from "../images/rose.jpg";
import sun from "../images/sun.jpg";
import tree from "../images/tree.jpg";
function ViewPosts({ userid, name,shouldReload }) {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [postid, setPostid] = useState(null);
  const [errMsg, setErrMsg] = useState(null);
  const handleClose = () => {
    const myModal = document.getElementById("myModal");
    myModal.style.display = "none";
  };
  const handleOneClose = () => {
    const myModal = document.getElementById("myOneModal");
    myModal.style.display = "none";
  };
  const shareSub = async () => {
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
      setErrMsg("User not valid");
      return false;
    } else {
      setErrMsg("");

      const post1 = {
        fromUserid: userid,
        postid: postid,
        toUserid: userlist[0].id,
        date: new Date(),
      };
      const postUrl = await fetch("http://localhost:3004/postShareMapping", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },

        body: JSON.stringify(post1),
      });

      handleClose();
    }
  };
  useEffect(() => {
    setData([]);
    async function fetchData() {
      try {
        const followers = await fetch(
          "http://localhost:3004/userFollowerMapping?userid=" + userid,
          { method: "GET" }
        );
        console.log("followerslis3", followers);
        const followerslist = await followers.json();
        console.log("followerslisttt");
        followerslist.map(async (item) => {
          const response = await fetch(
            "http://localhost:3004/posts?userid=" + item.followerid+"&_sort=date&_order=desc",
            { method: "GET" }
          );
          const newData = await response.json();
          newData.map(async (item) => {
            const newpost = item.newpost;
            const id = item.id;
            const filename = item.filename;

            const postedUserid = item.userid;
            const response1 = await fetch(
              "http://localhost:3004/postLikeMapping?postid=" +
                item.id +
                "&userid=" +
                userid ,
                
              { method: "GET" }
            );
            const resp1 = await response1.json();

            const response2 = await fetch(
              "http://localhost:3004/users?id=" +postedUserid,
              { method: "GET" }
            );
            const resp2 = await response2.json();
            const postedUsername = resp2[0].name;
            let likeType = "";
            if (resp1.length > 0) likeType = "dislike";
            else likeType = "like";
            setData((prevItems) => [
              ...prevItems,
              { newpost, userid, likeType, id, postedUsername,filename },
            ]);
          });
        });
      } catch (error) {
        setError(error);
      }
    }
    fetchData();
  }, [shouldReload]);
  console.log("1", data);
  async function like(postid, likeType) {
    console.log("likeTypeeeeee" + likeType);
    if (likeType === "like") {
      const date = new Date();
      const data1 = { userid, postid, date };
      const resp = await fetch("http://localhost:3004/postLikeMapping", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(data1),
      });
      const updatedContact = data.map((singleUser) => {
        return singleUser.id === postid
          ? { ...singleUser, likeType: "dislike" }
          : singleUser;
      });
      setData(updatedContact);
    } else {
      const resp = await fetch(
        "http://localhost:3004/postLikeMapping?userid=" +
          userid +
          "&postid=" +
          postid,
        { method: "GET" }
      );
      const respdata = await resp.json();
      const deleteId = respdata[0].id;
      const resp1 = await fetch(
        "http://localhost:3004/postLikeMapping/" + deleteId,
        { method: "DELETE" }
      );
      const updatedContact = data.map((singleUser) => {
        return singleUser.id === postid
          ? { ...singleUser, likeType: "like" }
          : singleUser;
      });
      setData(updatedContact);
    }
  }
  const sharePost = (postid) => {
    setPostid(postid);
    const myModal = document.getElementById("myModal");
    myModal.style.display = "block";
  };
  const commentSub = async () => {
    const comment = document.getElementById("comment").value;
    if (!comment) {
      setErrMsg("Please Input");
      return false;
    }
    const date = new Date();
    const post1 = { postid, userid, comment, date };
    console.log("post1", post1);
    const resp = await fetch("http://localhost:3004/postCommentMapping", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(post1),
    });
    handleOneClose();
  };
  const commentPost = (postid) => {
    setPostid(postid);
    const myModal = document.getElementById("myOneModal");

    myModal.style.display = "block";
  };
  if (error) {
    return <div>{error.message}</div>;
  }

  if (!data) {
    return <div>Loading...</div>;
  }
  return (
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
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
              <h5 className="modal-title">Share Post</h5>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label for="usercheck">Enter User</label>
                <input type="text" id="usercheck" className="form-control" />
              </div>
              <span className="text-danger">{errMsg}</span>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-dismiss="modal"
                onClick={() => handleClose()}
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  shareSub();
                }}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="modal" tabindex="-1" role="dialog" id="myOneModal">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                onClick={() => handleOneClose()}
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
              <h5 className="modal-title">Comment Post</h5>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label for="comment">Enter Comment</label>
                <input type="text" id="comment" className="form-control" />
              </div>
              <span className="text-danger">{errMsg}</span>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-dismiss="modal"
                onClick={() => handleOneClose()}
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  commentSub();
                }}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>

      {data.length > 0
        ? data.map((item) => (
            <>
              <div className="well">
              <img
                                src={item.filename==="cat" ? cat:(item.filename==="beach"?beach:(item.filename==="nature"?nature:(item.filename==="rose"?rose:(item.filename==="sun"?sun:tree))))}
                                alt="My Image"
                crossOrigin="anonymous"
                width="30%"
              /><br></br>
                <p>{item.newpost}</p>

                <div className="d-flex justify-content-between align-items-center">
                  <button type="button" className="btn btn-link text-primary">
                    By {item.postedUsername}
                  </button>

                  <button
                    type="button"
                    className="btn btn-link text-primary"
                    onClick={() => like(item.id, item.likeType)}
                  >
                    {item.likeType === "like" ? (
                      <i className="far fa-thumbs-up"></i>
                    ) : (
                      <i className="far fa-thumbs-down"></i>
                    )}{" "}
                    {item.likeType}
                  </button>
                  <button
                    type="button"
                    className="btn btn-link text-primary"
                    onClick={() => sharePost(item.id)}>
                    Share
                  </button>
                  <button
                    type="button"
                    className="btn btn-link text-primary"
                    onClick={() => commentPost(item.id)}>
                    <i className="far fa-comment"></i> Comment
                  </button>
                </div>
              </div>
            </>
          ))
        : <div class="well">No Messages</div>}
    </div>
  );
}
export default ViewPosts;

