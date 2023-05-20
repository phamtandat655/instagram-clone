import classNames from 'classnames/bind';
import styles from './Inbox.module.scss';
import Account from '../../components/Account/Account';
import { ImageIcon } from '../../assets/Icons/Icons';
import Message from '../../components/Message/Message';
import { useRef } from 'react';
import { UseFireBase } from '../../Context/FireBaseContext';

const cx = classNames.bind(styles);

function Inbox() {
    const { inboxes } = UseFireBase();
    const scroll = useRef(null);

    console.log(inboxes);

    const handleSubmitMessage = (e) => {
        scroll.current.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('container')}>
                <div className={cx('inboxList')}>
                    <div className={cx('inboxList__account')}>
                        <Account
                            note="Hello ! Day la tin nhan dau tien ! Day la tin nhan dau tien !"
                            time=" - 3h"
                            lengthDesc={30}
                            name="Pham tan dat"
                            img="https://firebasestorage.googleapis.com/v0/b/instagram-clone-c4282.appspot.com/o/files%2F345249558_1160442644734602_9026704827842054617_n.jpg?alt=media&token=d2550f94-d683-4c47-8199-f79a72e6504d"
                        />
                    </div>
                    <div className={cx('inboxList__account')}>
                        <Account
                            note="Hello ! Day la tin nhan dau tien ! Day la tin nhan dau tien !"
                            time=" - 3h"
                            lengthDesc={30}
                            name="Pham tan dat"
                            img="https://firebasestorage.googleapis.com/v0/b/instagram-clone-c4282.appspot.com/o/files%2F345249558_1160442644734602_9026704827842054617_n.jpg?alt=media&token=d2550f94-d683-4c47-8199-f79a72e6504d"
                        />
                    </div>
                    <div className={cx('inboxList__account')}>
                        <Account
                            note="Hello ! Day la tin nhan dau tien ! Day la tin nhan dau tien !"
                            time=" - 3h"
                            lengthDesc={30}
                            name="Pham tan dat"
                            img="https://firebasestorage.googleapis.com/v0/b/instagram-clone-c4282.appspot.com/o/files%2F345249558_1160442644734602_9026704827842054617_n.jpg?alt=media&token=d2550f94-d683-4c47-8199-f79a72e6504d"
                        />
                    </div>
                    <div className={cx('inboxList__account')}>
                        <Account
                            note="Hello ! Day la tin nhan dau tien ! Day la tin nhan dau tien !"
                            time=" - 3h"
                            lengthDesc={30}
                            name="Pham tan dat"
                            img="https://firebasestorage.googleapis.com/v0/b/instagram-clone-c4282.appspot.com/o/files%2F345249558_1160442644734602_9026704827842054617_n.jpg?alt=media&token=d2550f94-d683-4c47-8199-f79a72e6504d"
                        />
                    </div>
                    <div className={cx('inboxList__account')}>
                        <Account
                            note="Hello ! Day la tin nhan dau tien ! Day la tin nhan dau tien !"
                            time=" - 3h"
                            lengthDesc={30}
                            name="Pham tan dat"
                            img="https://firebasestorage.googleapis.com/v0/b/instagram-clone-c4282.appspot.com/o/files%2F345249558_1160442644734602_9026704827842054617_n.jpg?alt=media&token=d2550f94-d683-4c47-8199-f79a72e6504d"
                        />
                    </div>
                    <div className={cx('inboxList__account')}>
                        <Account
                            note="Hello ! Day la tin nhan dau tien ! Day la tin nhan dau tien !"
                            time=" - 3h"
                            lengthDesc={30}
                            name="Pham tan dat"
                            img="https://firebasestorage.googleapis.com/v0/b/instagram-clone-c4282.appspot.com/o/files%2F345249558_1160442644734602_9026704827842054617_n.jpg?alt=media&token=d2550f94-d683-4c47-8199-f79a72e6504d"
                        />
                    </div>
                    <div className={cx('inboxList__account')}>
                        <Account
                            note="Hello ! Day la tin nhan dau tien ! Day la tin nhan dau tien !"
                            time=" - 3h"
                            lengthDesc={30}
                            name="Pham tan dat"
                            img="https://firebasestorage.googleapis.com/v0/b/instagram-clone-c4282.appspot.com/o/files%2F345249558_1160442644734602_9026704827842054617_n.jpg?alt=media&token=d2550f94-d683-4c47-8199-f79a72e6504d"
                        />
                    </div>
                    <div className={cx('inboxList__account')}>
                        <Account
                            note="Hello ! Day la tin nhan dau tien ! Day la tin nhan dau tien !"
                            time=" - 3h"
                            lengthDesc={30}
                            name="Pham tan dat"
                            img="https://firebasestorage.googleapis.com/v0/b/instagram-clone-c4282.appspot.com/o/files%2F345249558_1160442644734602_9026704827842054617_n.jpg?alt=media&token=d2550f94-d683-4c47-8199-f79a72e6504d"
                        />
                    </div>
                    <div className={cx('inboxList__account')}>
                        <Account
                            note="Hello ! Day la tin nhan dau tien ! Day la tin nhan dau tien !"
                            time=" - 3h"
                            lengthDesc={30}
                            name="Pham tan dat"
                            img="https://firebasestorage.googleapis.com/v0/b/instagram-clone-c4282.appspot.com/o/files%2F345249558_1160442644734602_9026704827842054617_n.jpg?alt=media&token=d2550f94-d683-4c47-8199-f79a72e6504d"
                        />
                    </div>
                    <div className={cx('inboxList__account')}>
                        <Account
                            note="Hello ! Day la tin nhan dau tien ! Day la tin nhan dau tien !"
                            time=" - 3h"
                            lengthDesc={30}
                            name="Pham tan dat"
                            img="https://firebasestorage.googleapis.com/v0/b/instagram-clone-c4282.appspot.com/o/files%2F345249558_1160442644734602_9026704827842054617_n.jpg?alt=media&token=d2550f94-d683-4c47-8199-f79a72e6504d"
                        />
                    </div>
                    <div className={cx('inboxList__account')}>
                        <Account
                            note="Hello ! Day la tin nhan dau tien ! Day la tin nhan dau tien !"
                            time=" - 3h"
                            lengthDesc={30}
                            name="Pham tan dat"
                            img="https://firebasestorage.googleapis.com/v0/b/instagram-clone-c4282.appspot.com/o/files%2F345249558_1160442644734602_9026704827842054617_n.jpg?alt=media&token=d2550f94-d683-4c47-8199-f79a72e6504d"
                        />
                    </div>
                    <div className={cx('inboxList__account')}>
                        <Account
                            note="Hello ! Day la tin nhan dau tien ! Day la tin nhan dau tien !"
                            time=" - 3h"
                            lengthDesc={30}
                            name="Pham tan dat"
                            img="https://firebasestorage.googleapis.com/v0/b/instagram-clone-c4282.appspot.com/o/files%2F345249558_1160442644734602_9026704827842054617_n.jpg?alt=media&token=d2550f94-d683-4c47-8199-f79a72e6504d"
                        />
                    </div>
                    <div className={cx('inboxList__account')}>
                        <Account
                            note="Hello ! Day la tin nhan dau tien ! Day la tin nhan dau tien !"
                            time=" - 3h"
                            lengthDesc={30}
                            name="Pham tan dat"
                            img="https://firebasestorage.googleapis.com/v0/b/instagram-clone-c4282.appspot.com/o/files%2F345249558_1160442644734602_9026704827842054617_n.jpg?alt=media&token=d2550f94-d683-4c47-8199-f79a72e6504d"
                        />
                    </div>
                    <div className={cx('inboxList__account')}>
                        <Account
                            note="Hello ! Day la tin nhan dau tien ! Day la tin nhan dau tien !"
                            time=" - 3h"
                            lengthDesc={30}
                            name="Pham tan dat"
                            img="https://firebasestorage.googleapis.com/v0/b/instagram-clone-c4282.appspot.com/o/files%2F345249558_1160442644734602_9026704827842054617_n.jpg?alt=media&token=d2550f94-d683-4c47-8199-f79a72e6504d"
                        />
                    </div>
                    <div className={cx('inboxList__account')}>
                        <Account
                            note="Hello ! Day la tin nhan dau tien ! Day la tin nhan dau tien !"
                            time=" - 3h"
                            lengthDesc={30}
                            name="Pham tan dat"
                            img="https://firebasestorage.googleapis.com/v0/b/instagram-clone-c4282.appspot.com/o/files%2F345249558_1160442644734602_9026704827842054617_n.jpg?alt=media&token=d2550f94-d683-4c47-8199-f79a72e6504d"
                        />
                    </div>
                    <div className={cx('inboxList__account')}>
                        <Account
                            note="Hello ! Day la tin nhan dau tien ! Day la tin nhan dau tien !"
                            time=" - 3h"
                            lengthDesc={30}
                            name="Pham tan dat"
                            img="https://firebasestorage.googleapis.com/v0/b/instagram-clone-c4282.appspot.com/o/files%2F345249558_1160442644734602_9026704827842054617_n.jpg?alt=media&token=d2550f94-d683-4c47-8199-f79a72e6504d"
                        />
                    </div>
                </div>
                <div className={cx('inboxChats')}>
                    <div className={cx('inboxChats-top')}>
                        <Account
                            name="Pham tan dat"
                            img="https://firebasestorage.googleapis.com/v0/b/instagram-clone-c4282.appspot.com/o/files%2F345249558_1160442644734602_9026704827842054617_n.jpg?alt=media&token=d2550f94-d683-4c47-8199-f79a72e6504d"
                        />
                    </div>
                    <div className={cx('inboxChats-mid')}>
                        <div ref={scroll}></div>

                        <Message
                            message="Hello ! Day la tin nhan dau tien ! Day la tin nhan dau tien !"
                            isMyMessage
                            name="Pham tan dat"
                            img="https://firebasestorage.googleapis.com/v0/b/instagram-clone-c4282.appspot.com/o/files%2F345249558_1160442644734602_9026704827842054617_n.jpg?alt=media&token=d2550f94-d683-4c47-8199-f79a72e6504d"
                        />
                        <Message
                            message="Hello ! Day la tin nhan dau tien ! Day la tin nhan dau tien !"
                            isMyMessage
                            name="Pham tan dat"
                            img="https://firebasestorage.googleapis.com/v0/b/instagram-clone-c4282.appspot.com/o/files%2F345249558_1160442644734602_9026704827842054617_n.jpg?alt=media&token=d2550f94-d683-4c47-8199-f79a72e6504d"
                        />
                        <Message
                            message="Hello ! Day la tin nhan dau tien ! Day la tin nhan dau tien !"
                            name="Pham tan dat"
                            img="https://firebasestorage.googleapis.com/v0/b/instagram-clone-c4282.appspot.com/o/files%2F345249558_1160442644734602_9026704827842054617_n.jpg?alt=media&token=d2550f94-d683-4c47-8199-f79a72e6504d"
                        />
                        <Message
                            message="Hello ! Day la tin nhan dau tien ! Day la tin nhan dau tien !"
                            isMyMessage
                            name="Pham tan dat"
                            img="https://firebasestorage.googleapis.com/v0/b/instagram-clone-c4282.appspot.com/o/files%2F345249558_1160442644734602_9026704827842054617_n.jpg?alt=media&token=d2550f94-d683-4c47-8199-f79a72e6504d"
                        />
                        <Message
                            message="Hello ! Day la tin nhan dau tien ! Day la tin nhan dau tien !"
                            name="Pham tan dat"
                            img="https://firebasestorage.googleapis.com/v0/b/instagram-clone-c4282.appspot.com/o/files%2F345249558_1160442644734602_9026704827842054617_n.jpg?alt=media&token=d2550f94-d683-4c47-8199-f79a72e6504d"
                        />
                        <Message
                            message="Hello ! Day la tin nhan dau tien ! Day la tin nhan dau tien !"
                            name="Pham tan dat"
                            img="https://firebasestorage.googleapis.com/v0/b/instagram-clone-c4282.appspot.com/o/files%2F345249558_1160442644734602_9026704827842054617_n.jpg?alt=media&token=d2550f94-d683-4c47-8199-f79a72e6504d"
                        />
                        <Message
                            message="Hello ! Day la tin nhan dau tien ! Day la tin nhan dau tien !"
                            isMyMessage
                            name="Pham tan dat"
                            img="https://firebasestorage.googleapis.com/v0/b/instagram-clone-c4282.appspot.com/o/files%2F345249558_1160442644734602_9026704827842054617_n.jpg?alt=media&token=d2550f94-d683-4c47-8199-f79a72e6504d"
                        />
                        <Message
                            message="Hello ! Day la tin nhan dau tien ! Day la tin nhan dau tien !"
                            isMyMessage
                            name="Pham tan dat"
                            img="https://firebasestorage.googleapis.com/v0/b/instagram-clone-c4282.appspot.com/o/files%2F345249558_1160442644734602_9026704827842054617_n.jpg?alt=media&token=d2550f94-d683-4c47-8199-f79a72e6504d"
                        />
                        <Message
                            message="Hello ! Day la tin nhan dau tien ! Day la tin nhan dau tien !"
                            name="Pham tan dat"
                            img="https://firebasestorage.googleapis.com/v0/b/instagram-clone-c4282.appspot.com/o/files%2F345249558_1160442644734602_9026704827842054617_n.jpg?alt=media&token=d2550f94-d683-4c47-8199-f79a72e6504d"
                        />
                        <Message
                            message="Hello ! Day la tin nhan dau tien ! Day la tin nhan dau tien !"
                            isMyMessage
                            name="Pham tan dat"
                            img="https://firebasestorage.googleapis.com/v0/b/instagram-clone-c4282.appspot.com/o/files%2F345249558_1160442644734602_9026704827842054617_n.jpg?alt=media&token=d2550f94-d683-4c47-8199-f79a72e6504d"
                        />
                        <Message
                            message="Hello ! Day la tin nhan dau tien ! Day la tin nhan dau tien !"
                            name="Pham tan dat"
                            img="https://firebasestorage.googleapis.com/v0/b/instagram-clone-c4282.appspot.com/o/files%2F345249558_1160442644734602_9026704827842054617_n.jpg?alt=media&token=d2550f94-d683-4c47-8199-f79a72e6504d"
                        />
                        <Message
                            message="Hello ! Day la tin nhan dau tien ! Day la tin nhan dau tien !"
                            name="Pham tan dat"
                            img="https://firebasestorage.googleapis.com/v0/b/instagram-clone-c4282.appspot.com/o/files%2F345249558_1160442644734602_9026704827842054617_n.jpg?alt=media&token=d2550f94-d683-4c47-8199-f79a72e6504d"
                        />
                        <Message
                            message="Hello ! Day la tin nhan dau tien ! Day la tin nhan dau tien !"
                            isMyMessage
                            name="Pham tan dat"
                            img="https://firebasestorage.googleapis.com/v0/b/instagram-clone-c4282.appspot.com/o/files%2F345249558_1160442644734602_9026704827842054617_n.jpg?alt=media&token=d2550f94-d683-4c47-8199-f79a72e6504d"
                        />
                        <Message
                            message="Hello ! Day la tin nhan dau tien ! Day la tin nhan dau tien !"
                            isMyMessage
                            name="Pham tan dat"
                            img="https://firebasestorage.googleapis.com/v0/b/instagram-clone-c4282.appspot.com/o/files%2F345249558_1160442644734602_9026704827842054617_n.jpg?alt=media&token=d2550f94-d683-4c47-8199-f79a72e6504d"
                        />
                        <Message
                            message="Hello ! Day la tin nhan dau tien ! Day la tin nhan dau tien !"
                            name="Pham tan dat"
                            img="https://firebasestorage.googleapis.com/v0/b/instagram-clone-c4282.appspot.com/o/files%2F345249558_1160442644734602_9026704827842054617_n.jpg?alt=media&token=d2550f94-d683-4c47-8199-f79a72e6504d"
                        />
                        <Message
                            message="Hello ! Day la tin nhan dau tien ! Day la tin nhan dau tien !"
                            isMyMessage
                            name="Pham tan dat"
                            img="https://firebasestorage.googleapis.com/v0/b/instagram-clone-c4282.appspot.com/o/files%2F345249558_1160442644734602_9026704827842054617_n.jpg?alt=media&token=d2550f94-d683-4c47-8199-f79a72e6504d"
                        />
                        <Message
                            message="Hello ! Day la tin nhan dau tien ! Day la tin nhan dau tien !"
                            name="Pham tan dat"
                            img="https://firebasestorage.googleapis.com/v0/b/instagram-clone-c4282.appspot.com/o/files%2F345249558_1160442644734602_9026704827842054617_n.jpg?alt=media&token=d2550f94-d683-4c47-8199-f79a72e6504d"
                        />
                        <Message
                            message="Hello ! Day la tin nhan dau tien ! Day la tin nhan dau tien !"
                            name="Pham tan dat"
                            img="https://firebasestorage.googleapis.com/v0/b/instagram-clone-c4282.appspot.com/o/files%2F345249558_1160442644734602_9026704827842054617_n.jpg?alt=media&token=d2550f94-d683-4c47-8199-f79a72e6504d"
                        />
                    </div>
                    <div className={cx('inboxChats-bottom')}>
                        <div className={cx('chatInput-wrapper')}>
                            <input type="text" placeholder="Nhập tin nhắn..." />
                            <label htmlFor="inboxChats-fileImg">{ImageIcon}</label>
                            <input type="file" id="inboxChats-fileImg" hidden />
                            <button onClick={handleSubmitMessage}>Gửi</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Inbox;
