import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center text-foreground mb-8">
          AI Studio
        </h1>
        <div className="text-center text-muted-foreground">
          <p>Your AI image generation workspace</p>
        </div>
      </div>
    </main>
  );
}
