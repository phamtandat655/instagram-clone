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

import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { onSnapshot, doc, collection, orderBy, query, addDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { UserAuth } from '../../Context/AuthContext';

const cx = classNames.bind(styles);

function Post({ post, setPage }) {
    const [saved, setSaved] = useState(false);
    const [time, setTime] = useState('');
    const [avatar, setAvatar] = useState('');
    const [muted, setMuted] = useState(true);
    const [pause, setPause] = useState(true);

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
        onSnapshot(doc(db, 'users', `${post?.useremail}`), (doc) => {
            setAvatar(doc.data()?.information.avatar);
        });
    }, [post?.useremail]);

    useEffect(() => {
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
    useEffect(() => {
        if (post?.url[0]?.type === 'video' && pause === true) {
            const srollEvent = window.addEventListener('scroll', () => {
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
            });

            return () => srollEvent;
        }
    }, [post?.url, pause]);

    const handleClickAccount = (e) => {
        setPage(`personalpage/${post?.useremail}`);
        nav(`/personalpage/${post?.useremail}`);
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
                <i className={cx('post-option')}>{ThreeDotsIcon}</i>
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
                <div className={cx('number-of-like')}>{likedsList ? likedsList.length : 0} lượt thích</div>
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
                />
                <button onClick={handleUploadComment}>Đăng</button>
            </div>
        </div>
    );
}

export default Post;
