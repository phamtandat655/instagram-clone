import classNames from 'classnames/bind';
import styles from './Explore.module.scss';

import { useState, useEffect } from 'react';
import { onSnapshot, collection } from 'firebase/firestore';
import { db } from '../../firebase';

import { ListIcon } from '../../assets/Icons/Icons';
import { useNavigate, useParams } from 'react-router-dom';

const cx = classNames.bind(styles);

function Explore() {
    const [posts, setPosts] = useState([]);

    const nav = useNavigate();
    const { email } = useParams();

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
    }, [email]);

    return (
        <div className={cx('wrapper')}>
            <div className={cx('post')}>
                {posts &&
                    posts.map((post, index) => {
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
