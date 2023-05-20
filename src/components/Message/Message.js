import classNames from 'classnames/bind';
import styles from './Message.module.scss';

const cx = classNames.bind(styles);

function Message({ message, isMyMessage, name, img }) {
    return (
        <div className={cx('wrapper')}>
            <div className={cx('container', { myMessage: isMyMessage })}>
                <div className={cx('image-wrapper')}>
                    <img alt="messageImage" src={img} />
                </div>
                <div className={cx('message-wrapper')}>
                    <p>{message}</p>
                </div>
            </div>
        </div>
    );
}

export default Message;
