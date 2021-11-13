import React, { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";
import UserForm from "./components/UserForm";
import ping from './assets/msgsounds.mp3'
import OnlineUsers from "./components/OnlineUsers";
import socket from './service/socket'
const ENDPOINT = "http://localhost:3001";


// const ENDPOINT = "https://live-chat-feed.herokuapp.com/";

// const socket = socketIOClient(ENDPOINT, {withCredentials: true});
// import socketIOClient from "socket.io-client";
// const ENDPOINT = "http://localhost:3001";
// const socketLanding = socketIOClient(`${ENDPOINT}/landing`, {withCredentials: true});

const userMediaConstraints = {
  video: {
    // facingMode: getCameraFace(),
    frameRate: {
      ideal: 17, max: 45
    },
    width: {
      exact: 320,
      min: 320,
      // ideal: 1280,
      // max: 2560,
    },
    height: {
      exact:240,
      min: 240,
      // ideal: 720,
      // max: 1440,
    },
  },
}


const App = () => {
  const [displayName, setDisplayName] = useState('')
  const [roomToJoin, setRoomToJoin] = useState('')
  const [msgInput, setMsgInput] = useState('')
  const [chatMessages, setChatMessages] = useState([])
  const [audio, setAudio] = useState(new Audio(ping))
  const [socketMessageBoard, setSocketMessageBoard] = useState();
  const [activeUsers, setActiveUsers] = useState([]);
  const [src, setSrc] = useState('')
  const [roomSocket, setRoomSocket] = useState('')

  const greeting = <h1> Hello {displayName}</h1>;
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
   const activeUserList =  <ul style={
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
    return <li key={message+ Math.random() *5}style={{border: '2px solid black', width: '25%'}}>
        <p style={{fontSize: '120%', fontWeight: 'bold'}}>{message}</p> 
      </li>
})


function trackMsgs() {
  const msgDiv =document.getElementById('messages')
  if(msgDiv){
    msgDiv.scrollTop= msgDiv.scrollHeight
  }
}
const messageBoard = <div>
  <p>Landing Room Message board</p>
  <ul id='messages' style={{
    overflow: 'scroll', 
    height: '20rem', 
    background: 'rgba(50, 230, 140, .8)', 
    padding: '10px'
  }}>
    {messages}
  </ul>
</div>

const messageInputBar = 
<form style={{display: 'flex', flexDirection: 'row-reverse', justifyContent: 'space-around'}}id="form" >
  <input 
    id="input" 
    value={msgInput} 
    style={chatBar} 
    onChange={handleMsgChange}
    autoComplete="off" 
    placeholder={'enter a message... '}
  />
  <button style={{width: '5rem'}}onClick={handleSubmitMsg}>Send</button>
</form>

  const openMediaDevices = async () => {
    const devices = await navigator.mediaDevices.getUserMedia(userMediaConstraints)
    return devices
  }
  const handleRecord = async() => {
    await videoStream()
  }

  const onUserSubmit = user => {
    if(!user.room){
      setRoomToJoin('open chat room')
    }
    setDisplayName(user.name)
  }

  const videoStream = async() => {
    const stream = await openMediaDevices();
    setSrc(stream)
    // video.srcObject = stream;
    stream.getTracks().forEach(track => {
    })
    let video = document.getElementById('video')
    video.srcObject = stream;
    const mediaRecorder =  new MediaRecorder(stream)
    // mediaRecorder.start(5000) 
    video.play()
    mediaRecorder.ondataavailable = (e) =>{
    socket.emit('video stream', e.data, roomSocket.id);     
    }
  }
 
   useEffect(() => {
    socket.on('welcome', msg => {
      if(msg.includes('Welcome')){
        setChatMessages(prevMessages => [...prevMessages, msg])
      }else{
        setChatMessages(prevMessages => [...prevMessages, msg + ' has joined the room']) 
      }
    })
    
    socket.on('send video', async function(frameData) {
      const video2 = document.getElementById('video2')
      // video2.src = url;
      var playPromise = video2.play();
      
      if (playPromise !== undefined) {
        playPromise.then(_ => {
          // Automatic playback started!
          // Show playing UI.
        })
        .catch(error => {
          // Auto-play was prevented
          // Show paused UI.
        });
      }
    })    

    socket.on('update users', users => {
      console.log(users,' gfgdfg');
      setActiveUsers(users)
    })
    
    socket.on('chats', msg  => {
      setChatMessages(prevChats =>[...prevChats, msg ])
      audio.play()
    })

    socket.on('greeting', (response, user) => {
      console.log('anything');
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
    const msgs = [...chatMessages]
    msgs.push(msgInput)
    setChatMessages(msgs)
    socket.emit('send message', msgInput, socket.id)
}

const userForm = <UserForm  onSubmit={onUserSubmit}/>
const uList = <OnlineUsers />
const recordButton = <button onClick={handleRecord}>Record here</button>
  return (
    <>
    {/* without a displayname the client needs to submit the sign up form */}
    {(!displayName) ? <>

      {userForm}
      {uList}
    </>

    :
    <div>
    {/* current time {time} */}
    {greeting}
    {/* <video style={{border: '3px solid black'}} id='video' srcobject={src}>  */}
    {/* </video> */}
    {/* {recordButton} */}
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
