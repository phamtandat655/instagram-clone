import styles from './Home.module.scss';
import classNames from 'classnames/bind';
import Story from '../../components/Story/Story';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronCircleLeft, faChevronCircleRight } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useRef, useState } from 'react';
import Post from '../../components/Post/Post';

import { db } from '../../firebase';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';

const cx = classNames.bind(styles);

function Home() {
    const [hideScrollLeft, setHideScrollLeft] = useState(true);
    const [hideScrollRight, setHideScrollRight] = useState(false);
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const q = query(collection(db, 'posts'), orderBy('timestamp', 'desc'));
        const unsubcribe = onSnapshot(q, (snapshot) => {
            let newPosts = [];
            snapshot.forEach((doc) => {
                newPosts.push({
                    id: doc.id,
                    ...doc.data(),
                });
            });
            setPosts(newPosts);
        });

        return () => unsubcribe();
    }, []);

    const storiesRef = useRef();
    const handleBtnClick = (position) => {
        if (storiesRef.current.scrollLeft <= 0) {
            setHideScrollLeft(true);
        } else {
            setHideScrollLeft(false);
        }

        // storiesRef.current.scrollWidth - storiesRef.current.clientWidth = 281
        if (
            Math.floor(storiesRef.current.scrollLeft + 2) >=
            storiesRef.current.scrollWidth - storiesRef.current.clientWidth
        ) {
            setHideScrollRight(true);
        } else {
            setHideScrollRight(false);
        }
        if (position === 'left') {
            storiesRef.current.scrollLeft -= 86;
        } else if (position === 'right') {
            storiesRef.current.scrollLeft += 86;
        }
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('newsfeed')}>
                <div className={cx('story-wrapper')}>
                    <div ref={storiesRef} className={cx('story-container')}>
                        <button
                            onClick={(e) => handleBtnClick('left')}
                            className={cx('button', 'btn-left', { hide: hideScrollLeft === true })}
                        >
                            <FontAwesomeIcon className={cx('icon')} icon={faChevronCircleLeft} />
                        </button>
                        <Story
                            name="User Name123456789"
                            img="http://phunuvietnam.mediacdn.vn/media/news/33abffcedac43a654ac7f501856bf700/anh-profile-tiet-lo-g-ve-ban-1.jpg"
                        />
                        <Story
                            name="User Name987654321"
                            img="http://phunuvietnam.mediacdn.vn/media/news/33abffcedac43a654ac7f501856bf700/anh-profile-tiet-lo-g-ve-ban-1.jpg"
                        />
                        <Story
                            name="User Name"
                            img="http://phunuvietnam.mediacdn.vn/media/news/33abffcedac43a654ac7f501856bf700/anh-profile-tiet-lo-g-ve-ban-1.jpg"
                        />
                        <Story
                            name="User Name"
                            img="http://phunuvietnam.mediacdn.vn/media/news/33abffcedac43a654ac7f501856bf700/anh-profile-tiet-lo-g-ve-ban-1.jpg"
                        />
                        <Story
                            name="User Name"
                            img="http://phunuvietnam.mediacdn.vn/media/news/33abffcedac43a654ac7f501856bf700/anh-profile-tiet-lo-g-ve-ban-1.jpg"
                        />
                        <Story
                            name="User Name"
                            img="http://phunuvietnam.mediacdn.vn/media/news/33abffcedac43a654ac7f501856bf700/anh-profile-tiet-lo-g-ve-ban-1.jpg"
                        />
                        <Story
                            name="User Name"
                            img="http://phunuvietnam.mediacdn.vn/media/news/33abffcedac43a654ac7f501856bf700/anh-profile-tiet-lo-g-ve-ban-1.jpg"
                        />
                        <Story
                            name="User Name"
                            img="http://phunuvietnam.mediacdn.vn/media/news/33abffcedac43a654ac7f501856bf700/anh-profile-tiet-lo-g-ve-ban-1.jpg"
                        />
                        <Story
                            name="User Name"
                            img="http://phunuvietnam.mediacdn.vn/media/news/33abffcedac43a654ac7f501856bf700/anh-profile-tiet-lo-g-ve-ban-1.jpg"
                        />
                        <button
                            onClick={(e) => handleBtnClick('right')}
                            className={cx('button', 'btn-right', { hide: hideScrollRight === true })}
                        >
                            <FontAwesomeIcon className={cx('icon')} icon={faChevronCircleRight} />
                        </button>
                    </div>
                </div>
                <div className={cx('post-container')}>
                    {posts && posts.map((post) => <Post key={post.id} post={post} />)}
                </div>
            </div>
            <div className={cx('recommend')}></div>
        </div>
    );
}

export default Home;
