import classNames from 'classnames/bind';
import styles from './PersonalPage.module.scss';

import { useState, useEffect } from 'react';
import { UserAuth } from '../../components/Context/AuthContext';
import { onSnapshot, doc } from 'firebase/firestore';
import { db } from '../../firebase';

import { PostIcon, SettingIcon } from '../../assets/Icons/Icons';
import { useNavigate } from 'react-router-dom';

const cx = classNames.bind(styles);

function PersonalPage() {
    const [avatar, setAvatar] = useState();
    const [name, setName] = useState();
    const [desc, setDesc] = useState();
    const { user } = UserAuth();

    const nav = useNavigate();

    useEffect(() => {
        onSnapshot(doc(db, 'users', `${user.email}`), (doc) => {
            setAvatar(doc.data()?.information.avatar);
            setName(doc.data()?.information.name);
            setDesc(doc.data()?.information.desc);
        });
    }, [user?.email]);

    return (
        <div className={cx('wrapper')}>
            <div className={cx('personalPage-top')}>
                <div className={cx('avatar-container')}>
                    <img alt="avatar" src={avatar} />
                </div>
                <div className={cx('infomation-container')}>
                    <div className={cx('info-top')}>
                        <p className={cx('info-top--email')}>{user.email}</p>
                        <div
                            onClick={(e) => {
                                nav('/account/edit');
                            }}
                        >
                            Chỉnh sửa trang cá nhân
                        </div>
                        <p className={cx('info-top--setting')}>{SettingIcon}</p>
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
                <div className={cx('post')}></div>
            </div>
        </div>
    );
}

export default PersonalPage;
