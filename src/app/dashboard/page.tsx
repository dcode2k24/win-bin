
"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/contexts/user-context";
import { AppHeader } from "@/components/layout/header";
import { BottleCountDisplay } from "@/components/dashboard/bottle-count-display";
import { EcoCoinCard } from "@/components/dashboard/eco-coin-card";
import { RedeemCard } from "@/components/dashboard/redeem-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Package, Clock, Loader2, Trash2, CheckCircle, AlertTriangle, Camera, HelpCircle, Mail, Code } from "lucide-react";
import type { Bottle } from "@/contexts/user-context";
import { Button } from "@/components/ui/button";
import { suggestBottleType, SuggestBottleTypeOutput } from "@/ai/flows/suggest-bottle-type";
import { useToast } from "@/hooks/use-toast";

interface DetectedBottle {
  type: string;
}

export default function DashboardPage() {
  const { user, bottles, addBottle, ecoCoins } = useUser();
  const router = useRouter();
  const { toast } = useToast();

  const [isDetecting, setIsDetecting] = useState(false);
  const [detectedBottle, setDetectedBottle] = useState<DetectedBottle | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!user) {
      router.replace("/");
    }
  }, [user, router]);
  
  // Request camera permission on component mount
  useEffect(() => {
    const getCameraPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setHasCameraPermission(true);
      } catch (err) {
        console.error('Error accessing camera:', err);
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Camera Access Denied',
          description: 'Please enable camera permissions in your browser settings to use this feature.',
        });
      }
    };

    getCameraPermission();

    // Cleanup function to stop video stream
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [toast]);

  const handleAIDetection = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current || isDetecting) return;

    setIsDetecting(true);
    setError(null);
    setDetectedBottle(null);

    try {
      const video = videoRef.current;
      const canvas = canvasRef.current;

      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const context = canvas.getContext('2d');
      if (!context) {
        throw new Error("Could not get canvas context");
      }
      
      // Draw the current video frame onto the canvas
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Convert the canvas image to a data URI
      const dataUri = canvas.toDataURL('image/jpeg');

      const aiResult: SuggestBottleTypeOutput = await suggestBottleType({ photoDataUri: dataUri });

      if (aiResult.isBottle && aiResult.suggestions && aiResult.suggestions.length > 0) {
        const firstSuggestion = aiResult.suggestions[0];
        setDetectedBottle({
          type: firstSuggestion.type,
        });
      } else {
        setError("AI did not detect a plastic bottle. Please try again.");
      }
    } catch (err) {
      console.error("AI detection failed:", err);
      setError("An error occurred during analysis. Please try again later.");
    } finally {
      setIsDetecting(false);
    }
  }, [isDetecting]);

  const handleAddBottle = () => {
    if (detectedBottle) {
      addBottle(detectedBottle.type, 0); // Size is no longer detected, so pass 0
      setDetectedBottle(null); 
      setError(null);
    }
  };
  
  const handleRetry = () => {
    setError(null);
    setDetectedBottle(null);
    // User can just click "Scan" again
  };

  // If user is not logged in, redirect them.
  if (!user) {
    return (
      <div className="flex flex-col min-h-screen">
        <AppHeader />
        <main className="flex-grow flex flex-col items-center justify-center p-4 bg-secondary">
           <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
           <p className="text-muted-foreground">Redirecting to login...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-secondary">
      <AppHeader />
      <main className="flex-grow p-4 md:p-6 space-y-6 container mx-auto max-w-4xl">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <BottleCountDisplay />
          <EcoCoinCard />
        </div>
        
        <Card className="shadow-lg">
            <CardHeader>
                <CardTitle className="text-xl font-medium text-primary flex items-center gap-2">
                    <Camera className="h-6 w-6" /> Bottle Scanner
                </CardTitle>
                <CardDescription>
                    Point your camera at a plastic bottle and click "Scan Bottle" to identify it.
                </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center p-6 text-center space-y-4">
                <div className="w-full max-w-md bg-black rounded-lg overflow-hidden shadow-inner relative aspect-video">
                  {/* The hidden canvas for capturing frames */}
                  <canvas ref={canvasRef} className="hidden"></canvas>
                  
                  {/* The video element for the camera stream */}
                  <video ref={videoRef} className="w-full h-full object-cover" autoPlay playsInline muted />

                  {hasCameraPermission === false && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 text-white p-4">
                        <AlertTriangle className="h-8 w-8 text-destructive mb-2" />
                        <p className="font-semibold">Camera Access Denied</p>
                        <p className="text-sm text-center">Please allow camera access in your browser settings to use the scanner.</p>
                    </div>
                  )}
                   {hasCameraPermission === null && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 text-white">
                        <Loader2 className="h-8 w-8 animate-spin" />
                        <p className="mt-2">Starting camera...</p>
                    </div>
                  )}
                </div>

                {isDetecting ? (
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Loader2 className="h-5 w-5 animate-spin text-primary" />
                        <span>AI is analyzing the image...</span>
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center gap-2">
                        <p className="text-destructive">{error}</p>
                        <Button onClick={handleRetry} variant="outline">Try Again</Button>
                    </div>
                ) : detectedBottle ? (
                    <div className="flex flex-col items-center gap-3">
                        <div className="flex items-center gap-2 text-lg">
                            <CheckCircle className="h-7 w-7 text-green-500" />
                            <p>Detected: <span className="font-semibold">{detectedBottle.type}</span></p>
                        </div>
                        <Button onClick={handleAddBottle} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                            Add This Bottle
                        </Button>
                    </div>
                ) : (
                   <Button onClick={handleAIDetection} disabled={isDetecting || hasCameraPermission !== true} size="lg">
                     <Camera className="mr-2 h-5 w-5" />
                     Scan Bottle
                   </Button>
                )}
            </CardContent>
        </Card>

        <RedeemCard />

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-medium text-primary">Recycling History</CardTitle>
            <CardDescription>View the bottles you've recycled.</CardDescription>
          </CardHeader>
          <CardContent>
            {bottles.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No bottles recycled yet. Start scanning!</p>
            ) : (
              <ScrollArea className="h-64">
                <ul className="space-y-3 pr-3">
                  {bottles.slice().reverse().map((bottle: Bottle) => (
                    <li key={bottle.id} className="flex items-center justify-between p-3 bg-background rounded-md shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-3">
                        <Package className="h-5 w-5 text-primary shrink-0" />
                        <div className="flex-grow min-w-0">
                          <p className="font-medium truncate" title={bottle.type}>{bottle.type}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground whitespace-nowrap">
                        <Clock className="h-3 w-3 shrink-0" />
                        {new Date(bottle.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </li>
                  ))}
                </ul>
              </ScrollArea>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-medium text-primary flex items-center gap-2">
              <HelpCircle className="h-6 w-6" /> Support & Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="flex items-center gap-4">
              <Mail className="h-6 w-6 text-muted-foreground" />
              <div>
                <p className="font-semibold">Support Email</p>
                <a href="mailto:dcode2k24@gmail.com" className="text-sm text-primary hover:underline">
                  dcode2k24@gmail.com
                </a>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Code className="h-6 w-6 text-muted-foreground" />
              <div>
                <p className="font-semibold">Created By</p>
                <p className="text-sm text-muted-foreground">Team D-CODE</p>
              </div>
            </div>
          </CardContent>
        </Card>

      </main>
      <footer className="text-center p-4 text-sm text-muted-foreground border-t bg-background">
        © {new Date().getFullYear()} Win-Bin. Keep up the great work!
      </footer>
    </div>
  );
}

    