import classNames from 'classnames/bind';
import styles from './Notify.module.scss';
import { useNavigate } from 'react-router-dom';
import { UseFireBase } from '../../Context/FireBaseContext';

const cx = classNames.bind(styles);

function Notify({ handleClick, flUser, user, notify, time, following, followings }) {
    const nav = useNavigate();
    const { handleFollow, handleUnfollow } = UseFireBase();

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
                        handleUnfollow(user, followings, flUser);
                    } else {
                        handleFollow(user, followings, flUser);
                    }
                }}
            >
                {following === true ? 'Đang theo dõi' : 'Theo dõi'}
            </div>
        </div>
    );
}

export default Notify;
