import React, { useState, useEffect } from "react";

function Users({ userid ,clicked}) {
  const [user, setUser] = useState([]);
  useEffect(() => {
    setUser([]);
    async function fetchData() {
      const getData = await fetch("http://localhost:3004/users/", {
        method: "GET",
      });
      const response1 = await getData.json();
      response1.map(async (item) => {
        const name = item.name;
        const id = item.id;
        const getData = await fetch(
          "http://localhost:3004/userFollowerMapping/?userid=" +
            userid +
            "&followerid=" +
            id,
          {
            method: "GET",
          }
        );
        const response = await getData.json();
        let fav = "";
        if (response.length > 0) fav = "unfollow";
        else fav = "follow";
        console.log("details", name, id, fav);
        setUser((prevItems) => [...prevItems, { name, id, fav }]);
      });
      }
    fetchData();
  }, []);

  async function followUser(followerid, followType) {
    console.log("followerid", followerid);
    if (followType == "follow") {
      const date=new Date();
      const data = { userid, followerid,date };
      const resp = await fetch("http://localhost:3004/userFollowerMapping", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(data),
      });
      const updatedContact = user.map((singleUser) => {
        return singleUser.id === followerid
          ? { ...singleUser, fav: "unfollow" }
          : singleUser;
      });
      setUser(updatedContact);
    } else {
      const resp = await fetch(
        "http://localhost:3004/userFollowerMapping?userid=" +
          userid +
          "&followerid=" +
          followerid,
        { method: "GET" }
      );
      const respdata = await resp.json();
      const deleteId = respdata[0].id;
      const resp1 = await fetch(
        "http://localhost:3004/userFollowerMapping/" + deleteId,
        { method: "DELETE" }
      );
      const updatedContact = user.map((singleUser) => {
        return singleUser.id === followerid
          ? { ...singleUser, fav: "follow" }
          : singleUser;
      });
      setUser(updatedContact);
    }
    clicked(true);
  }
  return (
    <div>
       {user.length > 0
        ? user.map(
            (item) =>
              item.id != userid && (
        <div className="well">
        <p><b> {item.name}</b></p>
        <button type="button" className="btn btn-link text-primary"  onClick={() => followUser(item.id, item.fav)}>
   {item.fav==="follow"?<i className="fas fa-user-plus"></i>: <i className="fas fa-user-minus"></i>} {item.fav}
  </button>
      </div>
       )
       )
     : "No users"}

      {/* Users List
      <br />
      {user.length > 0
        ? user.map(
            (item) =>
              item.id != userid && (
                <>
                  {" "}
                  <p>
                    {item.name}
                    <a href="#" onClick={() => followUser(item.id, item.fav)}>
                      {item.fav}
                    </a>
                  </p>
                  <br />
                </>
              )
          )
        : "No users"} */}
    </div>
  );
}
export default Users;
