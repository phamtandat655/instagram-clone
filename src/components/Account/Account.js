import classNames from 'classnames/bind';
import styles from './Account.module.scss';
import { useState, useEffect, Fragment } from 'react';
import { UserAuth } from '../../Context/AuthContext';
import { UseFireBase } from '../../Context/FireBaseContext';

import { onSnapshot, query, collection, orderBy } from 'firebase/firestore';
import { db } from '../../firebase';
import { ListIcon } from '../../assets/Icons/Icons';

const cx = classNames.bind(styles);

function Account({ userAccount, name, img, note, lengthDesc, follow, story, followings, recommend }) {
    const { user } = UserAuth();
    const { handleFollow } = UseFireBase();

    // modal
    const [userfollowings, setUserFollowings] = useState([]);
    const [userfollowers, setUserFollowers] = useState([]);
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        onSnapshot(collection(db, 'users'), (snapshot) => {
            let newUserFollowers = [];
            snapshot.forEach((doc) => {
                if (doc.id === userAccount?.information.email) {
                    setUserFollowings(doc.data()?.follows);
                }

                if (
                    doc
                        .data()
                        ?.follows.find(
                            (following) => following.User.information.email === userAccount?.information.email,
                        )
                ) {
                    newUserFollowers.push({
                        id: doc.id,
                        ...doc.data(),
                    });
                }
            });
            setUserFollowers(newUserFollowers);
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
            newPosts = newPosts.filter((post) => post?.useremail === userAccount?.information.email);
            setPosts(newPosts);
        });

        return () => {
            unsubcribe();
        };
    }, [userAccount?.information.email]);

    const [seenStory, setSeenStory] = useState(() => {
        if (story) return true;
        return false;
    });

    const handleLengthOfWords = (words, length = 22) => {
        if (words.length >= length) {
            return words.slice(0, length) + '...';
        }
        return words;
    };

    return (
        <div className={cx('wrapper', { 'recommend-home': recommend })}>
            <div className={cx('account')}>
                <div className={cx('avatar', { havestr: seenStory })} onClick={(e) => setSeenStory(false)}>
                    <img src={userAccount?.information.avatar || img || ''} alt="avatar" />
                </div>
                <div className={cx('about')}>
                    <p className={cx('name')}>{handleLengthOfWords(userAccount?.information.name || name || '', 18)}</p>
                    {note && <p className={cx('desc')}>{handleLengthOfWords(note, lengthDesc)}</p>}
                </div>

                {/* modal hover */}
                <div className={cx('modal--hover-account', { hide: !userAccount })}>
                    <div className={cx('modal--hover-account-top')}>
                        <div className={cx('modal--hover-account-top__avatar')}>
                            <img src={userAccount?.information.avatar || img || ''} alt="avatar" />
                        </div>
                        <div className={cx('modal--hover-account-top__instrodution')}>
                            <p className={cx('name')}>
                                {handleLengthOfWords(userAccount?.information.name || name || '', 18)}
                            </p>
                            {userAccount?.information.desc && (
                                <p className={cx('desc')}>{handleLengthOfWords(userAccount?.information.desc, 85)}</p>
                            )}
                        </div>
                    </div>
                    <div className={cx('modal--hover-account-mid')}>
                        <span className={cx('modal--hover-account-mid-posts')}>
                            <strong>{posts.length}</strong> <span>bài viết</span>
                        </span>
                        <span
                            className={cx('modal--hover-account-mid-followings', {
                                cursorText: userfollowers.length === 0 ? true : false,
                            })}
                        >
                            <strong>{userfollowers ? userfollowers.length : 0}</strong> <span>người theo dõi</span>
                        </span>
                        <span
                            className={cx('modal--hover-account-mid-followings', {
                                cursorText: userfollowings.length === 0 ? true : false,
                            })}
                        >
                            <span>đang theo dõi</span> <strong>{userfollowings ? userfollowings.length : 0}</strong>{' '}
                            <span>người dùng</span>
                        </span>
                    </div>
                    <div className={cx('modal--hover-account-bottom')}>
                        <div className={cx('post')}>
                            {posts &&
                                posts.map((post, index) => {
                                    if (index >= 3) {
                                        return <Fragment key={post?.id}></Fragment>;
                                    }
                                    if (post?.url[0].type.includes('image')) {
                                        return (
                                            <div key={post?.id} className={cx('post-wrapper')}>
                                                {post?.url.length > 1 && (
                                                    <i className={cx('listPost-icon')}>{ListIcon}</i>
                                                )}
                                                <img alt="post-img" src={post?.url[0].src} />
                                            </div>
                                        );
                                    } else {
                                        return (
                                            <div key={post?.id} className={cx('post-wrapper')}>
                                                {post?.url.length > 1 && (
                                                    <i className={cx('listPost-icon')}>{ListIcon}</i>
                                                )}
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

                {/* end modal */}
            </div>
            <div
                className={cx('follow')}
                onClick={(e) => {
                    e.stopPropagation();
                    handleFollow(user, followings, userAccount);
                }}
            >
                {follow && <p>Theo dõi</p>}
            </div>
        </div>
    );
}

export default Account;
