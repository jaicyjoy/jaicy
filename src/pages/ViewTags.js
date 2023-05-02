import React, { useEffect, useState } from "react";
import beach from "../images/beach.jpg";
import cat from "../images/cat.jpg";
import nature from "../images/nature.jpg";
import rose from "../images/rose.jpg";
import sun from "../images/sun.jpg";
import tree from "../images/tree.jpg";
function ViewTags({ userid, uname }) {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  useEffect(() => {
    setData([]);
    async function fetchData() {
      try {
        const tagMapping = await fetch(
          "http://localhost:3004/postTagMapping?toUserid=" + userid,
          { method: "GET" }
        );
        const tagMappinglist = await tagMapping.json();
        console.log("tagMappinglist", tagMappinglist);

        tagMappinglist.map(async (item) => {
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
          const filename =  newData[0].filename;
          setData((prevItems) => [...prevItems, { post, name, filename }]);

          console.log("newData", data);
        });
      } catch (error) {
        setError(error);
      }
    }
    fetchData();
  }, []);
  return (
    <div class="col-sm-12">
              {data.length==0 && <div class="well">No Posts</div>}

      {data.map((item) => (
        <>
          <div class="well">
            <p>
            &nbsp;&nbsp;&nbsp;<img
                                src={item.filename==="cat" ? cat:(item.filename==="beach"?beach:(item.filename==="nature"?nature:(item.filename==="rose"?rose:(item.filename==="sun"?sun:tree))))}
                                alt="My Image"
                crossOrigin="anonymous"
                width="20%"
              />
              <br></br>
              &nbsp;&nbsp;&nbsp;  {item.post}
            </p>
            <button type="button" class="btn btn-link text-primary">
        
           By {item.name}
            </button>
          </div>
        </>
      ))}
    </div>
  );
}

export default ViewTags;
