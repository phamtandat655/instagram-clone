import classNames from 'classnames/bind';
import { ClockIcon, MoonIcon, SaveIcon, SettingIcon, WarningIcon } from '../../assets/Icons/Icons';
import { UserAuth } from '../Context/AuthContext';
import styles from './MiniMenu.module.scss';

const cx = classNames.bind(styles);

function MiniMenu({ clickSeeMore }) {
    const { logout } = UserAuth();

    const handleSignOut = () => {
        logout();
    };

    if (clickSeeMore === false) {
        return;
    } else {
        return (
            <div
                className={cx('wrapper')}
                onClick={(e) => {
                    // chan hanh vi load web cua the navlink ben navbar component va noi bot khi click
                    e.preventDefault();
                    e.stopPropagation();
                }}
            >
                <div className={cx('menu-list')}>
                    <div className={cx('menu-item')}>
                        <div className={cx('menu-item-wrapper')}>
                            <p>Cài đặt</p>
                            <p>{SettingIcon}</p>
                        </div>
                    </div>
                    <div className={cx('menu-item')}>
                        <div className={cx('menu-item-wrapper')}>
                            <p>Đã lưu</p>
                            <p>{SaveIcon}</p>
                        </div>
                    </div>
                    <div className={cx('menu-item')}>
                        <div className={cx('menu-item-wrapper')}>
                            <p>Chuyển chế độ</p>
                            <p>{MoonIcon}</p>
                        </div>
                    </div>
                    <div className={cx('menu-item')}>
                        <div className={cx('menu-item-wrapper')}>
                            <p>Hoạt động của bạn</p>
                            <p>{ClockIcon}</p>
                        </div>
                    </div>
                    <div className={cx('menu-item')}>
                        <div className={cx('menu-item-wrapper')}>
                            <p>Báo cáo sự cố</p>
                            <p>{WarningIcon}</p>
                        </div>
                    </div>
                </div>
                <div className={cx('menu-list', 'account-settings')}>
                    <div className={cx('menu-item')}>
                        <div className={cx('menu-item-wrapper')}>
                            <p>Chuyển tài khoản</p>
                        </div>
                    </div>
                    <div className={cx('menu-item', 'signout')}>
                        <div onClick={handleSignOut} className={cx('menu-item-wrapper')}>
                            <p>Đăng xuất</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default MiniMenu;
