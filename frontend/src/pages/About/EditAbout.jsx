import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { Vortex } from "react-loader-spinner";
import { callProfile } from "../../helpers/CallProfile"
import customFetch from "../../helpers/api";

const EditProfille = () => {
    // const { loading } = useSelector(state => state.profile);
    const [updating, setUpdating] = useState(false);
    const dispatch = useDispatch();

    const navigate = useNavigate();

    const { user } = useSelector(state => state.user);
    const [userDetails, setUserDetails] = useState({ ...user });
    const [avatar, setAvatar] = useState(""); //->fileInputState

    const previewFile = async (file) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            // setPreviewSource(reader.result);
            setAvatar(reader.result);
        };
    };

    const handleChange = async (e) => {
        if (e.target.name === "avatar") {
            const file = e.target.files[0];
            previewFile(file);
        } else {
            setUserDetails({ ...userDetails, [e.target.name]: e.target.value });
        }
    };

    const handleUpdate = async (e) => {
        setUpdating(true);
        dispatch({ type: "UPDATE_PROFILE_REQUEST" });
        const { name, about, gender, email } = userDetails;
        const res = await customFetch("/api/v1/me/update", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name, about, gender, email, avatar
            }),
        });
        const data = await res.json();
        console.log(data);
        if (res.status === 200) {
            dispatch({ type: "UPDATE_PROFILE_SUCCESS" });
            dispatch({ type: "LOAD_USER_SUCCESS", payload: data.user });
            toast.success("Profile Updated Successfully");
            navigate("/about");
        } else {
            dispatch({ type: "UPDATE_PROFILE_FAIL", payload: data.message });
            toast.error(data.message);
        }
        setUpdating(false);
    };

    useEffect(() => {
        callProfile(dispatch);
        window.scrollTo(0, 0);
        // eslint-disable-next-line
    }, []);

    return (
        <>
            <div className="col-xl-9 col-lg-12 col-md-12 my-5 mx-auto">
                <div className="card mb-0">
                    <div className="card-header">
                        <h2 className="card-title">
                            Edit Your Profile
                        </h2>
                    </div>
                    <div className="card-body">
                        <div className="row justify-content-center align-items-center">
                            <div className="col-md-4">
                                <div className="form-group">
                                    <label htmlFor="name">Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="name"
                                        name="name"
                                        value={userDetails.name}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="form-group">
                                    <label htmlFor="email">Email</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        id="email"
                                        name="email"
                                        value={userDetails.email}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="col-md-4">
                                <div className="form-group">
                                    <label htmlFor="gender">Gender</label>
                                    <select className="form-control" name="gender" value={userDetails.gender} onChange={handleChange}>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="form-group">
                                    <label htmlFor="about">About</label>
                                    <textarea className="form-control" name="about" value={userDetails.about} onChange={handleChange} style={{ resize: "none", height: "200px" }}></textarea>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="form-group">
                                    <label htmlFor="avatar">Avatar</label>
                                    <input
                                        type="file"
                                        className="form-control"
                                        id="avatar"
                                        name="avatar"
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="col-md-4">
                                <div className="form-group">
                                    {userDetails?.avatar?.url && !avatar ? <div><p>Current Profile Picture</p> <img src={userDetails?.avatar?.url} alt="avatar" className="img-fluid w-50" /></div> : <div><p>Updated Profile Picture</p><img src={avatar} alt="avatar" className="img-fluid w-50" /></div>}
                                </div>
                            </div>
                            <div className="col-md-12">
                                <button className="btn btn-primary" disabled={updating} onClick={handleUpdate}>{updating ? <Vortex height={20} width={20} colors={['blue', 'white', 'blue', 'white', 'white', 'blue']} /> : "Update"}</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default EditProfille;
