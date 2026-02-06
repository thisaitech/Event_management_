import React, { useState, useRef, useEffect } from 'react';

interface VideoIntroProps {
  onVideoEnd: () => void;
}

const VideoIntro: React.FC<VideoIntroProps> = ({ onVideoEnd }) => {
  const [isVisible, setIsVisible] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleVideoEnd = () => {
      // Pause video at last frame
      if (video) {
        video.pause();
      }
      // Immediately trigger hero background to show and remove video
      onVideoEnd();
      setIsVisible(false);
    };

    video.addEventListener('ended', handleVideoEnd);
    
    // Start playing the video
    video.play().catch(error => {
      console.error('Error playing video:', error);
      // If video fails to play, still switch after a delay
      setTimeout(() => {
        handleVideoEnd();
      }, 3000);
    });

    return () => {
      video.removeEventListener('ended', handleVideoEnd);
    };
  }, [onVideoEnd]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black overflow-hidden">
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full"
        style={{
          objectFit: 'cover',
          objectPosition: 'center center',
          width: '100%',
          height: '100%',
          minWidth: '100%',
          minHeight: '100%'
        }}
        playsInline
        autoPlay
        muted
        preload="auto"
      >
        <source src="/AI_Animation_Building_Facade_To_Venue.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default VideoIntro;

