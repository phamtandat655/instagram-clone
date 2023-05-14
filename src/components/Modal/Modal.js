import { onSnapshot, collection } from 'firebase/firestore';
import { db } from '../../firebase';

import classNames from 'classnames/bind';
import styles from './Modal.module.scss';

import { SearchIconMini, RemoveIcon } from '../../assets/Icons/Icons';
import { useEffect, useState } from 'react';
import Account from '../Account/Account';
import Notify from '../Notify/Notify';
import { UserAuth } from '../../Context/AuthContext';
import useDebounce from '../../hooks/useDebounce/useDebounce';
import { useNavigate } from 'react-router-dom';

const cx = classNames.bind(styles);

function Modal({ setPage, page, pathname }) {
    const nav = useNavigate();
    const [input, setInput] = useState('');
    const [users, setUsers] = useState([]);
    const [searchUsers, setSearchUsers] = useState([]);
    const [followers, setFollowers] = useState([]);
    const [followings, setFollowings] = useState();

    const { user } = UserAuth();

    useEffect(() => {
        const unsubcribe = onSnapshot(collection(db, 'users'), (snapshot) => {
            let newUsers = [];
            let newFollowers = [];
            snapshot.forEach((doc) => {
                if (doc.data().follows.find((flUser) => flUser?.User.information.email === user?.email)) {
                    newFollowers.push(doc.data());
                }

                if (doc.data().information.email.includes(user?.email)) {
                    setFollowings(doc.data().follows);
                }

                newUsers.push({
                    ...doc.data().information,
                });
            });

            // sap xep thong bao theo thoi gian
            newFollowers.sort(function (a, b) {
                return (
                    new Date(
                        b?.follows.find((flUser) => flUser?.User.information.email === user?.email).timestampSecond,
                    ) -
                    new Date(
                        a?.follows.find((flUser) => flUser?.User.information.email === user?.email).timestampSecond,
                    )
                );
            });
            setUsers(newUsers);
            setFollowers(newFollowers);
        });

        return () => unsubcribe();
    }, [user?.email]);

    const debounced = useDebounce(input, 500);
    useEffect(() => {
        if (!debounced.trim()) {
            setSearchUsers([]);
        } else {
            const newSearchUsers = [];
            users.map((user) => {
                if (user?.name.includes(debounced)) {
                    newSearchUsers.push(user);
                }
                return user;
            });
            setSearchUsers(newSearchUsers);
        }
    }, [debounced, users]);

    const handleTimeStamp = (timestampSeconds) => {
        const postDate = new Date(timestampSeconds * 1000);
        const nowDate = new Date();

        const months = getMonthDifference(postDate, nowDate);
        const years = nowDate.getFullYear() - postDate.getFullYear();

        // get total seconds between the times
        let delta = Math.abs(nowDate - postDate) / 1000;
        // calculate (and subtract) whole days
        let days = Math.floor(delta / 86400);
        delta -= days * 86400;
        // calculate (and subtract) whole hours
        let hours = Math.floor(delta / 3600) % 24;
        delta -= hours * 3600;
        // calculate (and subtract) whole minutes
        let minutes = Math.floor(delta / 60) % 60;
        delta -= minutes * 60;
        // what's left is seconds
        let seconds = Math.round(delta % 60); // in theory the modulus is not required

        if (years < 1) {
            if (months >= 1) {
                return `${months} THÁNG TRƯỚC`;
            } else {
                if (days < 1) {
                    if (hours < 1) {
                        if (minutes < 1) {
                            return `${seconds} GIÂY TRƯỚC`;
                        } else {
                            return `${minutes} PHÚT TRƯỚC`;
                        }
                    } else {
                        return `${hours} GIỜ TRƯỚC`;
                    }
                } else {
                    return `${days} NGÀY TRƯỚC`;
                }
            }
        } else {
            return `NĂM ${years} THÁNG ${months} NGÀY ${days}`;
        }

        function getMonthDifference(startDate, endDate) {
            return endDate.getMonth() - startDate.getMonth() + 12 * (endDate.getFullYear() - startDate.getFullYear());
        }
    };

    return (
        <div
            className={cx('container')}
            onClick={(e) => {
                setPage(pathname);
            }}
        >
            <div className={cx('wrapper')} onClick={(e) => e.stopPropagation()}>
                {page === 'search' ? (
                    <div className={cx('search-modal')}>
                        <h3 className={cx('search__header')}>Tìm Kiếm</h3>
                        <div className={cx('search__container')}>
                            <p className={cx('search__icon', { hide: input !== '' })}>{SearchIconMini}</p>
                            <input
                                className={cx('search__input')}
                                type="text"
                                placeholder="Tìm kiếm"
                                value={input}
                                onInput={(e) => setInput(e.target.value)}
                                // onChange={handleSearchUser}
                            />
                            <p className={cx('search__remove', { show: input !== '' })} onClick={(e) => setInput('')}>
                                {RemoveIcon}
                            </p>
                        </div>
                        <div className={cx('bar')}></div>
                        <div className={cx('search-content')}>
                            <div className={cx('account-wrap')}>
                                {input !== '' &&
                                    searchUsers.map((user) => (
                                        <div
                                            className={cx('account-wrap')}
                                            key={user.email}
                                            onClick={(e) => {
                                                nav(`/personalPage/${user.email}`);
                                                setPage(pathname);
                                            }}
                                        >
                                            <Account
                                                name={user.name}
                                                img={user.avatar}
                                                desc={user.email}
                                                lengthDesc={40}
                                            />
                                        </div>
                                    ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className={cx('notify-modal')}>
                        <h3 className={cx('notify__header')}>Thông báo</h3>
                        <div className={cx('notify-container')}>
                            {followers &&
                                followers.map((flUser, index) => {
                                    let timestampSecond = flUser.follows.find(
                                        (flUser) => flUser?.User.information.email === user?.email,
                                    ).timestampSecond;
                                    return (
                                        <Notify
                                            handleClick={(e) => {
                                                setPage(pathname);
                                            }}
                                            key={index}
                                            user={user}
                                            flUser={flUser}
                                            notify="đã bắt đầu theo dõi bạn"
                                            time={timestampSecond ? handleTimeStamp(timestampSecond) : ''}
                                            following={
                                                followings.find(
                                                    (followingUser) =>
                                                        followingUser?.User.information.email ===
                                                        flUser?.information.email,
                                                )
                                                    ? true
                                                    : false
                                            }
                                            // list user dang follow
                                            followings={followings}
                                        />
                                    );
                                })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Modal;
