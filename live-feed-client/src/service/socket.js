import socketIOClient from "socket.io-client";
const ENDPOINT = "http://localhost:3001";
// const ENDPOINT = "https://live-chat-feed.herokuapp.com/";


export default socketIOClient(ENDPOINT, {withCredentials: true});

