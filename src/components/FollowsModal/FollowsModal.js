import styles from './FollowsModal.module.scss';
import classNames from 'classnames/bind';
import Account from '../Account/Account';
import { useNavigate } from 'react-router-dom';

const cx = classNames.bind(styles);

const FollowsModal = ({ typeOfFollowModal, setHideFollowModal, followings, followers }) => {
    const nav = useNavigate();

    if (typeOfFollowModal === 'followers') {
        return (
            <div
                className={cx('followings-modal')}
                onClick={(e) => {
                    setHideFollowModal(true);
                }}
            >
                <div
                    className={cx('followings-modal-wrapper')}
                    onClick={(e) => {
                        e.stopPropagation();
                    }}
                >
                    <i
                        className={cx('followings-modal-close')}
                        onClick={(e) => {
                            setHideFollowModal(true);
                        }}
                    >
                        X
                    </i>
                    <div className={cx('followings-modal-header')}>Người theo dõi</div>
                    <div className={cx('followings-modal-list')}>
                        {followers &&
                            followers.map((user, index) => (
                                <div
                                    key={user?.id || index}
                                    className={cx('followings-modal-item')}
                                    onClick={(e) => {
                                        setHideFollowModal(true);
                                        nav(`/personalPage/${user?.id}`);
                                    }}
                                >
                                    <Account
                                        userAccount={user}
                                        lengthDesc={40}
                                        follow={
                                            followings.find(
                                                (followingUser) =>
                                                    followingUser?.User.information.email === user?.information.email,
                                            )
                                                ? false
                                                : true
                                        }
                                        followings={followings}
                                    />
                                </div>
                            ))}
                    </div>
                </div>
            </div>
        );
    } else {
        return (
            <div
                className={cx('followings-modal')}
                onClick={(e) => {
                    setHideFollowModal(true);
                }}
            >
                <div
                    className={cx('followings-modal-wrapper')}
                    onClick={(e) => {
                        e.stopPropagation();
                    }}
                >
                    <i
                        className={cx('followings-modal-close')}
                        onClick={(e) => {
                            setHideFollowModal(true);
                        }}
                    >
                        X
                    </i>
                    <div className={cx('followings-modal-header')}>Đang theo dõi</div>
                    <div className={cx('followings-modal-list')}>
                        {followings &&
                            followings.map((user, index) => (
                                <div
                                    key={user?.User.id || index}
                                    className={cx('followings-modal-item')}
                                    onClick={(e) => {
                                        setHideFollowModal(true);
                                        nav(`/personalPage/${user?.User.information.email}`);
                                    }}
                                >
                                    <Account
                                        name={user?.User.information.name}
                                        img={user?.User.information.avatar}
                                        lengthDesc={40}
                                    />
                                </div>
                            ))}
                    </div>
                </div>
            </div>
        );
    }
};

export default FollowsModal;
