import React, { useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { socket } from "../../helpers/SocketConnect";


const Logout = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { user } = useSelector(state => state.user);

    const callLogout = async () => {
        dispatch({ type: "LOGOUT_USER_REQUEST" });
        const res = await fetch("/api/v1/user/logout", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        const data = await res.json();

        if (res.status === 200) {
            socket.emit("removeUserFromLiveUsers", user?._id)
            dispatch({ type: "LOGOUT_USER_SUCCESS" })
            toast.success(data.message);
            navigate("/login");
        } else {
            dispatch({ type: "LOGOUT_USER_FAIL", payload: data.message })
            toast.error(data.message);
        }
    };

    useEffect(() => {
        window.scrollTo(0, 0);
        callLogout();

        // eslint-disable-next-line
    }, []);

    return <h1 className="d-flex justify-content-center align-items-center">Logging out...</h1>;
};

export default Logout;
