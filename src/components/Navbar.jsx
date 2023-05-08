import React, { useContext } from 'react';
import profil1 from '../assets/profile_3.jpg';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { AuthContext } from '../cpntext/authContext';

const Navbar = () => {
  const {currentUser} = useContext(AuthContext);
  

  const handleSignOut = () => {
    // accout logout
    signOut(auth);
  }
  return (
    <div className='navbar'>
        <span className="logo">logo</span>
        <div className="user">
            <img src={currentUser.photoURL} alt="avatar" />
            <span>{currentUser.displayName}</span>
            <button onClick={handleSignOut}>logout</button>
        </div>
    </div>
  )
}

export default Navbar