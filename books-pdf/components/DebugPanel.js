'use client';

import { useState } from 'react';

const DebugPanel = ({ flowSteps }) => {
    const [isOpen, setIsOpen] = useState(false);

    if (process.env.NODE_ENV === 'production') return null;

    return (
        <div className="fixed bottom-4 right-4 z-50">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="bg-purple-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-purple-700 text-sm font-semibold"
            >
                🐛 Debug Flow
            </button>

            {isOpen && (
                <div className="absolute bottom-14 right-0 bg-white rounded-lg shadow-2xl p-4 w-80 max-h-96 overflow-y-auto border-2 border-purple-200">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="font-bold text-lg">Payment Flow Debug</h3>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            ✕
                        </button>
                    </div>
                    <div className="space-y-2">
                        {flowSteps.map((step, index) => (
                            <div
                                key={index}
                                className={`p-2 rounded text-sm ${
                                    step.completed
                                        ? 'bg-green-50 border-l-4 border-green-500'
                                        : 'bg-gray-50 border-l-4 border-gray-300'
                                }`}
                            >
                                <div className="flex items-center gap-2">
                                    <span className={`text-xs ${step.completed ? 'text-green-600' : 'text-gray-400'}`}>
                                        {step.completed ? '✓' : '○'}
                                    </span>
                                    <span className="font-semibold">{step.name}</span>
                                </div>
                                {step.data && (
                                    <pre className="text-xs mt-1 text-gray-600 overflow-x-auto">
                                        {JSON.stringify(step.data, null, 2)}
                                    </pre>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DebugPanel;
