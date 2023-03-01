import classNames from 'classnames/bind';
import { useState } from 'react';
import styles from './Story.module.scss';

const cx = classNames.bind(styles);

function Story({ name, img }) {
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
            }}
        >
            {/* neu da seen thi them class 'seen' vao */}
            <div className={cx('avatar', { seen: seen === true })}>
                <img alt="avatar" src={img} />
            </div>
            <p className={cx('user-name')}>{handleFixLengthOfName(name)}</p>
        </div>
    );
}

export default Story;
