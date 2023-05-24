import classNames from 'classnames/bind';
import styles from './PersonalPage.module.scss';

import { useState, useEffect, Fragment } from 'react';
import { UserAuth } from '../../Context/AuthContext';
import { onSnapshot, doc, query, collection, orderBy } from 'firebase/firestore';
import { db } from '../../firebase';

import { ListIcon, PostIcon, ThreeDotsIcon } from '../../assets/Icons/Icons';
import { useNavigate, useParams } from 'react-router-dom';
import { UseFireBase } from '../../Context/FireBaseContext';
import FollowsModal from '../../components/FollowsModal/FollowsModal';

const cx = classNames.bind(styles);

function PersonalPage() {
    const [thisUser, setThisUser] = useState({});
    const [posts, setPosts] = useState([]);
    const [followings, setFollowings] = useState([]);
    const [followers, setFollowers] = useState([]);
    const [myFollowings, setMyFollowings] = useState([]);
    const [hideFollowModal, setHideFollowModal] = useState(true);
    const [typeOfFollowModal, setTypeOfFollowModal] = useState('');
    const [indexPostObserved, setIndexPostObserved] = useState(15);
    const [showSignOut, setShowSignOut] = useState(false);

    const { user, logout } = UserAuth();
    const nav = useNavigate();
    const { email } = useParams();
    const { handleFollow, handleUnfollow } = UseFireBase();

    useEffect(() => {
        onSnapshot(doc(db, 'users', `${user?.email}`), (doc) => {
            setMyFollowings(doc.data()?.follows);
        });

        onSnapshot(collection(db, 'users'), (snapshot) => {
            let newFollowers = [];
            snapshot.forEach((doc) => {
                if (doc.id === email) {
                    setFollowings(doc.data()?.follows);
                    setThisUser(doc.data());
                }

                if (doc.data()?.follows.find((following) => following.User.information.email === email)) {
                    newFollowers.push({
                        id: doc.id,
                        ...doc.data(),
                    });
                }
            });
            setFollowers(newFollowers);
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

        return () => {
            unsubcribe();
        };
    }, [email, user?.email]);

    const handleScroll = (e) => {
        const scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight;
        const clientHeight = document.documentElement.clientHeight;

        const percentage = Math.floor((scrollTop / (scrollHeight - clientHeight)) * 100);
        if (percentage >= 90) {
            setIndexPostObserved((prevIndex) => prevIndex + 9);
        }
    };
    useEffect(() => {
        window.addEventListener('scroll', handleScroll);

        return () => window.removeEventListener('scroll', handleScroll);
    });

    const handleSignOut = () => {
        nav('/');
        logout();
    };

    if (thisUser?.information) {
        return (
            <div className={cx('wrapper')}>
                {hideFollowModal === false && (
                    <FollowsModal
                        typeOfFollowModal={typeOfFollowModal}
                        setHideFollowModal={setHideFollowModal}
                        followings={followings}
                        followers={followers}
                    />
                )}
                <div className={cx('personalPage-top')}>
                    <div className={cx('avatar-container')}>
                        <img alt="avatar" src={thisUser?.information.avatar} />
                    </div>

                    <div className={cx('infomation-container')}>
                        <div className={cx('info-top')}>
                            <div className={cx('email-wrapper')}>
                                <p className={cx('info-top--email')}>{email}</p>
                                {email === user?.email && (
                                    <p
                                        className={cx('info-top--icon')}
                                        onClick={(e) => {
                                            setShowSignOut(!showSignOut);
                                        }}
                                    >
                                        {ThreeDotsIcon}
                                    </p>
                                )}
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
                                <div className={cx('info-top--following-wrapper')}>
                                    <div
                                        className={cx('info-top--following')}
                                        onClick={(e) => {
                                            nav(`/inbox/${email}`);
                                        }}
                                    >
                                        Nhắn tin
                                    </div>
                                    {myFollowings &&
                                    myFollowings.find((following) => following.User.information.email === email) ? (
                                        <p
                                            className={cx('info-top--following')}
                                            onClick={(e) => {
                                                handleUnfollow(user, myFollowings, thisUser);
                                            }}
                                        >
                                            Đang theo dõi
                                        </p>
                                    ) : (
                                        <p
                                            className={cx('info-top--follow')}
                                            onClick={(e) => {
                                                handleFollow(user, myFollowings, thisUser);
                                            }}
                                        >
                                            Theo dõi
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                        <div className={cx('info-mid')}>
                            <span className={cx('info-mid-posts')}>
                                <strong>{posts.length}</strong> <span>bài viết</span>
                            </span>
                            <span
                                className={cx('info-mid-followings', {
                                    cursorText: followers.length === 0 ? true : false,
                                })}
                                onClick={(e) => {
                                    if (followers.length === 0) return;
                                    setTypeOfFollowModal('followers');
                                    setHideFollowModal(false);
                                }}
                            >
                                <strong>{followers ? followers.length : 0}</strong> <span>người theo dõi</span>
                            </span>
                            <span
                                className={cx('info-mid-followings', {
                                    cursorText: followings.length === 0 ? true : false,
                                })}
                                onClick={(e) => {
                                    if (followings.length === 0) return;
                                    setTypeOfFollowModal('followings');
                                    setHideFollowModal(false);
                                }}
                            >
                                <strong>{followings ? followings.length : 0}</strong> <span>đang theo dõi</span>
                            </span>
                        </div>
                        <div className={cx('info-bottom')}>
                            <p className={cx('info-bottom--name')}>{thisUser?.information.name}</p>
                            <p className={cx('info-bottom--desc')}>{thisUser?.information.desc}</p>
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
                    {posts.length <= 0 && (
                        <div className={cx('dontHavePost')}>
                            <h3>Hiện tại chưa có bài viết nào !</h3>
                            <p>Hãy chia sẻ những bức ảnh đầu tiên của bạn !</p>
                            <p>Khi bạn chia sẻ ảnh, ảnh sẽ xuất hiện trên trang cá nhân của bạn.</p>
                        </div>
                    )}
                </div>
            </div>
        );
    } else {
        return <p></p>;
    }
}

export default PersonalPage;
