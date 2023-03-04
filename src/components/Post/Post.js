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
import { onSnapshot, doc } from 'firebase/firestore';
import { db } from '../../firebase';

const cx = classNames.bind(styles);

function Post({ post }) {
    const [liked, setLiked] = useState(false);
    const [saved, setSaved] = useState(false);
    const [time, setTime] = useState('');
    const [avatar, setAvatar] = useState('');
    const [muted, setMuted] = useState(true);
    const [pause, setPause] = useState(true);
    const videoRef = useRef();

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
    // useEffect(() => {
    //     const srollEvent = window.addEventListener('scroll', () => {
    //         let isElInViewPort = (el) => {
    //             let rect = el.getBoundingClientRect() || { top: 0, bottom: 0 };
    //             let viewHeight = window.innerHeight || document.documentElement.clientHeight;

    //             return (
    //                 (rect.top <= 0 && rect.bottom >= 0) ||
    //                 (rect.bottom >= viewHeight && rect.top <= viewHeight) ||
    //                 (rect.top >= 0 && rect.bottom <= viewHeight)
    //             );
    //         };
    //         if (isElInViewPort(videoRef.current)) {
    //             videoRef.current.play();
    //         } else {
    //             videoRef.current.pause();
    //         }
    //     });

    //     return () => srollEvent;
    // }, []);

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
            <div className={cx('img-slider')} onDoubleClick={(e) => setLiked(true)}>
                {Array.isArray(post?.url) === false ? (
                    post?.url.type === 'image' ? (
                        <div>
                            <img src={post?.url.src} alt="post img" />
                        </div>
                    ) : (
                        <div className={cx('video-container')}>
                            {pause === true && <p className={cx('pause-icon')}>{PlayIcon}</p>}
                            <p className={cx('volume-icon')} onClick={handleVolume}>
                                {muted ? VolumeMutedIcon : VolumeIcon}
                            </p>
                            <video
                                ref={videoRef}
                                width="400"
                                // autoPlay
                                onClick={handleClickVideo}
                                loop
                                muted={muted}
                            >
                                <source src={post?.url.src} type="video/mp4" />
                            </video>
                        </div>
                    )
                ) : (
                    <Carousel responsive={responsive} showDots={true}>
                        {post?.imageUrl.map((img, index) => (
                            <div key={index}>
                                <img src={img} alt="post img" />
                            </div>
                        ))}
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
                <Link className={cx('see-all-cmt')} to="#">
                    <p>Xem tất cả bình luận</p>
                </Link>
                <p className={cx('time-post')}>{time}</p>
            </div>
            <div className={cx('comment')}>
                <span>{EmotionIcon}</span>
                <input type="text" placeholder="Thêm bình luận..." />
                <button>Đăng</button>
            </div>
        </div>
    );
}

export default Post;
