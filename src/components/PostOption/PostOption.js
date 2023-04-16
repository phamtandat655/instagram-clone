import classNames from 'classnames/bind';
import styles from './PostOption.module.scss';

import { db } from '../../firebase';
import { doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { UserAuth } from '../../Context/AuthContext';

const cx = classNames.bind(styles);

function PostOption({ post, ownPost, setHidePostOption, followings }) {
    const { user } = UserAuth();

    const handleClick = async (e) => {
        if (ownPost === true) {
            if (window.confirm('Bạn có muốn xóa bài viết ?')) {
                await deleteDoc(doc(db, 'posts', `${post?.id}`));
            }
        } else {
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
                {(followings.filter((following) => following?.User?.information.email !== post?.useremail) ||
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
