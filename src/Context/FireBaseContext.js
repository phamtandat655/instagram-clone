import { createContext, useContext, useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, orderBy, query, updateDoc, Timestamp, doc } from 'firebase/firestore';

const FireBaseContext = createContext();

export function FireBaseContextProvider({ children }) {
    const [posts, setPosts] = useState([]);
    const [idPostList, setIdPostList] = useState([]);

    useEffect(() => {
        const q = query(collection(db, 'posts'), orderBy('timestamp', 'desc'));
        const unsubcribe = onSnapshot(q, (snapshot) => {
            let newPosts = [];
            let newIdPostList = [];
            snapshot.forEach((doc) => {
                newPosts.push({
                    id: doc.id,
                    ...doc.data(),
                });
                newIdPostList.push(doc.id);
            });
            setPosts(newPosts);
            setIdPostList(newIdPostList);
        });

        return () => {
            unsubcribe();
        };
    }, []);

    const handleFollow = async (user, followings, flUser) => {
        const docRef = doc(db, 'users', `${user?.email}`);
        await updateDoc(docRef, {
            follows: [
                ...followings,
                {
                    User: flUser,
                    timestampSecond: Math.floor(Date.now() / 1000),
                    timestamp: Timestamp.now(),
                },
            ],
        });
    };

    const handleUnfollow = async (user, followings, flUser, email) => {
        const docRef = doc(db, 'users', `${user?.email}`);
        let newFollowings = followings.filter(
            (following) => following?.User?.information.email !== flUser?.information.email || email,
        );
        await updateDoc(docRef, {
            follows: [...newFollowings],
        });
    };

    return (
        <FireBaseContext.Provider value={{ posts, idPostList, handleFollow, handleUnfollow }}>
            {children}
        </FireBaseContext.Provider>
    );
}

export function UseFireBase() {
    return useContext(FireBaseContext);
}
