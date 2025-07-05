import { useEffect, useState, useRef } from "react";

interface StreamingResponseProps {
  responseStream: string;
  loading: boolean;
  error: { message?: string } | null;
}

const StreamingResponse = ({
  responseStream,
  loading,
  error,
}: StreamingResponseProps) => {
  const [displayedText, setDisplayedText] = useState("");
  const [isStreamComplete, setIsStreamComplete] = useState(false);
  const responseRef = useRef<HTMLDivElement>(null);

  // Simulate streaming text effect when new content is available
  useEffect(() => {
    if (!responseStream || isStreamComplete) return;

    let currentIndex = 0;
    const fullText = responseStream;

    // Reset if we get a new response
    if (currentIndex === 0) {
      setDisplayedText("");
      setIsStreamComplete(false);
    }

    const streamInterval = setInterval(() => {
      if (currentIndex < fullText.length) {
        setDisplayedText(fullText.substring(0, currentIndex + 1));
        currentIndex++;
      } else {
        clearInterval(streamInterval);
        setIsStreamComplete(true);
      }
    }, 15); // Speed of text appearance

    return () => clearInterval(streamInterval);
  }, [responseStream, isStreamComplete]);

  // Auto-scroll to bottom as new content appears
  useEffect(() => {
    if (responseRef.current) {
      responseRef.current.scrollTop = responseRef.current.scrollHeight;
    }
  }, [displayedText]);

  return (
    <div className="w-full max-w-4xl mx-auto mt-8 mb-8">
      <div className="bg-white border-2 border-teal-800 rounded-lg shadow-lg overflow-hidden">
        <div className="flex items-center justify-between bg-teal-800 px-4 py-3">
          <h3 className="text-white font-medium">Your Travel Itinerary</h3>
          <div className="flex space-x-2">
            {loading && !isStreamComplete && (
              <div className="flex items-center">
                <span className="text-white text-sm mr-2">Generating</span>
                <div className="flex space-x-1">
                  <div
                    className="w-1.5 h-1.5 bg-white rounded-full animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  ></div>
                  <div
                    className="w-1.5 h-1.5 bg-white rounded-full animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  ></div>
                  <div
                    className="w-1.5 h-1.5 bg-white rounded-full animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  ></div>
                </div>
              </div>
            )}
            {isStreamComplete && (
              <span className="text-white text-sm">Complete</span>
            )}
          </div>
        </div>

        <div ref={responseRef} className="p-6 h-96 overflow-y-auto font-sans">
          {error ? (
            <div className="text-red-500">
              <p className="font-medium">Error loading itinerary</p>
              <p>{error.message || "Please try again later."}</p>
            </div>
          ) : loading && !displayedText ? (
            <div className="animate-pulse flex space-x-4">
              <div className="flex-1 space-y-4 py-1">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                </div>
              </div>
            </div>
          ) : (
            <div className="whitespace-pre-wrap markdown-content">
              {displayedText}
              {loading && !isStreamComplete && (
                <span className="inline-block w-1.5 h-4 ml-0.5 bg-teal-800 animate-pulse" />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StreamingResponse;
