import { onSnapshot, collection } from 'firebase/firestore';
import { db } from '../../firebase';

import classNames from 'classnames/bind';
import styles from './Modal.module.scss';

import { SearchIconMini, RemoveIcon } from '../../assets/Icons/Icons';
import { useEffect, useState } from 'react';
import Account from '../Account/Account';

const cx = classNames.bind(styles);

function Modal({ page }) {
    const [input, setInput] = useState('');
    const [users, setUsers] = useState([]);
    const [searchUsers, setSearchUsers] = useState([]);

    useEffect(() => {
        const unsubcribe = onSnapshot(collection(db, 'users'), (snapshot) => {
            let newUsers = [];
            snapshot.forEach((doc) => {
                newUsers.push({
                    ...doc.data().information,
                });
            });
            setUsers(newUsers);
        });

        return () => unsubcribe();
    }, []);

    const handleSearchUser = (e) => {
        const newSearchUsers = [];
        users.map((user) => {
            if (user?.name.includes(e.target.value)) {
                newSearchUsers.push(user);
            }
            return user;
        });
        setSearchUsers(newSearchUsers);
    };

    let toggleOpen = page !== 'search' && page !== 'notify' ? 'hide' : 'show';
    return (
        <div className={cx('wrapper', toggleOpen)}>
            {page === 'search' ? (
                <div className={cx('search-modal')}>
                    <h3 className={cx('search__header')}>Tìm Kiếm</h3>
                    <div className={cx('search__container')}>
                        <p className={cx('search__icon', { hide: input !== '' })}>{SearchIconMini}</p>
                        <input
                            className={cx('search__input')}
                            type="text"
                            placeholder="Tìm kiếm"
                            value={input}
                            onInput={(e) => setInput(e.target.value)}
                            onChange={handleSearchUser}
                        />
                        <p className={cx('search__remove', { show: input !== '' })} onClick={(e) => setInput('')}>
                            {RemoveIcon}
                        </p>
                    </div>
                    <div className={cx('bar')}></div>
                    <div className={cx('search-content')}>
                        <div className={cx('account-wrap')}>
                            {input !== '' &&
                                searchUsers.map((user) => (
                                    <div className={cx('account-wrap')} key={user.email}>
                                        <Account name={user.name} img={user.avatar} desc={user.email} lengthDesc={40} />
                                    </div>
                                ))}
                        </div>
                    </div>
                </div>
            ) : (
                <div className={cx('notify-modal')}>
                    <h3 className={cx('notify__header')}>Thông báo</h3>
                </div>
            )}
        </div>
    );
}

export default Modal;
