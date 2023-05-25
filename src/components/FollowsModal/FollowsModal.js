import styles from './FollowsModal.module.scss';
import classNames from 'classnames/bind';
import Account from '../Account/Account';
import { useNavigate } from 'react-router-dom';
import { UseFireBase } from '../../Context/FireBaseContext';
import { UserAuth } from '../../Context/AuthContext';

const cx = classNames.bind(styles);

const FollowsModal = ({ typeOfFollowModal, setHideFollowModal, followings, followers }) => {
    const { getUserByEmail } = UseFireBase();
    const { user } = UserAuth();
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
                            followers.map((thisUser, index) => (
                                <div
                                    key={thisUser?.id || index}
                                    className={cx('followings-modal-item')}
                                    onClick={(e) => {
                                        setHideFollowModal(true);
                                        nav(`/personalPage/${thisUser?.id}`);
                                    }}
                                >
                                    <Account
                                        userAccount={thisUser}
                                        lengthDesc={40}
                                        follow={
                                            followings.find(
                                                (followingUser) =>
                                                    followingUser?.User.information.email ===
                                                    thisUser?.information.email,
                                            ) || thisUser?.information.email === user?.email
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
                            followings.map((user, index) => {
                                const thisUser = getUserByEmail(user?.User.information.email);

                                return (
                                    <div
                                        key={user?.User.id || index}
                                        className={cx('followings-modal-item')}
                                        onClick={(e) => {
                                            setHideFollowModal(true);
                                            nav(`/personalPage/${user?.User.information.email}`);
                                        }}
                                    >
                                        <Account
                                            name={thisUser?.information?.name || ''}
                                            img={thisUser?.information?.avatar || ''}
                                            lengthDesc={40}
                                        />
                                    </div>
                                );
                            })}
                    </div>
                </div>
            </div>
        );
    }
};

export default FollowsModal;
