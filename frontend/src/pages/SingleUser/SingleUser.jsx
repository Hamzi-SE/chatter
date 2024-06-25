import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import "./singleUser.css"
import customFetch from '../../helpers/api'

const SingleUser = () => {

    const [userDetails, setUserDetails] = useState(null)
    const { user } = useSelector(state => state.user)

    const { id } = useParams()
    const navigate = useNavigate();
    const dispatch = useDispatch();


    const getUserDetails = async () => {
        const res = await customFetch(`/api/v1/user/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })
        const data = await res.json()
        if (res.status === 200) {
            setUserDetails(data.user)
        } else {
            toast.error(data.message)
            navigate("/")
        }
    }

    useEffect(() => {
        getUserDetails()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id])


    const createConversation = async (receiver) => {
        dispatch({ type: "CREATE_CONVERSATION_REQUEST" })
        try {
            const res = await customFetch('/api/v1/conversation', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ senderId: user?._id, receiverId: receiver._id })
            })

            const data = await res.json()
            if (res.status === 201 || res.status === 200) {
                dispatch({ type: "CREATE_CONVERSATION_SUCCESS", payload: data.conversation })
                toast.success(data.message)
                navigate(`/messenger`, { replace: true })
            } else {
                dispatch({ type: "CREATE_CONVERSATION_FAIL", payload: data.message })
                toast.error(data.message)
            }

        } catch (error) {
            dispatch({ type: "CREATE_CONVERSATION_FAIL", payload: error })
            console.log(error)
        }
    }

    return (
        <>
            <div className='container'>
                <h1 className='about-heading text-center mt-3'>About</h1>

                <div className='row align-items-center'>
                    <div className='col-md-4 text-center'>
                        <img className='about-image rounded-circle' src={userDetails?.avatar?.url} alt={userDetails?.name} />
                    </div>
                    <div className="col-md-8">
                        <h2 className="text-center">{userDetails?.name}</h2>
                        <h5 className="text-center">{userDetails?.email}</h5>
                        <p>{userDetails?.about}</p>
                        <button className='btn btn-primary' onClick={() => createConversation(userDetails)}>Start Chatter</button>
                    </div>
                </div>
                <hr />


                <h5 className="text-center">Total Friends: {userDetails?.friends?.length}</h5>


                {/* Friends */}
                <h4 className="text-center">Friends</h4>
                {userDetails?.friends?.length !== 0 ? <div className="row d-flex justify-content-center align-items-center">
                    {userDetails?.friends?.map(friend => (
                        <div className="col-md-3 user-card m-3" key={friend?._id} onClick={() => navigate(`/user/${friend?._id}`)}>
                            <div className="card-body">
                                <img className='img-fluid' src={friend?.avatar?.url} alt={friend?.name} />
                                <h5 className='card-subtitle mt-2 text-center'>{friend?.name} <small className='text-capitalize text-muted float-right'>{friend?.gender}</small></h5>
                            </div>
                        </div>

                    ))}

                </div> : <h6>This user does not have any friends yet.</h6>}

            </div>
        </>
    )
}

export default SingleUser