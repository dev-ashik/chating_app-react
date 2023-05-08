import React, { useContext, useEffect, useState } from 'react'
import Message from './Message'
import { ChatContext } from '../cpntext/chatContext';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const {data} = useContext(ChatContext);

  console.log(data)

  useEffect(()=>{
    if(data.chatId) {
      const unSub = onSnapshot(doc (db, "chats", data.chatId), (doc)=>{
        doc.exists() && setMessages(doc.data().messages)
      })

      return()=> {
        unSub()
      }
    }
  }, [data.chatId])

  console.log(messages)

  return (
    <div className='messages'>
      {
        messages.map(m=>(
          <Message message={m} key={m.id}/>
        ))
      }
      {/* <Message/>
      <Message/>
      <Message/>
      <Message/>
      <Message/>
      <Message/>
      <Message/>
      <Message/>
      <Message/>
      <Message/> */}
    </div>
  )
}

export default Messages