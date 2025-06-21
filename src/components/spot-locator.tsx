'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Locate, Bot, Upload, Loader2 } from 'lucide-react';
import { findMySpot } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export function SpotLocator() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const { toast } = useToast();

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

  const handleSubmit = async () => {
    if (!file || !preview) {
      toast({
        title: 'No image selected',
        description: 'Please upload a photo of your parking spot.',
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

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>AI Spot Locator</CardTitle>
        <CardDescription>Lost in the lot? Upload a photo of where you parked, and our AI will help you find your way.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="picture" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Parking Spot Photo
          </Label>
          <Input id="picture" type="file" accept="image/*" onChange={handleFileChange} className="file:text-primary cursor-pointer"/>
        </div>

        {preview && (
          <div className="mt-4 border rounded-lg p-2 bg-muted/50 max-w-sm mx-auto">
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
        <Button onClick={handleSubmit} disabled={isLoading || !file} className="w-full md:w-auto">
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
