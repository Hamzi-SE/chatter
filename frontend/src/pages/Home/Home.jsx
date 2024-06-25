import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import Loader from '../../components/Loader/Loader';
import UserCard from '../../components/UserCard/UserCard';
import Pagination from "react-js-pagination"
import { callProfile } from '../../helpers/CallProfile';
import "./home.css"
import customFetch from '../../helpers/api';

const Home = () => {

    const [resultsPerPage, setResultsPerPage] = useState(0);
    const [search, setSearch] = useState('');
    const [searchUsersCount, setSearchUsersCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);

    const { loading, users, usersCount } = useSelector(state => state.users);
    const { user } = useSelector(state => state.user);

    const dispatch = useDispatch();
    const navigate = useNavigate();


    const getUsers = async () => {

        dispatch({ type: "LOAD_USERS_REQUEST" })
        try {
            let link = `/api/v1/users?page=${currentPage}`;
            if (search) {
                link += `&keyword=${search}`;
            }
            const res = await customFetch(link, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            })

            const data = await res.json()
            dispatch({ type: "LOAD_USERS_SUCCESS", payload: data })
            setResultsPerPage(data.resultsPerPage)

        } catch (error) {
            dispatch({ type: "LOAD_USERS_FAIL", payload: error })
            console.log(error)
        }

    }
    useEffect(() => {
        getUsers()

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch])



    const setCurrentPageNo = (e) => {
        setCurrentPage(e)
    }

    const getSearchUsers = async (e) => {
        e.preventDefault();
        dispatch({ type: "LOAD_USERS_REQUEST" })
        try {
            const res = await customFetch(`/api/v1/users?keyword=${search}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            })

            const data = await res.json()
            setSearchUsersCount(data.usersCount);
            dispatch({ type: "LOAD_USERS_SUCCESS", payload: data })
        } catch (error) {

            dispatch({ type: "LOAD_USERS_FAIL", payload: error })
            console.log(error)
        }
    }

    useEffect(() => {
        getUsers();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage])

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

    const addFriend = async (userId) => {
        // dispatch({ type: "ADD_FRIEND_REQUEST" })
        try {
            const res = await customFetch(`/api/v1/user/addFriend`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ userId })
            })

            const data = await res.json()
            if (res.status === 201 || res.status === 200) {
                callProfile(dispatch)
                toast.success(data.message)
            }
            else {
                toast.error(data.message)
            }
            // dispatch({ type: "ADD_FRIEND_SUCCESS", payload: data.friend })

        } catch (error) {
            // dispatch({ type: "ADD_FRIEND_FAIL", payload: error })
            console.log(error)
        }
    }



    if (loading) {
        return <Loader />
    }


    return (
        <>
            <div className="d-flex justify-content-end my-2 mx-2">
                <form className="form-inline my-2 my-lg-0" onSubmit={getSearchUsers}>
                    <input className="form-control mr-sm-2" type="search" placeholder="Search Users By Name" value={search} onChange={(e) => setSearch(e.target.value)} aria-label="Search" />
                    <button className="btn btn-outline-primary my-2 my-sm-0" type="submit">Search</button>
                </form>
            </div>
            <h1 className='text-center py-3 text-primary'>Find the best people all around the world!</h1>
            {searchUsersCount > 0 ? <h6 className='text-center py-3 text-primary'>{`Search Results: ${searchUsersCount}`}</h6> : ""}
            <div className='d-flex justify-content-center flex-wrap'>
                {usersCount > 0 ?
                    users?.map((person) => {
                        return (
                            <UserCard person={person} addFriend={addFriend} createConversation={createConversation} />
                        )
                    })
                    : "No users found"}

            </div>
            <div className="paginationBox">
                <Pagination activePage={currentPage}
                    itemsCountPerPage={resultsPerPage}
                    totalItemsCount={usersCount}
                    onChange={setCurrentPageNo}
                    nextPageText="Next"
                    prevPageText="Prev"
                    firstPageText="1st"
                    lastPageText="Last"
                    itemClass="page-item"
                    linkClass="page-link-pagination"
                    activeClass="pageItemActive"
                    activeLinkClass="pageLinkActive"
                />
            </div>

        </>
    )
}

export default Home