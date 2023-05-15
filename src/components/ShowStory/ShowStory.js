import classNames from 'classnames/bind';
import styles from './ShowStory.module.scss';
import Account from '../Account/Account';
import { HeartIcon, PlayIcon, ThreeDotsIcon, VolumeIcon } from '../../assets/Icons/Icons';
import { PostIcon } from '../../assets/Icons/Icons';

const cx = classNames.bind(styles);

function ShowStory() {
    return (
        <div className={cx('wrapper')}>
            <div className={cx('showstory-container')}>
                <div className={cx('showstory-top')}>
                    <div className={cx('showstory-top--info')}>
                        <Account
                            name="Pham Tan Dat"
                            img="https://firebasestorage.googleapis.com/v0/b/instagram-clone-c4282.appspot.com/o/files%2F12523558_530604130450323_583093592_n.jpg?alt=media&token=3879d764-d222-479c-8f75-9adf7d503a9e"
                        />
                        <p className={cx('showstory-top--info__time')}>18 gio truoc</p>
                    </div>
                    <div className={cx('showstory-top--option')}>
                        <p>
                            <PlayIcon />
                        </p>
                        <p>
                            <VolumeIcon />
                        </p>
                        <p>
                            <ThreeDotsIcon />
                        </p>
                    </div>
                </div>
                <div className={cx('showstory-mid')}>
                    <img
                        alt="story"
                        src="https://firebasestorage.googleapis.com/v0/b/instagram-clone-c4282.appspot.com/o/files%2F12523558_530604130450323_583093592_n.jpg?alt=media&token=3879d764-d222-479c-8f75-9adf7d503a9e"
                    />
                </div>
                <div className={cx('showstory-bottom')}>
                    <div>
                        <input type="text" placeholder={`Trả lời...`} />
                    </div>
                    <p>
                        <HeartIcon />
                    </p>
                    <p>
                        <PostIcon />
                    </p>
                </div>
            </div>
        </div>
    );
}

export default ShowStory;
