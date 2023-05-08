import React, { useContext, useState } from "react";
import profile1 from "../assets/profile_3.jpg";
import { collection, doc, getDoc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from "firebase/firestore";
import { db } from "../firebase";
import { toast } from "react-toastify";
import { AuthContext } from "../cpntext/authContext";

const Search = () => {
  const [userName, setUserName] = useState("");
  const [user, setUser] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);

  const {currentUser} = useContext(AuthContext);

  const handleSearch = async () => {
    setSearchLoading(true);
    
    try {
      const citiesRef = collection(db, "users");
      const q = query(citiesRef, where("displayName", "==", userName));

      console.log(q)
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
          setUser(doc.data());
          // console.log(doc.data());
      });
      setSearchLoading(false);
    } catch (error) {
      console.log(error);
      setSearchLoading(false);
      toast.error("error..!");
    }
  };

  const handleKey = (e) => {
    e.code === "Enter" && handleSearch();
  };

  const handleSelect = async() => {
    // check whether the group exists or not. if not create new
    const combinedId = currentUser.uid > user.uid ? currentUser.uid + user.uid : user.uid + currentUser.uid;

    // create user chat
    try{
      const res = await getDoc(doc (db, "chats", combinedId));

      if(!res.exists()) {
        //create new chat
        await setDoc(doc (db, "chats", combinedId), {messages: []})

        // create user Chats
       await updateDoc(doc (db, "userChats", currentUser.uid), {
        [combinedId+".userInfo"]: {
          uid: user.uid,
          displayName: user.displayName,
          photoURL: user.photoURL
        },
        [combinedId+".date"]: serverTimestamp()
       })

       await updateDoc(doc (db, "userChats", user.uid), {
        [combinedId+".userInfo"]: {
          uid: currentUser.uid,
          displayName: currentUser.displayName,
          photoURL: currentUser.photoURL
        },
        [combinedId+".date"]: serverTimestamp()
       })



      }
    } catch(error) {
      console.log(error)
    }
  
    setUser(null);
    setUserName("");
  }

  return (
    <div className="search">
      <div className="searchForm">
        <input
          type="text"
          placeholder="Find a user"
          onKeyDown={handleKey}
          onChange={(e) => setUserName(e.target.value)}
          value={userName}
        />
      </div>

      {!searchLoading ? (
        user && (
          <div className="userChat" onClick={handleSelect}>
        <img src={user.photoURL} alt="" />
        <div className="userChatInfo">
          <span>{user.displayName}</span>
        </div>
      </div>
        )
      ) : (
        <p style={{textAlign: "center"}}>Loading...</p>
      )}
    </div>
  );
};

export default Search;
