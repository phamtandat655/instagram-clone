import classNames from 'classnames/bind';
import { useState, memo } from 'react';
import styles from './Story.module.scss';

const cx = classNames.bind(styles);

function Story({ name, img, email, setShowStory, setUserEmailStory }) {
    const [seen, setSeen] = useState(false);

    const handleFixLengthOfName = (name) => {
        if (name.length > 10) {
            return name.slice(0, 10) + '...';
        }
        return name;
    };

    return (
        <div
            className={cx('wrapper')}
            onClick={() => {
                setSeen(true);
                setShowStory(true);
                setUserEmailStory(email);
            }}
        >
            {/* neu da seen thi them class 'seen' vao */}
            <div className={cx('avatar', { seen: seen === true })}>
                <img
                    alt="avatar"
                    src={
                        img ||
                        'http://phunuvietnam.mediacdn.vn/media/news/33abffcedac43a654ac7f501856bf700/anh-profile-tiet-lo-g-ve-ban-1.jpg'
                    }
                />
            </div>
            <p className={cx('user-name')}>{handleFixLengthOfName(name)}</p>
        </div>
    );
}

export default memo(Story);
