import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from './ui/Button';

interface CameraCaptureProps {
  onCapture: (file: File) => void;
  loading: boolean;
  analyzeButtonText?: string;
}

export const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture, loading, analyzeButtonText }) => {
  const { t } = useTranslation();
  const [mode, setMode] = useState<'upload' | 'camera'>('upload');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [capturedFile, setCapturedFile] = useState<File | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  const [zoom, setZoom] = useState(1);
  const [zoomCapabilities, setZoomCapabilities] = useState<{min: number, max: number, step: number} | null>(null);
  const [brightness, setBrightness] = useState(1);
  const [brightnessCapabilities, setBrightnessCapabilities] = useState<{min: number, max: number, step: number} | null>(null);
  const [contrast, setContrast] = useState(1);
  const [contrastCapabilities, setContrastCapabilities] = useState<{min: number, max: number, step: number} | null>(null);
  const [hasMultipleCameras, setHasMultipleCameras] = useState(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');

  // FIX: Added state for torch/flash control
  const [torchOn, setTorchOn] = useState(false);
  const [torchSupported, setTorchSupported] = useState(false);

  useEffect(() => {
    const checkForMultipleCameras = async () => {
        if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
            return;
        }
        try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            const videoDevices = devices.filter(device => device.kind === 'videoinput');
            setHasMultipleCameras(videoDevices.length > 1);
        } catch (err) {
            console.error("Could not enumerate devices: ", err);
        }
    };
    checkForMultipleCameras();
  }, []);

  const stopCamera = useCallback(() => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setZoomCapabilities(null); 
    setBrightnessCapabilities(null);
    setContrastCapabilities(null);
    setTorchSupported(false);
    setTorchOn(false);
  }, []);
  
  useEffect(() => {
    let isActive = true;
    const setupCamera = async () => {
        if (imagePreview || mode !== 'camera') {
            stopCamera();
            return;
        }
        stopCamera();
        try {
            // FIX: Request higher resolution with a fallback
            const highResConstraints = {
                video: {
                    facingMode,
                    width: { ideal: 1920 },
                    height: { ideal: 1080 }
                }
            };
            const standardConstraints = { video: { facingMode } };
            
            let stream: MediaStream;
            try {
                stream = await navigator.mediaDevices.getUserMedia(highResConstraints);
            } catch (err) {
                console.warn("Could not get HD stream, falling back to standard resolution.", err);
                stream = await navigator.mediaDevices.getUserMedia(standardConstraints);
            }
            
            if (!isActive) {
                stream.getTracks().forEach(track => track.stop());
                return;
            }
            mediaStreamRef.current = stream;
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                await videoRef.current.play();
                if (!isActive) return;
                const track = stream.getVideoTracks()[0];
                if (track) {
                    const capabilities = track.getCapabilities();
                    const settings = track.getSettings();
                    if (capabilities.zoom) {
                        setZoomCapabilities({ min: capabilities.zoom.min, max: capabilities.zoom.max, step: capabilities.zoom.step });
                        setZoom(settings.zoom || 1);
                    }
                    if (capabilities.brightness) {
                        setBrightnessCapabilities({ min: capabilities.brightness.min, max: capabilities.brightness.max, step: capabilities.brightness.step });
                        setBrightness(settings.brightness || 0);
                    }
                    if (capabilities.contrast) {
                        setContrastCapabilities({ min: capabilities.contrast.min, max: capabilities.contrast.max, step: capabilities.contrast.step });
                        setContrast(settings.contrast || 0);
                    }
                    // FIX: Check for torch support
                    if ('torch' in capabilities) {
                      setTorchSupported(true);
                    }
                }
            }
        } catch (err) {
            console.error("Error accessing camera stream: ", err);
            if (isActive) {
                alert(t('cameraCapture.cameraError'));
            }
        }
    };
    setupCamera();
    return () => {
        isActive = false;
        stopCamera();
    };
  }, [imagePreview, facingMode, stopCamera, t, mode]);

  const handleCaptureClick = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      if (facingMode === 'user') {
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
      }
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(blob => {
        if (blob) {
          const file = new File([blob], "capture.jpg", { type: "image/jpeg" });
          setImagePreview(URL.createObjectURL(blob));
          setCapturedFile(file);
        }
      }, 'image/jpeg', 0.95); // FIX: Increased JPEG quality to 95%
    }
  };

  const handleSubmit = () => {
    if (capturedFile) {
      onCapture(capturedFile);
    }
  };

  const handleSwitchCamera = () => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
  };

  const handleControlChange = (type: 'zoom' | 'brightness' | 'contrast', value: number) => {
    if (mediaStreamRef.current) {
        const track = mediaStreamRef.current.getVideoTracks()[0];
        if (track && track.getCapabilities()[type]) {
            track.applyConstraints({ advanced: [{ [type]: value }] })
                .catch(e => console.error(`Failed to apply ${type}:`, e));
            if (type === 'zoom') setZoom(value);
            else if (type === 'brightness') setBrightness(value);
            else if (type === 'contrast') setContrast(value);
        }
    }
  };

  const handleFileChange = (files: FileList | null) => {
    if (files && files[0]) {
        const file = files[0];
        setCapturedFile(file);
        setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLElement>) => e.preventDefault();
  const handleDrop = (e: React.DragEvent<HTMLElement>) => {
      e.preventDefault();
      handleFileChange(e.dataTransfer.files);
  };
  
  // FIX: Added function to toggle torch
  const handleToggleTorch = () => {
    if (mediaStreamRef.current && torchSupported) {
        const track = mediaStreamRef.current.getVideoTracks()[0];
        const newTorchState = !torchOn;
        track.applyConstraints({ advanced: [{ torch: newTorchState }] })
          .then(() => setTorchOn(newTorchState))
          .catch(e => console.error("Failed to toggle torch", e));
    }
  };

  const renderInitialState = () => (
    <div className="w-full">
      <div className="flex justify-center border-b dark:border-gray-700">
        <button onClick={() => setMode('upload')} className={`px-4 py-3 font-medium text-sm transition-colors ${mode === 'upload' ? 'border-b-2 border-brand-primary text-brand-primary' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}>
          {t('cameraCapture.uploadPhoto')}
        </button>
        <button onClick={() => setMode('camera')} className={`px-4 py-3 font-medium text-sm transition-colors ${mode === 'camera' ? 'border-b-2 border-brand-primary text-brand-primary' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}>
          {t('cameraCapture.useCamera')}
        </button>
      </div>

      {mode === 'upload' ? (
        <div className="p-6 flex items-center justify-center min-h-[300px]" onDragOver={handleDragOver} onDrop={handleDrop}>
          <input type="file" id="file-upload" accept="image/*" onChange={(e) => handleFileChange(e.target.files)} className="hidden" />
          <label htmlFor="file-upload" className="cursor-pointer text-center p-8 rounded-lg border-2 border-dashed hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
            <UploadCloudIcon className="mx-auto h-12 w-12 text-gray-400" />
            <span className="mt-2 block text-sm font-medium text-text-primary dark:text-gray-100">{t('cameraCapture.dragAndDrop')}</span>
          </label>
        </div>
      ) : (
        <div className="relative w-full min-h-[400px] flex items-center justify-center bg-gray-900">
            <video ref={videoRef} autoPlay playsInline muted className={`w-full h-auto max-h-[500px] transform ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`} />
            <canvas ref={canvasRef} className="hidden" />
            
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <svg viewBox="0 0 100 125" className="w-3/4 h-3/4 max-w-sm max-h-sm" style={{stroke: 'rgba(255, 255, 255, 0.6)', strokeWidth: '0.5'}}>
                    <path d="M50,25 C77.61,25 100,47.39 100,75 C100,91.87 89.2,106.37 73,112.5 M27,112.5 C10.8,106.37 0,91.87 0,75 C0,47.39 22.39,25 50,25" fill="none" />
                </svg>
            </div>

            <div className="absolute top-4 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-black/50 text-white text-xs rounded-full flex items-center gap-2 backdrop-blur-sm">
                <LightbulbIcon className="w-4 h-4" />
                <span>{t('cameraCapture.goodLighting')}</span>
            </div>

            {(zoomCapabilities || brightnessCapabilities || contrastCapabilities) && (
                <div className="absolute bottom-24 left-1/2 -translate-x-1/2 w-4/5 max-w-sm p-3 bg-black/40 backdrop-blur-sm rounded-xl space-y-2">
                    {zoomCapabilities && (
                        <div className="flex items-center gap-2 text-white" title="Zoom">
                            <ZoomInIcon className="w-5 h-5" />
                            <input type="range" min={zoomCapabilities.min} max={zoomCapabilities.max} step={zoomCapabilities.step} value={zoom} onChange={(e) => handleControlChange('zoom', Number(e.target.value))} className="w-full h-2 bg-white/30 rounded-lg appearance-none cursor-pointer accent-brand-primary" aria-label="Zoom control" />
                        </div>
                    )}
                    {brightnessCapabilities && (
                        <div className="flex items-center gap-2 text-white" title="Brightness">
                            <BrightnessIcon className="w-5 h-5" />
                            <input type="range" min={brightnessCapabilities.min} max={brightnessCapabilities.max} step={brightnessCapabilities.step} value={brightness} onChange={(e) => handleControlChange('brightness', Number(e.target.value))} className="w-full h-2 bg-white/30 rounded-lg appearance-none cursor-pointer accent-brand-primary" aria-label="Brightness control" />
                        </div>
                    )}
                    {contrastCapabilities && (
                        <div className="flex items-center gap-2 text-white" title="Contrast">
                            <ContrastIcon className="w-5 h-5" />
                            <input type="range" min={contrastCapabilities.min} max={contrastCapabilities.max} step={contrastCapabilities.step} value={contrast} onChange={(e) => handleControlChange('contrast', Number(e.target.value))} className="w-full h-2 bg-white/30 rounded-lg appearance-none cursor-pointer accent-brand-primary" aria-label="Contrast control" />
                        </div>
                    )}
                </div>
            )}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-full flex justify-center items-center gap-4 px-4">
                {/* Left Slot: Torch Button */}
                <div className="w-14 h-14 flex items-center justify-center">
                    {facingMode === 'environment' && torchSupported && (
                        <Button 
                            onClick={handleToggleTorch} 
                            variant="ghost" 
                            className={`bg-black/30 text-white hover:bg-black/50 p-3 rounded-full shadow-lg h-14 w-14 transition-colors ${torchOn ? '!bg-yellow-400 !text-black' : ''}`} 
                            aria-label="Toggle flash"
                        >
                            <FlashIcon />
                        </Button>
                    )}
                </div>

                {/* Center Slot: Capture Button */}
                <Button onClick={handleCaptureClick} className="shadow-lg !py-4 !px-4 !rounded-full">
                    <CameraIcon className="w-6 h-6" />
                </Button>
                
                {/* Right Slot: Switch Camera Button */}
                <div className="w-14 h-14 flex items-center justify-center">
                    {hasMultipleCameras && (
                        <Button 
                            onClick={handleSwitchCamera} 
                            variant="ghost" 
                            className="bg-black/30 text-white hover:bg-black/50 p-3 rounded-full shadow-lg h-14 w-14" 
                            aria-label="Switch camera"
                        >
                            <SwitchCameraIcon />
                        </Button>
                    )}
                </div>
            </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="w-full max-w-2xl mx-auto text-center border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm">
      <div className="bg-gray-50 dark:bg-gray-900/50 flex items-center justify-center relative">
        {!imagePreview ? renderInitialState() : (
          <div className="p-4">
            <img src={imagePreview} alt="Preview" className="max-w-full max-h-[400px] h-auto rounded-lg" />
          </div>
        )}
      </div>
      {imagePreview && (
        <div className="p-4 border-t dark:border-gray-700 bg-white dark:bg-gray-800 flex justify-center gap-4">
          <Button onClick={() => { setImagePreview(null); setCapturedFile(null); }} variant="ghost">{t('cameraCapture.retake')}</Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? t('cameraCapture.analyzing') : (analyzeButtonText || t('cameraCapture.analyzePhoto'))}
          </Button>
        </div>
      )}
    </div>
  );
};

// SVG Icons
function LightbulbIcon({ className = "h-4 w-4" }: { className?: string }) { return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 9 6c0 1.3.5 2.6 1.5 3.5.7.8 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>; }
function FlashIcon({ className = "h-6 w-6" }: { className?: string }) { return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m13 2-3 9h9L7 22l3-9H3z"/></svg>; }
function CameraIcon({ className = "h-4 w-4" }: { className?: string }) { return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>; }
function SwitchCameraIcon({ className = "h-6 w-6" }: { className?: string }) { return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m17 2 4 4-4 4"/><path d="M3 11v-1a4 4 0 0 1 4-4h14"/><path d="m7 22-4-4 4-4"/><path d="M21 13v1a4 4 0 0 1-4 4H3"/></svg>; }
function BrightnessIcon({ className = "h-4 w-4" }: { className?: string }) { return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m4.93 19.07 1.41-1.41"/><path d="m17.66 6.34 1.41-1.41"/></svg>; }
function ContrastIcon({ className = "h-4 w-4" }: { className?: string }) { return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><path d="M12 18a6 6 0 0 0 0-12v12z"/></svg>; }
function ZoomInIcon({ className = "h-4 w-4" }: { className?: string }) { return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>; }
function UploadCloudIcon({ className = "h-4 w-4" }: { className?: string }) { return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M12 12v9"/><path d="m16 16-4-4-4 4"/></svg>; }