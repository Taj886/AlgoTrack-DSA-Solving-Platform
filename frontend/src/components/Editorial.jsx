import { useState, useRef, useEffect } from 'react';
import { Pause, Play } from 'lucide-react';


const Editorial = ({ secureUrl, thumbnailUrl, duration, content }) => {

  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  // Format seconds to MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Update current time during playback
  useEffect(() => {
    const video = videoRef.current;
    const handleTimeUpdate = () => {
      if (video) setCurrentTime(video.currentTime);
    };
    if (video) {
      video.addEventListener('timeupdate', handleTimeUpdate);
      return () => video.removeEventListener('timeupdate', handleTimeUpdate);
    }
  }, []);

  return (
    <div>
      {content && (
        <div className="prose max-w-none mb-6">
          <div className="whitespace-pre-wrap text-sm leading-relaxed">
            {content}
          </div>
        </div>
      )}

      {(secureUrl || thumbnailUrl) && (
        <div 
          className="relative w-full max-w-2xl mx-auto rounded-xl overflow-hidden shadow-lg mb-6"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <video
            ref={videoRef}
            src={secureUrl}
            poster={thumbnailUrl}
            onClick={togglePlayPause}
            className="w-full aspect-video bg-black cursor-pointer"
            controls
          />

          <div 
            className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 transition-opacity ${
              isHovering || !isPlaying ? 'opacity-100' : 'opacity-0'
            } pointer-events-none`}
          >
            <div className="flex items-center">
              <button
                onClick={togglePlayPause}
                className="btn btn-circle btn-primary mr-3 pointer-events-auto"
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? (<Pause/>) : (<Play/>) }
              </button>

              <div className="flex items-center w-full mt-2 pointer-events-auto">
                <span className="text-white text-sm mr-2">
                  {formatTime(currentTime)}
                </span>
                <input
                  type="range"
                  min="0"
                  max={duration || 0}
                  value={currentTime}
                  onChange={(e) => {
                    if (videoRef.current) {
                      videoRef.current.currentTime = Number(e.target.value);
                    }
                  }}
                  className="range range-primary range-xs flex-1"
                />
                <span className="text-white text-sm ml-2">{formatTime(duration || 0)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Editorial;
