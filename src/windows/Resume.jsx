import { WindowControlls } from '#components/index.js';
import WindowWrapper from '#hoc/WindowWrapper';
import { Download, ZoomIn, ZoomOut, RotateCcw, ExternalLink, Loader2, FileText } from 'lucide-react';
import React, { useState, useEffect, useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url,
).toString();

const Resume = () => {
    const [numPages, setNumPages] = useState(null);
    const [scale, setScale] = useState(1.0);
    const [containerWidth, setContainerWidth] = useState(580);
    const [isLoading, setIsLoading] = useState(true);
    const containerRef = useRef(null);

    const updateWidth = () => {
        if (containerRef.current) {
            const width = containerRef.current.clientWidth - 48; // padding
            setContainerWidth(Math.max(280, Math.min(width, 680)));
        } else if (typeof window !== 'undefined') {
            setContainerWidth(Math.min(window.innerWidth - 40, 640));
        }
    };

    useEffect(() => {
        updateWidth();
        window.addEventListener('resize', updateWidth);
        return () => window.removeEventListener('resize', updateWidth);
    }, []);

    const onDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
        setIsLoading(false);
        updateWidth();
    };

    const handleZoomIn = (e) => {
        e.stopPropagation();
        setScale((prev) => Math.min(prev + 0.15, 2.2));
    };

    const handleZoomOut = (e) => {
        e.stopPropagation();
        setScale((prev) => Math.max(prev - 0.15, 0.6));
    };

    const handleResetZoom = (e) => {
        e.stopPropagation();
        setScale(1.0);
    };

    const pdfUrl = "files/resume1.pdf";

    return (
        <div className="flex flex-col h-full w-full bg-[#1e1e1e] text-gray-200 select-none overflow-hidden">
            {/* 🍎 macOS Preview Window Header Toolbar */}
            <div id="window-header" className="flex items-center justify-between px-3 sm:px-4 py-2 bg-gray-50/95 backdrop-blur-md border-b border-gray-200/90 text-gray-700 select-none flex-none gap-2">
                <div className="flex items-center gap-3">
                    <WindowControlls target="resume" />
                </div>

                {/* Title & Page Info Badge */}
                <div className="flex items-center gap-2 max-w-[200px] sm:max-w-xs truncate">
                    <FileText className="w-3.5 h-3.5 text-blue-600 flex-none max-sm:hidden" />
                    <h2 className="text-xs sm:text-sm font-semibold text-gray-800 truncate">Resume.pdf</h2>
                    {numPages && (
                        <span className="text-[10px] sm:text-[11px] font-medium text-gray-500 bg-gray-200/80 px-2 py-0.5 rounded-full">
                            {numPages} {numPages === 1 ? 'Page' : 'Pages'}
                        </span>
                    )}
                </div>

                {/* Right Action Tools: Zoom & Actions */}
                <div className="flex items-center gap-1 sm:gap-1.5">
                    {/* Zoom Out */}
                    <button
                        type="button"
                        onClick={handleZoomOut}
                        title="Zoom Out"
                        disabled={scale <= 0.6}
                        className="p-1 sm:p-1.5 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-200/80 disabled:opacity-40 transition-colors cursor-pointer"
                    >
                        <ZoomOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </button>

                    {/* Zoom Percentage / Reset */}
                    <button
                        type="button"
                        onClick={handleResetZoom}
                        title="Click to reset zoom (100%)"
                        className="px-1.5 py-0.5 text-[10px] sm:text-xs font-mono font-medium text-gray-600 hover:text-blue-600 hover:bg-gray-200/80 rounded transition-colors cursor-pointer"
                    >
                        {Math.round(scale * 100)}%
                    </button>

                    {/* Zoom In */}
                    <button
                        type="button"
                        onClick={handleZoomIn}
                        title="Zoom In"
                        disabled={scale >= 2.2}
                        className="p-1 sm:p-1.5 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-200/80 disabled:opacity-40 transition-colors cursor-pointer"
                    >
                        <ZoomIn className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </button>

                    {/* Reset Button (Mobile icon) */}
                    {scale !== 1.0 && (
                        <button
                            type="button"
                            onClick={handleResetZoom}
                            title="Reset Zoom"
                            className="p-1 sm:p-1.5 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-200/80 transition-colors cursor-pointer max-sm:hidden"
                        >
                            <RotateCcw className="w-3.5 h-3.5" />
                        </button>
                    )}

                    <div className="w-px h-4 bg-gray-300 mx-0.5 sm:mx-1" />

                    {/* Open in external new tab */}
                    <a
                        href={pdfUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1 sm:p-1.5 rounded-md text-gray-600 hover:text-blue-600 hover:bg-gray-200/80 transition-colors cursor-pointer"
                        title="Open PDF in new tab"
                    >
                        <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </a>

                    {/* Download button */}
                    <a
                        href={pdfUrl}
                        download="Mohd_Asif_Resume.pdf"
                        className="p-1 sm:p-1.5 rounded-md text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                        title="Download resume"
                    >
                        <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600" />
                    </a>
                </div>
            </div>

            {/* 📜 PDF Document Viewport - Scrollable Canvas */}
            <div
                ref={containerRef}
                className="flex-1 overflow-y-auto overflow-x-auto select-text p-3 sm:p-6 bg-[#2d3033] flex flex-col items-center gap-5 sm:gap-6"
                style={{ scrollBehavior: 'smooth' }}
            >
                <Document
                    file={pdfUrl}
                    onLoadSuccess={onDocumentLoadSuccess}
                    loading={
                        <div className="flex flex-col items-center justify-center py-24 gap-3 text-gray-400">
                            <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
                            <p className="text-xs font-medium tracking-wide">Loading Resume...</p>
                        </div>
                    }
                    error={
                        <div className="flex flex-col items-center justify-center py-16 gap-3 text-center px-4">
                            <p className="text-sm text-red-400 font-medium">Failed to load Resume PDF directly.</p>
                            <a
                                href={pdfUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg shadow transition-colors"
                            >
                                Open PDF in Browser
                            </a>
                        </div>
                    }
                    className="flex flex-col items-center gap-5 sm:gap-6 max-w-full"
                >
                    {Array.from(new Array(numPages || (isLoading ? 0 : 1)), (_, index) => (
                        <div
                            key={`page_${index + 1}`}
                            className="relative shadow-2xl rounded-sm overflow-hidden ring-1 ring-black/30 bg-white transition-transform duration-150"
                        >
                            <Page
                                pageNumber={index + 1}
                                scale={scale}
                                width={containerWidth}
                                renderTextLayer={true}
                                renderAnnotationLayer={true}
                                className="shadow-sm"
                            />
                            {numPages > 1 && (
                                <div className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/60 backdrop-blur-md text-white/90 text-[10px] font-mono rounded shadow pointer-events-none">
                                    {index + 1} / {numPages}
                                </div>
                            )}
                        </div>
                    ))}
                </Document>

                {/* Bottom padding helper so last page scrolls cleanly above any bottom bar */}
                <div className="h-6 flex-none" />
            </div>
        </div>
    );
};

const ResumeWindow = WindowWrapper(Resume, "resume");

export default ResumeWindow;
