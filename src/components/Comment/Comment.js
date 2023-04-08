import classNames from 'classnames/bind';
import styles from './Comment.module.scss';
import { useEffect, useState } from 'react';
import { onSnapshot, doc } from 'firebase/firestore';
import { db } from '../../firebase';
import { useNavigate } from 'react-router-dom';

const cx = classNames.bind(styles);

function Comment({ cmt }) {
    const [time, setTime] = useState('');
    const [avatar, setAvatar] = useState('');

    const nav = useNavigate();

    useEffect(() => {
        const timestamp = {
            seconds: cmt?.timestampSecond || '',
        };
        const postDate = new Date(timestamp.seconds * 1000);
        const nowDate = new Date();

        if (
            nowDate.getFullYear() === postDate.getFullYear() &&
            nowDate.getMonth() === postDate.getMonth() &&
            nowDate.getDate() === postDate.getDate()
        ) {
            if (nowDate.getHours() === postDate.getHours()) {
                if (nowDate.getMinutes() === postDate.getMinutes()) {
                    setTime(`${nowDate.getMinutes() - postDate.getMinutes()} giay truoc`);
                } else setTime(`${nowDate.getMinutes() - postDate.getMinutes()} phut truoc`);
            } else setTime(`${nowDate.getHours() - postDate.getHours()} gio truoc`);
        } else if (
            nowDate.getFullYear() === postDate.getFullYear() &&
            nowDate.getMonth() !== postDate.getMonth() &&
            nowDate.getDate() !== postDate.getDate()
        ) {
            setTime(`THANG ${postDate.getMonth()} ${postDate.getDate()}`);
        } else {
            setTime(`NAM ${postDate.getFullYear()} THANG ${postDate.getMonth()} ${postDate.getDate()}`);
        }
    }, [cmt?.timestampSecond]);

    useEffect(() => {
        onSnapshot(doc(db, 'users', `${cmt?.useremail}`), (doc) => {
            setAvatar(doc.data()?.information.avatar);
        });
    }, [cmt?.useremail]);

    return (
        <div className={cx('wrapper')}>
            <div className={cx('account')} onClick={(e) => nav(`/personalPage/${cmt.useremail}`)}>
                <div className={cx('avatar')}>
                    <img
                        src={
                            avatar ||
                            'http://phunuvietnam.mediacdn.vn/media/news/33abffcedac43a654ac7f501856bf700/anh-profile-tiet-lo-g-ve-ban-1.jpg'
                        }
                        alt="avatar"
                    />
                </div>
            </div>
            <div className={cx('about')}>
                <span className={cx('name')}>{cmt?.username}</span>
                <span className={cx('cmt')}>{cmt?.comment}</span>
                <div className={cx('info__cmt')}>
                    <p className={cx('time__cmt')}>{time ? time : ''}</p>
                </div>
            </div>
        </div>
    );
}

export default Comment;
