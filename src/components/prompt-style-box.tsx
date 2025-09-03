"use client"

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { generateImage, GenerateImageResponse, generateImageWithRetry } from '@/app/actions/generate-image';
import { responseQueue } from '@/app/utils/response-history';

interface PromptStyleBoxProps {
    onPromptChange?: (prompt: string) => void;
    onStyleChange?: (style: string) => void;
    className?: string;
}

const PromptStyleBox: React.FC<PromptStyleBoxProps> = ({
    onPromptChange,
    onStyleChange,
    className = ""
}) => {
    const [prompt, setPrompt] = useState("");
    const [selectedStyle, setSelectedStyle] = useState("");
    const [result, setResult] = useState<GenerateImageResponse | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Handle prompt change
    const handlePromptChange = (value: string) => {
        setPrompt(value);
        onPromptChange?.(value);
    };

    // Handle style change
    const handleStyleChange = (value: string) => {
        setSelectedStyle(value);
        onStyleChange?.(value);
    };

    const saveResponseInHistory = (response: GenerateImageResponse) => {
        responseQueue.enqueue(response);
    };

    // Handle generate button click
    const handleGenerate = async () => {
        if (!prompt.trim() || !selectedStyle) return;

        setIsGenerating(true);
        setError(null);
        setResult(null);

        try {
            const res = await generateImage({
                prompt: prompt.trim(),
                style: selectedStyle
            });

            if (res.status === 'success') {
                setResult(res);
                saveResponseInHistory(res);
            } else {
                const retryRes = await generateImageWithRetry({
                    prompt: prompt.trim(),
                    style: selectedStyle
                });
                setResult(retryRes);
                saveResponseInHistory(retryRes);
            }
            
        } catch (error) {
            console.error('Generation error:', error);
            setError('Failed to generate image. Please try again.');
        } finally {
            setIsGenerating(false);
        }
    };

    const canGenerate = prompt.trim() && selectedStyle;

    const styleOptions = [
        {
            value: "editorial",
            label: "Editorial",
            description: "Professional, magazine-style photography",
            icon: "📰"
        },
        {
            value: "streetwear",
            label: "Streetwear",
            description: "Urban, fashion-forward aesthetic",
            icon: "👟"
        },
        {
            value: "vintage",
            label: "Vintage",
            description: "Classic, retro-inspired look",
            icon: "📷"
        },
        {
            value: "minimalist",
            label: "Minimalist",
            description: "Clean, simple, and elegant",
            icon: "⚪"
        },
        {
            value: "artistic",
            label: "Artistic",
            description: "Creative, expressive, and unique",
            icon: "🎨"
        }
    ];

    const selectedStyleData = styleOptions.find(style => style.value === selectedStyle);

    return (
        <div className={`space-y-6 ${className}`}>
            {/* Prompt Input Section */}
            <Card className="border-2 border-dashed border-gray-200 hover:border-gray-300 transition-colors">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl">
                        <span className="text-2xl">✨</span>
                        Describe Your Vision
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="prompt" className="text-sm font-medium text-gray-700">
                            What would you like to create?
                        </Label>
                        <Textarea
                            id="prompt"
                            placeholder="A futuristic cityscape with neon lights, cyberpunk aesthetic, high-tech architecture..."
                            value={prompt}
                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handlePromptChange(e.target.value)}
                            className="min-h-[120px] resize-none border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                            rows={4}
                        />
                        <p className="text-xs text-gray-500">
                            Be specific and descriptive for better results
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* Style Selection Section */}
            <Card className="border-2 border-dashed border-gray-200 hover:border-gray-300 transition-colors">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl">
                        <span className="text-2xl">🎭</span>
                        Choose Your Style
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="style" className="text-sm font-medium text-gray-700">
                            Select a style that matches your vision
                        </Label>
                        <Select value={selectedStyle} onValueChange={handleStyleChange}>
                            <SelectTrigger className="w-full h-14 px-4 border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                                <SelectValue placeholder="Choose a style...">
                                    {selectedStyleData ? selectedStyleData.label : "Choose a style..."}
                                </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                                {styleOptions.map((style) => (
                                    <SelectItem key={style.value} value={style.value}>
                                        <div className="flex items-center gap-3">
                                            <span className="text-lg">{style.icon}</span>
                                            <div className="flex flex-col">
                                                <span className="font-medium">{style.label}</span>
                                                <span className="text-xs text-gray-500">{style.description}</span>
                                            </div>
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Selected Style Display */}
                    {selectedStyleData && (
                        <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                            <div className="flex items-center gap-3">
                                <span className="text-2xl">{selectedStyleData.icon}</span>
                                <div>
                                    <h4 className="font-semibold text-gray-900">{selectedStyleData.label}</h4>
                                    <p className="text-sm text-gray-600">{selectedStyleData.description}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Live Summary */}
            <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg text-green-800">
                        <span className="text-xl">🎯</span>
                        {result ? "Your Generation Summary" : (isGenerating ? "Generating..." : "Generate Summary")}
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    {result && (
                        <div className="flex flex-col gap-2">
                            <div className="flex gap-2">
                                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                                    Prompt
                                </Badge>
                                <p className="text-sm text-gray-700">{result?.prompt}</p>
                            </div>
                            <div className="flex gap-2">
                                <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                                    Style
                                </Badge>
                                <p className="text-sm text-gray-700">{result?.style}</p>
                            </div>
                            <div className="flex gap-2">
                                <Badge variant="secondary" className="bg-gray-100 text-gray-800"> Generated At:</Badge>
                                <p className="text-sm text-gray-700">{result?.createdAt}</p>
                            </div>
                            <div className='flex gap-2'>
                                <p> Image Url : {result?.imageUrl}</p>
                            </div>
                        </div>
                    )}
                    {isGenerating && (
                        <div className="flex items-center gap-2">
                            <span>
                                <div className="h-5 w-5 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
                            </span>
                            <p className="text-sm text-gray-700">Generating...</p>
                        </div>
                    )}
                </CardContent>
            </Card>
            {/* Generate Button */}
            <Button
                onClick={handleGenerate}
                disabled={!canGenerate || isGenerating}
                className="w-full h-14 text-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                ✨ Generate Image
            </Button>
        </div>
    );
};

export default PromptStyleBox;
