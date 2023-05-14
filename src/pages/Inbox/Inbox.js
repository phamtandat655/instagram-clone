import classNames from 'classnames/bind';
import styles from './Inbox.module.scss';

const cx = classNames.bind(styles);

function Inbox() {
    return (
        <div className={cx('wrapper')}>
            <h2>Trang web đang dần được hoàn thiện !</h2>
            <p>Vui lòng quay lại sau!</p>
        </div>
    );
}

export default Inbox;
