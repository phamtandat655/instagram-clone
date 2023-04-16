import classNames from 'classnames/bind';
import styles from './Notify.module.scss';
import { useNavigate } from 'react-router-dom';
import { db } from '../../firebase';
import { doc, updateDoc, Timestamp } from 'firebase/firestore';

const cx = classNames.bind(styles);

function Notify({ handleClick, flUser, user, notify, time, following, followings }) {
    const nav = useNavigate();

    const handleFollow = async (e) => {
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

    const handleUnfollow = async (e) => {
        const docRef = doc(db, 'users', `${user?.email}`);
        let newFollowings = followings.filter(
            (following) => following?.User?.information.email !== flUser?.information.email,
        );
        await updateDoc(docRef, {
            follows: [...newFollowings],
        });
    };

    const handleClickAccount = (e) => {
        nav(`/personalPage/${flUser?.information.email}`);
        handleClick();
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('account')} onClick={handleClickAccount}>
                <div className={cx('avatar')}>
                    <img src={flUser?.information.avatar} alt="avatar" />
                </div>
                <div className={cx('about')}>
                    <span className={cx('name')}>{flUser?.information.name}</span> {notify}
                    <span className={cx('time')}>. {time}</span>
                </div>
            </div>
            <div
                className={cx('follow', { following: following })}
                onClick={(e) => {
                    if (following === true) {
                        handleUnfollow();
                    } else {
                        handleFollow();
                    }
                }}
            >
                {following === true ? 'Đang theo dõi' : 'Theo dõi'}
            </div>
        </div>
    );
}

export default Notify;
