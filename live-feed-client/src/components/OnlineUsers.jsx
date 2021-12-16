import React, {useState, useEffect} from 'react'
import socketIOClient from "socket.io-client";
// const ENDPOINT = "http://localhost:3001";
const ENDPOINT = "https://live-chat-feed.herokuapp.com/";

const OnlineUsers = () => {
    const [activeUsers, setActiveUsers] = useState(0);
    const activeUsersHeadline = <>
        <p>Thanks for joining!</p>
        <p>{activeUsers} users Online now</p>
    </>
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
