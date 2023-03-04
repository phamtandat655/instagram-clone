import classNames from 'classnames/bind';
import { useRef, useState, useEffect } from 'react';
import { ImageUploadIcon, PlusIcon } from '../../assets/Icons/Icons';
import Account from '../Account/Account';
import styles from './CreatePost.module.scss';

import { UserAuth } from '../../components/Context/AuthContext';
import { onSnapshot, doc, addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { db } from '../../firebase';

const cx = classNames.bind(styles);

function CreatePost({ page, setPage, pathname }) {
    const [avatar, setAvatar] = useState('');
    const [name, setName] = useState('');
    const [textValue, setTextValue] = useState('');
    const [img, setImg] = useState('');
    const [file, setFile] = useState(null);
    const [progress, setProgress] = useState(0);
    const [video, setVideo] = useState('');
    const [type, setType] = useState('');

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

    const handleShowImg = (e) => {
        if (e.target.files[0]) {
            setFile(e.target.files[0]);
        }
        const file = e.target.files[0];
        showFile(file);
    };

    const storage = getStorage();
    const handleUpload = (e) => {
        const storageRef = ref(storage, `images/${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
            'state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setProgress(progress);
                console.log(progress);
                switch (snapshot.state) {
                    case 'paused':
                        // console.log('Upload is paused');
                        break;
                    case 'running':
                        // console.log('Upload is running');
                        break;
                    default:
                        break;
                }
            },
            (error) => {
                alert(error.message);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
                    await addDoc(collection(db, 'posts'), {
                        timestampSecond: Math.floor(Date.now() / 1000),
                        timestamp: serverTimestamp(),
                        caption: textValue,
                        url: {
                            src: downloadURL,
                            type,
                        },
                        username: name,
                        useremail: user?.email,
                    });
                    handleClose();
                });
            },
        );
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
                setType('image');
            };
            fileReader.readAsDataURL(file);
        } else if (fileType === 'video/mp4') {
            const video = URL.createObjectURL(file);
            setVideo(video);
            setType('video');
        } else {
            alert('Day khong phai anh , video !');
        }
    };

    const handleClose = () => {
        let path = pathname.slice(1) === '' ? 'home' : pathname.slice(1);
        setPage(path);
        setTextValue('');
        setImg('');
        setFile(null);
    };

    const handleClickPlusIcon = (e) => {
        // inputFileRef.current.click();
    };

    return (
        <div className={cx('wrapper', page === 'create' ? 'show' : 'hide')}>
            <div className={cx('upload-container')}>
                <span
                    className={cx('progress')}
                    style={{
                        width: `${progress}%`,
                    }}
                ></span>
                <p className={cx('close-icon')} onClick={handleClose}>
                    X
                </p>
                <div className={cx('caption-zone')}>
                    <div className={cx('account-wrap')}>
                        <Account name={name} img={avatar} />
                        <button onClick={handleUpload}>Chia sẻ</button>
                    </div>
                    <div className={cx('input-wrapper')} onClick={handleTextAraeClick}>
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
                    {img !== '' && (
                        <p className={cx('plus-icon')} onClick={handleClickPlusIcon}>
                            {PlusIcon}
                        </p>
                    )}
                    {img !== '' || video !== '' ? (
                        img !== '' ? (
                            Array.isArray(img) === true ? (
                                <div className={cx('img-slider')}>
                                    {img.map((imgSrc, index) => (
                                        <img alt="post" src={imgSrc} key={index} />
                                    ))}
                                </div>
                            ) : (
                                <img alt="post" src={img} />
                            )
                        ) : (
                            <video width="400" autoPlay loop muted>
                                <source src={video} type="video/mp4" />
                            </video>
                        )
                    ) : (
                        <div>
                            <div className={cx('text-center')}>{ImageUploadIcon}</div>
                            <header>Kéo ảnh vào đây</header>
                            <button onClick={handleOpenUploadImg}>Chọn từ máy tính</button>
                            <input type="file" hidden ref={inputFileRef} onChange={handleShowImg} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default CreatePost;
