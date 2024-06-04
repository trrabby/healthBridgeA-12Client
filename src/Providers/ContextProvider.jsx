import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, signOut, GithubAuthProvider, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import React, { createContext, useEffect, useState } from 'react'
import toast from 'react-hot-toast';

import { useAxiosSecure } from '../Hooks/useAxiosSecure';
import Swal from 'sweetalert2';
import { app } from '../../firebase.config';


export const ContextApi = createContext(null);
    
export const ContextProvider = ({ children }) => {

    const [loading, setLoading] = useState(true)

    const [err, setErr] = useState(null)
    const [user, setUser] = useState(null);


    const axiosSecure = useAxiosSecure()
    const auth = getAuth(app);

    const registerWithEmail = (email, password) => {
        setLoading(true)
        return createUserWithEmailAndPassword(auth, email, password)

    }

    const login = (email, password) => {
        setLoading(true)
        return signInWithEmailAndPassword(auth, email, password)
    }



    const signInWithGoogle = () => {
        setLoading(true)
        const provider = new GoogleAuthProvider();
        return signInWithPopup(auth, provider)

    }

    const singInWithGitHub = () => {
        setLoading(true)
        const provider = new GithubAuthProvider();
        return signInWithPopup(auth, provider)

    }


    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, currentUser => {
            setUser(currentUser)
            console.log('CurrentUser-->', currentUser)
            setLoading(false)
            // if user exist then provide a token
            if (currentUser) {
                const loggedPerson = { email: currentUser.email }
                try{
                    axiosSecure.post("/jwt", loggedPerson)
                    .then(res=>console.log('token response', res.data))
                }
                
                catch (err) {
                    console.log(err)
                }
            }
        })
        return () => {
            return unsubscribe()
        }
    }, [user])

    const updateUserInfo = (displayName, photo) => {
        return updateProfile(auth.currentUser, {
            displayName: displayName, photoURL: photo
        })

    }


    const signOutfromLogin = async () => {
        toast.success('Signed Out Successfully')
        // const {data} = await axiosSecure.post('/logout')
        // console.log('cookie logout',data)
        return signOut(auth)
    }


    const handleDelete = async (id) => {
        const shouldDelete = await Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        })
        console.log(shouldDelete)

        if (shouldDelete.isConfirmed) {

            const { data } = await axiosSecure.delete(`/blogs/${id}`)

            if (data.deletedCount > 0) {
                toast.success('Deleted Successfully')
                Swal.fire({
                    title: "Deleted!",
                    text: "Your file has been deleted.",
                    icon: "success"
                });
            }
            console.log(data)
        }

    }


    const ContextValue = {
        auth,
        user,
        loading,
        setLoading,
        setUser,
        registerWithEmail,
        login,
        signOutfromLogin,
        signInWithGoogle,
        singInWithGitHub,
        updateUserInfo,
        setErr,
        err,
        handleDelete
    }

    return (
        <ContextApi.Provider value={ContextValue}>
            {children}
        </ContextApi.Provider>
    )
}
