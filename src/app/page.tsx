"use client"

import FileUpload from "@/components/file-upload";
import SidePanel from "@/components/side-panel";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      {/* Main Container */}
      <div className="h-screen flex flex-col">
        {/* Title Section */}
        <div className="text-center py-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            AI Studio
          </h1>
          <p className="text-lg text-muted-foreground">
            Create amazing AI-generated images with your prompts and style preferences
          </p>
        </div>

        {/* Content Container */}
        <div className="flex flex-1 gap-8 px-6 pb-8">
          {/* Left Side - Side Panel */}
          <div className="flex-shrink-0">
            <SidePanel />
          </div>
          
          {/* Right Side - Upload Image - Centered */}
          <div className="flex-1 flex items-center justify-center">
            <FileUpload maxSizeMB={10} />
          </div>
        </div>
      </div>
    </main>
  );
}
