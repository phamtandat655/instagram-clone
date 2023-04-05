import classNames from 'classnames/bind';
import styles from './AccountEdit.module.scss';

import { useState, useEffect, useRef } from 'react';
import { UserAuth } from '../../Context/AuthContext';
import { onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { db } from '../../firebase';

import { useNavigate } from 'react-router-dom';

const cx = classNames.bind(styles);

function AccountEdit() {
    const [avatar, setAvatar] = useState('');
    const [name, setName] = useState('');
    const [desc, setDesc] = useState('');
    const [progress, setProgress] = useState(0);
    const [hideBar, setHideBar] = useState(true);
    const { user } = UserAuth();

    const fileRef = useRef();
    const nav = useNavigate();

    useEffect(() => {
        onSnapshot(doc(db, 'users', `${user.email}`), (doc) => {
            setAvatar(doc.data()?.information.avatar);
            setName(doc.data()?.information.name);
            setDesc(doc.data()?.information.desc);
        });
    }, [user?.email]);

    useEffect(() => {
        if (progress === 100) {
            setHideBar(true);
        } else {
            setHideBar(false);
        }
    }, [progress]);

    const handleSubmit = async () => {
        const docRef = doc(db, 'users', `${user.email}`);
        await updateDoc(docRef, {
            information: {
                email: user?.email,
                name,
                desc,
                avatar,
            },
        });
        nav(`/personalPage/${user?.email}`);
    };
    const handleImgUpload = () => {
        fileRef.current.click();
    };

    const storage = getStorage();
    const handleChangeImg = (e) => {
        const imgFile = e.target.files[0];
        const storageRef = ref(storage, `images/${imgFile.name}`);
        const uploadTask = uploadBytesResumable(storageRef, imgFile);

        uploadTask.on(
            'state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setProgress(progress);
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
                    await updateDoc(doc(db, 'users', `${user?.email}`), {
                        information: {
                            avatar: downloadURL,
                            name,
                            desc,
                        },
                    });
                });
            },
        );
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('account-wrapper')}>
                <span
                    className={cx('progress', { hide: hideBar })}
                    style={{
                        width: `${progress}%`,
                    }}
                ></span>
                <div className={cx('avatar-wrapper')}>
                    <img alt="avatar" src={avatar} />
                </div>
                <div className={cx('emailAndAvatar-wrapper')}>
                    <p>{user?.email}</p>
                    <div onClick={handleImgUpload}>
                        <span>Thay đổi ảnh đại diện</span>
                        <input type="file" onChange={handleChangeImg} hidden ref={fileRef} />
                    </div>
                </div>
            </div>
            <div className={cx('input-wrapper')}>
                <span>Email : </span>
                <input type="text" disabled value={user?.email || ''} onChange={(e) => user?.email} />
            </div>
            <div className={cx('input-wrapper')}>
                <span>Tên : </span>
                <input
                    type="text"
                    onChange={(e) => {
                        setName(e.target.value);
                    }}
                    value={name || ''}
                />
            </div>
            <div className={cx('input-wrapper')}>
                <span>Mô tả : </span>
                <input
                    type="text"
                    onChange={(e) => {
                        setDesc(e.target.value);
                    }}
                    value={desc || ''}
                />
            </div>
            <div className={cx('submit-btn')} onClick={handleSubmit}>
                <button>Gửi</button>
            </div>
        </div>
    );
}

export default AccountEdit;
