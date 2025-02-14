'use client';

import { motion, AnimatePresence } from 'framer-motion';
import * as Tabs from '@radix-ui/react-tabs';
import { useState, useEffect } from 'react';
import { HexColorPicker } from 'react-colorful';
import { PRESET_COLORS, RESOLUTIONS } from '@/constants/theme';

// Icons
const ColorIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
  </svg>
);

const PixelIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const BacklightIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const ResolutionIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8v8a4 4 0 004 4h8a4 4 0 004-4V8a4 4 0 00-4-4H8a4 4 0 00-4 4z" />
  </svg>
);

const FullscreenIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3" />
  </svg>
);

export default function Home() {
  const [selectedColor, setSelectedColor] = useState('#FFFFFF');
  const [activeTab, setActiveTab] = useState('color-test');
  const [pixelTestColor, setPixelTestColor] = useState('#FFFFFF');
  const [selectedResolution, setSelectedResolution] = useState(RESOLUTIONS[2]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    
    const handleFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement !== null);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const enterFullscreen = async () => {
    try {
      if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
      }
    } catch (error) {
      console.error('Failed to enter fullscreen:', error);
    }
  };

  const exitFullscreen = async () => {
    try {
      if (document.fullscreenElement && document.exitFullscreen) {
        await document.exitFullscreen();
      }
    } catch (error) {
      console.error('Failed to exit fullscreen:', error);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
  };

  // Don't render anything until client-side hydration is complete
  if (!isMounted) {
    return null;
  }

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-gray-50 to-gray-100 overflow-x-hidden relative">
      <Tabs.Root value={activeTab} onValueChange={setActiveTab} className="h-full">
        <AnimatePresence mode="wait">
          {!isFullscreen && (
            <motion.nav 
              className="sticky top-0 left-0 right-0 mx-auto p-2 sm:p-4 z-50"
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <div className="bg-white/90 backdrop-blur-lg rounded-full shadow-lg mx-auto max-w-3xl">
                <Tabs.List className="flex items-center justify-around sm:justify-center sm:gap-2 md:gap-4 p-1 sm:p-2">
                  <TabTrigger value="color-test" icon={<ColorIcon />}>Color Test</TabTrigger>
                  <TabTrigger value="pixel-test" icon={<PixelIcon />}>Pixel Test</TabTrigger>
                  <TabTrigger value="backlight-test" icon={<BacklightIcon />}>Backlight</TabTrigger>
                  <TabTrigger value="resolution" icon={<ResolutionIcon />}>Resolution</TabTrigger>
                </Tabs.List>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>

        <Tabs.Content value="color-test" className="h-screen">
          <div 
            className="h-full w-full transition-colors duration-500 relative"
            style={{ backgroundColor: selectedColor }}
            onClick={isFullscreen ? exitFullscreen : undefined}
          >
            <AnimatePresence>
              {!isFullscreen && (
                <motion.div 
                  className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-0 right-0 mx-auto px-4 sm:px-6 md:px-8"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <div className="bg-white/90 backdrop-blur-lg rounded-lg sm:rounded-xl md:rounded-2xl shadow-xl p-3 sm:p-4 md:p-6 max-w-3xl mx-auto">
                    <div className="space-y-3 sm:space-y-4 md:space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                        <div>
                          <h3 className="text-sm sm:text-base md:text-lg font-semibold mb-2 sm:mb-3 md:mb-4 flex items-center gap-2">
                            <ColorIcon />
                            Preset Colors
                          </h3>
                          <div className="grid grid-cols-3 gap-2 sm:gap-3">
                            {PRESET_COLORS.map((color) => (
                              <motion.button
                                key={color.value}
                                className="aspect-square rounded-md sm:rounded-lg md:rounded-xl shadow-sm border border-gray-200 transition-transform hover:scale-105"
                                style={{ backgroundColor: color.value }}
                                onClick={() => setSelectedColor(color.value)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              />
                            ))}
                          </div>
                        </div>
                        <div className="mt-4 md:mt-0">
                          <h3 className="text-sm sm:text-base md:text-lg font-semibold mb-2 sm:mb-3 md:mb-4">Custom Color</h3>
                          <div className="flex justify-center md:justify-start">
                            <HexColorPicker 
                              color={selectedColor} 
                              onChange={setSelectedColor}
                              className="w-full max-w-[160px] sm:max-w-[180px] md:max-w-[200px]"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-end pt-2">
                        <motion.button
                          className="px-3 py-1.5 sm:px-4 sm:py-2 md:px-6 md:py-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors flex items-center gap-1.5 sm:gap-2 shadow-lg text-xs sm:text-sm md:text-base"
                          onClick={enterFullscreen}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <FullscreenIcon />
                          <span>Enter Fullscreen</span>
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <AnimatePresence>
              {isFullscreen && (
                <motion.div 
                  className="fixed top-4 left-4 text-xs sm:text-sm text-white/50 pointer-events-none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  Press Esc to exit fullscreen
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Tabs.Content>

        <Tabs.Content value="pixel-test" className="h-screen">
          <div 
            className="h-full w-full transition-colors duration-500 relative"
            style={{ backgroundColor: pixelTestColor }}
            onClick={isFullscreen ? exitFullscreen : undefined}
          >
            <AnimatePresence>
              {!isFullscreen && (
                <motion.div 
                  className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-0 right-0 mx-auto px-4 sm:px-6 md:px-8"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <div className="bg-white/90 backdrop-blur-lg rounded-lg sm:rounded-xl md:rounded-2xl shadow-xl p-3 sm:p-4 md:p-6 max-w-3xl mx-auto">
                    <div className="space-y-3 sm:space-y-4 md:space-y-6">
                      <div className="flex items-center gap-2 mb-2">
                        <PixelIcon />
                        <h3 className="text-sm sm:text-base md:text-lg font-semibold">Dead Pixel Test</h3>
                      </div>
                      <p className="text-gray-600 text-xs sm:text-sm md:text-base">
                        Move your eyes across the screen to detect any dead or stuck pixels. 
                        Use different colors to test thoroughly.
                      </p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-3 md:gap-4">
                        {PRESET_COLORS.map((color) => (
                          <motion.button
                            key={color.value}
                            className="px-2 sm:px-3 py-1.5 sm:py-2 md:px-4 md:py-2 rounded-md sm:rounded-lg md:rounded-xl text-xs sm:text-sm font-medium transition-colors shadow-sm"
                            style={{
                              backgroundColor: color.value,
                              color: color.value === '#FFFFFF' ? '#000000' : '#FFFFFF',
                            }}
                            onClick={() => setPixelTestColor(color.value)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            {color.name}
                          </motion.button>
                        ))}
                      </div>
                      <div className="flex justify-end pt-2">
                        <motion.button
                          className="px-3 py-1.5 sm:px-4 sm:py-2 md:px-6 md:py-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors flex items-center gap-1.5 sm:gap-2 shadow-lg text-xs sm:text-sm md:text-base"
                          onClick={enterFullscreen}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <FullscreenIcon />
                          <span>Enter Fullscreen</span>
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <AnimatePresence>
              {isFullscreen && (
                <motion.div 
                  className="fixed top-4 left-4 text-xs sm:text-sm text-white/50 pointer-events-none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  Press Esc to exit fullscreen
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Tabs.Content>

        <Tabs.Content value="backlight-test" className="h-screen">
          <div 
            className="h-full w-full bg-black transition-colors duration-500 relative"
            onClick={isFullscreen ? exitFullscreen : undefined}
          >
            <AnimatePresence>
              {!isFullscreen && (
                <motion.div 
                  className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-0 right-0 mx-auto px-4 sm:px-6 md:px-8"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <div className="bg-white/90 backdrop-blur-lg rounded-lg sm:rounded-xl md:rounded-2xl shadow-xl p-3 sm:p-4 md:p-6 max-w-3xl mx-auto">
                    <div className="space-y-3 sm:space-y-4 md:space-y-6">
                      <div className="flex items-center gap-2 mb-2">
                        <BacklightIcon />
                        <h3 className="text-sm sm:text-base md:text-lg font-semibold">Backlight Bleed Test</h3>
                      </div>
                      <p className="text-gray-600 text-xs sm:text-sm md:text-base">
                        View the black screen in a dark room. Look for any light leaking from the edges 
                        or bright spots on the screen. This test helps identify backlight bleeding issues.
                      </p>
                      <div className="flex justify-end pt-2">
                        <motion.button
                          className="px-3 py-1.5 sm:px-4 sm:py-2 md:px-6 md:py-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors flex items-center gap-1.5 sm:gap-2 shadow-lg text-xs sm:text-sm md:text-base"
                          onClick={enterFullscreen}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <FullscreenIcon />
                          <span>Enter Fullscreen</span>
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <AnimatePresence>
              {isFullscreen && (
                <motion.div 
                  className="fixed top-4 left-4 text-xs sm:text-sm text-white/50 pointer-events-none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  Press Esc to exit fullscreen
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Tabs.Content>

        <Tabs.Content value="resolution" className="h-screen">
          <div 
            className="h-full w-full bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center relative"
            onClick={isFullscreen ? exitFullscreen : undefined}
          >
            <AnimatePresence>
              {!isFullscreen && (
                <motion.div 
                  className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-0 right-0 mx-auto px-4 sm:px-6 md:px-8"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <div className="bg-white/90 backdrop-blur-lg rounded-lg sm:rounded-xl md:rounded-2xl shadow-xl p-3 sm:p-4 md:p-6 max-w-3xl mx-auto">
                    <div className="space-y-3 sm:space-y-4 md:space-y-6">
                      <div className="flex items-center gap-2 mb-2">
                        <ResolutionIcon />
                        <h3 className="text-sm sm:text-base md:text-lg font-semibold">Resolution Test</h3>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3 md:gap-4">
                        {RESOLUTIONS.map((resolution) => (
                          <motion.button
                            key={resolution.name}
                            className={`p-2 sm:p-3 md:p-4 rounded-md sm:rounded-lg md:rounded-xl border transition-colors ${
                              selectedResolution.name === resolution.name
                                ? 'border-blue-500 bg-blue-50 shadow-sm'
                                : 'border-gray-200 hover:border-blue-200 hover:bg-gray-50'
                            }`}
                            onClick={() => setSelectedResolution(resolution)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <div className="font-medium text-xs sm:text-sm md:text-base">{resolution.name}</div>
                            <div className="text-xs sm:text-sm md:text-base text-gray-500">
                              {resolution.width} × {resolution.height}
                            </div>
                          </motion.button>
                        ))}
                      </div>
                      <div className="text-center text-gray-600 mb-4 sm:mb-6 md:mb-8">
                        Selected: {selectedResolution.width} × {selectedResolution.height}
                      </div>
                      <div className="flex justify-end">
                        <motion.button
                          className="px-3 py-1.5 sm:px-4 sm:py-2 md:px-6 md:py-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors flex items-center gap-1.5 sm:gap-2 shadow-lg text-xs sm:text-sm md:text-base"
                          onClick={enterFullscreen}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <FullscreenIcon />
                          <span>Enter Fullscreen</span>
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <AnimatePresence>
              {isFullscreen && (
                <>
                  <motion.div 
                    className="fixed top-4 left-4 text-xs sm:text-sm text-gray-500 pointer-events-none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    Press Esc to exit fullscreen
                  </motion.div>
                  <motion.div 
                    className="text-sm sm:text-base font-semibold text-gray-700 bg-white/90 px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl shadow-sm backdrop-blur-sm"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                  >
                    {selectedResolution.width} × {selectedResolution.height}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </Tabs.Content>
      </Tabs.Root>
    </div>
  );
}

function TabTrigger({ children, value, icon }: { children: React.ReactNode; value: string; icon: React.ReactNode }) {
  return (
    <Tabs.Trigger
      value={value}
      className="flex-1 sm:flex-initial p-2 sm:px-4 sm:py-2 rounded-full text-gray-600 hover:bg-white/50 data-[state=active]:bg-white data-[state=active]:text-blue-500 data-[state=active]:shadow-sm transition-all duration-200 flex items-center justify-center sm:justify-start gap-1 sm:gap-2 text-xs sm:text-sm md:text-base"
    >
      <span className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0">{icon}</span>
      <span className="hidden sm:inline">{children}</span>
    </Tabs.Trigger>
  );
}
