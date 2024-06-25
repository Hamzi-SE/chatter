import React, { useEffect, useRef, useState } from 'react'
import Conversation from '../../components/Conversation/Conversation'
import Message from '../../components/Message/Message'
import Picker from 'emoji-picker-react';
import { useDispatch, useSelector } from 'react-redux';
import { Vortex } from 'react-loader-spinner'
import { socket } from '../../helpers/SocketConnect';

import "./messenger.css"
import { Navigate } from 'react-router-dom';
import Loader from '../../components/Loader/Loader';
import customFetch from '../../helpers/api';

const Messenger = () => {
    const [conversations, setConversations] = useState([])
    const [currentChat, setCurrentChat] = useState(null)
    const [messages, setMessages] = useState([])
    const [newMessage, setNewMessage] = useState("")
    const [arrivalMessage, setArrivalMessage] = useState(null)
    const [typing, setTyping] = useState(false)
    const [showPicker, setShowPicker] = useState(false);
    const [msgSending, setMsgSending] = useState(false);
    const [liveUsers, setLiveUsers] = useState([]);

    const { user, loading, isAuthenticated } = useSelector(state => state.user)

    const scrollRef = useRef()
    const chatEmojiRef = useRef();
    const dispatch = useDispatch();

    // On Receive Message
    useEffect(() => {
        socket.on("getMessage", data => {
            setArrivalMessage({
                sender: data.senderId,
                text: data.text,
                createdAt: Date.now()
            })
        })
    })

    useEffect(() => {
        socket.on("isTyping", data => {
            if (data.typing) {
                currentChat?.members.includes(data.senderId) && setTyping(true)
                scrollRef.current?.scrollIntoView({ behavior: "smooth" })
            } else {
                setTyping(false)
            }
        })
    }, [currentChat])

    useEffect(() => {
        arrivalMessage && currentChat?.members.includes(arrivalMessage.sender) && setMessages((prev) => [...prev, arrivalMessage])
    }, [arrivalMessage, currentChat])

    useEffect(() => {
        socket.emit("addUserToLiveUsers", user?._id)
        socket.on("getUsers", users => {
            console.log(users)
            setLiveUsers(users);
        })
    }, [user])

    const onEmojiClick = (event, emojiObject) => {
        setNewMessage(prevInput => prevInput + emojiObject.emoji);
        setShowPicker(false);
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();

        if (newMessage.trim() === "") {
            return;
        }

        const message = {
            sender: user?._id,
            text: newMessage,
            conversationId: currentChat?._id
        }

        const receiverId = currentChat?.members.find(member => member !== user?._id)

        socket.emit("sendMessage", {
            senderId: user?._id,
            receiverId,
            text: newMessage
        })

        try {
            setMsgSending(true);
            const res = await customFetch("/api/v1/message", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(message)
            });
            const data = await res.json();
            setMessages([...messages, data.message]);
            setNewMessage("");

        } catch (error) {
            console.log(error)
        }
        setMsgSending(false);

    }

    useEffect(() => {
        const getConversations = async () => {
            dispatch({ type: "GET_ALL_CONVERSATIONS_REQUEST" })
            try {
                const res = await customFetch(`/api/v1/conversations/${user?._id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    }
                })
                const data = await res.json();
                dispatch({ type: "GET_ALL_CONVERSATIONS_SUCCESS", payload: data.conversations })
                setConversations(data.conversations);
            } catch (err) {
                dispatch({ type: "GET_ALL_CONVERSATIONS_FAIL", payload: err })
                console.log(err);
            }
        }
        getConversations();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user?._id])

    useEffect(() => {
        const getMessages = async () => {
            try {
                const res = await customFetch(`/api/v1/messages/${currentChat?._id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    }
                })
                const data = await res.json();
                setMessages(data.messages);
            } catch (err) {
                console.log(err);
            }
        }
        getMessages();
    }, [currentChat])

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages])


    // Typing Check
    useEffect(() => {
        if (newMessage.trim() !== "") {
            socket.emit("typing", {
                senderId: user?._id,
                receiverId: currentChat?.members.find(member => member !== user?._id),
                typing: true
            })
            scrollRef.current?.scrollIntoView({ behavior: "smooth" })

        } else if (newMessage.trim() === "") {
            socket.emit("typing", {
                senderId: user?._id,
                receiverId: currentChat?.members.find(member => member !== user?._id),
                typing: false
            })
        }
    }, [newMessage, currentChat, user])


    // add active class to child component
    const addActiveClass = (e) => {
        const allConversations = document.querySelectorAll(".conversation");
        allConversations.forEach((conversation) => {
            conversation.classList.remove("active");
        });

        e.currentTarget.children[0].classList.add("active");
    };


    const checkOnlineStatus = (members) => {
        const friendId = members.find(m => m !== user?._id);
        return !!liveUsers.find(user => user.userId === friendId)
    }




    if (loading) {
        return <Loader />
    } else if (!isAuthenticated) {
        return <Navigate to="/login" />
    }

    return (
        <>
            <div className='messenger'>
                <div className='chatMenu'>
                    <div className='chatMenuWrapper'>
                        <input placeholder='Search for friends' className='chatMenuInput' />
                        {
                            conversations?.map(conversation => (
                                <div key={conversation?._id} onClick={(e) => { setCurrentChat(conversation); addActiveClass(e) }}>
                                    <Conversation conversation={conversation} currentUser={user} onlineStatus={checkOnlineStatus(conversation.members)} />
                                </div>
                            ))
                        }
                    </div>
                </div>
                <div className='chatBox'>
                    <div className='chatBoxWrapper'>
                        {
                            currentChat ?
                                <>

                                    <div className="chatBoxTop">
                                        {
                                            messages?.map(message => (
                                                <div key={message?._id} ref={scrollRef}>
                                                    <Message message={message} own={message.sender === user?._id} />
                                                </div>
                                            ))

                                        }
                                        {typing && <div className="typing">
                                            <div className="typing__dot"></div>
                                            <div className="typing__dot"></div>
                                            <div className="typing__dot"></div>
                                        </div>}



                                    </div>
                                    <div className="chatBoxBottom" style={{ position: "relative" }}>
                                        <img
                                            className="emoji-icon" ref={chatEmojiRef}
                                            src="https://icons.getbootstrap.com/assets/icons/emoji-smile.svg"
                                            alt="emoji"
                                            onClick={() => setShowPicker(val => !val)} />
                                        {showPicker && <Picker
                                            onEmojiClick={onEmojiClick}
                                        />}
                                        <textarea className='chatMessageInput' placeholder='Type Message Here' value={newMessage} onChange={(e) => setNewMessage(e.target.value)} />
                                        <button className="chatSubmitButton d-flex justify-content-center align-items-center" disabled={msgSending} onClick={handleSendMessage}>
                                            {msgSending ? <Vortex height={20} width={20} colors={['blue', 'white', 'blue', 'white', 'white', 'blue']} /> : "Send"}</button>
                                    </div>
                                </> : <span className='noConversationText'>Open a Conversation to Start a Chatter!</span>
                        }
                    </div>
                </div>

            </div>
        </>
    )
}

export default Messenger