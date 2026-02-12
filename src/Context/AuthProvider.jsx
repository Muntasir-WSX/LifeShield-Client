import React, { useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';
import { createUserWithEmailAndPassword, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut } from 'firebase/auth';
import { auth } from '../Firebase/Firebase.init';

const AuthProvider = ({children}) => {

    const [user,setUser] = useState(null);
    const [ loading, setLoading ] = useState(true);
    const googleProvider = new GoogleAuthProvider();

    const createUser = ( email,password) =>
    {
        setLoading(true);
        return createUserWithEmailAndPassword(auth,email,password);
    }

    const signIn = ( email,password) =>
    {
        setLoading(true);
        return signInWithEmailAndPassword(auth,email,password);
    }

    const logOut = () =>
    {
        return signOut(auth);
    }

    const googleSignIn = () => {
        setLoading(true);
        return signInWithPopup(auth, googleProvider);
    }

    useEffect (() => {
        const unSubscribe = onAuthStateChanged(auth,currentUser =>
        {
            setUser(currentUser);
            setLoading(false);
        });
        return ( )=>
        {
            unSubscribe();
        }
        
    },[])

    const authInfo = {
        user,
        loading,
        createUser,
        signIn,
        googleSignIn,
        logOut

    }
    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;