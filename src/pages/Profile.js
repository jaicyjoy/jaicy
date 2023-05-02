import React, { useState, useEffect } from "react";
import beach from "../images/beach.jpg";
import cat from "../images/cat.jpg";
import nature from "../images/nature.jpg";
import rose from "../images/rose.jpg";
import sun from "../images/sun.jpg";
import tree from "../images/tree.jpg";
function Profile({ userid }) {
  const [data, setData] = useState({});
  const [error, setError] = useState(null);
  const [mypost, setMyPost] = useState([]);
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(
          "http://localhost:3004/users?id=" + userid,
          { method: "GET" }
        );
        const newData = await response.json();
        setData(newData[0]);
      } catch (error) {
        setError(error);
      }
    }
    async function viewMyPosts() {
      const response1 = await fetch(
        "http://localhost:3004/posts?userid=" +
          userid +
          "&_sort=date&_order=desc",
        { method: "GET" }
      );
      const resp1 = await response1.json();
     
  
      setMyPost(resp1);
    }
    fetchData();
    viewMyPosts();
  }, []);
  if (error) {
    return <div>{error.message}</div>;
  }
  if (!data) {
    return <div>No data</div>;
  }
  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <div className="panel panel-default">
              <div className="panel-heading">
                <h3 className="panel-title">Profile Information</h3>
              </div>
              <div className="panel-body">
                <table className="table table-bordered table-hover">
                  <tr>
                    <br></br>
                  </tr>
<tr><td colspan="2" align="center"><img
                                src={data.photo==="cat" ? cat:(data.photo==="beach"?beach:(data.photo==="nature"?nature:(data.photo==="rose"?rose:(data.photo==="sun"?sun:tree))))}
                                alt="My Image"
                crossOrigin="anonymous"
                width="20%"
              /></td></tr>
                  <tr>
                    <th>&nbsp;&nbsp;Name</th>
                    <td>{data.name}</td>
                  </tr>
                  <tr>
                    <br></br>
                  </tr>
                  <tr>
                    <th>&nbsp;&nbsp;Email</th>
                    <td>{data.email}</td>
                  </tr>
                  <tr>
                    <br></br>
                  </tr>

                  <tr>
                    <th>&nbsp;&nbsp;Username</th>
                    <td>{data.username}</td>
                  </tr>
                  <tr>
                    <br></br>
                  </tr>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <div className="panel panel-default">
              <div className="panel-heading">
                <h3 className="panel-title">My Post</h3>
              </div>
              {mypost.length==0 && <div class=""><br/>&nbsp;&nbsp;No Posts<br/><br/></div>}

              {mypost.map((item) => (
                
                <div className="panel-body">
                  <table className="table table-bordered table-hover">
                    <tr>
                      <td>
                        <br />
                      </td>
                    </tr>
                    <tr>
                      <td>&nbsp;&nbsp;&nbsp;<img
                               
                                width={"250px"}
                                src={item.filename==="cat" ? cat:(item.filename==="beach"?beach:(item.filename==="nature"?nature:(item.filename==="rose"?rose:(item.filename==="sun"?sun:tree))))}
                                
                              /><br></br>
                              &nbsp;&nbsp;&nbsp;{item.newpost}</td>
                    </tr>
                    <tr>
                      <td>
                        <br />
                      </td>
                    </tr>
                  </table>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default Profile;
