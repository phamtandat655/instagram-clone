import classNames from 'classnames/bind';
import styles from './PostVideo.module.scss';
import { memo, useRef, useState } from 'react';
// , useEffect
import { VolumeIcon, VolumeMutedIcon, PlayIcon } from '../../assets/Icons/Icons';

const cx = classNames.bind(styles);

function PostVideo({ file, postDetail }) {
    const [muted, setMuted] = useState(true);
    const [pause, setPause] = useState(true);
    const videoRef = useRef();

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

    return (
        <div className={cx('video-container')}>
            <div className={cx('video-wrapper')}>
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
                    onClick={handleClickVideo}
                    loop
                    muted={muted}
                    className={cx('video', { 'PostDetail-video': postDetail })}
                >
                    <source src={file.src} type="video/mp4" />
                </video>
            </div>
        </div>
    );
}

export default memo(PostVideo);
