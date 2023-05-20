import classNames from 'classnames/bind';
import styles from './SwipperStory.module.scss';
import PostVideo from '../PostVideo/PostVideo';

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import '../../swiper.scss';
import { useEffect, useRef } from 'react';
import { db } from '../../firebase';
import { doc, deleteDoc } from 'firebase/firestore';
// import { getStorage } from 'firebase/storage';
// , ref, deleteObject

import { useNavigate } from 'react-router-dom';

const cx = classNames.bind(styles);

function SwipperStory({ usersStory, pause, setShowStory, showStory }) {
    const swiperRef = useRef(null);

    const nav = useNavigate();
    // const storage = getStorage();

    useEffect(() => {
        if (!showStory) {
            swiperRef.current.swiper.autoplay.stop();
        } else {
            swiperRef.current.swiper.autoplay.start();
        }

        if (pause === true) {
            swiperRef.current.swiper.autoplay.stop();
        } else {
            swiperRef.current.swiper.autoplay.start();
        }
    }, [pause, showStory]);

    let post;
    if (usersStory.length > 0) {
        post = usersStory;
    } else {
        post = usersStory[0];
    }

    useEffect(() => {
        if (usersStory.length > 0) {
            usersStory.forEach((post) => {
                const postDate = new Date(post.timestampSecond * 1000);
                const nowDate = new Date();

                // get total seconds between the times
                let delta = Math.abs(nowDate - postDate) / 1000;
                // calculate (and subtract) whole days
                let days = Math.floor(delta / 86400);

                if (days >= 1) {
                    handleDeleteStory(post);
                }
            });
        } else {
            usersStory[0].forEach((post) => {
                const postDate = new Date(post.timestampSecond * 1000);
                const nowDate = new Date();

                // get total seconds between the times
                let delta = Math.abs(nowDate - postDate) / 1000;
                // calculate (and subtract) whole days
                let days = Math.floor(delta / 86400);

                if (days >= 1) {
                    handleDeleteStory(post);
                }
            });
        }
    }, [usersStory]);

    const handleDeleteStory = async (post) => {
        nav(`/`);
        await deleteDoc(doc(db, 'stories', `${post?.id}`));
        // để xóa hình ảnh trong story nhưng nếu nhiều người đăng ảnh giống nhau sẽ bị xóa mất luôn ảnh của những ng đăng sau
        // post?.url.forEach((url) => {
        //     // Create a reference to the file to delete
        //     const desertRef = ref(storage, `files/${url.src.split('files%2F')[1].split('?alt')[0]}`);
        //     // Delete the file
        //     deleteObject(desertRef)
        //         .then(() => {
        //             // File deleted successfully
        //             console.log('xoa files thanh cong !');
        //         })
        //         .catch((error) => {
        //             // Uh-oh, an error occurred!
        //             console.log(error);
        //         });
        // });
    };

    const handleTimeStory = (timestampSecond) => {
        const timestamp = {
            seconds: timestampSecond || '',
        };
        const postDate = new Date(timestamp.seconds * 1000);
        const nowDate = new Date();

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
        let seconds = Math.round(delta % 60);

        if (days < 1) {
            if (hours < 1) {
                if (minutes < 1) {
                    return `${seconds} GIÂY TRƯỚC`;
                } else {
                    return `${minutes} PHÚT TRƯỚC`;
                }
            } else {
                return `${hours} GIỜ TRƯỚC`;
            }
        } else {
            return `${days} NGÀY TRƯỚC`;
        }
    };

    if (usersStory) {
        return (
            <div className={cx('files-slider')}>
                <Swiper
                    ref={swiperRef}
                    className={cx('mySwiper')}
                    slidesPerView={1}
                    pagination={{
                        type: 'progressbar',
                    }}
                    navigation={true}
                    modules={[Pagination, Navigation, Autoplay]}
                    autoplay={{
                        delay: 3000,
                        disableOnInteraction: false,
                    }}
                    // onReachEnd={() => {
                    // console.log('reach end');
                    // }}
                >
                    {usersStory.length > 0
                        ? usersStory.map((post) => {
                              return post?.url.map((file, index) => {
                                  if (file.type.includes('image')) {
                                      return (
                                          <SwiperSlide
                                              key={file.src}
                                              style={{ height: '100%' }}
                                              className={'item-wrapper'}
                                          >
                                              <p className={cx('timer')}>{handleTimeStory(post?.timestampSecond)}</p>
                                              <img src={file.src} alt="post img" />
                                          </SwiperSlide>
                                      );
                                  } else if (file.type.includes('video')) {
                                      return (
                                          <SwiperSlide key={file.src}>
                                              <p className={cx('timer')}>{handleTimeStory(post?.timestampSecond)}</p>
                                              <PostVideo post={post} file={file} />
                                          </SwiperSlide>
                                      );
                                  } else {
                                      return <SwiperSlide key={index}>Hinh anh hoac video bi loi!</SwiperSlide>;
                                  }
                              });
                          })
                        : post?.url.map((file, index) => {
                              if (file.type.includes('image')) {
                                  return (
                                      <SwiperSlide key={file.src} style={{ height: '100%' }} className={'item-wrapper'}>
                                          <p className={cx('timer')}>{handleTimeStory(post?.timestampSecond)}</p>
                                          <img src={file.src} alt="post img" />
                                      </SwiperSlide>
                                  );
                              } else if (file.type.includes('video')) {
                                  return (
                                      <SwiperSlide key={file.src}>
                                          <p className={cx('timer')}>{handleTimeStory(post?.timestampSecond)}</p>
                                          <PostVideo post={post} file={file} />
                                      </SwiperSlide>
                                  );
                              } else {
                                  return <SwiperSlide key={index}>Hinh anh hoac video bi loi!</SwiperSlide>;
                              }
                          })}
                </Swiper>
            </div>
        );
    } else {
        return <p className={cx('invalidStory')}>Story không còn tồn tại !</p>;
    }
}

export default SwipperStory;
