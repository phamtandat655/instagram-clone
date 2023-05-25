import classNames from 'classnames/bind';
import styles from './Inbox.module.scss';
import Account from '../../components/Account/Account';
import Message from '../../components/Message/Message';
import { useEffect, useRef, useState } from 'react';
import { UseFireBase } from '../../Context/FireBaseContext';
import { UserAuth } from '../../Context/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { updateDoc, doc, Timestamp, setDoc } from 'firebase/firestore';
import { db } from '../../firebase';

const cx = classNames.bind(styles);

function Inbox() {
    const { inboxes, getUserByEmail, userEmailList } = UseFireBase();
    const { user } = UserAuth();
    const { pathname } = useLocation();
    const scroll = useRef(null);
    const [userInboxes, setUserInboxes] = useState([]);
    const [chatings, setChatings] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [idInboxList, setIdInboxList] = useState([]);
    const nav = useNavigate();
    // de responsive
    const [isHoverUserInUserInboxes, setIsHoverUserInUserInboxes] = useState(false);

    let emailInPathName = pathname.slice(7);

    useEffect(() => {
        setIsHoverUserInUserInboxes(emailInPathName ? true : false);

        if (
            emailInPathName &&
            userEmailList &&
            userEmailList?.length !== 0 &&
            !userEmailList.includes(emailInPathName)
        ) {
            nav(`/NotFound/inbox/${emailInPathName}`);
        }

        let newUserInboxes = [];
        let newIdInboxList = [];

        inboxes.forEach((inbox) => {
            newIdInboxList.push(inbox?.id);

            const idArr = [...inbox?.id.split('??')];
            if (idArr.includes(user?.email)) {
                newUserInboxes.push(inbox);

                if (emailInPathName && idArr.includes(emailInPathName)) {
                    setChatings(
                        inbox?.inboxesList
                            .sort(function (x, y) {
                                return x.timestampSecond - y.timestampSecond;
                            })
                            .reverse(),
                    );
                }
            }
        });
        setUserInboxes(newUserInboxes);
        setIdInboxList(newIdInboxList);
    }, [inboxes, user, emailInPathName, nav, userEmailList]);

    const handleSubmitMessage = async (e) => {
        if (inputValue.trim().length <= 0) {
            return;
        }

        scroll.current.scrollIntoView({ behavior: 'smooth' });

        let id = emailInPathName + '??' + user?.email;
        let idReverse = user?.email + '??' + emailInPathName;
        const sender = getUserByEmail(user?.email);

        // nếu chưa có cuộc trò chuyện thì tạo
        if (!idInboxList.includes(id) && !idInboxList.includes(idReverse)) {
            await setDoc(doc(db, 'inboxes', `${id}`), {
                inboxesList: [
                    {
                        timestampSecond: Math.floor(Date.now() / 1000),
                        timestamp: Timestamp.now(),
                        useremail: sender?.information?.email,
                        chat: inputValue,
                    },
                ],
            });
            setInputValue('');
        }

        // nếu có rồi thì thêm vô
        inboxes.forEach(async (inbox) => {
            if (inbox?.id.includes(user?.email) && inbox?.id.includes(emailInPathName)) {
                setInputValue('');

                // lay thong tin nguoi gui
                const docRef = doc(db, 'inboxes', `${inbox?.id}`);
                await updateDoc(docRef, {
                    inboxesList: [
                        ...chatings,
                        {
                            timestampSecond: Math.floor(Date.now() / 1000),
                            timestamp: Timestamp.now(),
                            useremail: sender?.information?.email,
                            chat: inputValue,
                        },
                    ],
                });
            }
        });
    };

    const getUserByIdInbox = (idInbox) => {
        return idInbox.split('??').find((useremail) => useremail !== user?.email);
    };

    const handleClickUserInUserList = (useremail) => {
        setInputValue('');
        nav(`/inbox/${useremail}`);
        scroll.current.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('container')}>
                <div className={cx('inboxList', { responsiveInboxList: isHoverUserInUserInboxes })}>
                    <div className={cx('inboxList__account-wrapper')}>
                        <p className={cx('inboxList__title')}>Tin nhắn</p>
                        {userInboxes.length <= 0 && (
                            <div className={cx('inboxList__title-wrong')}>Hiện không có tin nhắn nào !</div>
                        )}
                        {userInboxes &&
                            userInboxes.map((userInbox, index) => {
                                const userEmail = getUserByIdInbox(userInbox?.id);
                                const user = getUserByEmail(userEmail);
                                const lastestMessage = userInbox?.inboxesList
                                    .sort(function (x, y) {
                                        return x.timestampSecond - y.timestampSecond;
                                    })
                                    .reverse();

                                return (
                                    <div
                                        className={cx('inboxList__account', {
                                            activeAccount: pathname && emailInPathName === userEmail,
                                        })}
                                        onClick={(e) => handleClickUserInUserList(userEmail)}
                                        key={index}
                                    >
                                        <Account
                                            note={lastestMessage[0]?.chat}
                                            // time=" - 3h"
                                            lengthDesc={30}
                                            name={user?.information?.name}
                                            img={user?.information?.avatar}
                                        />
                                    </div>
                                );
                            })}
                    </div>
                </div>
                <div className={cx('inboxChats', { responsiveInboxChats: isHoverUserInUserInboxes })}>
                    <div className={cx('inboxChats-top')}>
                        <div
                            className={cx('icon-back')}
                            onClick={(e) => {
                                setIsHoverUserInUserInboxes(false);
                                nav('/inbox');
                            }}
                        >
                            {'<'}
                        </div>
                        {emailInPathName && (
                            <div
                                onClick={(e) =>
                                    nav(`/personalPage/${getUserByEmail(emailInPathName)?.information?.email}`)
                                }
                            >
                                <Account
                                    name={getUserByEmail(emailInPathName)?.information?.name || ''}
                                    img={getUserByEmail(emailInPathName)?.information?.avatar || ''}
                                />
                            </div>
                        )}
                    </div>
                    <div className={cx('inboxChats-mid')}>
                        <div ref={scroll}></div>

                        {emailInPathName &&
                            chatings.map((chat, index) => {
                                const time = new Date(chat?.timestampSecond * 1000);
                                const thisuser = getUserByEmail(chat?.useremail);

                                return (
                                    <Message
                                        key={index}
                                        message={chat?.chat}
                                        isMyMessage={chat?.useremail === user?.email}
                                        name={thisuser?.information?.name}
                                        img={thisuser?.information?.avatar}
                                        time={time.toLocaleString()}
                                    />
                                );
                            })}
                    </div>
                    <div className={cx('inboxChats-bottom')}>
                        {emailInPathName && (
                            <form
                                className={cx('chatInput-wrapper')}
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    handleSubmitMessage();
                                }}
                            >
                                <input
                                    value={inputValue}
                                    onChange={(e) => {
                                        setInputValue(e.target.value);
                                    }}
                                    type="text"
                                    placeholder="Nhập tin nhắn..."
                                />
                                <button>Gửi</button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Inbox;
