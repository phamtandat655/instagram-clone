import classNames from 'classnames/bind';
import styles from './ShowStory.module.scss';
import Account from '../Account/Account';
import { PlayStoryIcon, PauseStoryIcon, ThreeDotsStoryIcon } from '../../assets/Icons/Icons';
import { useState } from 'react';
import SwipperStory from '../SwipperStory/SwipperStory';

const cx = classNames.bind(styles);

function ShowStory({ showStory, setShowStory, usersStory }) {
    // const [inputValue, setInputValue] = useState('');
    const [pause, setPause] = useState(false);

    return (
        <div className={cx('wrapper', { hide: !showStory })} onClick={(e) => setShowStory(false)}>
            <i
                className={cx('icon-close')}
                onClick={(e) => {
                    setShowStory(false);
                }}
            >
                X
            </i>
            <div
                className={cx('showstory-container')}
                // , { blur: inputValue.length > 0 }
                onClick={(e) => e.stopPropagation()}
            >
                <div className={cx('showstory-top')}>
                    <div className={cx('showstory-top-info')}>
                        <Account
                            name={usersStory[0].username || ''}
                            img={
                                usersStory[0].useravatar ||
                                'http://phunuvietnam.mediacdn.vn/media/news/33abffcedac43a654ac7f501856bf700/anh-profile-tiet-lo-g-ve-ban-1.jpg'
                            }
                            // img="https://media-cdn-v2.laodong.vn/Storage/NewsPortal/2022/1/18/996173/Style_61E4d4fee07cd.jpg"
                        />
                    </div>
                    <div className={cx('showstory-top-option')}>
                        <p
                            onClick={(e) => {
                                e.stopPropagation();
                                setPause(!pause);
                            }}
                        >
                            {pause === false ? PauseStoryIcon : PlayStoryIcon}
                        </p>
                        <p>{ThreeDotsStoryIcon}</p>
                    </div>
                </div>
                <div className={cx('showstory-mid')}>
                    {usersStory && (
                        <SwipperStory
                            usersStory={usersStory}
                            showStory={showStory}
                            pause={pause}
                            setShowStory={setShowStory}
                        />
                    )}
                </div>
                {/* <div className={cx('showstory-bottom')}>
                    <div>
                        <input
                            className={cx('reply')}
                            type="text"
                            placeholder={`Trả lời ${123}...`}
                            onChange={(e) => setInputValue(e.target.value)}
                            value={inputValue}
                        />
                    </div>
                    <button
                        disabled={inputValue.length > 0 ? true : false}
                        className={cx({ 'color-white': inputValue.length > 0 })}
                    >
                        Gửi
                    </button>
                </div> */}
            </div>
        </div>
    );
}

export default ShowStory;
