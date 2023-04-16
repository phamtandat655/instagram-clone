// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import '../../swiper.scss';

import styles from './Home.module.scss';
import classNames from 'classnames/bind';
import Story from '../../components/Story/Story';
import Post from '../../components/Post/Post';
import { UseFireBase } from '../../Context/FireBaseContext';
import Account from '../../components/Account/Account';
import { useNavigate } from 'react-router-dom';
import React, { Fragment, useEffect, useState } from 'react';
import { UserAuth } from '../../Context/AuthContext';
import { onSnapshot, collection, doc } from 'firebase/firestore';
import { db } from '../../firebase';

const cx = classNames.bind(styles);

function Home({ setPage }) {
    const { posts } = UseFireBase();
    const nav = useNavigate();
    const [followings, setFollowings] = useState([]);
    const [users, setUsers] = useState([]);
    const [seeAll, setSeeAll] = useState(false);
    const [indexPostObserved, setIndexPostObserved] = useState(8);
    const [loading, setLoading] = useState(true);
    const [allFollowedPost, setAllFollowedPost] = useState([]);
    const { user } = UserAuth();

    useEffect(() => {
        onSnapshot(doc(db, 'users', `${user?.email}`), (doc) => {
            setFollowings(doc.data()?.follows);
        });

        onSnapshot(collection(db, 'users'), (snapshot) => {
            let newUsers = [];
            snapshot.forEach((doc) => {
                newUsers.push({
                    id: doc.id,
                    ...doc.data(),
                });
            });
            newUsers = newUsers.filter((newuser) => newuser?.id !== user?.email);
            setUsers(newUsers);
        });
    }, [user?.email]);

    useEffect(() => {
        if (followings && posts) {
            let allNewFollowedPost = posts.filter((post) => {
                return (
                    followings.find((following) => following?.User?.information.email === post?.useremail) ||
                    user?.email === post?.useremail
                );
            });
            setAllFollowedPost(allNewFollowedPost);
            setLoading(false);
        }
    }, [followings, posts, user?.email]);

    const handleScroll = (e) => {
        const scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight;
        const clientHeight = document.documentElement.clientHeight;

        const percentage = Math.floor((scrollTop / (scrollHeight - clientHeight)) * 100);
        if (percentage >= 90) {
            setIndexPostObserved((prevIndex) => prevIndex + 2);
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);

        return () => window.removeEventListener('scroll', handleScroll);
    });

    return (
        <div className={cx('wrapper')}>
            <div className={cx('newsfeed')}>
                <div className={cx('story-wrapper')}>
                    <Swiper
                        spaceBetween={30}
                        modules={[Navigation]}
                        slidesPerView={6}
                        navigation
                        className={cx('story-container')}
                    >
                        <SwiperSlide>
                            <Story
                                name="User Name123456789"
                                img="http://phunuvietnam.mediacdn.vn/media/news/33abffcedac43a654ac7f501856bf700/anh-profile-tiet-lo-g-ve-ban-1.jpg"
                            />
                        </SwiperSlide>
                        <SwiperSlide>
                            <Story
                                name="User Name123456789"
                                img="http://phunuvietnam.mediacdn.vn/media/news/33abffcedac43a654ac7f501856bf700/anh-profile-tiet-lo-g-ve-ban-1.jpg"
                            />
                        </SwiperSlide>
                        <SwiperSlide>
                            <Story
                                name="User Name123456789"
                                img="http://phunuvietnam.mediacdn.vn/media/news/33abffcedac43a654ac7f501856bf700/anh-profile-tiet-lo-g-ve-ban-1.jpg"
                            />
                        </SwiperSlide>
                        <SwiperSlide>
                            <Story
                                name="User Name123456789"
                                img="http://phunuvietnam.mediacdn.vn/media/news/33abffcedac43a654ac7f501856bf700/anh-profile-tiet-lo-g-ve-ban-1.jpg"
                            />
                        </SwiperSlide>
                        <SwiperSlide>
                            <Story
                                name="User Name123456789"
                                img="http://phunuvietnam.mediacdn.vn/media/news/33abffcedac43a654ac7f501856bf700/anh-profile-tiet-lo-g-ve-ban-1.jpg"
                            />
                        </SwiperSlide>
                        <SwiperSlide>
                            <Story
                                name="User Name123456789"
                                img="http://phunuvietnam.mediacdn.vn/media/news/33abffcedac43a654ac7f501856bf700/anh-profile-tiet-lo-g-ve-ban-1.jpg"
                            />
                        </SwiperSlide>
                        <SwiperSlide>
                            <Story
                                name="User Name123456789"
                                img="http://phunuvietnam.mediacdn.vn/media/news/33abffcedac43a654ac7f501856bf700/anh-profile-tiet-lo-g-ve-ban-1.jpg"
                            />
                        </SwiperSlide>
                        <SwiperSlide>
                            <Story
                                name="User Name123456789"
                                img="http://phunuvietnam.mediacdn.vn/media/news/33abffcedac43a654ac7f501856bf700/anh-profile-tiet-lo-g-ve-ban-1.jpg"
                            />
                        </SwiperSlide>
                        <SwiperSlide>
                            <Story
                                name="User Name123456789"
                                img="http://phunuvietnam.mediacdn.vn/media/news/33abffcedac43a654ac7f501856bf700/anh-profile-tiet-lo-g-ve-ban-1.jpg"
                            />
                        </SwiperSlide>
                        <SwiperSlide>
                            <Story
                                name="User Name123456789"
                                img="http://phunuvietnam.mediacdn.vn/media/news/33abffcedac43a654ac7f501856bf700/anh-profile-tiet-lo-g-ve-ban-1.jpg"
                            />
                        </SwiperSlide>
                    </Swiper>
                </div>
                {loading === true ? (
                    <p className={cx('loading')}>Loading...</p>
                ) : (
                    <div className={cx('post-container')}>
                        {allFollowedPost &&
                            followings &&
                            allFollowedPost.map((post, index) => {
                                if (index > indexPostObserved) {
                                    return <Fragment key={index}></Fragment>;
                                }
                                return <Post key={post?.id} post={post} setPage={setPage} />;
                            })}
                    </div>
                )}
            </div>
            <div className={cx('recommend')}>
                <div className={cx('recommend--header-wrapper')}>
                    <span className={cx('recommend--header')}>Gợi ý cho bạn</span>
                    <span
                        className={cx('recommend--see-all')}
                        onClick={(e) => {
                            if (users?.length > 5) {
                                setSeeAll(!seeAll);
                            }
                        }}
                    >
                        {seeAll === false ? 'Xem tất cả' : 'Ẩn bớt'}
                    </span>
                </div>
                <div className={cx('recommend--users')}>
                    {followings &&
                        users &&
                        users.map((user, index) => {
                            if (seeAll === false) {
                                if (index === 5) {
                                    return <div key={index} className={cx('hide')}></div>;
                                }
                            }
                            if (!followings.find((following) => following?.User?.information.email === user?.id)) {
                                return (
                                    <div
                                        key={user?.id || index}
                                        className={cx('recommend--user-wrapper')}
                                        onClick={(e) => {
                                            nav(`/personalPage/${user?.id}`);
                                        }}
                                    >
                                        <Account
                                            name={user?.information?.name}
                                            img={user?.information?.avatar}
                                            desc="Gợi ý cho bạn"
                                            follow
                                            followings={followings}
                                            flUser={user}
                                            recommend="recommend-home"
                                        />
                                    </div>
                                );
                            }
                            return <Fragment key={index}></Fragment>;
                        })}
                </div>
            </div>
        </div>
    );
}

export default Home;
