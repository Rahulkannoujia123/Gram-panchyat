'use client';

import { useState, useRef } from 'react';
import { Camera, Check, X, Plus, Minus, RotateCw } from 'lucide-react';
import { detectClothingItems, calculateCost } from '@/app/lib/aiCounter';

interface PhotoCaptureProps {
  onConfirm: (count: number, photoUrl: string, totalAmount: number) => void;
  onCancel: () => void;
}

export function PhotoCapture({ onConfirm, onCancel }: PhotoCaptureProps) {
  const [stage, setStage] = useState<'camera' | 'preview' | 'counting' | 'result'>('camera');
  const [photoUrl, setPhotoUrl] = useState<string>('');
  const [itemCount, setItemCount] = useState<number>(1);
  const [detectedItems, setDetectedItems] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string>('');

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const RATE_PER_ITEM = 8;

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      setError('Camera access denied. Please enable camera permissions.');
      console.error('[v0] Camera error:', err);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        const url = canvasRef.current.toDataURL('image/jpeg', 0.8);
        setPhotoUrl(url);
        setStage('preview');

        // Stop camera stream
        const stream = videoRef.current.srcObject as MediaStream;
        stream?.getTracks().forEach(track => track.stop());
      }
    }
  };

  const analyzePhoto = async () => {
    if (!photoUrl) return;

    setIsAnalyzing(true);
    setError('');

    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = async () => {
        try {
          console.log('[v0] Starting AI analysis...');
          const result = await detectClothingItems(img);
          console.log('[v0] AI result:', result);

          setDetectedItems(result.items);
          setItemCount(result.count);
          setStage('result');
        } catch (err) {
          console.error('[v0] AI analysis error:', err);
          setError('AI analysis failed. Using manual count.');
          setStage('counting');
        } finally {
          setIsAnalyzing(false);
        }
      };
      img.src = photoUrl;
    } catch (err) {
      console.error('[v0] Photo analysis error:', err);
      setError('Failed to analyze photo');
      setIsAnalyzing(false);
    }
  };

  const handleManualInput = () => {
    setStage('camera');
    setPhotoUrl('');
    setItemCount(1);
    startCamera();
  };

  const handleUploadPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPhotoUrl(reader.result as string);
        setStage('preview');
      };
      reader.readAsDataURL(file);
    }
  };

  const totalAmount = calculateCost(itemCount, RATE_PER_ITEM);

  if (stage === 'camera') {
    return (
      <div className="fixed inset-0 bg-background/95 z-50 flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-border">
          <h2 className="text-xl font-bold">📷 कपड़े की तस्वीर लें</h2>
          <button onClick={onCancel} className="p-2 hover:bg-muted rounded-lg">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center relative">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
          <canvas ref={canvasRef} className="hidden" />

          <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-4">
            <button
              onClick={capturePhoto}
              className="bg-primary text-primary-foreground rounded-full p-6 hover:scale-110 transition-transform"
              title="Capture Photo"
            >
              <Camera size={32} />
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-secondary text-secondary-foreground rounded-full p-6 hover:scale-110 transition-transform"
              title="Upload Photo"
            >
              <Plus size={32} />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleUploadPhoto}
              className="hidden"
            />
          </div>
        </div>

        {error && <div className="p-4 bg-destructive/20 text-destructive text-sm">{error}</div>}
      </div>
    );
  }

  if (stage === 'preview') {
    return (
      <div className="fixed inset-0 bg-background/95 z-50 flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-border">
          <h2 className="text-xl font-bold">तस्वीर का पूर्वावलोकन</h2>
          <button onClick={onCancel} className="p-2 hover:bg-muted rounded-lg">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <img src={photoUrl} alt="Preview" className="max-w-full max-h-[70vh] rounded-lg" />
        </div>

        <div className="p-4 border-t border-border flex gap-4 justify-center">
          <button
            onClick={() => {
              setPhotoUrl('');
              setStage('camera');
              startCamera();
            }}
            className="px-6 py-3 bg-muted text-muted-foreground rounded-lg font-semibold hover:bg-secondary"
          >
            🔄 फिर से लें
          </button>
          <button
            onClick={analyzePhoto}
            disabled={isAnalyzing}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 disabled:opacity-50"
          >
            {isAnalyzing ? '🤖 विश्लेषण हो रहा है...' : '🤖 AI से गणना करें'}
          </button>
        </div>
      </div>
    );
  }

  if (stage === 'result') {
    return (
      <div className="fixed inset-0 bg-background/95 z-50 flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-border">
          <h2 className="text-xl font-bold">✅ कपड़ों की गिनती</h2>
          <button onClick={onCancel} className="p-2 hover:bg-muted rounded-lg">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-auto">
          <div className="p-4 space-y-4">
            <div className="flex gap-4">
              <img src={photoUrl} alt="Captured" className="w-32 h-32 rounded-lg object-cover" />
              <div className="flex-1">
                <h3 className="font-bold text-lg mb-2">📊 AI विश्लेषण परिणाम:</h3>
                {detectedItems.length > 0 ? (
                  <div className="text-sm space-y-1">
                    {detectedItems.slice(0, 5).map((item, i) => (
                      <p key={i} className="text-muted-foreground">
                        • {item}
                      </p>
                    ))}
                    {detectedItems.length > 5 && (
                      <p className="text-muted-foreground">
                        • +{detectedItems.length - 5} और...
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-muted-foreground">मैनुअल गणना के लिए संख्या समायोजित करें</p>
                )}
              </div>
            </div>

            <div className="bg-card p-4 rounded-lg border-2 border-primary space-y-4">
              <div>
                <label className="text-sm font-semibold block mb-2">
                  कपड़ों की संख्या: {itemCount}
                </label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setItemCount(Math.max(1, itemCount - 1))}
                    className="p-2 bg-destructive text-white rounded-lg hover:opacity-80"
                  >
                    <Minus size={20} />
                  </button>
                  <input
                    type="number"
                    value={itemCount}
                    onChange={e => setItemCount(Math.max(1, parseInt(e.target.value) || 1))}
                    className="text-center text-2xl font-bold bg-muted rounded-lg p-2 w-20"
                  />
                  <button
                    onClick={() => setItemCount(itemCount + 1)}
                    className="p-2 bg-primary text-primary-foreground rounded-lg hover:opacity-80"
                  >
                    <Plus size={20} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-muted p-3 rounded-lg">
                  <p className="text-sm text-muted-foreground">प्रति कपड़ा दर</p>
                  <p className="text-2xl font-bold">₹{RATE_PER_ITEM}</p>
                </div>
                <div className="bg-primary/20 p-3 rounded-lg border-2 border-primary">
                  <p className="text-sm text-muted-foreground">कुल राशि</p>
                  <p className="text-2xl font-bold text-primary">₹{totalAmount}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-border flex gap-4 justify-center">
          <button
            onClick={() => {
              setPhotoUrl('');
              setStage('camera');
              startCamera();
            }}
            className="px-6 py-3 bg-muted text-muted-foreground rounded-lg font-semibold hover:bg-secondary"
          >
            🔄 फिर से शुरू करें
          </button>
          <button
            onClick={() => onConfirm(itemCount, photoUrl, totalAmount)}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90"
          >
            <Check className="inline mr-2" size={20} />
            ✓ पुष्टि करें
          </button>
        </div>
      </div>
    );
  }

  return null;
}
