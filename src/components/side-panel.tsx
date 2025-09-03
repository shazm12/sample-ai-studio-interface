"use client"

import PromptStyleBox from "./prompt-style-box";

export default function SidePanel() {
  return (
    <div className="w-96 h-full bg-card border-r shadow-sm p-6 overflow-y-auto">
      <PromptStyleBox />
    </div>
  );
}
