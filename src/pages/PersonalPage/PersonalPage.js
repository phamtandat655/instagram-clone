import classNames from 'classnames/bind';
import styles from './PersonalPage.module.scss';

import { useState, useEffect, Fragment } from 'react';
import { UserAuth } from '../../Context/AuthContext';
import { onSnapshot, doc, query, collection, orderBy, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';

import { ListIcon, PostIcon, ThreeDotsIcon } from '../../assets/Icons/Icons';
import { useNavigate, useParams } from 'react-router-dom';
import Account from '../../components/Account/Account';

const cx = classNames.bind(styles);

function PersonalPage() {
    const [avatar, setAvatar] = useState();
    const [name, setName] = useState();
    const [desc, setDesc] = useState();
    const [posts, setPosts] = useState([]);
    const [followings, setFollowings] = useState([]);
    const [myFollowings, setMyFollowings] = useState([]);
    const [users, setUsers] = useState([]);
    const [hideFollowingsModal, setHideFollowingsModal] = useState(true);
    const [indexPostObserved, setIndexPostObserved] = useState(15);
    const [showSignOut, setShowSignOut] = useState(false);

    const { user, logout } = UserAuth();
    const nav = useNavigate();
    const { email } = useParams();

    useEffect(() => {
        onSnapshot(doc(db, 'users', `${email}`), (doc) => {
            setAvatar(doc.data()?.information.avatar);
            setName(doc.data()?.information.name);
            setDesc(doc.data()?.information.desc);
            setFollowings(doc.data()?.follows);
        });

        onSnapshot(doc(db, 'users', `${user?.email}`), (doc) => {
            setMyFollowings(doc.data()?.follows);
        });

        onSnapshot(collection(db, 'users'), (snapshot) => {
            let newUsers = [];
            snapshot.forEach((doc) => {
                newUsers.push({
                    id: doc.id,
                    ...doc.data(),
                });
            });
            setUsers(newUsers);
        });

        const q = query(collection(db, 'posts'), orderBy('timestamp', 'desc'));
        const unsubcribe = onSnapshot(q, (snapshot) => {
            let newPosts = [];
            snapshot.forEach((doc) => {
                newPosts.push({
                    id: doc.id,
                    ...doc.data(),
                });
            });
            newPosts = newPosts.filter((post) => post?.useremail.includes(email));
            setPosts(newPosts);
        });

        return () => unsubcribe();
    }, [email, user?.email]);

    useEffect(() => {
        const srollEvent = window.addEventListener('scroll', (e) => {
            const scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight;
            const clientHeight = document.documentElement.clientHeight;

            const percentage = Math.floor((scrollTop / (scrollHeight - clientHeight)) * 100);
            if (percentage >= 90) {
                setIndexPostObserved((prevIndex) => prevIndex + 9);
            }
        });

        return () => srollEvent;
    });

    // con loi~ la : tu cho xem follow bam qua tai khoan ngkhac xong unfollow se bi doi thanh tai khoan cua minh
    const handleFollow = async (e) => {
        const docRef = doc(db, 'users', `${user?.email}`);
        await updateDoc(docRef, {
            follows: [...myFollowings, email],
        });
    };

    const handleUnfollow = async (e) => {
        const docRef = doc(db, 'users', `${user?.email}`);
        let newFollowings = myFollowings.filter((followingEmail) => followingEmail !== email);
        await updateDoc(docRef, {
            follows: [...newFollowings],
        });
    };

    const handleSignOut = () => {
        nav('/');
        logout();
    };

    return (
        <div className={cx('wrapper')}>
            {hideFollowingsModal === false && (
                <div
                    className={cx('followings-modal')}
                    onClick={(e) => {
                        setHideFollowingsModal(true);
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
                                setHideFollowingsModal(true);
                            }}
                        >
                            X
                        </i>
                        <div className={cx('followings-modal-header')}>Người theo dõi</div>
                        <div className={cx('followings-modal-list')}>
                            {users &&
                                users.map((user, index) => {
                                    if (followings.includes(user?.information.email)) {
                                        return (
                                            <div
                                                key={user?.id || index}
                                                className={cx('followings-modal-item')}
                                                onClick={(e) => {
                                                    setHideFollowingsModal(true);
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
            )}
            <div className={cx('personalPage-top')}>
                <div className={cx('avatar-container')}>
                    <img alt="avatar" src={avatar} />
                </div>

                <div className={cx('infomation-container')}>
                    <div className={cx('info-top')}>
                        <div className={cx('email-wrapper')}>
                            <p className={cx('info-top--email')}>{email}</p>
                            <p
                                className={cx('info-top--icon')}
                                onClick={(e) => {
                                    setShowSignOut(!showSignOut);
                                }}
                            >
                                {ThreeDotsIcon}
                            </p>
                            {showSignOut === true && (
                                <div className={cx('info-top--signout')} onClick={handleSignOut}>
                                    Đăng xuất
                                </div>
                            )}
                        </div>
                        {email === user?.email ? (
                            <div
                                className={cx('info-top--settings')}
                                onClick={(e) => {
                                    nav('/account/edit');
                                }}
                            >
                                Chỉnh sửa trang cá nhân
                            </div>
                        ) : (
                            <div>
                                {myFollowings && myFollowings.includes(email) ? (
                                    <p className={cx('info-top--following')} onClick={handleUnfollow}>
                                        Đang theo dõi
                                    </p>
                                ) : (
                                    <p className={cx('info-top--follow')} onClick={handleFollow}>
                                        Theo dõi
                                    </p>
                                )}
                            </div>
                        )}
                        {/* <p className={cx('info-top--setting')}>{SettingIcon}</p> */}
                    </div>
                    <div className={cx('info-mid')}>
                        <span>
                            <strong>{posts.length}</strong> bài viết
                        </span>
                        <span
                            className={cx('info-mid-followings')}
                            onClick={(e) => {
                                setHideFollowingsModal(false);
                            }}
                        >
                            <strong>{followings ? followings.length : 0}</strong> đang theo dõi
                        </span>
                    </div>
                    <div className={cx('info-bottom')}>
                        <p className={cx('info-bottom--name')}>{name}</p>
                        <p>{desc}</p>
                    </div>
                </div>
            </div>
            <div className={cx('personalPage-bottom')}>
                <p className={cx('post-container', 'active')}>
                    <span className={cx('post-container--icon')}>{PostIcon}</span>
                    <span>BÀI VIẾT</span>
                </p>
                <div className={cx('post')}>
                    {posts &&
                        posts.map((post, index) => {
                            if (index >= indexPostObserved) {
                                return <Fragment key={index}></Fragment>;
                            }
                            if (post?.url[0].type.includes('image')) {
                                return (
                                    <div
                                        key={post?.id}
                                        className={cx('post-wrapper')}
                                        onClick={(e) => {
                                            nav(`/${post?.id}`);
                                        }}
                                    >
                                        {post?.url.length > 1 && <i className={cx('listPost-icon')}>{ListIcon}</i>}
                                        <img alt="post-img" src={post?.url[0].src} />
                                    </div>
                                );
                            } else {
                                return (
                                    <div
                                        key={post?.id}
                                        className={cx('post-wrapper')}
                                        onClick={(e) => {
                                            nav(`/${post?.id}`);
                                        }}
                                    >
                                        {post?.url.length > 1 && <i className={cx('listPost-icon')}>{ListIcon}</i>}
                                        <video width="290" muted className={cx('video')}>
                                            <source src={post?.url[0].src} type="video/mp4" />
                                        </video>
                                    </div>
                                );
                            }
                        })}
                </div>
            </div>
        </div>
    );
}

export default PersonalPage;
