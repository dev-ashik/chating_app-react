import React, { useContext, useEffect, useRef } from "react";
import profile1 from "../assets/profile_3.jpg";
import { AuthContext } from "../cpntext/authContext";
import { ChatContext } from "../cpntext/chatContext";

const Message = ({ message }) => {
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);
  const ref = useRef();

  useEffect(()=> {
    ref.current?.scrollIntoView({behabior: "smooth"})
  }, [message])
  
  // console.log(message.sendeId, currentUser.uid);
  // console.log(message);
  return (
    <div
      ref={ref}
      className={`message ${message.senderId === currentUser.uid && "owner"}`}
    >
      <div className="messageInfo">
        <img
          src={
            message.senderId === currentUser.uid
              ? currentUser.photoURL
              : data.user.photoURL
          }
          alt=""
        />
        <span>just now</span>
      </div>
      <div className="messageContent">
        <p>{message.text}</p>
        {message.img && <img src={message.img} alt="" />}
      </div>
    </div>
  );
};

export default Message;
