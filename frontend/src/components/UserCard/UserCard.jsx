import React from 'react'
import "./userCard.css"
import { useNavigate } from 'react-router-dom'

const UserCard = ({ person, addFriend, createConversation }) => {
    const navigate = useNavigate()
    return (
        <div className='user-card m-3' style={{ width: '20rem' }} key={person._id}>
            <img src={person.avatar.url} className='card-img-top' alt={person.name} onClick={() => navigate(`/user/${person._id}`)} />
            <div className='card-body'>
                <h5 className='card-title text-capitalize'>{person.name} <small className='text-capitalize float-right'>{person.gender}</small></h5>
                <p className='card-text user-about'>{person.about}</p>
                <div className='d-flex justify-content-between'>
                    <button className='btn btn-primary' onClick={() => addFriend(person._id)}>Add Friend</button>
                    <button className='btn btn-primary' onClick={() => createConversation(person)}>Start Chatter</button>
                </div>
            </div>
        </div>
    )
}

export default UserCard