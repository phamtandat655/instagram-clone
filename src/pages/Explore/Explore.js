import classNames from 'classnames/bind';
import styles from './Explore.module.scss';

const cx = classNames.bind(styles);

function Explore() {
    return <div className={cx('wrapper')}>Explore</div>;
}

export default Explore;
