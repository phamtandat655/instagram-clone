import styles from './FollowsModal.module.scss';
import classNames from 'classnames/bind';
import Account from '../Account/Account';
import { Fragment } from 'react';
import { useNavigate } from 'react-router-dom';

const cx = classNames.bind(styles);

const FollowsModal = ({ users, typeOfFollowModal, setHideFollowModal, followings, followers }) => {
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
                                        name={user?.information.name}
                                        img={user?.information.avatar}
                                        lengthDesc={40}
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
                        {users &&
                            users.map((user, index) => {
                                if (followings.includes(user?.information.email)) {
                                    return (
                                        <div
                                            key={user?.id || index}
                                            className={cx('followings-modal-item')}
                                            onClick={(e) => {
                                                setHideFollowModal(true);
                                                nav(`/personalPage/${user?.id}`);
                                            }}
                                        >
                                            <Account
                                                name={user?.information.name}
                                                img={user?.information.avatar}
                                                lengthDesc={40}
                                            />
                                        </div>
                                    );
                                }
                                return <Fragment key={index}></Fragment>;
                            })}
                    </div>
                </div>
            </div>
        );
    }
};

export default FollowsModal;
