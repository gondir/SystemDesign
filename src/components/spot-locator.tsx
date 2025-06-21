'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Locate, Bot, Upload, Loader2, Camera, Video, VideoOff } from 'lucide-react';
import { findMySpot } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function SpotLocator() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Stop any active video stream when the component unmounts
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const getCameraPermission = async () => {
    // Only ask for permission if we haven't already determined it
    if (hasCameraPermission !== null) return;
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setHasCameraPermission(true);
    } catch (error) {
      console.error('Error accessing camera:', error);
      setHasCameraPermission(false);
      toast({
        variant: 'destructive',
        title: 'Camera Access Denied',
        description: 'Please enable camera permissions in your browser settings to use the camera feature.',
      });
    }
  };

  const handleTabChange = (value: string) => {
    setPreview(null);
    setResult(null);
    if (value === 'camera') {
      getCameraPermission();
    } else {
      // Stop the camera stream when switching away
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 4 * 1024 * 1024) { // 4MB limit
        toast({
          title: 'Image too large',
          description: 'Please upload an image smaller than 4MB.',
          variant: 'destructive',
        });
        return;
      }
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
      setResult(null);
    }
  };

  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        const dataUri = canvas.toDataURL('image/jpeg');
        setPreview(dataUri);
        setResult(null);
        setFile(null); // Clear file if a photo is taken
      }
    }
  };

  const handleSubmit = async () => {
    if (!preview) {
      toast({
        title: 'No image provided',
        description: 'Please upload or take a photo of your parking spot.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setResult(null);

    const { data, error } = await findMySpot({ photoDataUri: preview });

    setIsLoading(false);

    if (error) {
      toast({
        title: 'Error',
        description: error,
        variant: 'destructive',
      });
    } else if (data) {
      setResult(data.locationDescription);
    }
  };
  
  const isSubmitDisabled = isLoading || (!preview);

  return (
    <Card className="w-full overflow-hidden">
        <div className="relative h-48 w-full">
            <Image
                src="https://placehold.co/600x240.png"
                alt="Graphic of a car being located on a map"
                fill
                className="object-cover"
                data-ai-hint="location map"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-card via-card/80 to-transparent" />
        </div>
      <CardHeader className="pt-2">
        <CardTitle>AI Spot Locator</CardTitle>
        <CardDescription>Lost in the lot? Use your camera or upload a photo, and our AI will help you find your way.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">

        <Tabs defaultValue="camera" className="w-full" onValueChange={handleTabChange}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="camera"><Camera className="mr-2 h-4 w-4"/>Use Camera</TabsTrigger>
            <TabsTrigger value="upload"><Upload className="mr-2 h-4 w-4"/>Upload Photo</TabsTrigger>
          </TabsList>
          <TabsContent value="camera" className="mt-6">
            <div className="space-y-4">
              <div className="relative aspect-video w-full max-w-sm mx-auto bg-muted rounded-lg overflow-hidden flex items-center justify-center">
                <video ref={videoRef} className="w-full h-full object-cover" autoPlay playsInline muted />
                <canvas ref={canvasRef} className="hidden" />
                {hasCameraPermission === false && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                        <VideoOff className="h-12 w-12 text-muted-foreground" />
                        <p className="mt-2 text-muted-foreground">Camera access is disabled.</p>
                        <p className="text-xs text-muted-foreground">Please enable it in your browser settings or use the upload option.</p>
                    </div>
                )}
                {hasCameraPermission === null && (
                     <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                        <Video className="h-12 w-12 text-muted-foreground" />
                        <p className="mt-2 text-muted-foreground">Camera will appear here.</p>
                    </div>
                )}
              </div>
              <Button onClick={takePhoto} disabled={!hasCameraPermission || isLoading} className="w-full">
                <Camera className="mr-2 h-4 w-4" />
                Take Photo
              </Button>
            </div>
          </TabsContent>
          <TabsContent value="upload" className="mt-6">
             <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="picture">
                  Parking Spot Photo
                </Label>
                <Input id="picture" type="file" accept="image/*" onChange={handleFileChange} className="file:text-primary cursor-pointer"/>
              </div>
          </TabsContent>
        </Tabs>
        
        {preview && (
          <div className="mt-4 border rounded-lg p-2 bg-muted/50 max-w-sm mx-auto">
            <p className="text-sm font-medium text-center mb-2">Image Preview</p>
            <Image src={preview} alt="Parking spot preview" width={400} height={300} className="rounded-md object-contain max-h-64 w-full" data-ai-hint="parking garage" />
          </div>
        )}
        
        {isLoading && (
            <div className="flex items-center justify-center space-x-2 text-muted-foreground pt-4">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Analyzing your location... this may take a moment.</span>
            </div>
        )}

        {result && (
            <Alert className="mt-4">
                <Bot className="h-4 w-4" />
                <AlertTitle>Location Found!</AlertTitle>
                <AlertDescription className="text-foreground">
                    {result}
                </AlertDescription>
            </Alert>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={handleSubmit} disabled={isSubmitDisabled} className="w-full md:w-auto">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Locating...
            </>
          ) : (
            <>
              <Locate className="mr-2 h-4 w-4" />
              Locate My Spot
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
