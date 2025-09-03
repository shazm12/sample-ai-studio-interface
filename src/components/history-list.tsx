"use client"

import { useState, useEffect } from 'react';
import { responseQueue, GenerationHistory } from '@/app/utils/response-history';

export default function HistoryList() {
    const [history, setHistory] = useState<GenerationHistory[]>([]);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        // Load history from queue on client side only
        setHistory(responseQueue.getAll());
    }, []);

    // Don't render anything until client-side hydration is complete
    if (!isClient) {
        return (
            <div className="w-full">
                <div className="mb-4">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">History</h2>
                </div>
                <div className="text-gray-500 dark:text-gray-400 text-sm text-center py-8 border rounded-lg bg-muted/50">
                    Loading history...
                </div>
            </div>
        );
    }

    return (
        <div className="w-full">
            <div className="mb-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">History</h2>
            </div>
            <div className="space-y-3">
                {history.length === 0 ? (
                    <div className="text-gray-500 dark:text-gray-400 text-sm text-center py-8 border rounded-lg bg-muted/50">
                        No history yet. Generate an image to see it here.
                    </div>
                ) : (
                    <ul className="space-y-2">
                        {history.map((response) => (
                            <li key={response.id}>
                                <div className="flex items-center gap-3 p-4 rounded-lg border bg-card shadow-sm hover:shadow-md transition-shadow">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium text-gray-900 dark:text-gray-100 truncate">{response.prompt}</span>
                                            <span className="ml-2 px-2 py-0.5 rounded text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                                                {response.style}
                                            </span>
                                        </div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                            {new Date(response.createdAt).toLocaleString()}
                                        </div>
                                        {response.status === 'error' && (
                                            <div className="mt-1 text-xs text-red-500 dark:text-red-400">
                                                {response.message || "Error"}
                                            </div>
                                        )}
                                    </div>
                                    {response.imageUrl && (
                                        <p className="text-sm text-gray-500 dark:text-gray-400">{response.imageUrl}</p>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}