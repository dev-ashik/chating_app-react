import React, { useContext, useState } from "react";
import { MdImage } from "react-icons/md";
import { RiSendPlaneFill } from "react-icons/ri";
import { ImAttachment } from "react-icons/im";
import { AuthContext } from "../cpntext/authContext";
import { ChatContext } from "../cpntext/chatContext";
import { Timestamp, arrayUnion, doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db, storage } from "../firebase";
import { v4 as uuid } from "uuid";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

const Input = () => {
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);

  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  const handleSend = async () => {
    if (img) {
      const storageRef = ref(storage, `messageImage/${uuid()}`);
      const uploadTask = uploadBytesResumable(storageRef, img);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Observe state change events such as progress, pause, and resume
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
          }
        },
        (error) => {
          // Handle unsuccessful uploads
        },
        () => {
          // Handle successful uploads on complete
          // For instance, get the download URL: https://firebasestorage.googleapis.com/...
          getDownloadURL(uploadTask.snapshot.ref).then(async(downloadURL) => {
            console.log("File available at", downloadURL);


            await updateDoc(doc(db, "chats", data.chatId), {
              messages: arrayUnion({
                id: uuid(),
                text,
                senderId: currentUser.uid,
                date: Timestamp.now(),
                img: downloadURL
              }),
            });
          });
        }
      );
    } else {
      await updateDoc(doc(db, "chats", data.chatId), {
        messages: arrayUnion({
          id: uuid(),
          text,
          senderId: currentUser.uid,
          date: Timestamp.now(),
        }),
      });
    }

    await updateDoc(doc (db, "userChats", currentUser.uid), {
      [data.chatId + ".lastMessage"] : {
        text
      },
      [data.chatId+".date"] : serverTimestamp()
    })

    await updateDoc(doc (db, "userChats", data.user.uid), {
      [data.chatId + ".lastMessage"] : {
        text
      },
      [data.chatId+".date"] : serverTimestamp()
    })

    setText("");
    setImg(null);
  };
  return (
    <div className="input">
      <input
        type="text"
        placeholder="Type Your Message"
        onChange={(e) => setText(e.target.value)}
        value={text}
      />
      <div className="send">
        <ImAttachment />
        <label htmlFor="file">
          <MdImage />
        </label>
        <input
          type="file"
          id="file"
          style={{ display: "none" }}
          onChange={(e) => setImg(e.target.files[0])}
          value={img}
        />
        <button onClick={handleSend}>
          <RiSendPlaneFill />
        </button>
      </div>
    </div>
  );
};

export default Input;
