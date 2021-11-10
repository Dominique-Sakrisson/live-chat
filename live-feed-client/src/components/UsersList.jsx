import React, {useEffect, useState} from 'react'

const UsersList = (users) =>{
    return(<>
        {users.length > 0 ? users.map(user => {
            return <li style={{border: '2px solid black', width: '25%'}}>
                <p style={{fontSize: '120%', fontWeight: 'bold'}}>{user}</p> 
              </li>
        }): ''}
    </>
    )
}

export default UsersList
