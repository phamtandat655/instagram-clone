import classNames from 'classnames/bind';
import styles from './Modal.module.scss';

import { SearchIconMini, RemoveIcon } from '../../assets/Icons/Icons';
import { useState } from 'react';

const cx = classNames.bind(styles);

function Modal({ page }) {
    const [input, setInput] = useState('');

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
                        />
                        <p className={cx('search__remove', { show: input !== '' })} onClick={(e) => setInput('')}>
                            {RemoveIcon}
                        </p>
                    </div>
                    <div className={cx('bar')}></div>
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
