import classNames from 'classnames/bind';
import styles from './PostOption.module.scss';

import { db } from '../../firebase';
import { doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { UserAuth } from '../../Context/AuthContext';
import { useNavigate } from 'react-router-dom';

import { getStorage, ref, deleteObject } from 'firebase/storage';

const cx = classNames.bind(styles);

function PostOption({ post, ownPost, setHidePostOption, followings, page }) {
    const { user } = UserAuth();
    const nav = useNavigate();
    const storage = getStorage();

    const handleClick = async (e) => {
        if (ownPost === true) {
            if (window.confirm('Bạn có muốn xóa bài viết ?')) {
                nav(`/${page === 'home' ? '' : page}`);
                await deleteDoc(doc(db, 'posts', `${post?.id}`));
                post?.url.forEach((url) => {
                    // Create a reference to the file to delete
                    const desertRef = ref(storage, `files/${url.src.split('files%2F')[1].split('?alt')[0]}`);
                    // Delete the file
                    deleteObject(desertRef)
                        .then(() => {
                            // File deleted successfully
                            // console.log('xoa files thanh cong !');
                        })
                        .catch((error) => {
                            // Uh-oh, an error occurred!
                            console.log(error);
                        });
                });
            }
        } else {
            if (followings.find((following) => following?.User?.information.email === post?.useremail)) {
                if (window.confirm('Bạn có muốn hủy theo dõi ?')) {
                    const docRef = doc(db, 'users', `${user?.email}`);
                    let newFollowings = followings.filter(
                        (following) => following?.User?.information.email !== post?.useremail,
                    );
                    await updateDoc(docRef, {
                        follows: [...newFollowings],
                    });
                    setHidePostOption(true);
                }
            }
        }
    };

    return (
        <div
            className={cx('wrapper')}
            onClick={(e) => {
                setHidePostOption(true);
                e.stopPropagation();
            }}
        >
            <div className={cx('post-option-container')}>
                {(followings.find((following) => following?.User?.information.email === post?.useremail) ||
                    ownPost === true) && (
                    <div
                        onClick={(e) => {
                            e.stopPropagation();
                            handleClick(e);
                        }}
                    >
                        {ownPost === true ? 'Xóa bài viết' : ' Bỏ theo dõi'}
                    </div>
                )}
                <div
                    onClick={(e) => {
                        setHidePostOption(true);
                        e.stopPropagation();
                    }}
                >
                    Hủy
                </div>
            </div>
        </div>
    );
}

export default PostOption;
