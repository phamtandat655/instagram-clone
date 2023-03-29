import classNames from 'classnames/bind';
import styles from './Reels.module.scss';
import { useEffect, Fragment, useState } from 'react';

const cx = classNames.bind(styles);

function Reels() {
    // const [indexPostObserved, setIndexPostObserved] = useState(4);

    // useEffect(() => {
    //     const srollEvent = window.addEventListener('scroll', (e) => {
    //         const scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
    //         const scrollHeight = document.documentElement.scrollHeight;
    //         const clientHeight = document.documentElement.clientHeight;

    //         const percentage = Math.floor((scrollTop / (scrollHeight - clientHeight)) * 100);
    //         if (percentage >= 90) {
    //             setIndexPostObserved((prevIndex) => prevIndex + 2);
    //         }
    //     });

    //     return () => srollEvent;
    // });

    // if (index > indexPostObserved) {
    //     return <Fragment key={index}></Fragment>;
    // }

    return <div className={cx('wrapper')}>Reels</div>;
}

export default Reels;
