"use client"
import FileUpload from "@/components/file-upload";

export default function Home() {
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
          <section className="bg-card border rounded-lg p-6 shadow-sm">
            <FileUpload
              maxSizeMB={10}
            />
          </section>
        </div>
      </div>
    </main>
  );
}
