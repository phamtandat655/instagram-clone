import styles from './Navbar.module.scss';
import classNames from 'classnames/bind';

import { logo } from '../../assets/image/instagram';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

import {
    InstaIcon,
    HomeIcon,
    SearchIcon,
    ExploreIcon,
    ReelsIcon,
    InboxIcon,
    HeartIcon,
    CreateIcon,
} from '../../assets/Icons/Icons';
import {
    HomeIconActived,
    ExploreIconActived,
    ReelsIconActived,
    InboxIconActived,
    HeartIconActived,
    CreateIconActived,
} from '../../assets/Icons/IconsActived';
import { Link, NavLink } from 'react-router-dom';

import Modal from '../Modal/Modal';
import MiniMenu from '../MiniMenu/MiniMenu';
import { useState, useEffect } from 'react';
import { UserAuth } from '../../Context/AuthContext';
import { onSnapshot, doc } from 'firebase/firestore';
import { db } from '../../firebase';

const cx = classNames.bind(styles);

function Navbar({ page, setPage, clickSeeMore, setClickSeeMore, pathname }) {
    const [avatar, setAvatar] = useState();
    const { user } = UserAuth();

    useEffect(() => {
        onSnapshot(doc(db, 'users', `${user.email}`), (doc) => {
            setAvatar(doc.data()?.information.avatar);
        });
    }, [user?.email]);

    return (
        <div className={cx('wrapper', { openModal: page === 'search' || page === 'notify' })}>
            <div className={cx('nav')}>
                <div
                    className={cx('logo')}
                    onClick={(e) => {
                        setPage('home');
                    }}
                >
                    <Link to="/" className={cx('logo-letter')}>
                        {logo}
                    </Link>
                    <Link to="/" className={cx('logo-icon')}>
                        {InstaIcon}
                    </Link>
                </div>
                <div className={cx('list')}>
                    <NavLink to="/" className={(nav) => cx({ active: nav.isActive && page === 'home' })}>
                        <div
                            className={cx('item')}
                            onClick={(e) => {
                                setPage('home');
                            }}
                        >
                            <i className={cx('icon')}>{page === 'home' ? HomeIconActived : HomeIcon}</i>
                            <span>Trang chủ</span>
                        </div>
                    </NavLink>
                    <NavLink to="#" className={(nav) => cx({ activeModal: nav.isActive && page === 'search' })}>
                        <div
                            className={cx('item')}
                            onClick={(e) => {
                                if (page === 'search') {
                                    let path = pathname.slice(1) === '' ? 'home' : pathname.slice(1);
                                    setPage(path);
                                } else setPage('search');
                            }}
                        >
                            <i className={cx('icon')}>{SearchIcon}</i>
                            <span>Tìm kiếm</span>
                        </div>
                    </NavLink>
                    <NavLink to="/explore" className={(nav) => cx({ active: nav.isActive && page === 'explore' })}>
                        <div
                            className={cx('item')}
                            onClick={(e) => {
                                setPage('explore');
                            }}
                        >
                            <i className={cx('icon')}>{page === 'explore' ? ExploreIconActived : ExploreIcon}</i>
                            <span>Khám phá</span>
                        </div>
                    </NavLink>
                    <NavLink to="/videos" className={(nav) => cx({ active: nav.isActive && page === 'videos' })}>
                        <div
                            className={cx('item')}
                            onClick={(e) => {
                                setPage('videos');
                            }}
                        >
                            <i className={cx('icon')}>{page === 'videos' ? ReelsIconActived : ReelsIcon}</i>
                            <span>Reels</span>
                        </div>
                    </NavLink>
                    <NavLink to="/inbox" className={(nav) => cx({ active: nav.isActive && page === 'inbox' })}>
                        <div
                            className={cx('item')}
                            onClick={(e) => {
                                setPage('inbox');
                            }}
                        >
                            <i className={cx('icon')}>{page === 'inbox' ? InboxIconActived : InboxIcon}</i>
                            <span>Tin nhắn</span>
                        </div>
                    </NavLink>
                    <NavLink to="#" className={(nav) => cx({ activeModal: nav.isActive && page === 'notify' })}>
                        <div
                            className={cx('item')}
                            onClick={(e) => {
                                if (page === 'notify') {
                                    let path = pathname.slice(1) === '' ? 'home' : pathname.slice(1);
                                    setPage(path);
                                } else setPage('notify');
                            }}
                        >
                            <i className={cx('icon')}>{page === 'notify' ? HeartIconActived : HeartIcon}</i>
                            <span>Thông báo</span>
                        </div>
                    </NavLink>
                    <NavLink to="#" className={(nav) => cx({ active: nav.isActive && page === 'create' })}>
                        <div
                            className={cx('item')}
                            onClick={(e) => {
                                setPage('create');
                            }}
                        >
                            <i className={cx('icon')}>{page === 'create' ? CreateIconActived : CreateIcon}</i>
                            <span>Tạo</span>
                        </div>
                    </NavLink>
                    <NavLink
                        to={`/personalpage/${user.email}`}
                        className={(nav) => cx({ active: nav.isActive && page === `personalpage/${user.email}` })}
                    >
                        <div
                            className={cx('item', 'personalPage')}
                            onClick={(e) => {
                                setPage(`personalpage/${user.email}`);
                            }}
                        >
                            <img src={avatar} alt="avatar bi loi" />
                            <span>Trang cá nhân</span>
                        </div>
                    </NavLink>
                </div>
            </div>

            <NavLink to="#" className={(nav) => cx({ active: clickSeeMore === true }, 'see-more')}>
                <div
                    className={cx('item')}
                    onClick={(e) => {
                        setClickSeeMore(!clickSeeMore);
                        // chan hanh vi load web cua the navlink va noi bot khi click
                        e.preventDefault();
                        e.stopPropagation();
                    }}
                >
                    <FontAwesomeIcon className={cx('icon')} icon={faBars} />
                    <span>Xem thêm</span>
                </div>
                <MiniMenu clickSeeMore={clickSeeMore} setClickSeeMore={setClickSeeMore} />
            </NavLink>

            <Modal page={page} />
        </div>
    );
}

export default Navbar;
