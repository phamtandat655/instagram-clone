import { createContext, useContext, useEffect, useState } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import avatarClone from '../../assets/image/anh-profile-tiet-lo-g-ve-ban-1.webp';
import { setDoc, doc } from 'firebase/firestore';

import { auth, db } from '../../firebase';

const AuthContext = createContext();

export function AuthContextProvider({ children }) {
    const [user, setUser] = useState({});

    function handleName(email) {
        return email.split('@')[0];
    }

    function signUp(email, password) {
        createUserWithEmailAndPassword(auth, email, password);
        setDoc(doc(db, 'users', email), {
            information: {
                email,
                name: handleName(email),
                avatar: avatarClone,
                desc: '',
            },
        });
    }

    function login(email, password) {
        return signInWithEmailAndPassword(auth, email, password);
    }

    function logout() {
        return signOut(auth);
    }

    useEffect(() => {
        const unscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });

        return () => {
            unscribe();
        };
    }, []);

    return <AuthContext.Provider value={{ user, signUp, login, logout }}>{children}</AuthContext.Provider>;
}

export function UserAuth() {
    return useContext(AuthContext);
}
