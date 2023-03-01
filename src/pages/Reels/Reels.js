import classNames from 'classnames/bind';
import styles from './Reels.module.scss';

const cx = classNames.bind(styles);

function Reels() {
    return <div className={cx('wrapper')}>Reels</div>;
}

export default Reels;
