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

import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { onSnapshot, doc, collection, orderBy, query, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import { UserAuth } from '../Context/AuthContext';

const cx = classNames.bind(styles);

function Post({ post }) {
    const [liked, setLiked] = useState(false);
    const [saved, setSaved] = useState(false);
    const [time, setTime] = useState('');
    const [avatar, setAvatar] = useState('');
    const [muted, setMuted] = useState(true);
    const [pause, setPause] = useState(true);

    const [username, setUsername] = useState('');
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState([]);

    const videoRef = useRef();
    const { user } = UserAuth();

    const responsive = {
        desktop: {
            breakpoint: { max: 3000, min: 1024 },
            items: 1,
            slidesToSlide: 1, // optional, default to 1.
        },
        tablet: {
            breakpoint: { max: 1024, min: 464 },
            items: 1,
            slidesToSlide: 1, // optional, default to 1.
        },
        mobile: {
            breakpoint: { max: 464, min: 0 },
            items: 1,
            slidesToSlide: 1, // optional, default to 1.
        },
    };

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

        return () => {
            unsubcribe();
            unsubcribe2();
        };
    }, [user?.email, post?.id]);

    const handleUploadComment = (e) => {
        addDoc(collection(db, `posts/${post?.id}/comments`), {
            timestampSecond: Math.floor(Date.now() / 1000),
            timestamp: serverTimestamp(),
            comment: comment,
            username: username,
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

    return (
        <div className={cx('wrapper')}>
            <div className={cx('user')}>
                <Account
                    name={post?.username}
                    img={
                        avatar ||
                        'http://phunuvietnam.mediacdn.vn/media/news/33abffcedac43a654ac7f501856bf700/anh-profile-tiet-lo-g-ve-ban-1.jpg'
                    }
                    // story
                />
                <i className={cx('post-option')}>{ThreeDotsIcon}</i>
            </div>
            <div className={cx('files-slider')} onDoubleClick={(e) => setLiked(true)}>
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
                    <Carousel responsive={responsive} showDots={true}>
                        {post?.url.map((file, index) => {
                            if (file.type.includes('image')) {
                                return (
                                    <div
                                        key={file.src}
                                        style={{ height: '100%' }}
                                        className={'item-wrapper'}
                                        onDoubleClick={(e) => setLiked(true)}
                                    >
                                        <img src={file.src} alt="post img" />
                                    </div>
                                );
                            } else if (file.type.includes('video')) {
                                return (
                                    <div className={cx('video-container')} key={file.src}>
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
                                );
                            } else {
                                return <p key={index}>Hinh anh hoac video bi loi!</p>;
                            }
                        })}
                    </Carousel>
                )}
            </div>
            <div className={cx('info')}>
                <div className={cx('icons-container')}>
                    <div className={cx('icons-left')}>
                        <div className={cx('icon')} onClick={(e) => setLiked(!liked)}>
                            {liked === true ? LikedIcon : LikeIcon}
                        </div>
                        <div className={cx('icon')}>{CmtIcon}</div>
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
                {/* <div className={cx('number-of-like')}>123.123 lượt thích</div> */}
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
