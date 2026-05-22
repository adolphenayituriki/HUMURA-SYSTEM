import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBookOpen, faVideo, faMusic, faPlay, faHeadphones,
  faClock, faUser, faMapPin, faPlayCircle, faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { service } from '../../services/mockData';
import { useI18nStore } from '../../i18n';

type Tab = 'stories' | 'videos' | 'audio';

export default function HealingMedia() {
  const { t } = useI18nStore();
  const trans = t();
  const cd = trans.communityDashboard;
  const [activeTab, setActiveTab] = useState<Tab>('stories');
  const [playingVideo, setPlayingVideo] = useState<{ src: string; title: string } | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const stories = service.getHealingStories();
  const videos = service.getHealingVideos();
  const audio = service.getHealingAudio();

  const playVideo = (src: string, title: string) => {
    setPlayingVideo({ src, title });
    setTimeout(() => videoRef.current?.play(), 100);
  };

  const closeVideo = () => {
    if (videoRef.current) { videoRef.current.pause(); videoRef.current.currentTime = 0; }
    setPlayingVideo(null);
  };

  const tabs: Array<{ key: Tab; label: string; icon: React.ReactNode; count: number }> = [
    { key: 'stories', label: cd.featuredStories, icon: <FontAwesomeIcon icon={faBookOpen} className="text-[12px]" />, count: stories.length },
    { key: 'videos', label: cd.guidedVideos, icon: <FontAwesomeIcon icon={faVideo} className="text-[12px]" />, count: videos.length },
    { key: 'audio', label: cd.audioResources, icon: <FontAwesomeIcon icon={faMusic} className="text-[12px]" />, count: audio.length },
  ];

  return (
    <>
      <div className="space-y-8 md:space-y-10">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-[-.02em]">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-brand-400">{cd.healingMedia}</span>
          </h1>
          <p className="text-sm text-ink-400 mt-2">{cd.healingMediaDesc}</p>
        </div>

        <div className="flex items-center gap-2 border-b border-ink-100/60">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all border-b-2 -mb-px ${
                activeTab === tab.key
                  ? 'text-brand-600 border-brand-500'
                  : 'text-ink-400 border-transparent hover:text-ink-600'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              <span className={`text-[11px] px-1.5 py-0.5 rounded-full ${
                activeTab === tab.key ? 'bg-brand-50 text-brand-600' : 'bg-ink-50 text-ink-400'
              }`}>{tab.count}</span>
            </button>
          ))}
        </div>

        {activeTab === 'stories' && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {stories.map((story, i) => (
              <motion.div
                key={story.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="bg-white rounded-xl border border-ink-100/60 overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer group"
              >
                <div className="h-40 bg-ink-100 overflow-hidden">
                  <img src={story.image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-5">
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {story.tags.map((tag) => (
                      <span key={tag} className="text-[9px] px-1.5 py-0.5 rounded-full bg-brand-50 text-brand-600 font-medium capitalize">{tag}</span>
                    ))}
                  </div>
                  <h3 className="text-sm font-bold text-ink-800 leading-snug line-clamp-2 group-hover:text-brand-600 transition-colors">{story.title}</h3>
                  <p className="text-xs text-ink-500 mt-1.5 line-clamp-2 leading-relaxed">{story.excerpt}</p>
                  <div className="flex items-center gap-3 mt-3 text-[10px] text-ink-400">
                    <span className="flex items-center gap-1"><FontAwesomeIcon icon={faUser} className="text-[8px]" /> {story.author}</span>
                    <span className="flex items-center gap-1"><FontAwesomeIcon icon={faMapPin} className="text-[8px]" /> {story.district}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {activeTab === 'videos' && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {videos.map((video, i) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                onClick={() => playVideo(video.src || '/video auto play.mp4', video.title)}
                className="bg-white rounded-xl border border-ink-100/60 overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer group"
              >
                <div className="h-44 bg-ink-100 overflow-hidden relative">
                  <img src={video.thumbnail} alt="" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-all">
                    <span className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <FontAwesomeIcon icon={faPlay} className="text-brand-600 text-[18px] ml-0.5" />
                    </span>
                  </div>
                  <span className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] px-1.5 py-0.5 rounded font-medium">{video.duration}</span>
                </div>
                <div className="p-5">
                  <h3 className="text-sm font-bold text-ink-800 leading-snug line-clamp-2 group-hover:text-brand-600 transition-colors">{video.title}</h3>
                  <p className="text-xs text-ink-500 mt-1.5 line-clamp-2 leading-relaxed">{video.description}</p>
                  <div className="flex items-center gap-2 mt-3">
                    <span className="text-[10px] font-medium text-brand-500">{cd.watchVideo}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {activeTab === 'audio' && (
          <div className="space-y-2">
            {audio.map((a, i) => {
              const categoryLabel =
                a.category === 'meditation' ? cd.guidedMeditation :
                a.category === 'breathing' ? cd.breathingGuide :
                a.category === 'calming' ? cd.calmingSounds : a.category;
              return (
                <motion.div
                  key={a.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="flex items-center gap-5 p-5 rounded-xl bg-white border border-ink-100/60 hover:border-brand-200/50 hover:shadow-sm transition-all cursor-pointer group"
                >
                  <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-50 to-brand-100 flex items-center justify-center text-brand-600 shrink-0 group-hover:scale-105 transition-transform">
                    <FontAwesomeIcon icon={faHeadphones} className="text-[16px]" />
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-ink-800 truncate group-hover:text-brand-600 transition-colors">{a.title}</p>
                    <p className="text-xs text-ink-400 truncate">{a.description}</p>
                    <span className="inline-block text-[10px] font-medium text-brand-500 mt-1 px-1.5 py-0.5 rounded bg-brand-50 capitalize">{categoryLabel}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="flex items-center gap-1 text-[11px] text-ink-400">
                      <FontAwesomeIcon icon={faClock} className="text-[9px]" /> {a.duration}
                    </span>
                    <span className="w-8 h-8 rounded-full bg-brand-500 text-white flex items-center justify-center hover:bg-brand-600 transition-all">
                      <FontAwesomeIcon icon={faPlayCircle} className="text-[14px]" />
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      <AnimatePresence>
        {playingVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
            onClick={closeVideo}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl overflow-hidden shadow-2xl w-full max-w-3xl"
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-ink-100/60">
                <h3 className="text-sm font-bold text-ink-800 truncate">{playingVideo.title}</h3>
                <button onClick={closeVideo} className="w-8 h-8 flex items-center justify-center rounded-lg text-ink-400 hover:text-ink-600 hover:bg-ink-50 transition-all cursor-pointer">
                  <FontAwesomeIcon icon={faXmark} className="text-[18px]" />
                </button>
              </div>
              <div className="bg-black">
                <video
                  ref={videoRef}
                  src={playingVideo.src}
                  controls
                  autoPlay
                  className="w-full aspect-video"
                  playsInline
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
