import React, { useState, useEffect } from "react";
import UserForm from "./components/UserForm";
import ping from './assets/msgsounds.mp3'
import OnlineUsers from "./components/OnlineUsers";
import socket from './service/socket'

const App = () => {
  const [displayName, setDisplayName] = useState('')
  const [roomToJoin, setRoomToJoin] = useState('')
  const [chatBGColor, setChatBGColor] = useState('rgba(50, 230, 140, .8)')
  const [msgServerColor, setServerMsgColor] = useState('#000')
  const [msgServerBGColor, setServerMsgBGColor] = useState('rgba(50, 230, 140, .8)')
  const [msgColor, setMsgColor] = useState('#000')
  const [msgBGColor, setMsgBGColor] = useState('rgba(50, 230, 140, .8)')
  const [openControls, setOpenControls] = useState(false)
  const [msgInput, setMsgInput] = useState('')
  const [chatMessages, setChatMessages] = useState([])
  const [audio, setAudio] = useState(new Audio(ping))
  const [activeUsers, setActiveUsers] = useState([]);
  const [roomSocket, setRoomSocket] = useState('')
  const [recievedSrc, setRecievedSrc]= useState('')
  const [openRooms, setOpenRooms] = useState([])

const roomCountStyle = {
  borderRadius: '50%',
  background: 'green',
  width: 'fit-content',
  padding: '.25rem',
  fontWeight: 'bold'
}
const roomsList = {
  width: '45%',
  marginTop: '0px',
  display: 'flex',
  flexDirection: 'row',
  maxHeight: '6rem',
  listStyle: 'none',
  alignItems: 'center',
  overflowX: 'scroll',
  overflowY: 'hidden',
  background: 'rgba(33, 18, 18, .8)'
}
const roomItem= {
  minHeight: '1.5rem',
  maxHeight: '4.5rem',
  wordWrap: 'break-word',
  margin: '.25rem',
  minWidth: '12rem',
  padding: '.25rem',
  textAlign: 'center',
  background: 'rgba(0,0,0, .8)',
  color: 'rgba(255,255,255, .8)',
  borderRadius: '5rem'
}

const roomItems = openRooms.map(room => <li style={roomItem}><p>{room.name} <span style={roomCountStyle}>{room.count}</span></p> </li>)

const openRoomsList = <div>
  <h2 style={{fontWeight: 'bold', margin: '0px', borderBottom: '2px solid rgba(122, 122, 122, .8)'}}>Open Rooms</h2>
  <ul style={roomsList}> {roomItems}</ul>
</div>
  
const greeting = () => {
    if(!openControls){
      return <div>
      <p>Customize the chat</p>
      <p>
        Chat Background color
        <input type='color' value={chatBGColor} 
          onChange={e =>setChatBGColor(e.target.value)}></input>
      </p>
      <p>
        Message font color
        <input type='color' value={msgColor} 
          onChange={e =>setMsgColor(e.target.value)}></input>
      </p>
      <p>
        Message background color
        <input type='color' value={msgBGColor} 
          onChange={e => setMsgBGColor(e.target.value)}></input>
      </p>
      <p>
        Server Message font color
        <input type='color' value={msgColor} 
          onChange={e =>setServerMsgColor(e.target.value)}></input>
      </p>
      <p>
        Server Message background color
        <input type='color' value={msgBGColor} 
          onChange={e => setServerMsgBGColor(e.target.value)}></input>
      </p>
    </div>
    } 
} 
  
const activeUsersBanner = <h2 style={{
  background: 'rgba(100,100,200, .8)',
    borderBottom: '2px solid black',
    marginBottom: '0px', width: '14rem'
  }}>
    Active Users
</h2>

const users = activeUsers.map(user => {
  return <li key={user + Math.random() *5} style={{border: '2px solid black', width: '25%'}}>
      <p style={{fontSize: '120%', fontWeight: 'bold'}}>{user.username}</p> 
      <p style={{fontSize: '80%', }}>private msg room: {user.privateRoom}</p> 
    </li>
})

const activeUserList = <ul style={
  {marginTop: '0px',
  background: 'rgba(100,100,200, .8)', 
  listStyle: 'none',
  display: 'flex', 
  flexDirection: 'row-reverse' 
  }}>          
  {users}
</ul>

const chatBar = {
  width:  '90%',
  display: 'flex',
  padding: '2rem', 
  justifyContent:'center',
  fontSize: '1.3rem',
    margin: '0 auto'
}

const messages = chatMessages.map(message => {
  if(message.owner){
    if(message.msg === ''){
      return;
    }
    const msgItem = <li 
      key={message+ Math.random() *5} 
      style={{
      color: `${msgColor}`,
      background: `${msgBGColor}`,
      border: '2px solid black', 
      borderRadius: '.25rem',
      width: 'fit-content',
      maxWidth: '60%',
      wordWrap: 'break-word',
      boxSizing: 'content-box',
      padding: '.5rem',
      listStyle: 'none',
      alignSelf: 'flex-end',
      margin: '.25rem'}}>
      
      <p style={{fontSize: '120%', fontWeight: 'bold'}}>
        {message.msg}
      </p>
    </li>
  return msgItem
  }
  const msgItem = <li 
    key={message+ Math.random() *5} 
    style={{
      color: `${msgServerColor}`,
      background: `${msgServerBGColor}`,
      border: '2px solid black', 
      borderRadius: '.25rem',
      width: 'fit-content',
      maxWidth: '60%',
      wordWrap: 'break-word',
      boxSizing: 'content-box',
      padding: '.5rem',
      listStyle: 'none',
      alignSelf: 'flex-start',
      margin: '.25rem',
      }}>
    <p style={{fontSize: '120%', fontWeight: 'bold'}}>
    {(message.sender) ? ` ${message.msg}` : message }
    </p>
    <span style={{fontSize: '.8rem', borderTop: '1px solid black'}}>{(message.sender) ? `from ${message.sender}` : ''}</span> 
  </li>
  return msgItem
})

function trackMsgs() {
  const msgDiv =document.getElementById('messages')
  if(msgDiv){
    msgDiv.scrollTop= msgDiv.scrollHeight
  }
}

const messageBoard = 
  <ul id='messages' style={{
    overflow: 'scroll',  
    background: `${chatBGColor}`,
    maxHeight: '20rem', 
    padding: '10px',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
  }}>
    {messages}
  </ul>

const messageInputBar = 
  <form style={{display: 'flex', flexDirection: 'row',
    justifyContent: 'space-around'}}id="form" >
    <input 
      id="input" 
      value={msgInput} 
      style={chatBar} 
      onChange={handleMsgChange}
      autoComplete="off" 
      placeholder={'enter a message... '}
    />
    <button style={{width: '5rem'}}
      onClick={handleSubmitMsg}>
        Send
    </button>
  </form>

const recievedVideo= <video id='video2' autoPlay srcObject={recievedSrc} 
style={{border: '3px solid black'}} alt='other users recording'></video>

const onUserSubmit = user => {
  setRoomToJoin(user.room);
  if(!user.room){
    setRoomToJoin('open chat room')
  }
  setDisplayName(user.name)
}

useEffect(() => {
  window.onunload = window.onbeforeunload = () => {
    socket.close();
  };
  socket.on('welcome', msg => {
    if(msg.includes('Welcome')){
      setChatMessages(prevMessages => [...prevMessages, msg])
    }else{
      setChatMessages(prevMessages => [...prevMessages, msg + ' has joined the room']) 
    }
  })
  socket.on('room updates', roomsData => {
    setOpenRooms(roomsData);
  })
  socket.query = {
        name: displayName
  }
  socket.on('update users', users => {
    setActiveUsers(users)
  })
  socket.on('chats', (msg, {id, sender})  => {
    setChatMessages(prevChats =>[...prevChats, {msg, sender} ])
    audio.play()
  })
  socket.on('greeting', (response, user) => {
    setActiveUsers(prevUsers =>[...prevUsers, user])
    setChatMessages(prevChats =>[...prevChats, response ])
    audio.play()
  })
}, [])

useEffect(() => {
  if(displayName){
    socket.emit('send new user', {displayName, roomToJoin})
  }
  return () => {
  }
}, [displayName])

useEffect(() => {
  trackMsgs()
  setMsgInput('')
  return () => {
  }
}, [chatMessages])

function handleMsgChange(e){
  setMsgInput(e.target.value)
}

function handleSubmitMsg(e){
    e.preventDefault();
    setChatMessages(prevMsgs => [...prevMsgs, {msg:msgInput, owner: true}])
    socket.emit('send message', msgInput, {id: socket.id, sender: displayName})
}

const userForm = <UserForm  onSubmit={onUserSubmit}/>
const uList = <OnlineUsers />

  return (
    <>
      {/* always show open rooms */}
      {openRoomsList}
    {/* without a displayname the client needs to submit the sign up form */}
    {(!displayName) ? <>
      {userForm}
      {uList}
    </>
    :
    <div>
    <h1> Hello {displayName}</h1>
    {greeting()}
    {recievedVideo}
    {activeUsersBanner}
    {activeUserList}
    {messageBoard}
    {messageInputBar}
    </div>
    }
    </>
  );
}

export default App;
