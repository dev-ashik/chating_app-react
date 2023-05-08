import React, { useState } from "react";
import { MdImage } from "react-icons/md";
import "../style.scss";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, storage, db } from "../firebase";
import { toast } from "react-toastify";

// image
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const [loading, setLoading] = useState(false);
  const [photo, setPhoto] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 6000);

    const displayName = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;
    const file = e.target[3].files[0];

    try {
      // create account
      const res = await createUserWithEmailAndPassword(auth, email, password);

      // res.user && toast.success("Register successful.");

      // store image and get url
      const storageRef = ref(storage, `usersImage/${displayName}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          // console.log("Upload is " + progress + "% done");
          if (progress === 10.927196900381617 || progress === 100) {
            toast.info("Upload is " + progress + "% done", {
              autoClose: 2000,
            });
          }
          switch (snapshot.state) {
            case "paused":
              // console.log("Upload is paused");
              break;
            case "running":
              // console.log("Upload is running");
              break;
          }
        },
        (error) => {
          toast.error("Error while uploading image");
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            // console.log("File available at", downloadURL);

            //  update display name and photoUrl
            updateProfile(auth.currentUser, {
              displayName: displayName,
              photoURL: downloadURL,
            }).then(() => {
              toast.info("name and photoURL have been saved", {
                autoClose: 2000,
              });
            });

            // store in database
            await setDoc(doc(db, "users", res.user.uid), {
              displayName,
              uid: res.user.uid,
              email,
              photoURL: downloadURL,
            }).then(() => {
              // console.log("user successfully saved to database");
              toast.info("user successfully saved to database", {
                autoClose: 2000,
              });
            });

            // store user chats
            await setDoc(doc(db, "userChats", res.user.uid), {}).then(() => {
              toast.info("userChats successfuly created", {
                autoClose: 2000,
              });
              // console.log("userChats successfuly created")
            });

            toast.success("Register successful");
            navigate("/");
          });
        }
      );
    } catch (error) {
      toast.error("Register failed..!");
      console.log(error);
    }
  };

  // console.log(photo);
  return (
    <div className="formContainer">
      <div className="formWrapper">
        <span className="title">Register</span>
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="display name" required />
          <input type="email" placeholder="Email" required />
          <input type="password" placeholder="password" required />
          <input
            onChange={(e) => setPhoto(e.target.files[0])}
            style={{ display: "none" }}
            accept="image/*"
            type="file"
            id="file"
            required
          />
          <label style={{ cursor: "pointer" }} htmlFor="file">
            {photo ? (
              <span
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <img
                  src={URL.createObjectURL(photo)}
                  alt=""
                  style={{
                    height: "40px",
                    width: "40px",
                    borderRadius: "50%",
                    objectFit: "contain",
                    border: "1px solid gray",
                  }}
                />
                {photo.name}
              </span>
            ) : (
              <span
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <MdImage
                  style={{
                    fontSize: "40px",
                    borderRadius: "50%",
                    border: "1px solid gray",
                    padding: "5px",
                  }}
                />
                <span>add an avatar</span>
              </span>
            )}
            {URL.createObjectURL ? "d" : "add an avatar"}
          </label>

          <button>{loading ? "Sing up..." : "Sign up"}</button>
        </form>

        <p>
          You do have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
