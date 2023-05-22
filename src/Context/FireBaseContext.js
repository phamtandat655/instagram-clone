import { createContext, useContext, useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, orderBy, query, updateDoc, Timestamp, doc, deleteDoc } from 'firebase/firestore';

const FireBaseContext = createContext();

export function FireBaseContextProvider({ children }) {
    const [posts, setPosts] = useState([]);
    const [idPostList, setIdPostList] = useState([]);
    const [stories, setStories] = useState([]);
    const [users, setUsers] = useState([]);
    const [userEmailList, setUserEmailList] = useState([]);
    const [inboxes, setInboxes] = useState([]);

    // them du lieu
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
            let newUserEmailList = [];
            snapshot.forEach((doc) => {
                newUserList.push({
                    id: doc.id,
                    ...doc.data(),
                });
                newUserEmailList.push(doc.id);
            });
            setUsers(newUserList);
            setUserEmailList(newUserEmailList);
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

    // tu dong xoa story sau 24h
    useEffect(() => {
        stories.forEach((story) => {
            const postDate = new Date(story.timestampSecond * 1000);
            const nowDate = new Date();

            // get total seconds between the times
            let delta = Math.abs(nowDate - postDate) / 1000;
            // calculate (and subtract) whole days
            let days = Math.floor(delta / 86400);

            if (days >= 1) {
                handleDeleteStory(story);
            }
        });
    }, [stories]);

    // const storage = getStorage();
    const handleDeleteStory = async (post) => {
        await deleteDoc(doc(db, 'stories', `${post?.id}`));
        // để xóa hình ảnh trong story nhưng nếu nhiều người đăng ảnh giống nhau sẽ bị xóa mất luôn ảnh của những ng đăng sau
        // post?.url.forEach((url) => {
        //     // Create a reference to the file to delete
        //     const desertRef = ref(storage, `files/${url.src.split('files%2F')[1].split('?alt')[0]}`);
        //     // Delete the file
        //     deleteObject(desertRef)
        //         .then(() => {
        //             // File deleted successfully
        //             console.log('xoa files thanh cong !');
        //         })
        //         .catch((error) => {
        //             // Uh-oh, an error occurred!
        //             console.log(error);
        //         });
        // });
    };

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
            value={{
                posts,
                idPostList,
                handleFollow,
                handleUnfollow,
                stories,
                users,
                userEmailList,
                getUserByEmail,
                inboxes,
            }}
        >
            {children}
        </FireBaseContext.Provider>
    );
}

export function UseFireBase() {
    return useContext(FireBaseContext);
}
