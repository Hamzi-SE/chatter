import React from 'react'
import { useSelector } from 'react-redux'
import TimeAgo from "react-timeago"
import "./message.css"

const Message = ({ message, own }) => {
    const { user } = useSelector(state => state.user)
    return (
        <div className={own ? "message own" : "message"}>
            <div className='messageTop'>
                <img className='messageImg' src={own ? user?.avatar?.url : "https://st3.depositphotos.com/4111759/13425/v/600/depositphotos_134255710-stock-illustration-avatar-vector-male-profile-gray.jpg"} alt="" />
                <p className='messageText'>
                    {message?.text}
                </p>
            </div>
            <div className='messageBottom'>
                <TimeAgo date={message?.createdAt} />
            </div>

        </div>
    )
}

export default Message