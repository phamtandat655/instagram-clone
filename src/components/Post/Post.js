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
} from '../../assets/Icons/Icons';

import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const cx = classNames.bind(styles);

function Post({ post }) {
    const [liked, setLiked] = useState(false);
    const [saved, setSaved] = useState(false);
    const [time, setTime] = useState('');

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
            nanoseconds: post?.timestamp.nanoseconds,
            seconds: post?.timestamp.seconds,
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
            setTime(`THANG ${nowDate.getMonth() - postDate.getMonth()}${nowDate.getDate() - postDate.getDate()}`);
        } else {
            setTime(
                `NAM ${nowDate.getFullYear() - postDate.getFullYear()} THANG ${
                    nowDate.getMonth() - postDate.getMonth()
                }${nowDate.getDate() - postDate.getDate()}`,
            );
        }
    }, []);

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

    return (
        <div className={cx('wrapper')}>
            <div className={cx('user')}>
                <Account
                    name={post?.username}
                    img="http://phunuvietnam.mediacdn.vn/media/news/33abffcedac43a654ac7f501856bf700/anh-profile-tiet-lo-g-ve-ban-1.jpg"
                    story
                />
                <i className={cx('post-option')}>{ThreeDotsIcon}</i>
            </div>
            <div className={cx('img-slider')} onDoubleClick={(e) => setLiked(true)}>
                {Array.isArray(post?.imageUrl) === false ? (
                    <div>
                        <img src={post?.imageUrl} alt="post img" />
                    </div>
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
