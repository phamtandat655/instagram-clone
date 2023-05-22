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
import { useNavigate } from 'react-router-dom';
// import { getStorage } from 'firebase/storage';
// , ref, deleteObject

const cx = classNames.bind(styles);

function SwipperStory({ usersStory, pause, setShowStory, showStory }) {
    const swiperRef = useRef(null);
    const nav = useNavigate();

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
        nav('/');
        return <p className={cx('invalidStory')}>Story không còn tồn tại !</p>;
    }
}

export default SwipperStory;
