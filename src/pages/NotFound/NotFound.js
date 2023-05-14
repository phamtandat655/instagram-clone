import classNames from 'classnames/bind';
import styles from './NotFound.module.scss';

const cx = classNames.bind(styles);

function NotFound() {
    return (
        <div className={cx('wrapper')}>
            <h2>Rất tiếc, trang này hiện không khả dụng.</h2>
            <p>Liên kết bạn theo dõi có thể bị hỏng hoặc trang này có thể đã bị gỡ. Quay lại Instagram.</p>
        </div>
    );
}

export default NotFound;
