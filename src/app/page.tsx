"use client"

import FileUpload from "@/components/file-upload";
import HistoryList from "@/components/history-list";
import SidePanel from "@/components/side-panel";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      {/* Title Section */}
      <div className="text-center py-8">
        <h1 className="text-4xl font-bold text-foreground mb-4">
          AI Studio
        </h1>
        <p className="text-lg text-muted-foreground">
          Create amazing AI-generated images with your prompts and style preferences
        </p>
      </div>

      {/* Main Content Area */}
      <div className="flex gap-8 px-6 pb-8">
        {/* Left Side - Side Panel */}
        <div className="flex-shrink-0">
          <SidePanel />
        </div>
        
        {/* Right Side - Upload Image - Centered */}
        <div className="flex-1 flex items-center justify-center">
          <FileUpload maxSizeMB={10} />
        </div>
      </div>

      {/* History Section - Separate section below */}
      <div className="px-6 pb-8">
        <HistoryList />
      </div>
    </main>
  );
}
