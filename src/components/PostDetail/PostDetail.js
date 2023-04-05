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
    VolumeIcon,
    VolumeMutedIcon,
    PlayIcon,
} from '../../assets/Icons/Icons';
import PostOption from '../PostOption/PostOption';
import { useRef, useState, useEffect, Fragment } from 'react';
import Comment from '../Comment/Comment';
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

const cx = classNames.bind(styles);

function PostDetail({ setPage, page, setIdpost, pathname }) {
    const [saved, setSaved] = useState(false);
    const [avatar, setAvatar] = useState('');
    const [muted, setMuted] = useState(true);
    const [pause, setPause] = useState(true);

    const [myFollowings, setMyFollowings] = useState([]);
    const [users, setUsers] = useState([]);
    const [hideLikedsModal, setHideLikedsModal] = useState(true);
    const [likedsList, setLikedsList] = useState([]);
    const [username, setUsername] = useState('');
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState([]);
    const { user } = UserAuth();
    const { idPost } = useParams();
    const [post, setPost] = useState({});
    const [time, setTime] = useState('');
    const [hidePostOption, setHidePostOption] = useState(true);

    useEffect(() => {
        const timestamp = {
            seconds: post?.timestampSecond || '',
        };
        const postDate = new Date(timestamp.seconds * 1000);
        const nowDate = new Date();

        if (
            nowDate.getFullYear() === postDate.getFullYear() &&
            nowDate.getMonth() === postDate.getMonth() &&
            nowDate.getDate() === postDate.getDate()
        ) {
            if (nowDate.getHours() === postDate.getHours()) {
                if (nowDate.getMinutes() === postDate.getMinutes()) {
                    setTime(`${nowDate.getMinutes() - postDate.getMinutes()} giay truoc`);
                } else setTime(`${nowDate.getMinutes() - postDate.getMinutes()} phut truoc`);
            } else setTime(`${nowDate.getHours() - postDate.getHours()} gio truoc`);
        } else if (
            nowDate.getFullYear() === postDate.getFullYear() &&
            nowDate.getMonth() !== postDate.getMonth() &&
            nowDate.getDate() !== postDate.getDate()
        ) {
            setTime(`THANG ${postDate.getMonth()} ${postDate.getDate()}`);
        } else {
            setTime(`NAM ${postDate.getFullYear()} THANG ${postDate.getMonth()} ${postDate.getDate()}`);
        }
    }, [post?.timestampSecond]);

    useEffect(() => {
        let path = pathname.slice(1) === '' ? 'home' : pathname.slice(1);
        if (path === idPost) {
            setIdpost(idPost);
            setPage(page);
        }
    });

    useEffect(() => {
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

        onSnapshot(doc(db, 'users', `${user?.email}`), (doc) => {
            setMyFollowings(doc.data()?.follows);
        });

        onSnapshot(doc(db, 'posts', `${idPost}`), (doc) => {
            setPost(doc.data());
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
            setAvatar(doc.data()?.information.avatar);
        });
    }, [post?.useremail]);

    const videoRef = useRef();
    const handleClickVideo = (e) => {
        if (videoRef.current.paused === false) {
            videoRef.current.pause();
            setPause(true);
        } else {
            videoRef.current.play();
            setPause(false);
        }
    };
    const handleVolume = (e) => {
        if (videoRef.current.muted === true) {
            setMuted(false);
        } else {
            setMuted(true);
        }
    };

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

    const nav = useNavigate();
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
                                                    name={likedUser?.information.name}
                                                    img={likedUser?.information.avatar}
                                                    lengthDesc={40}
                                                    followings={myFollowings}
                                                    email={likedUser?.information.email}
                                                    follow={
                                                        myFollowings.includes(likedUser?.information.email) ||
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
            {isEmpty(post) === false && (
                <div
                    className={cx('container')}
                    onClick={(e) => {
                        e.stopPropagation();
                    }}
                >
                    <div className={cx('slider-wrapper')} onDoubleClick={handleDoubleClickLike}>
                        {post?.url.length === 1 ? (
                            post?.url[0].type.includes('image') ? (
                                <div>
                                    <img src={post?.url[0].src} alt="post img" />
                                </div>
                            ) : (
                                <div className={cx('video-container')}>
                                    {pause === true && (
                                        <p
                                            className={cx('pause-icon')}
                                            onClick={handleClickVideo}
                                            onDoubleClick={(e) => e.stopPropagation()}
                                        >
                                            {PlayIcon}
                                        </p>
                                    )}
                                    <p
                                        className={cx('volume-icon')}
                                        onClick={handleVolume}
                                        onDoubleClick={(e) => e.stopPropagation()}
                                    >
                                        {muted ? VolumeMutedIcon : VolumeIcon}
                                    </p>
                                    <video
                                        ref={videoRef}
                                        width="400"
                                        onClick={handleClickVideo}
                                        loop
                                        muted={muted}
                                        className={cx('video')}
                                    >
                                        <source src={post?.url[0].src} type="video/mp4" />
                                    </video>
                                </div>
                            )
                        ) : (
                            <Swiper
                                modules={[Navigation, Pagination]}
                                slidesPerView={1}
                                navigation
                                pagination={{ clickable: true }}
                                onDoubleClick={handleDoubleClickLike}
                            >
                                {post?.url.map((file, index) => {
                                    if (file.type.includes('image')) {
                                        return (
                                            <SwiperSlide
                                                key={file.src}
                                                style={{ height: '100%' }}
                                                className={'item-wrapper'}
                                            >
                                                <img src={file.src} alt="post img" />
                                            </SwiperSlide>
                                        );
                                    } else if (file.type.includes('video')) {
                                        return (
                                            <SwiperSlide key={file.src}>
                                                <div className={cx('video-container')}>
                                                    <div className={cx('video-wrapper')}>
                                                        {pause === true && (
                                                            <p
                                                                className={cx('pause-icon')}
                                                                onClick={handleClickVideo}
                                                                onDoubleClick={(e) => e.stopPropagation()}
                                                            >
                                                                {PlayIcon}
                                                            </p>
                                                        )}
                                                        <p
                                                            className={cx('volume-icon')}
                                                            onClick={handleVolume}
                                                            onDoubleClick={(e) => e.stopPropagation()}
                                                        >
                                                            {muted ? VolumeMutedIcon : VolumeIcon}
                                                        </p>
                                                        <video
                                                            ref={videoRef}
                                                            width="400"
                                                            // autoPlay
                                                            onClick={handleClickVideo}
                                                            loop
                                                            muted={muted}
                                                            className={cx('video')}
                                                        >
                                                            <source src={file.src} type="video/mp4" />
                                                        </video>
                                                    </div>
                                                </div>
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
                        <div className={cx('account-wrapper')} onClick={handleClickAccount}>
                            <Account name={post?.username} img={avatar} />
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
