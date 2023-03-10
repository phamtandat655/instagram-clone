import classNames from 'classnames/bind';
import styles from './PostDetail.module.scss';

const cx = classNames.bind(styles);

function PostDetail() {
    return <div className={cx('wrapper')}>PostDetail</div>;
}

export default PostDetail;
