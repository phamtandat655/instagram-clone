import styles from './App.module.scss';
import classNames from 'classnames/bind';
import { Routes, Route, useLocation } from 'react-router-dom';

import Navbar from './components/Navbar/Navbar';
import Home from './pages/Home/Home';
import Explore from './pages/Explore/Explore';
import Inbox from './pages/Inbox/Inbox';
import Reels from './pages/Reels/Reels';
import PersonalPage from './pages/PersonalPage/PersonalPage';
import { logo } from './assets/image/instagram';
import { UserAuth } from './components/Context/AuthContext';

import { useState } from 'react';
import AccountEdit from './pages/AccountEdit/AccountEdit';
import CreatePost from './components/CreatePost/CreatePost';
import PostDetail from './components/PostDetail/PostDetail';

const cx = classNames.bind(styles);

function App() {
    let { pathname } = useLocation();
    const [clickSeeMore, setClickSeeMore] = useState(false);

    const [form, setForm] = useState('login');
    const [error, setError] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const { user, signUp, login } = UserAuth();

    const [page, setPage] = useState(() => {
        return pathname.slice(1) === '' ? 'home' : pathname.slice(1);
    });

    const handleLogin = async () => {
        setError('');

        try {
            await login(email, password);
            setEmail('');
            setPassword('');
        } catch (error) {
            console.log(error);
            setError(error?.message);
        }
    };
    const handleRegister = async () => {
        const regex =
            /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

        if (!regex.test(email)) {
            alert('Email is WRONG ! Please re-enter!');
            return;
        }
        if (password.trim().length < 6) {
            alert('Password must be at least 6 characters! Please re-enter!');
            return;
        }
        if (password.trim() !== confirmPassword.trim()) {
            alert('Password and confirm password do not match ! Please re-enter!');
            return;
        }

        try {
            alert('Successfully signed up');
            await signUp(email, password);
            setForm('login');
            setEmail('');
            setPassword('');
            setConfirmPassword('');
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            {user ? (
                <div
                    className={cx('App')}
                    onClick={(e) => {
                        setClickSeeMore(false);
                    }}
                >
                    <Navbar
                        page={page}
                        setPage={setPage}
                        clickSeeMore={clickSeeMore}
                        setClickSeeMore={setClickSeeMore}
                        pathname={pathname}
                    />
                    <div className={cx('page-wrapper')}>
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/explore" element={<Explore />} />
                            <Route path="/videos" element={<Reels />} />
                            <Route path="/inbox" element={<Inbox />} />
                            <Route path="/personalpage" element={<PersonalPage />} />
                            <Route path="/account/edit" element={<AccountEdit />} />
                            <Route path="/:idPost" element={<PostDetail />} />
                        </Routes>
                    </div>
                    {page === 'create' && <CreatePost page={page} pathname={pathname} setPage={setPage} />}
                </div>
            ) : (
                <div className={cx('login-wrapper')}>
                    <div className={cx('img-slider')}>
                        <div className={cx('slider')}></div>
                    </div>
                    <div className={cx('form')}>
                        <div className={cx('icon')}>{logo}</div>
                        {form === 'login' ? (
                            <div className={cx('input-wrap')}>
                                {error && <p className={cx('error')}>{error}</p>}
                                <input
                                    value={email}
                                    onInput={(e) => {
                                        setEmail(e.target.value);
                                    }}
                                    type="text"
                                    placeholder="Email"
                                />
                                <input
                                    value={password}
                                    onInput={(e) => {
                                        setPassword(e.target.value);
                                    }}
                                    type="password"
                                    placeholder="M???t kh???u"
                                />
                                <button onClick={handleLogin}>????ng nh???p</button>
                            </div>
                        ) : (
                            <div className={cx('input-wrap')}>
                                <input
                                    value={email}
                                    onInput={(e) => {
                                        setEmail(e.target.value);
                                    }}
                                    type="text"
                                    placeholder="Email"
                                />
                                <input
                                    value={password}
                                    onInput={(e) => {
                                        setPassword(e.target.value);
                                    }}
                                    type="password"
                                    placeholder="M???t kh???u"
                                />
                                <input
                                    value={confirmPassword}
                                    onInput={(e) => {
                                        setConfirmPassword(e.target.value);
                                    }}
                                    type="password"
                                    placeholder="Nh???p l???i m???t kh???u"
                                />
                                <button onClick={handleRegister}>????ng k??</button>
                            </div>
                        )}
                        <p className={cx('or')}>Ho???c</p>
                        <div>
                            {form === 'login' ? (
                                <p className={cx('change')}>
                                    B???n ch??a c?? t??i kho???n ??? <span onClick={(e) => setForm('register')}>????ng k??</span>
                                </p>
                            ) : (
                                <p className={cx('change', 'change-login')}>
                                    B???n ???? c?? t??i kho???n ? <span onClick={(e) => setForm('login')}>????ng nh???p</span>
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default App;
