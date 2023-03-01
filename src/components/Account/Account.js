import classNames from 'classnames/bind';
import styles from './Account.module.scss';
import { useState } from 'react';

const cx = classNames.bind(styles);

function Account({ name, img, desc, follow, change, story }) {
    const [seenStory, setSeenStory] = useState(() => {
        if (story) return true;
        return false;
    });

    const handleLengthOfWords = (words, length) => {
        if (words.length >= length) {
            return words.slice(0, length) + '...';
        }
        return words;
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('account')}>
                <div className={cx('avatar', { havestr: seenStory })} onClick={(e) => setSeenStory(false)}>
                    <img src={img} alt="avatar" />
                </div>
                <div className={cx('about')}>
                    <p className={cx('name')}>{handleLengthOfWords(name, 18)}</p>
                    {desc && <p className={cx('desc')}>{handleLengthOfWords(desc, 22)}</p>}
                </div>
            </div>
            <div className={cx('follow')}>{(follow && <p>Theo dõi</p>) || (change && <p>Chuyển</p>)}</div>
        </div>
    );
}

export default Account;
