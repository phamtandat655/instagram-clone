import classNames from 'classnames/bind';
import styles from './ReelVideo.module.scss';
import { VolumeIcon, VolumeMutedIcon, PlayIcon, LikeIcon, LikedIcon, CmtIcon } from '../../assets/Icons/Icons';
import { doc, updateDoc, onSnapshot, addDoc, serverTimestamp, collection, orderBy, query } from 'firebase/firestore';
import Account from '../Account/Account';
import Comment from '../Comment/Comment';
import { db } from '../../firebase';
import { useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';

const cx = classNames.bind(styles);

function ReelVideo({ reel, user, username, userAvatar }) {
    const [seeMore, setSeeMore] = useState(false);
    const [muted, setMuted] = useState(true);
    const [pause, setPause] = useState(true);
    const [avatar, setAvatar] = useState('');
    const [likedsList, setLikedsList] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [comments, setComments] = useState([]);
    const [showCmtsModal, setShowCmtsModal] = useState(false);

    const videoRef = useRef();
    const nav = useNavigate();

    useEffect(() => {
        onSnapshot(doc(db, 'users', `${reel?.useremail}`), (doc) => {
            setAvatar(doc.data()?.information.avatar);
        });

        const unsubcribe3 = onSnapshot(doc(db, 'posts', `${reel?.id}`), (doc) => {
            setLikedsList(doc.data()?.likeds);
        });

        const q2 = query(collection(db, `posts/${reel?.id}/comments`), orderBy('timestamp', 'desc'));
        const unsubcribe2 = onSnapshot(q2, (snapshot) => {
            let newComments = [];
            snapshot.forEach((doc) => {
                newComments.push({
                    id: doc.id,
                    ...doc.data(),
                });
            });
            setComments(newComments);
        });

        return () => {
            unsubcribe2();
            unsubcribe3();
        };
    }, [reel]);

    const handleClickVideo = (e) => {
        if (videoRef.current.paused === false) {
            videoRef.current.pause();
            setPause(true);
        } else {
            videoRef.current.play();
            setPause(false);
        }
    };
    const handleVolume = (e) => {
        if (videoRef.current.muted === true) {
            setMuted(false);
        } else {
            setMuted(true);
        }
    };

    const handleCaption = (caption) => {
        let newCap = caption.split('');
        if (newCap.length < 40) return caption;
        else {
            if (seeMore === false) {
                return caption.slice(0, 40) + ' ...Xem thêm';
            }
            for (let i = 1; i <= caption.length; i++) {
                if (i % 40 === 0) {
                    newCap.splice(i, 0, <br key={i} />);
                }
            }
        }
        return newCap;
    };

    const handleClickLike = (e) => {
        if (likedsList.includes(user?.email)) {
            handleUnLikePost();
        } else {
            handleLikePost();
        }
    };

    const handleLikePost = async () => {
        const docRef = doc(db, 'posts', `${reel?.id}`);
        await updateDoc(docRef, {
            likeds: [...likedsList, user?.email],
        });
    };
    const handleUnLikePost = async () => {
        const docRef = doc(db, 'posts', `${reel?.id}`);
        let newLikeds = likedsList.filter((likedIdPost) => likedIdPost !== user?.email);
        await updateDoc(docRef, {
            likeds: [...newLikeds],
        });
    };
    const handleUploadComment = (e) => {
        addDoc(collection(db, `posts/${reel?.id}/comments`), {
            timestampSecond: Math.floor(Date.now() / 1000),
            timestamp: serverTimestamp(),
            comment: inputValue,
            username: username,
            useremail: user?.email,
        });
        setInputValue('');
    };

    return (
        <div className={cx('video-wrapper')}>
            {showCmtsModal === true && (
                <div className={cx('cmt-modal')} onClick={(e) => setShowCmtsModal(false)}>
                    <div className={cx('cmt-container')} onClick={(e) => e.stopPropagation()}>
                        <div className={cx('cmt-header')}>
                            <strong>Bình luận</strong>
                            <i className={cx('cmt-header--icon')} onClick={(e) => setShowCmtsModal(false)}>
                                X
                            </i>
                        </div>
                        <div className={cx('cmt-list')}>
                            {comments.map((cmt, index) => (
                                <Comment cmt={cmt} key={index} />
                            ))}
                        </div>
                        <div className={cx('upload-cmt')}>
                            <img alt="avatar-upload-cmt" src={userAvatar} />
                            <input
                                type="text"
                                placeholder="Thêm bình luận..."
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.code === 'Enter') {
                                        if (inputValue.length === 0) return;
                                        else handleUploadComment();
                                    }
                                }}
                            />
                            <button disabled={inputValue.length === 0} onClick={handleUploadComment}>
                                Đăng
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <div className={cx('account-wrapper')}>
                <div onClick={(e) => nav(`/personalPage/${reel.useremail}`)}>
                    <Account name={reel?.username} img={avatar} />
                </div>
                <p
                    className={cx('account-wrapper--caption')}
                    onClick={(e) => {
                        setSeeMore(!seeMore);
                    }}
                >
                    {handleCaption(reel?.caption)}
                </p>
            </div>
            <div className={cx('video-container')}>
                {pause === true && (
                    <p
                        className={cx('pause-icon')}
                        onClick={handleClickVideo}
                        onDoubleClick={(e) => e.stopPropagation()}
                    >
                        {PlayIcon}
                    </p>
                )}
                <p className={cx('volume-icon')} onClick={handleVolume} onDoubleClick={(e) => e.stopPropagation()}>
                    {muted ? VolumeMutedIcon : VolumeIcon}
                </p>
                <video
                    ref={videoRef}
                    width="400"
                    // autoPlay
                    onClick={handleClickVideo}
                    loop
                    muted={muted}
                    className={cx('video')}
                >
                    <source src={reel?.url[0].src} type="video/mp4" />
                </video>
            </div>
            <div className={cx('icons-container')}>
                <div className={cx('like-wrapper')}>
                    <p onClick={(e) => handleClickLike()}>{likedsList.includes(user?.email) ? LikedIcon : LikeIcon}</p>
                    <p>{reel?.likeds.length}</p>
                </div>
                <div className={cx('cmt-wrapper')} onClick={(e) => setShowCmtsModal(true)}>
                    <p>{CmtIcon}</p>
                    <p>{comments.length}</p>
                </div>
            </div>
        </div>
    );
}

export default ReelVideo;
