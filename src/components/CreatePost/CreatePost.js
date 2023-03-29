import classNames from 'classnames/bind';
import { useRef, useState, useEffect } from 'react';
import { ImageUploadIcon, PlusIcon } from '../../assets/Icons/Icons';
import Account from '../Account/Account';
import styles from './CreatePost.module.scss';

import { UserAuth } from '../../Context/AuthContext';
import { onSnapshot, doc, addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { db } from '../../firebase';

const cx = classNames.bind(styles);

function CreatePost({ page, setPage, pathname }) {
    const [avatar, setAvatar] = useState('');
    const [name, setName] = useState('');
    const [textValue, setTextValue] = useState('');
    const [uploadArray, setUploadArray] = useState([]);
    const [files, setFiles] = useState([]);
    const [progress, setProgress] = useState(0);
    const [waitLoad, setWaitLoad] = useState(true);

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
        if (e.target.files) {
            setWaitLoad(false);
        }
        const selectedFiles = e.target.files;
        const selectedFilesArray = Array.from(selectedFiles);

        setFiles((prev) => prev.concat(selectedFilesArray));

        const imagesArray = selectedFilesArray.map((file) => {
            const upload = {
                type: file.type,
                src: URL.createObjectURL(file),
            };
            return upload;
        });

        setUploadArray((previousImages) => previousImages.concat(imagesArray));

        // FOR BUG IN CHROME
        e.target.value = '';
    };

    const storage = getStorage();
    const handleUpload = async (e) => {
        setWaitLoad(true);
        const arrUrls = [];

        files.map((file) => {
            const storageRef = ref(storage, `files/${file.name}`);
            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setProgress(progress);

                    switch (snapshot.state) {
                        case 'paused':
                            break;
                        case 'running':
                            break;
                        default:
                            break;
                    }
                },
                (error) => {
                    alert(error.message);
                },
                async () => {
                    await getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        arrUrls.push({ src: downloadURL, type: file.type });
                        if (arrUrls.length === uploadArray.length) {
                            addDoc(collection(db, 'posts'), {
                                likeds: [],
                                timestampSecond: Math.floor(Date.now() / 1000),
                                timestamp: serverTimestamp(),
                                caption: textValue,
                                url: arrUrls,
                                username: name,
                                useremail: user?.email,
                            });
                            handleClose();
                        }
                    });
                },
            );
        });
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
                const fileUrl = {
                    src: fileReader.result,
                    type: fileType,
                };
                const fileUrlArr = [fileUrl];
                setUploadArray((previousImages) => previousImages.concat(fileUrlArr));
            };
            fileReader.readAsDataURL(file);
        } else if (fileType === 'video/mp4') {
            const video = URL.createObjectURL(file);
            const fileUrl = {
                src: video,
                type: fileType,
            };
            setUploadArray((previous) => previous.concat(fileUrl));
        } else {
            alert('Day khong phai anh , video !');
        }
    };

    function deleteHandler(image) {
        setUploadArray(uploadArray.filter((e) => e.src !== image));
        URL.revokeObjectURL(image);
    }

    const handleClose = () => {
        let path = pathname.slice(1) === '' ? 'home' : pathname.slice(1);
        setPage(path);
        setTextValue('');
        setUploadArray([]);
        setFiles([]);
    };

    const handleClickPlusIcon = (e) => {
        inputFileRef.current.click();
    };

    return (
        <div className={cx('wrapper', page === 'create' ? 'show' : 'hide')} onClick={handleClose}>
            <div
                className={cx('upload-container')}
                onClick={(e) => {
                    e.stopPropagation();
                }}
            >
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
                        <button onClick={handleUpload} className={cx({ wait: waitLoad })} disabled={waitLoad}>
                            Chia sẻ
                        </button>
                    </div>
                    <div className={cx('input-wrapper')} onClick={handleTextAraeClick}>
                        <textarea
                            placeholder="Viết chú thích..."
                            ref={textAreaRef}
                            value={textValue}
                            onChange={(e) => {
                                setTextValue(e.target.value);
                                if (e.target.value.length > 0) setWaitLoad(false);
                                else if (files.length === 0) setWaitLoad(true);
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
                    <div>
                        {uploadArray.length > 0 && (
                            <div className={cx('img-slider')}>
                                {uploadArray.map((file, index) => {
                                    if (file.type === 'video/mp4') {
                                        return (
                                            <div className={cx('upload-wrapper')} key={index}>
                                                <video width="400" autoPlay loop muted>
                                                    <source src={file.src} type="video/mp4" />
                                                </video>
                                                <button
                                                    className={cx('btn-delete')}
                                                    onClick={() => deleteHandler(file.src)}
                                                >
                                                    delete
                                                </button>
                                            </div>
                                        );
                                    } else {
                                        return (
                                            <div className={cx('upload-wrapper')} key={index}>
                                                <img alt="upload" src={file.src} />
                                                <button
                                                    className={cx('btn-delete')}
                                                    onClick={() => deleteHandler(file.src)}
                                                >
                                                    delete
                                                </button>
                                            </div>
                                        );
                                    }
                                })}
                            </div>
                        )}
                        {uploadArray.length > 0 ? (
                            <p className={cx('plus-icon')} onClick={handleClickPlusIcon}>
                                {PlusIcon}
                            </p>
                        ) : (
                            <div>
                                <div className={cx('text-center')}>{ImageUploadIcon}</div>
                                <header>Kéo ảnh vào đây</header>
                                <button onClick={handleOpenUploadImg}>Chọn từ máy tính</button>
                            </div>
                        )}
                        <input
                            type="file"
                            hidden
                            multiple
                            accept="image/jpeg, image/jpg, image/png , video/mp4"
                            ref={inputFileRef}
                            onChange={handleShowImg}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CreatePost;
