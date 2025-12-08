"use client";

import { useState, useRef, useEffect } from "react";
import YouTube from "react-youtube";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX, Play, Pause, CheckCircle, X, Youtube, Facebook, Instagram } from "lucide-react";
import { InlineWidget } from "react-calendly";
import { toast } from 'react-hot-toast';

export function HeroSection() {
  const services = [
    "Corporate Offices",
    "Medical Facilities",
    "Educational Institutions",
    "Industrial Spaces",
    "Retail Stores",
  ];

  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const playerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isCalendlyOpen, setIsCalendlyOpen] = useState(false);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [showCalendly, setShowCalendly] = useState(false);
  const [leadData, setLeadData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
  });

  // Set the video source and type here
  const [videoSource, setVideoSource] = useState({
    // type: "youtube", // 'youtube' or 'local'
    // source: "Rt7iUhijySY", // YouTube video ID or local video
    type: "local",
    source: "/landing-video.mp4",
  });

  const opts = {
    height: "100%",
    width: "100%",
    playerVars: {
      autoplay: 1,
      mute: 1,
      controls: 0,
      showinfo: 0,
      rel: 0,
      loop: 1,
      playlist: videoSource.source, // This will work if the video type is youtube
      modestbranding: 1,
    },
  };

  const onReady = (event: { target: any }) => {
    playerRef.current = event.target;
    event.target.playVideo();
    updateVideoSize();
  };

  const toggleVideo = () => {
    setIsPlaying(!isPlaying);
    if (videoSource.type === "youtube") {
      if (isPlaying) {
        playerRef.current?.pauseVideo();
      } else {
        playerRef.current?.playVideo();
      }
    } else {
      const localVideoElement = document.getElementById(
        "local-video"
      ) as HTMLVideoElement;
      if (localVideoElement) {
        if (isPlaying) {
          localVideoElement.pause();
        } else {
          localVideoElement.play();
        }
      }
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (videoSource.type === "youtube") {
      if (isMuted) {
        playerRef.current?.unMute();
      } else {
        playerRef.current?.mute();
      }
    } else {
      const localVideoElement = document.getElementById(
        "local-video"
      ) as HTMLVideoElement;
      if (localVideoElement) {
        localVideoElement.muted = isMuted;
      }
    }
  };

  const updateVideoSize = () => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.offsetWidth;
      const containerHeight = containerRef.current.offsetHeight;
      const aspectRatio = 16 / 9; // Assuming 16:9 aspect ratio for the video

      let width = containerWidth;
      let height = containerWidth / aspectRatio;

      if (height < containerHeight) {
        height = containerHeight;
        width = containerHeight * aspectRatio;
      }

      if (videoSource.type === "youtube" && playerRef.current) {
        playerRef.current.setSize(width, height);
      } else {
        const localVideoElement = document.getElementById(
          "local-video"
        ) as HTMLVideoElement;
        if (localVideoElement) {
          localVideoElement.style.width = `${width}px`;
          localVideoElement.style.height = `${height}px`;
        }
      }
    }
  };

  useEffect(() => {
    window.addEventListener("resize", updateVideoSize);
    return () => window.removeEventListener("resize", updateVideoSize);
  }, [videoSource]);

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/createAccount', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(leadData),
      });

      if (response.ok) {
        setShowLeadForm(false);
        setShowCalendly(true);
        toast.success('Information submitted successfully!');
      } else {
        throw new Error('Failed to submit lead information');
      }
    } catch (error) {
      console.error('Error creating lead:', error);
      toast.error('Failed to submit lead information. Please try again.');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLeadData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <section
      ref={containerRef}
      className="relative h-screen w-full overflow-hidden"
    >
      <div className="absolute inset-0 z-0">
        {videoSource.type === "youtube" ? (
          <YouTube
            videoId={videoSource.source}
            opts={opts}
            onReady={onReady}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 min-w-full min-h-full w-auto h-auto"
          />
        ) : (
          <video
            id="local-video"
            src={videoSource.source}
            autoPlay
            loop
            muted
            playsInline
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 min-w-full min-h-full w-auto h-auto object-cover"
            onLoadedMetadata={updateVideoSize}
          />
        )}
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50 z-10" />
      <motion.div
        className="absolute inset-0 flex items-center justify-center text-center z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {/* Adjusted the text container background to be more transparent */}
        <div className="max-w-5xl space-y-8 px-4 py-8 bg-black/10 rounded-lg backdrop-blur-sm">
          <motion.h1
            className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight text-white"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.7)" }}
          >
            Expert Commercial Cleaning Services
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl text-white font-medium"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.7)" }}
          >
            Elevate your business environment with our 10+ years of cleaning
            expertise
          </motion.p>
          <motion.div
            className="flex flex-wrap justify-center gap-4 mb-8"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            {services.map((service, index) => (
              <div
                key={index}
                className="flex items-center bg-black/30 backdrop-blur-sm rounded-full px-4 py-2"
              >
                <CheckCircle className="text-primary mr-2" size={16} />
                <span className="text-white text-sm font-medium">
                  {service}
                </span>
              </div>
            ))}
          </motion.div>
          <motion.div
            className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            <Button
              size="lg"
              variant="outline"
              className="bg-white/10 text-white border-white hover:bg-white/20 text-lg px-8 py-3 w-full sm:w-auto font-semibold"
              onClick={() => setShowLeadForm(true)}
            >
              Schedule Quote
            </Button>
          </motion.div>
        </div>
      </motion.div>
      <AnimatePresence>
        <motion.div
          className="absolute bottom-4 right-4 flex space-x-2 z-30"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          <div className="p-2 flex space-x-2">
            <a href="https://youtu.be/ODoLwsSyd4o" target="_blank" rel="noopener noreferrer" className="text-secondary-foreground hover:text-primary transition-colors" aria-label="Youtube">
              <Youtube size={24} />
          </a>
          <a href="https://www.facebook.com/people/CustoSupreme-Commercial-Cleaning/61550114426903/" target="_blank" rel="noopener noreferrer" className="text-secondary-foreground hover:text-primary transition-colors" aria-label="Facebook">
            <Facebook size={24} />
          </a>
          <a href="https://www.instagram.com/custosupreme/" target="_blank" rel="noopener noreferrer" className="text-secondary-foreground hover:text-primary transition-colors" aria-label="Instagram">
            <Instagram size={24} />
          </a>
          </div>
          <button
            onClick={toggleVideo}
            className="p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
            aria-label={isPlaying ? "Pause video" : "Play video"}
          >
            {isPlaying ? <Pause size={24} /> : <Play size={24} />}
          </button>
          <button
            onClick={toggleMute}
            className="p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
            aria-label={isMuted ? "Unmute video" : "Mute video"}
          >
            {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
          </button>
        </motion.div>
      </AnimatePresence>

      {/* Calendly Inline Widget Modal */}
      <AnimatePresence>
        {isCalendlyOpen && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white p-4 rounded-lg w-full max-w-[310px] m-4"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Schedule Quote for Precise Estimate</h2>
                <button
                  onClick={() => setIsCalendlyOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </button>
              </div>
              {/* <InlineWidget
                url="https://calendly.com/admin-custosupreme/30min"
                styles={{ height: "calc(100% - 60px)" }}
              /> */}
              
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lead Capture Form Modal */}
      <AnimatePresence>
        {showLeadForm && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white p-6 rounded-lg w-full max-w-[400px] m-4 relative"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <button
                onClick={() => setShowLeadForm(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
              <h2 className="text-2xl font-bold mb-4">Schedule a Quote</h2>
              <form onSubmit={handleLeadSubmit} className="space-y-4">
                <Input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={leadData.name}
                  onChange={handleInputChange}
                  required
                />
                <Input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={leadData.email}
                  onChange={handleInputChange}
                  required
                />
                <Input
                  type="tel"
                  name="phone"
                  placeholder="Phone"
                  value={leadData.phone}
                  onChange={handleInputChange}
                  required
                />
                <Input
                  type="text"
                  name="company"
                  placeholder="Company Name"
                  value={leadData.company}
                  onChange={handleInputChange}
                  required
                />
                <Input
                  type="text"
                  name="street"
                  placeholder="Street Address"
                  value={leadData.street}
                  onChange={handleInputChange}
                  required
                />
                <Input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={leadData.city}
                  onChange={handleInputChange}
                  required
                />
                <Input
                  type="text"
                  name="state"
                  placeholder="State"
                  value={leadData.state}
                  onChange={handleInputChange}
                  required
                />
                <Input
                  type="text"
                  name="zipCode"
                  placeholder="Zip Code"
                  value={leadData.zipCode}
                  onChange={handleInputChange}
                  required
                />
                <Button type="submit" className="w-full">Submit</Button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Calendly Inline Widget Modal */}
      <AnimatePresence>
        {showCalendly && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white p-4 rounded-lg w-full max-w-[800px] h-[600px] m-4 relative"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <button
                onClick={() => setShowCalendly(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-10"
              >
                <X size={24} />
              </button>
              <InlineWidget
                url="https://calendly.com/h-nelson-custosupreme/30min"
                styles={{ height: '100%' }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
