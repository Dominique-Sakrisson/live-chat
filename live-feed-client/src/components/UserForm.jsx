import React, {useState} from 'react'

const UserForm = ({onSubmit}) => {
    const [name, setName] = useState('')
    const [room, setRoom] = useState('')
  
 
    const chatBar = {
        color: 'white',
        margin: '2rem auto',
        width:  '45%',
        display: 'flex',
        flexDirection: 'column',
        padding: '2rem', 
        textAlign: 'center',
        fontSize: '1.3rem',
        background: 'rgba(27, 17, 65)',
        borderRadius: '5rem'
    }

    const bigInpu = {
        color: 'grey',
        margin: '2rem auto',
        width:  '45%',
        flexDirection: 'column',
        padding: '1rem', 
        textAlign: 'center',
        fontSize: '1.5rem',
        background: 'rgba()',
        border: '2px 2px 2px 5px grey'
    }

    const buttonStyle ={
        textAlign: 'center',
        margin: 'auto',
        padding: '1rem',
        fontSize: '2rem',
        pointer: 'auto'
    }
    const hint ={
        fontSize: '.9rem',
        marginTop: '0',
    }
    const noBotMargin = {
        margin: '0',
        color: 'grey',
        width:  '45%',
        flexDirection: 'column',
        padding: '1rem', 
        textAlign: 'center',
        fontSize: '1.5rem',
        background: 'rgba()',
        border: '2px 2px 2px 5px grey'
    }
    const cool = {
        color: 'orange',
        fontWeight: 'bold'
    }


    return(
        <div style={chatBar}>

        <form  onSubmit={e => {
            e.preventDefault();
            onSubmit({name, room})}
        }>
            <p>
                Set your name <br/> and <br/> room to join or create
            </p>
            
            <input style={bigInpu} type="text" value={name} onChange={e => setName(e.target.value)} placeholder='name'/>
            <input style={noBotMargin} type="text" value={room} onChange={e => setRoom(e.target.value)} placeholder='room'/>
            <p style={hint}>Leave blank for <span style={cool}> messageBoard </span> room</p>
           
            <button style={buttonStyle} type='submit'>Join / Create Room</button>
        </form>      
        </div>
    )
}

export default UserForm;
