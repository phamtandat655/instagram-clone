// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import '../../swiper.scss';

import styles from './Home.module.scss';
import classNames from 'classnames/bind';
import { UseFireBase } from '../../Context/FireBaseContext';
import { useNavigate } from 'react-router-dom';
import React, { Fragment, useEffect, useMemo, useState } from 'react';
import { UserAuth } from '../../Context/AuthContext';
import { onSnapshot, doc } from 'firebase/firestore';
import { db } from '../../firebase';
import confirmIcon from '../../assets/image/illo-confirm-refresh-light.png';

import Account from '../../components/Account/Account';
import Post from '../../components/Post/Post';
import Story from '../../components/Story/Story';
import ShowStory from '../../components/ShowStory/ShowStory';

const cx = classNames.bind(styles);

function Home() {
    const { posts, stories } = UseFireBase();
    const nav = useNavigate();
    const [followings, setFollowings] = useState([]);
    const [indexPostObserved, setIndexPostObserved] = useState(8);
    const { user } = UserAuth();
    const { users } = UseFireBase();
    const [userEmailStory, setUserEmailStory] = useState('');
    const [showStory, setShowStory] = useState(false);

    useEffect(() => {
        onSnapshot(doc(db, 'users', `${user?.email}`), (doc) => {
            setFollowings(doc.data()?.follows);
        });
    }, [user?.email]);

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

    // tìm list user đăng story (và user không bị trùng lặp)
    let uniqueUser = [
        ...new Set(
            stories.map((story) => {
                return story.useremail;
            }),
        ),
    ];

    // tìm những cái story chứa thông tin của từng người ở trên (và thông tin của từng user không bị trùng lặp)
    let userUploadStory = [];
    for (let i of stories) {
        // nếu thông tin user chưa có trong mảng thì thêm còn có rồi thì ko thêm lại
        if (!userUploadStory.find((story) => uniqueUser.includes(story.useremail) && story.useremail === i.useremail)) {
            userUploadStory = userUploadStory.concat(i);
        }
        if (userUploadStory.length > 0) {
            // lấy ra những story của những người đang theo dõi mình hoặc của chính mình
            userUploadStory = [
                ...userUploadStory.filter((userUpload) => {
                    return (
                        followings.find((fl) => fl?.User.information.email === userUpload?.useremail) ||
                        user?.email === userUpload?.useremail
                    );
                }),
            ];
        }
    }

    // loc ra nhung bai post cua nhung nguoi dang follow
    let allFollowedPost = useMemo(() => {
        if (followings && posts) {
            return posts.filter((post) => {
                return (
                    followings.find((following) => following?.User?.information.email === post?.useremail) ||
                    user?.email === post?.useremail
                );
            });
        }
        return null;
    }, [followings, posts, user?.email]);

    // loc recomendUsers
    let recommendUsers = useMemo(() => {
        if (followings && users) {
            return users.filter((u) => {
                return (
                    !followings.find((following) => following?.User?.information?.email === u?.information?.email) &&
                    u?.information?.email !== user?.email
                );
            });
        }
        return null;
    }, [users, followings, user?.email]);

    let count = 1;

    return (
        <div className={cx('wrapper')}>
            {userEmailStory && (
                <ShowStory
                    showStory={showStory}
                    setShowStory={setShowStory}
                    usersStory={stories.filter((story) => {
                        return story.useremail === userEmailStory;
                    })}
                />
            )}
            <div className={cx('newsfeed')}>
                <div className={cx('story-wrapper', { hide: userUploadStory <= 0 })}>
                    <Swiper
                        spaceBetween={30}
                        modules={[Navigation]}
                        slidesPerView={6}
                        navigation
                        className={cx('story-container')}
                    >
                        {userUploadStory.map((userUpload, index) => {
                            return (
                                <SwiperSlide key={index}>
                                    <Story
                                        name={userUpload?.username}
                                        email={userUpload?.useremail}
                                        img={userUpload.useravatar}
                                        setShowStory={setShowStory}
                                        setUserEmailStory={setUserEmailStory}
                                    />
                                </SwiperSlide>
                            );
                        })}
                    </Swiper>
                </div>
                <div className={cx('post-container')}>
                    {allFollowedPost &&
                        followings &&
                        allFollowedPost.map((post, index) => {
                            if (index > indexPostObserved) {
                                return <Fragment key={index}></Fragment>;
                            } else if (index === allFollowedPost.length - 1) {
                                return (
                                    <Fragment key={post?.id}>
                                        <Post post={post} />
                                        <div className={cx('confirm-icon-wrapper')}>
                                            <img src={confirmIcon} alt="confirm-icon" />
                                            <p>Bạn đã xem hết rồi !</p>
                                            <p className={cx('see-more-post')}>
                                                Bạn có muốn xem thêm những bài viết thú vị ?{' '}
                                                <span onClick={(e) => nav('/explore')}>Tại đây</span>
                                            </p>
                                        </div>
                                    </Fragment>
                                );
                            }
                            return <Post key={post?.id} post={post} />;
                        })}
                    {allFollowedPost && followings && allFollowedPost.length === 0 && (
                        <div className={cx('confirm-icon-wrapper', 'dontHaveAnyPost')}>
                            {/* <img src={confirmIcon} alt="confirm-icon" /> */}
                            <p>Hiện tại không có bài viết nào !</p>
                            <p className={cx('see-more-post')}>
                                Bạn có muốn khám phá những bài viết thú vị ?{' '}
                                <span onClick={(e) => nav('/explore')}>Tại đây</span>
                            </p>
                        </div>
                    )}
                </div>
            </div>
            <div className={cx('recommend')}>
                <div className={cx('recommend--header-wrapper')}>
                    <span className={cx('recommend--header')}>Gợi ý cho bạn</span>
                    <span
                        className={cx('recommend--see-all')}
                        onClick={(e) => {
                            nav('/recommendUsers');
                        }}
                    >
                        Xem tất cả
                    </span>
                </div>
                <div className={cx('recommend--users')}>
                    {recommendUsers &&
                        recommendUsers.map((u, index) => {
                            if (count > 5) {
                                return <div key={index} className={cx('hide')}></div>;
                            } else {
                                count++;
                                return (
                                    <div
                                        key={index}
                                        className={cx('recommend--user-wrapper')}
                                        onClick={(e) => {
                                            nav(`/personalPage/${u?.information?.email}`);
                                        }}
                                    >
                                        <Account
                                            userAccount={u}
                                            note="Gợi ý cho bạn"
                                            follow
                                            followings={followings}
                                            recommend="recommend-home"
                                        />
                                    </div>
                                );
                            }
                        })}
                </div>
            </div>
        </div>
    );
}

export default Home;
