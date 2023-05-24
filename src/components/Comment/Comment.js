import classNames from 'classnames/bind';
import styles from './Comment.module.scss';
import { useEffect, useState, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { UseFireBase } from '../../Context/FireBaseContext';

const cx = classNames.bind(styles);

function Comment({ cmt }) {
    const [time, setTime] = useState('');
    const [avatar, setAvatar] = useState('');
    const { getUserByEmail } = UseFireBase();

    const nav = useNavigate();

    useEffect(() => {
        const timestamp = {
            seconds: cmt?.timestampSecond || '',
        };
        const postDate = new Date(timestamp.seconds * 1000);
        const nowDate = new Date();

        const months = getMonthDifference(postDate, nowDate);
        const years = nowDate.getFullYear() - postDate.getFullYear();

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
        let seconds = Math.round(delta % 60); // in theory the modulus is not required

        if (years < 1) {
            if (months >= 1) {
                setTime(`${months} THÁNG TRƯỚC`);
            } else {
                if (days < 1) {
                    if (hours < 1) {
                        if (minutes < 1) {
                            setTime(`${seconds} GIÂY TRƯỚC`);
                        } else {
                            setTime(`${minutes} PHÚT TRƯỚC`);
                        }
                    } else {
                        setTime(`${hours} GIỜ TRƯỚC`);
                    }
                } else {
                    setTime(`${days} NGÀY TRƯỚC`);
                }
            }
        } else {
            setTime(`NĂM ${years} THÁNG ${months} NGÀY ${days}`);
        }

        function getMonthDifference(startDate, endDate) {
            return endDate.getMonth() - startDate.getMonth() + 12 * (endDate.getFullYear() - startDate.getFullYear());
        }
    }, [cmt?.timestampSecond]);

    useEffect(() => {
        setAvatar(getUserByEmail(`${cmt?.useremail}`)?.information.avatar);
    }, [cmt?.useremail, getUserByEmail]);

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

export default memo(Comment);
