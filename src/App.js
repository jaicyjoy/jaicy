import Login from "./pages/Login";
import Register from "./pages/Register";
import { useEffect, useRef, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import ViewMessage from "./pages/ViewMessage";
import ViewTags from "./pages/ViewTags";
import Profile from "./pages/Profile";
import ViewComment from "./pages/ViewComment";
function App() {
  const [userid, setUserid] = useState(null);
  const [uname, setUserName] = useState(null);
  const linkRef = useRef(null);
  const [activeTab, setActiveTab] = useState(0);

  function handleClick(tab) {
    setActiveTab(tab);
  }
  let setUser = (userid, uname) => {
    setUserid(userid);
    setUserName(uname);
  };
  let logout=()=>{
    setUserid(null);

  }
  useEffect(() => {
    console.log(userid+"uuuuuuuuuuu");

    if (userid) {
      linkRef.current.click();
      setActiveTab("home");
    }
  }, [userid]);

  return (
    <>
      <Router>
      {userid!==null &&  <>
  <nav className="navbar navbar-inverse">
<div className="container-fluid">

 <div className="collapse navbar-collapse" id="myNavbar">
   <ul className="nav navbar-nav">
     <li className={activeTab === "home" ? 'active' : ''} onClick={() => handleClick("home")}><Link to="/">Home</Link></li>
     <li className={activeTab === "messages" ? 'active' : ''} onClick={() => handleClick("messages")}><Link to="/messages">Messages</Link></li>
  <li className={activeTab === "tags" ? 'active' : ''} onClick={() => handleClick("tags")}><Link to="/tags">Tags</Link></li>
  <li className={activeTab === "comments" ? 'active' : ''} onClick={() => handleClick("comments")}><Link to="/comments">Comments</Link></li>

  <li className={activeTab === "profile" ? 'active' : ''} onClick={() => handleClick("profile")}><Link to="/profile">Profile</Link></li>
 </ul>
   
   <ul className="nav navbar-nav navbar-right">
     <li><Link to="/login" onClick={()=>logout()}>Logout</Link></li>
   </ul>
 </div>
</div>
</nav>  
 
</>
  }
          <Link to="/" ref={linkRef} style={{"display":"none"}}>Go to home page</Link>

        <Routes>
          <Route exact path="/login" element={<Login setUser={setUser} />} />
          <Route
            exact
            path="/register"
            element={<Register setUser={setUser} />}
          />
           <Route exact path='/' element={<Home userid={userid} uname={uname}/>}></Route>
 <Route exact path='/messages' element={<ViewMessage userid={userid} uname={uname} />}></Route>
 <Route exact path='/comments' element={<ViewComment userid={userid} uname={uname} />}></Route>

 <Route exact path='/tags' element={<ViewTags userid={userid} uname={uname}/>}></Route>
 <Route exact path='/profile' element={<Profile userid={userid} uname={uname}/>}></Route>
 <Route exact path='/logout' element={< Login />}></Route>
          {/* <Route exact path='/*' element={< NotFound/>}></Route> */}
        </Routes>
      </Router>

    </>
  );
}

export default App;
