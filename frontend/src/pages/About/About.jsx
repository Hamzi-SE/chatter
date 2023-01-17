import React from 'react'
import { useSelector } from 'react-redux'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import Loader from '../../components/Loader/Loader'
import "./about.css"

const About = () => {
    const { user, loading, isAuthenticated } = useSelector(state => state.user)
    const navigate = useNavigate()

    if (loading) {
        return <Loader />
    } else if (!isAuthenticated) {
        return <Navigate to="/login" />
    }
    return (
        <div className='container'>
            <h1 className='about-heading text-center mt-3'>About</h1>

            <div className="row align-items-center">
                <div className="col-md-4 text-center">
                    <img className='about-image rounded-circle' src={user?.avatar?.url} alt={user?.name} />
                </div>

                <div className="col-md-8">
                    <h2 className="text-center">{user?.name}</h2>
                    <h5 className="text-center">{user?.email}</h5>
                    <p>{user?.about}</p>
                    <h5 className="text-center">Total Friends: {user?.friends?.length}</h5>
                    <div className="text-center">
                        <Link className='btn btn-primary' to="/editAbout">Edit Profile</Link>
                    </div>
                </div>
            </div>
            <hr />
            {/* Friends  */}
            <div className='about-friends'>
                <h4 className='text-center'>Friends</h4>
                {user?.friends?.length !== 0 ? <div className='row d-flex justify-content-center align-items-center'>
                    {
                        user?.friends.map((friend) => {
                            return (
                                <div className='col-md-3 user-card m-3' key={friend?._id} onClick={() => navigate(`/user/${friend?._id}`)}>
                                    <img className='img-fluid' src={friend?.avatar?.url} alt={friend?.name} />
                                    <h4 className='text-center'>{friend?.name}</h4>
                                    <button className='m-auto btn btn-danger'>Remove Friend</button>
                                </div>
                            )
                        })
                    }
                </div> : <h6>You do not have any friends yet. Look for a match and start a chatter now! 😉</h6>}
            </div>
        </div>
    )
}

export default About
