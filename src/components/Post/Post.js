import classNames from 'classnames/bind';
import Account from '../Account/Account';
import styles from './Post.module.scss';
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

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import '../../swiper.scss';

import { useEffect, useRef, useState, Fragment } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { onSnapshot, doc, collection, orderBy, query, addDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { UserAuth } from '../../Context/AuthContext';
import PostOption from '../PostOption/PostOption';

const cx = classNames.bind(styles);

function Post({ post, setPage }) {
    const [saved, setSaved] = useState(false);
    const [time, setTime] = useState('');
    const [avatar, setAvatar] = useState('');
    const [muted, setMuted] = useState(true);
    const [pause, setPause] = useState(true);
    const [hideLikedsModal, setHideLikedsModal] = useState(true);
    const [hidePostOption, setHidePostOption] = useState(true);
    const [users, setUsers] = useState([]);
    const [myFollowings, setMyFollowings] = useState([]);

    const [username, setUsername] = useState('');
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState([]);
    const [likedsList, setLikedsList] = useState([]);

    const videoRef = useRef();
    const { user } = UserAuth();
    const nav = useNavigate();

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
        onSnapshot(doc(db, 'users', `${post?.useremail}`), (doc) => {
            setAvatar(doc.data()?.information.avatar);
        });
    }, [post?.useremail]);

    useEffect(() => {
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

        const q = query(collection(db, `posts/${post?.id}/comments`), orderBy('timestamp', 'desc'));
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

        const unsubcribe3 = onSnapshot(doc(db, 'posts', `${post?.id}`), (doc) => {
            setLikedsList(doc.data()?.likeds);
        });

        return () => {
            unsubcribe();
            unsubcribe2();
            unsubcribe3();
        };
    }, [user?.email, post?.id]);

    const handleUploadComment = (e) => {
        addDoc(collection(db, `posts/${post?.id}/comments`), {
            timestampSecond: Math.floor(Date.now() / 1000),
            timestamp: serverTimestamp(),
            comment: comment,
            username: username,
            useremail: user?.email,
        });
        setComment('');
    };

    const handleDesc = (desc) => {
        if (desc.length > 50) {
            return (
                <p>
                    {desc.slice(0, 50)}
                    <br />
                    <br />
                    ...<Link to="#">Xem thêm</Link>
                </p>
            );
        }
        return <p>{desc}</p>;
    };

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

    const handleScroll = () => {
        let isElInViewPort = (el) => {
            let rect = el.getBoundingClientRect();
            let viewHeight = window.innerHeight || document.documentElement.clientHeight;

            return (
                (rect.top <= 200 && rect.bottom >= 200) ||
                (rect.bottom >= viewHeight - 200 && rect.top <= viewHeight - 200) ||
                (rect.top >= 200 && rect.bottom <= viewHeight - 200)
            );
        };
        if (isElInViewPort(videoRef.current)) {
            videoRef.current.play();
            setPause(false);
        } else {
            videoRef.current.pause();
            setPause(true);
        }
    };
    useEffect(() => {
        if (post?.url[0]?.type === 'video' && pause === true) {
            window.addEventListener('scroll', handleScroll);

            return () => window.removeEventListener('scroll', handleScroll);
        }
    }, [post?.url, pause]);

    const handleClickAccount = (e) => {
        setPage(`personalPage/${post?.useremail}`);
        nav(`/personalPage/${post?.useremail}`);
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
        const docRef = doc(db, 'posts', `${post?.id}`);
        await updateDoc(docRef, {
            likeds: [...likedsList, user?.email],
        });
    };

    const handleUnLikePost = async () => {
        const docRef = doc(db, 'posts', `${post?.id}`);
        let newLikeds = likedsList.filter((likedIdPost) => likedIdPost !== user?.email);
        await updateDoc(docRef, {
            likeds: [...newLikeds],
        });
    };

    return (
        <div className={cx('wrapper')}>
            {hideLikedsModal === false && (
                <div
                    className={cx('likeds-modal')}
                    onClick={(e) => {
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
            {hidePostOption === false && (
                <PostOption
                    post={post}
                    ownPost={post?.useremail === user?.email ? true : false}
                    setHidePostOption={setHidePostOption}
                    followings={myFollowings}
                />
            )}
            <div className={cx('user')}>
                <span onClick={handleClickAccount}>
                    <Account
                        name={post?.username}
                        img={
                            avatar ||
                            'http://phunuvietnam.mediacdn.vn/media/news/33abffcedac43a654ac7f501856bf700/anh-profile-tiet-lo-g-ve-ban-1.jpg'
                        }
                        // story
                    />
                </span>
                <i className={cx('post-option')} onClick={(e) => setHidePostOption(false)}>
                    {ThreeDotsIcon}
                </i>
            </div>
            <div className={cx('files-slider')}>
                {post?.url.length === 1 ? (
                    post?.url[0].type.includes('image') ? (
                        <div>
                            <img src={post?.url[0].src} alt="post img" onDoubleClick={handleDoubleClickLike} />
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
                                // autoPlay
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
                                    <SwiperSlide key={file.src} style={{ height: '100%' }} className={'item-wrapper'}>
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
                                return <SwiperSlide key={index}>Hinh anh hoac video bi loi!</SwiperSlide>;
                            }
                        })}
                    </Swiper>
                )}
            </div>
            <div className={cx('info')}>
                <div className={cx('icons-container')}>
                    <div className={cx('icons-left')}>
                        <div className={cx('icon')} onClick={handleClickLike}>
                            {likedsList && likedsList.includes(user?.email) === true ? LikedIcon : LikeIcon}
                        </div>
                        <div
                            className={cx('icon')}
                            onClick={(e) => {
                                nav(`/${post?.id}`);
                            }}
                        >
                            {CmtIcon}
                        </div>
                        <div className={cx('icon')}>{ShareIcon}</div>
                    </div>
                    <div
                        className={cx('icon')}
                        onClick={(e) => {
                            setSaved(!saved);
                        }}
                    >
                        {saved === true ? SavedIcon : SaveIcon}
                    </div>
                </div>
                <div className={cx('number-of-like')} onClick={(e) => setHideLikedsModal(false)}>
                    {likedsList ? likedsList.length : 0} lượt thích
                </div>
                <div className={cx('caption')}>
                    <p className={cx('caption-user')}>{post?.username}</p>
                    {handleDesc(post?.caption)}
                </div>
                <Link className={cx('see-all-cmt')} to={`/${post?.id}`}>
                    <p>Xem tất cả {comments && comments.length} bình luận</p>
                </Link>
                <p className={cx('time-post')}>{time}</p>
            </div>
            <div className={cx('comment')}>
                <span>{EmotionIcon}</span>
                <input
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
    );
}

export default Post;
