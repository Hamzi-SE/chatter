import React, { useState } from 'react'
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom'
import "./signup.css"

const Signup = () => {

    const [user, setUser] = useState({
        name: "", email: "", password: "", gender: "", about: ""
    });

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        dispatch({ type: "SIGNUP_USER_REQUEST" });

        const res = await fetch("/api/v1/user/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(user)
        });

        const data = await res.json();
        if (res.status === 201) {
            dispatch({ type: "SIGNUP_USER_SUCCESS", payload: data });
            toast.success("Registered successfully");
            navigate("/");
        } else {
            dispatch({ type: "SIGNUP_USER_FAIL", payload: data });
            toast.error(data.message);
        }


    }

    return (
        <>
            <section className="h-80">
                <div className="container py-5 h-100">
                    <div className="row d-flex justify-content-center align-items-center h-100">
                        <div className="col">
                            <div className="card card-registration my-4">
                                <div className="row g-0">
                                    <div className="register-left-tab col-xl-6 d-none d-xl-block">
                                        {/* <img src="https://i.postimg.cc/ryP8ybV5/chatter-signup.jpg"
                                            alt="SamplePhoto" className="img-fluid"
                                            style={{ borderTopLeftRadius: ".25rem", borderBottomLeftRadius: ".25rem", height: "-webkit-fill-available" }} /> */}
                                    </div>
                                    <div className="col-xl-6">
                                        <div className="card-body p-md-5 text-black">
                                            <div className="d-flex align-items-center mb-3 pb-1">
                                                <i className="fa-regular fa-comments" style={{ color: "#007bff", fontSize: "50px", marginRight: "10px" }}></i>
                                                <span className="h1 fw-bold mb-0">Chatter</span>
                                            </div>
                                            <h3 className="mb-5 text-uppercase">Sign Up Form </h3>


                                            <form onSubmit={handleSubmit}>
                                                <div className="form-outline mb-4">
                                                    <div className="form-outline">
                                                        <input type="text" className="form-control form-control-lg" name='name' onChange={handleInputChange} required />
                                                        <label className="form-label" for="form3Example1m">Your Full Name</label>
                                                    </div>
                                                </div>


                                                <div className="form-outline mb-4">
                                                    <input type="text" className="form-control form-control-lg" name='email' onChange={handleInputChange} required />
                                                    <label className="form-label" for="form3Example97">Your Email Address</label>
                                                </div>
                                                <div className="form-outline mb-4">
                                                    <input type="password" className="form-control form-control-lg" name='password' onChange={handleInputChange} required />
                                                    <label className="form-label" for="form3Example97">Your Password</label>
                                                </div>
                                                {/* <div className="form-outline mb-4">
                                                    <textarea className='form-control form-control-lg' style={{ resize: "none" }} name='about' onChange={handleInputChange}></textarea>
                                                    <label className="form-label" for="dob">Tell Us Something Exciting About Yourself :)</label>
                                                </div> */}

                                                <select className='form-control form-control-lg' name='gender' onChange={handleInputChange} required>
                                                    <option value="" selected disabled>Gender</option>
                                                    <option value="male">Male</option>
                                                    <option value="female">Female</option>
                                                    <option value="other">Other</option>
                                                </select>
                                                <label for="gender"> Select you gender</label>




                                                <div className="d-flex justify-content-end pt-3">
                                                    <button type="submit" className="btn btn-dark btn-lg btn-block ms-2" style={{ backgroundColor: "#007BFF" }}>Register</button>
                                                </div>
                                            </form>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default Signup