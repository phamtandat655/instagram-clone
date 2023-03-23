import { createContext, useContext, useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';

const FireBaseContext = createContext();

export function FireBaseContextProvider({ children }) {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const q = query(collection(db, 'posts'), orderBy('timestamp', 'desc'));
        const unsubcribe = onSnapshot(q, (snapshot) => {
            let newPosts = [];
            snapshot.forEach((doc) => {
                newPosts.push({
                    id: doc.id,
                    ...doc.data(),
                });
            });
            setPosts(newPosts);
        });

        return () => {
            unsubcribe();
        };
    }, []);

    return <FireBaseContext.Provider value={{ posts }}>{children}</FireBaseContext.Provider>;
}

export function UseFireBase() {
    return useContext(FireBaseContext);
}
