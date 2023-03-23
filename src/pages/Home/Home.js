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

const cx = classNames.bind(styles);

function Home({ setPage }) {
    const { posts } = UseFireBase();

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
                <div className={cx('post-container')}>
                    {posts && posts.map((post) => <Post key={post.id} post={post} setPage={setPage} />)}
                </div>
            </div>
            <div className={cx('recommend')}></div>
        </div>
    );
}

export default Home;
