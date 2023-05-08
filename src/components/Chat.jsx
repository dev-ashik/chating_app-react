import React, { useContext } from 'react'
import Messages from './Messages'
import Input from './Input';
import { BsCameraVideoFill } from 'react-icons/bs';
import { MdWifiCalling3 } from 'react-icons/md';
import { HiUserAdd } from 'react-icons/hi';
import { BsThreeDots } from 'react-icons/bs';
import { ChatContext } from '../cpntext/chatContext';

const Chat = () => {
  const {data} = useContext(ChatContext);

  // console.log(data)
  return (
    <div className='chat'>
      <div className="chatInfo">
        <span>{data.user.displayName}</span>
        <div className="chatIcons">
        <BsCameraVideoFill className='cahatIcons_icon'/>
        <MdWifiCalling3 className='cahatIcons_icon'/>
        <HiUserAdd className='cahatIcons_icon'/>
        <BsThreeDots className='cahatIcons_icon'/>
        </div>
      </div>
        <Messages/>
        <Input/>
    </div>
  )
}

export default Chat