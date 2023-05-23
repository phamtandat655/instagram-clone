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
                name: file.name,
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
                                reels: false,
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
            return file;
        });
    };

    const handleUploadToReels = async (e) => {
        setWaitLoad(true);
        const arrUrls = [];

        if (uploadArray.length > 1 || !uploadArray[0].type.includes('video')) {
            alert('Reels chỉ đăng được 1 VIDEO');
            setWaitLoad(false);
            return;
        }

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
                                reels: true,
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
            return file;
        });
    };

    const handleUploadToStory = async (e) => {
        setWaitLoad(true);
        const arrUrls = [];

        if (textValue.length > 0) {
            alert('Story không có caption !');
            setWaitLoad(false);
            return;
        }

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
                            addDoc(collection(db, 'stories'), {
                                timestampSecond: Math.floor(Date.now() / 1000),
                                timestamp: serverTimestamp(),
                                url: arrUrls,
                                username: name,
                                useremail: user?.email,
                                useravatar: avatar,
                            });
                            handleClose();
                        }
                    });
                },
            );
            return file;
        });
    };

    const handleDropImg = (e) => {
        e.preventDefault();

        const files = e.dataTransfer.files;
        if (files) {
            setWaitLoad(false);
        }
        setFiles((prev) => prev.concat(Array.from(files)));
        for (let file of files) {
            showFile(file);
        }
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
                    name: file.name,
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
                name: file.name,
            };
            setUploadArray((previous) => previous.concat(fileUrl));
        }
    };

    function deleteHandler(file, src) {
        setUploadArray(uploadArray.filter((e) => e.src !== src));
        setFiles(files.filter((f) => f.name !== file.name));
        URL.revokeObjectURL(src);

        if (uploadArray.length <= 1) {
            setWaitLoad(true);
        }
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
                        <div>
                            <button
                                onClick={handleUploadToStory}
                                className={cx('reels-btn', { wait: waitLoad })}
                                disabled={waitLoad}
                            >
                                Story
                            </button>
                            <button
                                onClick={handleUploadToReels}
                                className={cx('reels-btn', { wait: waitLoad })}
                                disabled={waitLoad}
                            >
                                Reels
                            </button>
                            <button onClick={handleUpload} className={cx({ wait: waitLoad })} disabled={waitLoad}>
                                Chia sẻ
                            </button>
                        </div>
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
                                                    onClick={() => deleteHandler(file, file.src)}
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
                                                    onClick={() => deleteHandler(file, file.src)}
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
                                <button onClick={handleOpenUploadImg}>Chọn từ máy</button>
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
