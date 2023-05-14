import styles from './App.module.scss';
import classNames from 'classnames/bind';
import { Routes, Route, useLocation } from 'react-router-dom';

import Navbar from './components/Navbar/Navbar';
import { logo } from './assets/image/instagram';
import { UserAuth } from './Context/AuthContext';
import React, { lazy, useEffect, useState } from 'react';

import CreatePost from './components/CreatePost/CreatePost';
import Loader from './components/Loader/Loader';

import { publicRoutes } from './routes/routes';
const PostDetail = lazy(() => import('./components/PostDetail/PostDetail'));

const cx = classNames.bind(styles);

function App() {
    let { pathname } = useLocation();
    const [idpost, setIdpost] = useState('');
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
    console.log(`1 : ${page}`);
    useEffect(() => {
        let path = pathname.slice(1) === '' ? 'home' : pathname.slice(1);
        if (path !== idpost) {
            if (page === 'search' || page === 'notify' || page === 'create') {
                return;
            } else {
                setPage(path);
            }
        }
    }, [page, pathname, idpost]);

    const handleLogin = async (e) => {
        e.preventDefault();
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
    const handleRegister = async (e) => {
        e.preventDefault();

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
                            {publicRoutes.map((route, index) => {
                                const Page = route.component;
                                return (
                                    <Route
                                        key={index}
                                        path={route.path}
                                        element={
                                            <React.Suspense fallback={<Loader />}>
                                                <Page />
                                            </React.Suspense>
                                        }
                                    />
                                );
                            })}
                            <Route
                                path="/:idPost"
                                element={
                                    <React.Suspense fallback={<Loader />}>
                                        <PostDetail
                                            page={page}
                                            setPage={setPage}
                                            setIdpost={setIdpost}
                                            pathname={pathname}
                                        />
                                    </React.Suspense>
                                }
                            />
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
                            <form className={cx('input-wrap')}>
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
                                    placeholder="Mật khẩu"
                                />
                                <button type="submit" onClick={handleLogin}>
                                    Đăng nhập
                                </button>
                            </form>
                        ) : (
                            <form className={cx('input-wrap')}>
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
                                    placeholder="Mật khẩu"
                                />
                                <input
                                    value={confirmPassword}
                                    onInput={(e) => {
                                        setConfirmPassword(e.target.value);
                                    }}
                                    type="password"
                                    placeholder="Nhập lại mật khẩu"
                                />
                                <button type="submit" onClick={handleRegister}>
                                    Đăng ký
                                </button>
                            </form>
                        )}
                        <p className={cx('or')}>Hoặc</p>
                        <div>
                            {form === 'login' ? (
                                <p className={cx('change')}>
                                    Bạn chưa có tài khoản ư? <span onClick={(e) => setForm('register')}>Đăng ký</span>
                                </p>
                            ) : (
                                <p className={cx('change', 'change-login')}>
                                    Bạn đã có tài khoản ? <span onClick={(e) => setForm('login')}>Đăng nhập</span>
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
