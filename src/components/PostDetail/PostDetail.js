import classNames from 'classnames/bind';
import Account from '../Account/Account';
import styles from './PostDetail.module.scss';
import {
    ThreeDotsIcon,
    LikeIcon,
    LikedIcon,
    ShareIcon,
    CmtIcon,
    SaveIcon,
    SavedIcon,
    EmotionIcon,
} from '../../assets/Icons/Icons';
import { useRef, useState, useEffect, Fragment } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { onSnapshot, doc, collection, orderBy, query, addDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { UserAuth } from '../../Context/AuthContext';

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import '../../swiper.scss';
import { UseFireBase } from '../../Context/FireBaseContext';

import PostOption from '../PostOption/PostOption';
import Comment from '../Comment/Comment';
import PostVideo from '../PostVideo/PostVideo';

const cx = classNames.bind(styles);

function PostDetail({ setPage, page }) {
    const { idPostList } = UseFireBase();
    const { idPost } = useParams();
    const nav = useNavigate();

    const [saved, setSaved] = useState(false);
    const [thisUser, setThisUser] = useState({});

    const [myFollowings, setMyFollowings] = useState([]);
    const [hideLikedsModal, setHideLikedsModal] = useState(true);
    const [likedsList, setLikedsList] = useState([]);
    const [username, setUsername] = useState('');
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState([]);
    const { user } = UserAuth();
    const { users } = UseFireBase();
    const [post, setPost] = useState({});
    const [time, setTime] = useState('');
    const [hidePostOption, setHidePostOption] = useState(true);

    console.log();

    useEffect(() => {
        if (idPostList && !isEmpty(idPostList) && !idPostList.includes(idPost)) {
            nav(`/NotFound/${idPost}`);
        }
    }, [idPostList, nav, idPost]);

    useEffect(() => {
        const timestamp = {
            seconds: post?.timestampSecond || '',
        };
        const postDate = new Date(timestamp.seconds * 1000);
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
                setTime(`${months} THÁNG TRƯỚC`);
            } else {
                if (days < 1) {
                    if (hours < 1) {
                        if (minutes < 1) {
                            setTime(`${seconds} GIÂY TRƯỚC`);
                        } else {
                            setTime(`${minutes} PHÚT TRƯỚC`);
                        }
                    } else {
                        setTime(`${hours} GIỜ TRƯỚC`);
                    }
                } else {
                    setTime(`${days} NGÀY TRƯỚC`);
                }
            }
        } else {
            setTime(`NĂM ${years} THÁNG ${months} NGÀY ${days}`);
        }
    }, [post?.timestampSecond]);

    function getMonthDifference(startDate, endDate) {
        return endDate.getMonth() - startDate.getMonth() + 12 * (endDate.getFullYear() - startDate.getFullYear());
    }

    useEffect(() => {
        onSnapshot(doc(db, 'users', `${user?.email}`), (doc) => {
            setMyFollowings(doc.data()?.follows);
        });

        onSnapshot(doc(db, 'posts', `${idPost}`), (doc) => {
            setPost({
                id: doc.id,
                ...doc.data(),
            });
        });

        const q = query(collection(db, `posts/${idPost}/comments`), orderBy('timestamp', 'desc'));
        const unsubcribe = onSnapshot(q, (snapshot) => {
            let newComments = [];
            snapshot.forEach((doc) => {
                newComments.push({
                    id: doc.id,
                    ...doc.data(),
                });
            });
            setComments(newComments);
        });

        const unsubcribe2 = onSnapshot(doc(db, 'users', `${user?.email}`), (doc) => {
            setUsername(doc.data()?.information.name);
        });

        const unsubcribe3 = onSnapshot(doc(db, 'posts', `${idPost}`), (doc) => {
            setLikedsList(doc.data()?.likeds);
        });

        return () => {
            unsubcribe();
            unsubcribe2();
            unsubcribe3();
        };
    }, [user?.email, idPost]);

    useEffect(() => {
        onSnapshot(doc(db, 'users', `${post?.useremail}`), (doc) => {
            setThisUser(doc.data());
        });
    }, [post?.useremail]);

    const inputRef = useRef();

    const handleUploadComment = (e) => {
        addDoc(collection(db, `posts/${idPost}/comments`), {
            timestampSecond: Math.floor(Date.now() / 1000),
            timestamp: serverTimestamp(),
            comment: comment,
            username: username,
            useremail: user?.email,
        });
        setComment('');
    };

    function isEmpty(obj) {
        return Object.keys(obj).length === 0;
    }

    const handleClickAccount = (e) => {
        setPage(`personalPage/${post?.useremail}`);
        nav(`/personalPage/${post?.useremail}`);
    };

    const handleClose = () => {
        setComment('');
        if (page === idPost) {
            setPage('home');
            nav('/');
        } else {
            nav(`/${page === 'home' ? '' : page}`);
            setPage(page);
        }
    };

    const handleDoubleClickLike = (e) => {
        if (likedsList.includes(user?.email)) {
            return;
        }
        handleLikePost();
    };

    const handleClickLike = (e) => {
        if (likedsList.includes(user?.email)) {
            handleUnLikePost();
        } else {
            handleLikePost();
        }
    };

    const handleLikePost = async () => {
        const docRef = doc(db, 'posts', `${idPost}`);
        await updateDoc(docRef, {
            likeds: [...likedsList, user?.email],
        });
    };

    const handleUnLikePost = async () => {
        const docRef = doc(db, 'posts', `${idPost}`);
        let newLikeds = likedsList.filter((likedIdPost) => likedIdPost !== user?.email);
        await updateDoc(docRef, {
            likeds: [...newLikeds],
        });
    };

    return (
        <div className={cx('wrapper')} onClick={handleClose}>
            {hidePostOption === false && (
                <PostOption
                    post={post}
                    ownPost={post?.useremail === user?.email ? true : false}
                    setHidePostOption={setHidePostOption}
                    followings={myFollowings}
                    page={page}
                />
            )}
            {hideLikedsModal === false && (
                <div
                    className={cx('likeds-modal')}
                    onClick={(e) => {
                        e.stopPropagation();
                        setHideLikedsModal(true);
                    }}
                >
                    <div
                        className={cx('likeds-modal-wrapper')}
                        onClick={(e) => {
                            e.stopPropagation();
                        }}
                    >
                        <i
                            className={cx('likeds-modal-close')}
                            onClick={(e) => {
                                setHideLikedsModal(true);
                            }}
                        >
                            X
                        </i>
                        <div className={cx('likeds-modal-header')}>Lượt thích</div>
                        <div className={cx('likeds-modal-list')}>
                            {users &&
                                users.map((likedUser, index) => {
                                    if (likedsList.includes(likedUser?.information.email)) {
                                        return (
                                            <div
                                                key={likedUser?.id || index}
                                                className={cx('likeds-modal-item')}
                                                onClick={(e) => {
                                                    setHideLikedsModal(true);
                                                    nav(`/personalPage/${likedUser?.id}`);
                                                }}
                                            >
                                                <Account
                                                    userAccount={likedUser}
                                                    lengthDesc={40}
                                                    followings={myFollowings}
                                                    follow={
                                                        (myFollowings &&
                                                            myFollowings.find(
                                                                (following) =>
                                                                    following.User.information.email ===
                                                                    likedUser?.information.email,
                                                            )) ||
                                                        likedUser?.information.email === user?.email
                                                            ? false
                                                            : true
                                                    }
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
            <p className={cx('close-icon')} onClick={handleClose}>
                X
            </p>
            {!isEmpty(post) && post.url && !isEmpty(post.url) && (
                <div
                    className={cx('container')}
                    onClick={(e) => {
                        e.stopPropagation();
                    }}
                >
                    <div className={cx('slider-wrapper')}>
                        {post?.url?.length === 1 ? (
                            post?.url[0].type.includes('image') ? (
                                <div>
                                    <img src={post?.url[0].src} alt="post img" onDoubleClick={handleDoubleClickLike} />
                                </div>
                            ) : (
                                <PostVideo file={post?.url[0]} postDetail />
                            )
                        ) : (
                            <Swiper
                                modules={[Navigation, Pagination]}
                                slidesPerView={1}
                                navigation
                                pagination={{ clickable: true }}
                            >
                                {post?.url.map((file) => {
                                    if (file.type.includes('image')) {
                                        return (
                                            <SwiperSlide
                                                key={file.src}
                                                style={{ height: '100%' }}
                                                className={'item-wrapper'}
                                                onDoubleClick={handleDoubleClickLike}
                                            >
                                                <img src={file.src} alt="post img" />
                                            </SwiperSlide>
                                        );
                                    } else if (file.type.includes('video')) {
                                        return (
                                            <SwiperSlide key={file.src} onDoubleClick={handleDoubleClickLike}>
                                                <PostVideo file={file} postDetail />
                                            </SwiperSlide>
                                        );
                                    } else {
                                        return <SwiperSlide key={file.src}>Hinh anh hoac video bi loi!</SwiperSlide>;
                                    }
                                })}
                            </Swiper>
                        )}
                    </div>
                    <div className={cx('info-wrapper')}>
                        <div className={cx('account-wrapper')}>
                            <div onClick={handleClickAccount}>
                                <Account userAccount={thisUser} />
                            </div>
                            <i
                                className={cx('post-option')}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setHidePostOption(false);
                                }}
                            >
                                {ThreeDotsIcon}
                            </i>
                        </div>
                        <div className={cx('cmt-wrapper')}>
                            {comments.map((cmt, index) => (
                                <Comment cmt={cmt} key={index} />
                            ))}
                        </div>
                        <div className={cx('about-post-wrapper')}>
                            <div className={cx('icons-container')}>
                                <div className={cx('icons-left')}>
                                    <div className={cx('icon')} onClick={handleClickLike}>
                                        {likedsList && likedsList.includes(user?.email) === true ? LikedIcon : LikeIcon}
                                    </div>
                                    <div
                                        className={cx('icon')}
                                        onClick={(e) => {
                                            inputRef.current.focus();
                                        }}
                                    >
                                        {CmtIcon}
                                    </div>
                                    <div className={cx('icon')}>{ShareIcon}</div>
                                </div>
                                <div
                                    className={cx('icon', 'save-icon')}
                                    onClick={(e) => {
                                        setSaved(!saved);
                                    }}
                                >
                                    {saved === true ? SavedIcon : SaveIcon}
                                </div>
                            </div>
                            <div
                                className={cx('number-of-like')}
                                onClick={(e) => {
                                    setHideLikedsModal(false);
                                }}
                            >
                                {likedsList ? likedsList.length : 0} lượt thích
                            </div>
                            <p className={cx('time-post')}>{time}</p>
                        </div>
                        <div className={cx('upload-cmt-wrapper')}>
                            <span>{EmotionIcon}</span>
                            <input
                                ref={inputRef}
                                type="text"
                                placeholder="Thêm bình luận..."
                                value={comment}
                                onChange={(e) => {
                                    setComment(e.target.value);
                                }}
                                onKeyDown={(e) => {
                                    if (e.code === 'Enter') {
                                        if (comment.length === 0) return;
                                        else handleUploadComment();
                                    }
                                }}
                            />
                            <button onClick={handleUploadComment} disabled={comment.length === 0}>
                                Đăng
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default PostDetail;
