import classNames from 'classnames/bind';
import styles from './PersonalPage.module.scss';

import { useState, useEffect } from 'react';
import { UserAuth } from '../../Context/AuthContext';
import { onSnapshot, doc, query, collection, orderBy } from 'firebase/firestore';
import { db } from '../../firebase';

import { ListIcon, PostIcon } from '../../assets/Icons/Icons';
import { useNavigate, useParams } from 'react-router-dom';

const cx = classNames.bind(styles);

function PersonalPage() {
    const [avatar, setAvatar] = useState();
    const [name, setName] = useState();
    const [desc, setDesc] = useState();
    const [posts, setPosts] = useState([]);
    const { user } = UserAuth();

    const nav = useNavigate();
    const { email } = useParams();

    useEffect(() => {
        onSnapshot(doc(db, 'users', `${email}`), (doc) => {
            setAvatar(doc.data()?.information.avatar);
            setName(doc.data()?.information.name);
            setDesc(doc.data()?.information.desc);
        });

        const q = query(collection(db, 'posts'), orderBy('timestamp', 'desc'));
        const unsubcribe = onSnapshot(q, (snapshot) => {
            let newPosts = [];
            snapshot.forEach((doc) => {
                newPosts.push({
                    id: doc.id,
                    ...doc.data(),
                });
            });
            newPosts = newPosts.filter((post) => post?.useremail.includes(email));
            setPosts(newPosts);
        });

        return () => unsubcribe();
    }, [email]);

    return (
        <div className={cx('wrapper')}>
            <div className={cx('personalPage-top')}>
                <div className={cx('avatar-container')}>
                    <img alt="avatar" src={avatar} />
                </div>

                <div className={cx('infomation-container')}>
                    <div className={cx('info-top')}>
                        <p className={cx('info-top--email')}>{email}</p>
                        {email === user?.email && (
                            <div
                                onClick={(e) => {
                                    nav('/account/edit');
                                }}
                            >
                                Chỉnh sửa trang cá nhân
                            </div>
                        )}
                        {/* <p className={cx('info-top--setting')}>{SettingIcon}</p> */}
                    </div>
                    <div className={cx('info-mid')}>
                        <span>0 </span>bài viết
                    </div>
                    <div className={cx('info-bottom')}>
                        <p className={cx('info-bottom--name')}>{name}</p>
                        <p>{desc}</p>
                    </div>
                </div>
            </div>
            <div className={cx('personalPage-bottom')}>
                <p className={cx('post-container', 'active')}>
                    <span className={cx('post-container--icon')}>{PostIcon}</span>
                    <span>BÀI VIẾT</span>
                </p>
                <div className={cx('post')}>
                    {posts &&
                        posts.map((post, index) => {
                            if (post?.url[0].type.includes('image')) {
                                return (
                                    <div
                                        key={post?.id}
                                        className={cx('post-wrapper')}
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
                                        className={cx('post-wrapper')}
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
        </div>
    );
}

export default PersonalPage;
