import classNames from 'classnames/bind';
import styles from './Account.module.scss';
import { useState } from 'react';
import { UserAuth } from '../../Context/AuthContext';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';

const cx = classNames.bind(styles);

function Account({ name, img, desc, lengthDesc, follow, change, story, followings, email }) {
    const { user } = UserAuth();

    const [seenStory, setSeenStory] = useState(() => {
        if (story) return true;
        return false;
    });

    const handleLengthOfWords = (words, length = 22) => {
        if (words.length >= length) {
            return words.slice(0, length) + '...';
        }
        return words;
    };

    const handleFollow = async (e) => {
        const docRef = doc(db, 'users', `${user?.email}`);
        await updateDoc(docRef, {
            follows: [...followings, email],
        });
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('account')}>
                <div className={cx('avatar', { havestr: seenStory })} onClick={(e) => setSeenStory(false)}>
                    <img src={img || ''} alt="avatar" />
                </div>
                <div className={cx('about')}>
                    <p className={cx('name')}>{handleLengthOfWords(name || '', 18)}</p>
                    {desc && <p className={cx('desc')}>{handleLengthOfWords(desc, lengthDesc)}</p>}
                </div>
            </div>
            <div
                className={cx('follow')}
                onClick={(e) => {
                    e.stopPropagation();
                    handleFollow();
                }}
            >
                {(follow && <p>Theo dõi</p>) || (change && <p>Chuyển</p>)}
            </div>
        </div>
    );
}

export default Account;
