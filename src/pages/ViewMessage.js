import React, { useEffect, useState } from "react";
import Users from "./Users";
import { Link } from "react-router-dom";
import beach from "../images/beach.jpg";
import cat from "../images/cat.jpg";
import nature from "../images/nature.jpg";
import rose from "../images/rose.jpg";
import sun from "../images/sun.jpg";
import tree from "../images/tree.jpg";
function ViewMessage({ userid, uname }) {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  useEffect(() => {
    setData([]);
    async function fetchData() {
      try {
        const sharingMapping = await fetch(
          "http://localhost:3004/postShareMapping?toUserid=" + userid,
          { method: "GET" }
        );
        const sharingMappinglist = await sharingMapping.json();
        console.log("sharingMappinglist", sharingMappinglist);

        sharingMappinglist.map(async (item) => {
          const response = await fetch(
            "http://localhost:3004/posts?id=" + item.postid,
            { method: "GET" }
          );
          const newData = await response.json();
          const response1 = await fetch(
            "http://localhost:3004/users?id=" + item.fromUserid,
            { method: "GET" }
          );
          const newData1 = await response1.json();
          const post = newData[0].newpost;
          const name = newData1[0].name;
          const filename = newData[0].filename;

          setData((prevItems) => [...prevItems, { post, name,filename }]);

          console.log("newData", data);
        });
      } catch (error) {
        setError(error);
      }
    }
    fetchData();
  }, []);
  return (
    <>
      <div class="col-sm-9">
        {data.length==0 && <div class="well">No Messages</div>}
        {data.map((item) => (
          <>
            <div class="well">
            <p>&nbsp;&nbsp;&nbsp;<img
                                src={item.filename==="cat" ? cat:(item.filename==="beach"?beach:(item.filename==="nature"?nature:(item.filename==="rose"?rose:(item.filename==="sun"?sun:tree))))}
                                alt="My Image"
                crossOrigin="anonymous"
                width="20%"
              /></p>
              <p>&nbsp;&nbsp;&nbsp;{item.post}</p>
              <button type="button" class="btn btn-link text-primary">
               
                {item.name}
              </button>
            </div>
          </>
        ))}
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
        <Users userid={userid} />
      </div>
    </>
  );
}

export default ViewMessage;
