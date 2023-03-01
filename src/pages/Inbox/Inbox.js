import classNames from 'classnames/bind';
import styles from './Inbox.module.scss';

const cx = classNames.bind(styles);

function Inbox() {
    return <div className={cx('wrapper')}>Inbox</div>;
}

export default Inbox;
