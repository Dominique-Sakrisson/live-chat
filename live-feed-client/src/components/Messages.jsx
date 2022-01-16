import React, {useState, useEffect} from 'react'

const Messages = (chatMessages, socket) => {
    const [msgInput, setMsgInput] = useState('')
    const [msgList, setMsgList] = useState([])
    
    useEffect(() => {
        if(chatMessages.length > 0){
            const messages = chatMessages.map(message => {
                return <li style={{
                    border: '2px solid black', 
                    width: '50%', 
                    listStyle: 'none'}}
                    >
              <p style={{fontSize: '120%', fontWeight: 'bold'}}>
                {message}
              </p> 
            </li>
          })
          setMsgList(messages)
        }
    }, [chatMessages])
    return (
        ''
    )
}

export default Messages;
