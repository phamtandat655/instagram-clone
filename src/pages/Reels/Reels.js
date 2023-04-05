import classNames from 'classnames/bind';
import styles from './Reels.module.scss';
import { useEffect, useState, Fragment } from 'react';
import { db } from '../../firebase';
import { collection, onSnapshot, orderBy, query, doc } from 'firebase/firestore';
import { UserAuth } from '../../Context/AuthContext';
import ReelVideo from '../../components/ReelVideo/ReelVideo';

const cx = classNames.bind(styles);

function Reels() {
    const [reels, setReels] = useState([]);
    const [username, setUsername] = useState('');
    const [userAvatar, setUserAvatar] = useState('');

    const { user } = UserAuth();
    const [indexPostObserved, setIndexPostObserved] = useState(4);

    const handleScroll = (e) => {
        const scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight;
        const clientHeight = document.documentElement.clientHeight;

        const percentage = Math.floor((scrollTop / (scrollHeight - clientHeight)) * 100);
        if (percentage >= 90) {
            setIndexPostObserved((prevIndex) => prevIndex + 4);
        }
    };
    useEffect(() => {
        window.addEventListener('scroll', handleScroll);

        return () => window.removeEventListener('scroll', handleScroll);
    });

    useEffect(() => {
        const q = query(collection(db, 'posts'), orderBy('timestamp', 'desc'));
        const unsubcribe = onSnapshot(q, (snapshot) => {
            let newReelss = [];
            snapshot.forEach((doc) => {
                if (doc.data().reels && doc.data().reels === true) {
                    newReelss.push({
                        id: doc.id,
                        ...doc.data(),
                    });
                }
            });
            setReels(newReelss);
        });

        return () => {
            unsubcribe();
        };
    }, []);

    useEffect(() => {
        onSnapshot(doc(db, 'users', `${user?.email}`), (doc) => {
            setUserAvatar(doc.data()?.information.avatar);
            setUsername(doc.data()?.information.name);
        });
    }, [user?.email]);

    return (
        <div className={cx('wrapper')}>
            {reels.map((reel, index) => {
                if (index > indexPostObserved) {
                    return <Fragment key={index}></Fragment>;
                } else {
                    return (
                        <ReelVideo key={reel?.id} reel={reel} user={user} username={username} userAvatar={userAvatar} />
                    );
                }
            })}
        </div>
    );
}

export default Reels;
