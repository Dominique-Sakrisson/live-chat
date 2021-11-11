import React, {useState, useEffect} from 'react'
import socketIOClient from "socket.io-client";
const ENDPOINT = "http://localhost:3001";

const OnlineUsers = () => {
    const [activeUsers, setActiveUsers] = useState(0);
    const activeUsersHeadline = <>
        <p>Thanks for joining!</p>
        <p>{activeUsers} users Online now</p>
    </>
    // const users = activeUsers.map(user => {
    //     console.log(user);
    //     return <li key={user + Math.random() *5} style={{border: '2px solid black', width: '25%'}}>
    //         <p style={{fontSize: '120%', fontWeight: 'bold'}}>{user.username}</p> 
    //         <p style={{fontSize: '80%', }}>{user.id}</p> 
    //       </li>
    //   })
    //      const activeUserList =  <ul style={
    //       {marginTop: '0px',
    //       background: 'rgba(100,100,200, .8)', 
    //       listStyle: 'none',
    //       display: 'flex', 
    //       flexDirection: 'row-reverse' 
    //       }}>          
    //         {users}
            
    //     </ul>

    useEffect(() => {
      const socket = socketIOClient(`${ENDPOINT}`, {withCredentials: true});

        socket.on('users', users => {
          console.log(users);
          setActiveUsers(users)
        })
      },[])
    return(
       activeUsersHeadline

    )
}

export default OnlineUsers
