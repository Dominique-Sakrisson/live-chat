import React, {useState} from 'react'

const UserForm = ({onSubmit}) => {
    const [name, setName] = useState('')
    // const [room, setRoom] = useState('')
  
 
    const chatBar = {
        color: 'white',
        margin: '2rem auto',
        width:  '45%',
        display: 'flex',
        flexDirection: 'column',
        padding: '2rem', 
        textAlign: 'center',
        fontSize: '1.3rem',
        background: 'blue',
        
    }

    const bigInpu = {
        color: 'grey',
        margin: '2rem auto',
        width:  '45%',
        flexDirection: 'column',
        padding: '1.5rem', 
        textAlign: 'center',
        fontSize: '1.5rem',
        background: 'rgba()',
        border: '2px 2px 2px 5px grey'
    }
    const bigInput = {
        fontSize: '1.3rem',
        borderRadius: '5px',
        border: '5px solid grey',
        textAlign: 'center',
    }
    const buttonStyle ={
        textAlign: 'center',
        width: '60%',
        margin: 'auto',
        padding: '2.5rem',
        fontSize: '2rem',
        pointer: 'auto'
    }


    return(
        <div style={chatBar}>

        <form  onSubmit={e => {
            e.preventDefault();
            onSubmit({name})}
        }>
            <p>
                Set your name <br/> and <br/> room to join or create
            </p>
            <p>
            <input style={bigInpu} type="text" value={name} onChange={e => setName(e.target.value)} placeholder='name'/>
            </p>
            <span></span>
            <button style={buttonStyle} type='submit'>Join / Create Room</button>
        </form>      
        </div>
    )
}

export default UserForm;
