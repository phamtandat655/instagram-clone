import classNames from 'classnames/bind';
import { useRef, useState, useEffect } from 'react';
import { ImageUploadIcon } from '../../assets/Icons/Icons';
import Account from '../Account/Account';
import styles from './CreatePost.module.scss';

import { UserAuth } from '../../components/Context/AuthContext';
import { onSnapshot, doc } from 'firebase/firestore';
import { db } from '../../firebase';

const cx = classNames.bind(styles);

function CreatePost({ page, setPage, pathname }) {
    const [avatar, setAvatar] = useState('');
    const [name, setName] = useState('');
    const [textValue, setTextValue] = useState('');
    const [img, setImg] = useState('');

    const { user } = UserAuth();
    useEffect(() => {
        onSnapshot(doc(db, 'users', `${user.email}`), (doc) => {
            setAvatar(doc.data()?.information.avatar);
            setName(doc.data()?.information.name);
        });
    }, [user?.email]);

    const textAreaRef = useRef();
    const inputFileRef = useRef();

    const handleTextAraeClick = () => {
        textAreaRef.current.focus();
    };
    const handleOpenUploadImg = () => {
        inputFileRef.current.click();
    };

    const handleUploadImg = (e) => {
        const file = e.target.files[0];
        showFile(file);
    };

    const handleDropImg = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        showFile(file);
    };

    const showFile = (file) => {
        const fileType = file.type;
        const validExtensions = ['image/jpeg', 'image/jpg', 'image/png'];
        if (validExtensions.includes(fileType)) {
            const fileReader = new FileReader();
            fileReader.onload = () => {
                const fileUrl = fileReader.result;
                setImg(fileUrl);
            };
            fileReader.readAsDataURL(file);
        } else {
            alert('Day khong phai anh');
        }
    };

    const handleClose = () => {
        let path = pathname.slice(1) === '' ? 'home' : pathname.slice(1);
        setPage(path);
        setTextValue('');
        setImg('');
    };

    return (
        <div className={cx('wrapper', page === 'create' ? 'show' : 'hide')}>
            <div className={cx('upload-container')}>
                <p className={cx('close-icon')} onClick={handleClose}>
                    X
                </p>
                <div className={cx('caption-zone')}>
                    <div className={cx('account-wrap')}>
                        <Account name={name} img={avatar} />
                        <button>Chia sẻ</button>
                    </div>
                    <div className={cx('input-wrapper')} onClick={handleTextAraeClick}>
                        {/* <input type="text" /> */}
                        <textarea
                            placeholder="Viết chú thích..."
                            ref={textAreaRef}
                            value={textValue}
                            onChange={(e) => {
                                setTextValue(e.target.value);
                            }}
                        />
                    </div>
                </div>
                <div
                    className={cx('image-zone')}
                    onDrop={(e) => {
                        handleDropImg(e);
                    }}
                    onDragOver={(e) => {
                        e.preventDefault();
                    }}
                >
                    {img !== '' ? (
                        <img alt="post" src={img} />
                    ) : (
                        <div>
                            <div className={cx('text-center')}>{ImageUploadIcon}</div>
                            <header>Kéo ảnh vào đây</header>
                            <button onClick={handleOpenUploadImg}>Chọn từ máy tính</button>
                            <input
                                type="file"
                                hidden
                                ref={inputFileRef}
                                onChange={(e) => {
                                    handleUploadImg(e);
                                }}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default CreatePost;
