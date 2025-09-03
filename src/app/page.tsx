"use client"
import FileUpload from "@/components/file-upload";
import PromptStyleBox from "@/components/prompt-style-box";
import { useState } from "react";

export default function Home() {

  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            AI Studio
          </h1>
          <p className="text-lg text-muted-foreground">
            Create amazing AI-generated images with your prompts and style preferences
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto space-y-8">
          {/* File Upload Section */}
          <FileUpload maxSizeMB={10} />

          {/* Prompt & Style Section */}
          <section className="bg-card border rounded-lg p-6 shadow-sm">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-foreground mb-2">
                Prompt & Style
              </h2>
              <p className="text-muted-foreground">
                Describe your vision and choose a style
              </p>
            </div>
            <PromptStyleBox  />
          </section>
        </div>
      </div>
    </main>
  );
}
