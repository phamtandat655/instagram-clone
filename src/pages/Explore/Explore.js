import classNames from 'classnames/bind';
import styles from './Explore.module.scss';

import { useState, useEffect, Fragment } from 'react';
import { onSnapshot, collection } from 'firebase/firestore';
import { db } from '../../firebase';

import { ListIcon } from '../../assets/Icons/Icons';
import { useNavigate } from 'react-router-dom';

const cx = classNames.bind(styles);

function Explore() {
    const [posts, setPosts] = useState([]);
    const [indexPostObserved, setIndexPostObserved] = useState(15);

    const nav = useNavigate();

    useEffect(() => {
        const unsubcribe = onSnapshot(collection(db, 'posts'), (snapshot) => {
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

    const handleScroll = (e) => {
        const scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight;
        const clientHeight = document.documentElement.clientHeight;

        const percentage = Math.floor((scrollTop / (scrollHeight - clientHeight)) * 100);
        if (percentage >= 90) {
            setIndexPostObserved((prevIndex) => prevIndex + 9);
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);

        return () => window.removeEventListener('scroll', handleScroll);
    });

    return (
        <div className={cx('wrapper')}>
            <div className={cx('post-list')}>
                {posts &&
                    posts.map((post, index) => {
                        if (index >= indexPostObserved) {
                            return <Fragment key={index}></Fragment>;
                        }
                        if (post?.url[0].type.includes('image')) {
                            return (
                                <div
                                    key={post?.id}
                                    className={cx('post-wrapper', 'img-wrapper')}
                                    onClick={(e) => {
                                        nav(`/${post?.id}`);
                                    }}
                                >
                                    {post?.url.length > 1 && <i className={cx('listPost-icon')}>{ListIcon}</i>}
                                    <img alt="post-img" src={post?.url[0].src} />
                                </div>
                            );
                        } else {
                            return (
                                <div
                                    key={post?.id}
                                    className={cx('post-wrapper', 'video-wrapper')}
                                    onClick={(e) => {
                                        nav(`/${post?.id}`);
                                    }}
                                >
                                    {post?.url.length > 1 && <i className={cx('listPost-icon')}>{ListIcon}</i>}
                                    <video width="290" muted className={cx('video')}>
                                        <source src={post?.url[0].src} type="video/mp4" />
                                    </video>
                                </div>
                            );
                        }
                    })}
            </div>
        </div>
    );
}

export default Explore;
