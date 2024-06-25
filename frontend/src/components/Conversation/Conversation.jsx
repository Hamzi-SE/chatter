import React, { useState } from 'react'
import { useEffect } from 'react';
import "./conversation.css"
import customFetch from '../../helpers/api';

const Conversation = ({ conversation, currentUser, onlineStatus }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const friendId = conversation.members.find(member => member !== currentUser?._id);
        const getUser = async () => {
            try {
                const res = await customFetch(`/api/v1/user/${friendId}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    }
                })
                const data = await res.json();
                setUser(data.user);
            } catch (err) {
                console.log(err);
            }
        }
        getUser();
    }, [conversation, currentUser])
    return (
        <div className="conversation">
            <div className="img-group position-relative">
                <img src={user?.avatar.url} alt={user?.name} className="conversationImg" />
                {onlineStatus && <div className="user-online"></div>}
            </div>
            <span className="conversationName">
                {user?.name}
            </span>
        </div>
    )
}

export default Conversation