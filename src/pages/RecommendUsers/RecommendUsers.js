import classNames from 'classnames/bind';
import styles from './RecommendUsers.module.scss';
import { UseFireBase } from '../../Context/FireBaseContext';
import { UserAuth } from '../../Context/AuthContext';
import { useEffect, useMemo, useState } from 'react';
import Account from '../../components/Account/Account';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase';
import { useNavigate } from 'react-router-dom';

const cx = classNames.bind(styles);

function RecommendUsers() {
    const { users } = UseFireBase();
    const { user } = UserAuth();
    const [followings, setFollowings] = useState([]);
    const [IndexObserved, setIndexObserved] = useState(50);
    const nav = useNavigate();

    useEffect(() => {
        onSnapshot(doc(db, 'users', `${user?.email}`), (doc) => {
            setFollowings(doc.data()?.follows);
        });
    }, [user?.email]);

    const handleScroll = (e) => {
        const scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight;
        const clientHeight = document.documentElement.clientHeight;

        const percentage = Math.floor((scrollTop / (scrollHeight - clientHeight)) * 100);
        if (percentage >= 90) {
            setIndexObserved((prevIndex) => prevIndex + 20);
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);

        return () => window.removeEventListener('scroll', handleScroll);
    });

    let recommendUsers = useMemo(() => {
        if (followings && users) {
            return users.filter((u, index) => {
                return (
                    !followings.find((following) => following?.User?.information?.email === u?.information?.email) &&
                    u?.information?.email !== user?.email
                );
            });
        }
        return null;
    }, [users, followings, user?.email]);

    return (
        <div className={cx('wrapper')}>
            <div className={cx('recommend')}>
                <p className={cx('recommend__title')}>Gợi ý</p>
                <div className={cx('recommend--users')}>
                    {recommendUsers &&
                        recommendUsers.map((u, index) => {
                            if (index >= IndexObserved) {
                                return <div key={index} className={cx('hide')}></div>;
                            } else {
                                return (
                                    <div
                                        key={index}
                                        className={cx('recommend--user-wrapper')}
                                        onClick={(e) => {
                                            nav(`/personalPage/${u?.information?.email}`);
                                        }}
                                    >
                                        <Account
                                            userAccount={u}
                                            note="Gợi ý cho bạn"
                                            follow
                                            followings={followings}
                                            recommend="recommend-home"
                                        />
                                    </div>
                                );
                            }
                        })}
                </div>
            </div>
        </div>
    );
}

export default RecommendUsers;
