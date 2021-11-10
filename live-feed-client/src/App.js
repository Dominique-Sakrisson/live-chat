import React, { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";
import UserForm from "./components/UserForm";
import ping from './assets/msgsounds.mp3'
const ENDPOINT = "http://localhost:3001";
const socket = socketIOClient(ENDPOINT);

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
  const [msgInput, setMsgInput] = useState('')
  const [chatMessages, setChatMessages] = useState([])
  const [audio, setAudio] = useState(new Audio(ping))
  
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
      <p style={{fontSize: '120%', fontWeight: 'bold'}}>{user}</p> 
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
  <p>Message board</p>
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
    console.log(user);
    setDisplayName(user.name)
    // setRoomToJoin(user.room)
    socket.emit('send username', displayName)
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
    setRoomSocket(socket);
  
    socket.on('welcome', msg => {
      if(msg.includes('Welcome')){
        setChatMessages(prevMessages => {
          prevMessages.push(msg);
          return prevMessages
        })
        
      }else{
        setChatMessages(prevMessages => {
          prevMessages.push(msg + ' has joined the room');
          return prevMessages
        })
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
      setActiveUsers(users)
    })
    
    socket.on('chats', msg  => {
      console.log(chatMessages);
      setChatMessages(prevChats =>[...prevChats, msg ])
        audio.play()
        // const msgDiv =document.getElementById('messages')
        // msgDiv.scrollTop= msgDiv.scrollHeight
        trackMsgs()
      console.log(chatMessages);
    })
  }, [])

  
  useEffect(() => {

    trackMsgs()
    console.log('bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb', chatMessages);
    
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
const recordButton = <button onClick={handleRecord}>Record here</button>
  return (
    <>
    {/* without a displayname the client needs to submit the sign up form */}
    {(!displayName) ? 
    userForm 
    :
    <div>
    {/* current time {time} */}
    {greeting}
    <video style={{border: '3px solid black'}} id='video' srcobject={src}> 
    </video>
    {recordButton}
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
