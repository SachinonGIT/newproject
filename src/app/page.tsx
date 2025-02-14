'use client';

import { motion, AnimatePresence } from 'framer-motion';
import * as Tabs from '@radix-ui/react-tabs';
import { useState, useEffect, useRef } from 'react';
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
  const [showGuide, setShowGuide] = useState(false);

  // Add new state for fullscreen content
  const [fullscreenContent, setFullscreenContent] = useState<{
    type: 'color' | 'pixel' | 'backlight' | 'resolution';
    value: string;
  } | null>(null);

  // Add ref for test section
  const testSectionRef = useRef<HTMLDivElement>(null);

  // SEO metadata
  const pageTitle = "White Screen Test Tool | Dead Pixel, Fake Screen & Bleeding Check | Free";
  const pageDescription = "Test mobile, laptop, or monitor screens instantly. Detect dead pixels, fake screens, screen bleeding, and more. Download HD white wallpapers for calibration.";

  useEffect(() => {
    // Add metadata
    document.title = pageTitle;
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', pageDescription);
    }

    setIsMounted(true);
    
    const handleFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement !== null);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const enterFullscreen = async (type: 'color' | 'pixel' | 'backlight' | 'resolution', value: string) => {
    try {
      setFullscreenContent({ type, value });
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
        setFullscreenContent(null);
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

  // Add function to handle start test click
  const handleStartTest = () => {
    setActiveTab('color-test');
    setShowGuide(false);
    testSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Don't render anything until client-side hydration is complete
  if (!isMounted) {
    return null;
  }

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-gray-50 to-gray-100 overflow-x-hidden relative">
      {/* Add ref to the test section */}
      <div ref={testSectionRef}>
        <Tabs.Root value={activeTab} onValueChange={setActiveTab} className="h-full">
          <AnimatePresence mode="wait">
            {!isFullscreen && (
              <motion.nav 
              // here i will change the code from sticky to Fixed
                className="fixed top-0 left-0 right-0 mx-auto p-2 sm:p-4 z-50"
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
                    className="absolute inset-x-0 bottom-0 px-4 pb-6 sm:px-6 sm:pb-8 md:px-8 md:pb-10"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 max-w-3xl mx-auto border border-white/20">
                      <div className="space-y-4 sm:space-y-6">
                        <div className="flex items-center gap-2 mb-2">
                          <ColorIcon />
                          <p className="text-lg sm:text-xl font-semibold">Color Test</p>
                        </div>
                        <p className="text-gray-600 text-sm sm:text-base">
                          Use this test to check your screen's color accuracy and uniformity. Look for any color inconsistencies or variations across the screen.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                          <div>
                            <p className="text-sm sm:text-base md:text-lg font-semibold mb-2 sm:mb-3 md:mb-4 flex items-center gap-2">
                              <ColorIcon />
                              Preset Colors
                            </p>
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
                            <p className="text-sm sm:text-base md:text-lg font-semibold mb-2 sm:mb-3 md:mb-4">Custom Color</p>
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
                            className="px-4 py-2.5 sm:px-5 sm:py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all flex items-center gap-2 shadow-lg text-sm font-medium group"
                            onClick={() => enterFullscreen('color', selectedColor)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <span className="w-5 h-5 transition-transform group-hover:scale-110"><FullscreenIcon /></span>
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
                    className="absolute inset-x-0 bottom-0 px-4 pb-6 sm:px-6 sm:pb-8 md:px-8 md:pb-10"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 max-w-3xl mx-auto border border-white/20">
                      <div className="space-y-4 sm:space-y-6">
                        <div className="flex items-center gap-2 mb-2">
                          <PixelIcon />
                          <p className="text-lg sm:text-xl font-semibold">Dead Pixel Test</p>
                        </div>
                        <p className="text-gray-600 text-sm sm:text-base">
                          Move your eyes slowly across the screen to detect any dead or stuck pixels. They will appear as persistent dots that don't change color.
                          Test with different colors for thorough inspection.
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
                            className="px-4 py-2.5 sm:px-5 sm:py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all flex items-center gap-2 shadow-lg text-sm font-medium group"
                            onClick={() => enterFullscreen('pixel', pixelTestColor)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <span className="w-5 h-5 transition-transform group-hover:scale-110"><FullscreenIcon /></span>
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
                    className="absolute inset-x-0 bottom-0 px-4 pb-6 sm:px-6 sm:pb-8 md:px-8 md:pb-10"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 max-w-3xl mx-auto border border-white/20">
                      <div className="space-y-4 sm:space-y-6">
                        <div className="flex items-center gap-2 mb-2">
                          <BacklightIcon />
                          <p className="text-lg sm:text-xl font-semibold">Backlight Bleed Test</p>
                        </div>
                        <p className="text-gray-600 text-sm sm:text-base">
                          For best results, test in a dark room. Look for any light leaking from the edges or bright spots.
                          This is especially important for LCD screens and gaming monitors.
                        </p>
                        <div className="flex justify-end pt-2">
                          <motion.button
                            className="px-4 py-2.5 sm:px-5 sm:py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all flex items-center gap-2 shadow-lg text-sm font-medium group"
                            onClick={() => enterFullscreen('backlight', '')}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <span className="w-5 h-5 transition-transform group-hover:scale-110"><FullscreenIcon /></span>
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
                    className="absolute inset-x-0 bottom-0 px-4 pb-6 sm:px-6 sm:pb-8 md:px-8 md:pb-10"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 max-w-3xl mx-auto border border-white/20">
                      <div className="space-y-4 sm:space-y-6">
                        <div className="flex items-center gap-2 mb-2">
                          <ResolutionIcon />
                          <p className="text-lg sm:text-xl font-semibold">Resolution Test</p>
                        </div>
                        <p className="text-gray-600 text-sm sm:text-base">
                          Select your screen's native resolution to verify proper scaling and sharpness.
                          Text and UI elements should appear crisp without blurriness.
                        </p>
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
                            className="px-4 py-2.5 sm:px-5 sm:py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all flex items-center gap-2 shadow-lg text-sm font-medium group"
                            onClick={() => enterFullscreen('resolution', `${selectedResolution.width} × ${selectedResolution.height}`)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <span className="w-5 h-5 transition-transform group-hover:scale-110"><FullscreenIcon /></span>
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

      {/* Help Button */}
      <button
        onClick={() => setShowGuide(true)}
        className="fixed top-4 right-4 z-50 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-white/80 transition-all"
        aria-label="Show Guide"
      >
        <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </button>

      {/* Guide Modal */}
      <AnimatePresence>
        {showGuide && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowGuide(false)}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-xl max-w-4xl max-h-[90vh] overflow-y-auto p-6 m-4"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="prose prose-sm sm:prose lg:prose-lg max-w-none">
                <h1 className="text-2xl sm:text-3xl font-bold mb-6">White Screen Test Tool: Ultimate Guide</h1>
                
                <div className="space-y-6">
                  <section>
                    <h2 className="text-xl font-semibold">Quick Start Guide</h2>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Select a test type from the navigation bar (Color, Pixel, Backlight, Resolution)</li>
                      <li>Click "Enter Fullscreen" for the most accurate results</li>
                      <li>Follow the specific instructions for each test type</li>
                      <li>Press ESC to exit fullscreen mode</li>
                    </ul>
                  </section>

                  <section>
                    <h2 className="text-xl font-semibold">Test Types Explained</h2>
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-medium">Color Test</h3>
                        <p>Use solid colors to check screen uniformity and color accuracy. Perfect for photographers and designers.</p>
                      </div>
                      <div>
                        <h3 className="font-medium">Dead Pixel Test</h3>
                        <p>Look for stuck or dead pixels that appear as persistent dots on solid backgrounds.</p>
                      </div>
                      <div>
                        <h3 className="font-medium">Backlight Test</h3>
                        <p>Check for light leakage around screen edges in a dark environment.</p>
                      </div>
                      <div>
                        <h3 className="font-medium">Resolution Test</h3>
                        <p>Verify your screen's actual resolution and check for scaling issues.</p>
                      </div>
                    </div>
                  </section>

                  <section>
                    <h2 className="text-xl font-semibold">Tips for Best Results</h2>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Clean your screen before testing</li>
                      <li>Test in different lighting conditions</li>
                      <li>Use multiple colors for thorough pixel testing</li>
                      <li>Document any issues found for warranty claims</li>
                    </ul>
                  </section>
                </div>

                <button
                  onClick={() => setShowGuide(false)}
                  className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Close Guide
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fullscreen Canvas */}
      <AnimatePresence>
        {isFullscreen && fullscreenContent && (
          <motion.div
            className="fixed inset-0 w-screen h-screen z-[100]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={exitFullscreen}
          >
            {fullscreenContent.type === 'color' && (
              <div 
                className="w-full h-full transition-colors duration-500"
                style={{ backgroundColor: fullscreenContent.value }}
              />
            )}
            {fullscreenContent.type === 'pixel' && (
              <div 
                className="w-full h-full transition-colors duration-500"
                style={{ backgroundColor: fullscreenContent.value }}
              />
            )}
            {fullscreenContent.type === 'backlight' && (
              <div className="w-full h-full bg-black" />
            )}
            {fullscreenContent.type === 'resolution' && (
              <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                <div className="text-lg font-semibold text-gray-700 bg-white/90 px-6 py-3 rounded-xl shadow-sm backdrop-blur-sm">
                  {fullscreenContent.value}
                </div>
              </div>
            )}
            <motion.div 
              className="fixed top-4 left-4 text-sm text-white/50 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              Press Esc to exit fullscreen
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Comprehensive Guide Section */}
      <section className="bg-white py-12 sm:py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg mx-auto">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-8">
              White Screen Test Tool: Your Ultimate Guide to Diagnosing Screen Issues
            </h1>
            
            <div className="text-lg text-gray-600 mb-8">
              <p>
                Is your screen acting up? Flickering displays, mysterious dark spots, or uneven backlighting can ruin your productivity, 
                gaming, or streaming experience. Our 100% free White Screen Test Tool is the ultimate solution for identifying screen 
                defects like dead pixels, fake screens, backlight bleeding, and more.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              <div className="bg-blue-50 rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4">Key Features</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500">✓</span>
                    <span>100% Free & No Ads – Unlimited tests</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500">✓</span>
                    <span>Multi-Device Support (iOS/Android/Desktop)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500">✓</span>
                    <span>7 Color Modes + Custom HEX Picker</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500">✓</span>
                    <span>Resolution Testing (480p to 8K)</span>
                  </li>
                </ul>
              </div>
              <div className="bg-green-50 rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4">Use Cases</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">🎮</span>
                    <span>Gamers: Check for screen tearing</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">📸</span>
                    <span>Photographers: Color calibration</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">🛍️</span>
                    <span>Consumers: Verify screen quality</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">💼</span>
                    <span>IT Pros: Diagnose display issues</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="space-y-12">
              <section id="how-to-use">
                <h2 className="text-2xl font-bold mb-4">How to Use the Tool</h2>
                <ol className="list-decimal pl-6 space-y-4">
                  <li>Select your test mode (Color, Pixel, Backlight, Resolution)</li>
                  <li>Enter fullscreen mode for accurate results</li>
                  <li>Follow the specific instructions for each test</li>
                  <li>Document any issues found for warranty claims</li>
                </ol>
              </section>

              <section id="maintenance">
                <h2 className="text-2xl font-bold mb-4">Screen Maintenance Tips</h2>
                <div className="bg-gray-50 rounded-xl p-6">
                  <ul className="space-y-3">
                    <li>Clean your screen regularly with appropriate materials</li>
                    <li>Avoid direct sunlight to prevent screen aging</li>
                    <li>Use screen protectors when possible</li>
                    <li>Perform monthly calibration checks</li>
                  </ul>
                </div>
              </section>

              <section id="faq">
                <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold">How often should I test my screen?</h3>
                    <p>Test new devices immediately and repeat every 3 months for maintenance.</p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Is it safe for OLED screens?</h3>
                    <p>Yes, but limit usage to 5-10 minutes to prevent burn-in.</p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Can this fix dead pixels?</h3>
                    <p>No, but it helps identify them for warranty claims or repairs.</p>
                  </div>
                </div>
              </section>

              <section id="testimonials">
                <h2 className="text-2xl font-bold mb-6">What Users Say</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white shadow-lg rounded-xl p-6">
                    <p className="italic mb-4">"I detected 3 dead pixels on my new iPad using this tool. The seller replaced it for free!"</p>
                    <p className="font-semibold">- Jessica T., Graphic Designer</p>
                  </div>
                  <div className="bg-white shadow-lg rounded-xl p-6">
                    <p className="italic mb-4">"The HD white wallpapers saved my product photography business!"</p>
                    <p className="font-semibold">- Rahul S., E-commerce Seller</p>
                  </div>
                </div>
              </section>
            </div>

            <div className="mt-12 text-center">
              <h2 className="text-2xl font-bold mb-4">Ready to Test Your Screen?</h2>
              <button 
                onClick={handleStartTest}
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors group"
              >
                <span>Start Free Test Now</span>
                <svg 
                  className="w-5 h-5 ml-2 transform transition-transform group-hover:translate-y-[-4px]" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
              </button>
            </div>

            {/* Facebook Comments Section */}
            <section className="mt-16">
              <h2 className="text-2xl font-bold mb-6">Community Discussion</h2>
              <div className="bg-white rounded-xl shadow-lg p-4">
                <div 
                  className="fb-comments" 
                  data-href={typeof window !== 'undefined' ? window.location.href : ''}
                  data-width="100%" 
                  data-numposts="10"
                  data-order-by="reverse_time"
                ></div>
              </div>
            </section>
          </div>
        </div>
      </section>
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
