import { createContext, useContext, useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, orderBy, query, updateDoc, Timestamp, doc } from 'firebase/firestore';

const FireBaseContext = createContext();

export function FireBaseContextProvider({ children }) {
    const [posts, setPosts] = useState([]);
    const [stories, setStories] = useState([]);
    const [users, setUsers] = useState([]);
    const [inboxes, setInboxes] = useState([]);
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

        const q2 = query(collection(db, 'stories'), orderBy('timestamp', 'asc'));
        const unsubcribe2 = onSnapshot(q2, (snapshot) => {
            let newStoryList = [];
            snapshot.forEach((doc) => {
                newStoryList.push({
                    id: doc.id,
                    ...doc.data(),
                });
            });
            setStories(newStoryList);
        });

        const unsubcribe3 = onSnapshot(collection(db, 'users'), (snapshot) => {
            let newUserList = [];
            snapshot.forEach((doc) => {
                newUserList.push({
                    id: doc.id,
                    ...doc.data(),
                });
            });
            setUsers(newUserList);
        });

        const unsubcribe4 = onSnapshot(collection(db, 'inboxes'), (snapshot) => {
            let newInboxList = [];
            snapshot.forEach((doc) => {
                newInboxList.push({
                    id: doc.id,
                    ...doc.data(),
                });
            });
            setInboxes(newInboxList);
        });

        return () => {
            unsubcribe();
            unsubcribe2();
            unsubcribe3();
            unsubcribe4();
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

    const getUserByEmail = (useremail) => {
        let newUser = null;
        users.forEach((user) => {
            if (user?.information.email === useremail) {
                newUser = {
                    ...user,
                };
            }
        });
        return newUser;
    };

    return (
        <FireBaseContext.Provider
            value={{ posts, idPostList, handleFollow, handleUnfollow, stories, users, getUserByEmail, inboxes }}
        >
            {children}
        </FireBaseContext.Provider>
    );
}

export function UseFireBase() {
    return useContext(FireBaseContext);
}
