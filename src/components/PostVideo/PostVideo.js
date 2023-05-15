import classNames from 'classnames/bind';
import styles from './PostVideo.module.scss';
import { useRef, useState } from 'react';
// , useEffect
import { VolumeIcon, VolumeMutedIcon, PlayIcon } from '../../assets/Icons/Icons';

const cx = classNames.bind(styles);

function PostVideo({ post, file, postDetail }) {
    const [muted, setMuted] = useState(true);
    const [pause, setPause] = useState(true);
    const videoRef = useRef();

    // useEffect(() => {
    //     if (post) {
    //         if (post?.url[0]?.type === 'video' && pause === true) {
    //             window.addEventListener('scroll', handleScroll);

    //             return () => window.removeEventListener('scroll', handleScroll);
    //         }
    //     }
    // }, [post, pause]);

    // const handleScroll = () => {
    //     let isElInViewPort = (el) => {
    //         let rect = el.getBoundingClientRect();
    //         let viewHeight = window.innerHeight || document.documentElement.clientHeight;

    //         return (
    //             (rect.top <= 200 && rect.bottom >= 200) ||
    //             (rect.bottom >= viewHeight - 200 && rect.top <= viewHeight - 200) ||
    //             (rect.top >= 200 && rect.bottom <= viewHeight - 200)
    //         );
    //     };
    //     if (isElInViewPort(videoRef.current)) {
    //         videoRef.current.play();
    //         setPause(false);
    //     } else {
    //         videoRef.current.pause();
    //         setPause(true);
    //     }
    // };

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

export default PostVideo;
