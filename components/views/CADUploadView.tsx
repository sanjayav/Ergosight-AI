'use client';

import { useState, useCallback } from 'react';
import { Upload, FileText, CheckCircle2, Clock, XCircle, Trash2, Download, Eye, Folder, Zap, Box, Layers, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CADFile {
    id: string;
    name: string;
    size: number;
    uploadedAt: Date;
    status: 'processing' | 'completed' | 'failed';
    progress: number;
    vehicle?: string;
    kpisExtracted?: number;
}

export default function CADUploadView() {
    const [files, setFiles] = useState<CADFile[]>([
        {
            id: '1',
            name: 'XUV700_Front_Driver.stp',
            size: 24580000,
            uploadedAt: new Date('2025-11-20T14:30:00'),
            status: 'completed',
            progress: 100,
            vehicle: 'XUV700',
            kpisExtracted: 24
        },
        {
            id: '2',
            name: 'Scorpio_N_Assembly.stp',
            size: 31200000,
            uploadedAt: new Date('2025-11-19T09:15:00'),
            status: 'completed',
            progress: 100,
            vehicle: 'Scorpio-N',
            kpisExtracted: 24
        },
        {
            id: '3',
            name: 'Thar_Complete_Model.stp',
            size: 18900000,
            uploadedAt: new Date('2025-11-18T16:45:00'),
            status: 'processing',
            progress: 67,
            vehicle: 'Thar'
        }
    ]);

    const [isDragging, setIsDragging] = useState(false);

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    };

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        const droppedFiles = Array.from(e.dataTransfer.files);
        const stpFiles = droppedFiles.filter(file => file.name.endsWith('.stp') || file.name.endsWith('.step'));

        stpFiles.forEach(file => {
            const newFile: CADFile = {
                id: Date.now().toString() + Math.random(),
                name: file.name,
                size: file.size,
                uploadedAt: new Date(),
                status: 'processing',
                progress: 0
            };

            setFiles(prev => [newFile, ...prev]);

            let progress = 0;
            const interval = setInterval(() => {
                progress += Math.random() * 15;
                if (progress >= 100) {
                    progress = 100;
                    clearInterval(interval);
                    setFiles(prev => prev.map(f =>
                        f.id === newFile.id
                            ? { ...f, status: 'completed', progress: 100, kpisExtracted: 24 }
                            : f
                    ));
                } else {
                    setFiles(prev => prev.map(f =>
                        f.id === newFile.id ? { ...f, progress } : f
                    ));
                }
            }, 500);
        });
    }, []);

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const selectedFiles = Array.from(e.target.files);
            selectedFiles.forEach(file => {
                const newFile: CADFile = {
                    id: Date.now().toString() + Math.random(),
                    name: file.name,
                    size: file.size,
                    uploadedAt: new Date(),
                    status: 'processing',
                    progress: 0
                };

                setFiles(prev => [newFile, ...prev]);

                let progress = 0;
                const interval = setInterval(() => {
                    progress += Math.random() * 15;
                    if (progress >= 100) {
                        progress = 100;
                        clearInterval(interval);
                        setFiles(prev => prev.map(f =>
                            f.id === newFile.id
                                ? { ...f, status: 'completed', progress: 100, kpisExtracted: 24 }
                                : f
                        ));
                    } else {
                        setFiles(prev => prev.map(f =>
                            f.id === newFile.id ? { ...f, progress } : f
                        ));
                    }
                }, 500);
            });
        }
    };

    const deleteFile = (id: string) => {
        setFiles(prev => prev.filter(f => f.id !== id));
    };

    const completedFiles = files.filter(f => f.status === 'completed').length;
    const processingFiles = files.filter(f => f.status === 'processing').length;
    const totalSize = files.reduce((sum, f) => sum + f.size, 0);

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-sm">
                            <Folder className="w-7 h-7 text-white" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">3D CAD Upload Center</h2>
                            <p className="text-sm text-gray-500 mt-1">
                                Upload .stp/.step files for automatic 3D processing and KPI extraction
                            </p>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-4 gap-4 mt-6">
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div className="text-xs text-gray-600 mb-1 font-medium uppercase">Total Files</div>
                        <div className="text-2xl font-bold text-gray-900">{files.length}</div>
                        <div className="text-xs text-gray-500 mt-1">CAD assemblies</div>
                    </div>

                    <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
                        <div className="text-xs text-emerald-700 mb-1 font-medium uppercase">Completed</div>
                        <div className="text-2xl font-bold text-emerald-700">{completedFiles}</div>
                        <div className="text-xs text-emerald-600 mt-1 flex items-center">
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Ready for analysis
                        </div>
                    </div>

                    <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                        <div className="text-xs text-amber-700 mb-1 font-medium uppercase">Processing</div>
                        <div className="text-2xl font-bold text-amber-700">{processingFiles}</div>
                        <div className="text-xs text-amber-600 mt-1 flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            In progress
                        </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div className="text-xs text-gray-600 mb-1 font-medium uppercase">Total Size</div>
                        <div className="text-2xl font-bold text-gray-900">{formatFileSize(totalSize)}</div>
                        <div className="text-xs text-gray-500 mt-1">Storage used</div>
                    </div>
                </div>
            </div>

            {/* Upload Zone */}
            <div>
                <input
                    type="file"
                    id="file-upload"
                    className="hidden"
                    accept=".stp,.step"
                    multiple
                    onChange={handleFileInput}
                />

                <label
                    htmlFor="file-upload"
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`bg-white border-2 border-dashed rounded-xl p-12 cursor-pointer transition-all block ${isDragging
                        ? 'border-cyan-500 bg-cyan-50 scale-[1.01]'
                        : 'border-gray-300 hover:border-cyan-400 hover:bg-gray-50'
                        }`}
                >
                    <div className="flex flex-col items-center justify-center space-y-4">
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center ${isDragging
                            ? 'bg-cyan-500 shadow-lg'
                            : 'bg-gray-100 border-2 border-gray-300'
                            }`}>
                            <Upload className={`w-8 h-8 ${isDragging ? 'text-white' : 'text-gray-600'}`} />
                        </div>

                        <div className="text-center">
                            <h3 className="text-lg font-bold text-gray-900 mb-2">
                                {isDragging ? 'Drop files here' : 'Drag & drop CAD files'}
                            </h3>
                            <p className="text-sm text-gray-600">
                                or <span className="text-cyan-600 font-semibold underline">browse</span> to upload
                            </p>
                            <p className="text-xs text-gray-500 mt-2">
                                Supports .stp and .step files (max 500MB per file)
                            </p>
                        </div>

                        <div className="flex items-center space-x-6 text-xs text-gray-600">
                            <div className="flex items-center space-x-1">
                                <Box className="w-4 h-4 text-cyan-600" />
                                <span>Full 3D Import</span>
                            </div>
                            <div className="flex items-center space-x-1">
                                <Layers className="w-4 h-4 text-blue-600" />
                                <span>Edge Detection</span>
                            </div>
                            <div className="flex items-center space-x-1">
                                <Zap className="w-4 h-4 text-indigo-600" />
                                <span>Auto KPI Extract</span>
                            </div>
                        </div>
                    </div>
                </label>
            </div>

            {/* Files List */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-gray-900">Uploaded Files</h3>
                    <div className="text-sm text-gray-500">
                        {files.length} {files.length === 1 ? 'file' : 'files'}
                    </div>
                </div>

                <div className="space-y-3">
                    <AnimatePresence mode="popLayout">
                        {files.map((file) => (
                            <motion.div
                                key={file.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="bg-gray-50 hover:bg-gray-100 rounded-lg p-4 border border-gray-200 transition-all group"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4 flex-1">
                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${file.status === 'completed' ? 'bg-emerald-100 border border-emerald-300' :
                                            file.status === 'processing' ? 'bg-amber-100 border border-amber-300' :
                                                'bg-red-100 border border-red-300'
                                            }`}>
                                            {file.status === 'completed' && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
                                            {file.status === 'processing' && <Clock className="w-5 h-5 text-amber-600 animate-pulse" />}
                                            {file.status === 'failed' && <XCircle className="w-5 h-5 text-red-600" />}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center space-x-2">
                                                <h4 className="text-sm font-bold text-gray-900 truncate">{file.name}</h4>
                                                {file.vehicle && (
                                                    <span className="px-2 py-0.5 bg-blue-100 border border-blue-300 text-blue-700 text-xs font-semibold rounded">
                                                        {file.vehicle}
                                                    </span>
                                                )}
                                            </div>

                                            <div className="flex items-center space-x-3 mt-1 text-xs text-gray-600">
                                                <span>{formatFileSize(file.size)}</span>
                                                <span>•</span>
                                                <span>{file.uploadedAt.toLocaleDateString()}</span>
                                                {file.kpisExtracted && (
                                                    <>
                                                        <span>•</span>
                                                        <span className="text-emerald-600 font-medium">{file.kpisExtracted} KPIs extracted</span>
                                                    </>
                                                )}
                                            </div>

                                            {file.status === 'processing' && (
                                                <div className="mt-2">
                                                    <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                                                        <span>Processing... {Math.round(file.progress)}%</span>
                                                        <span className="text-gray-500">OpenCascade 7.6</span>
                                                    </div>
                                                    <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                                        <motion.div
                                                            className="h-full bg-gradient-to-r from-cyan-500 to-blue-600"
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${file.progress}%` }}
                                                            transition={{ duration: 0.3 }}
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-2 ml-4">
                                        {file.status === 'completed' && (
                                            <>
                                                <button className="p-2 rounded-lg bg-white hover:bg-indigo-50 text-gray-600 hover:text-indigo-600 border border-gray-200 transition-all opacity-0 group-hover:opacity-100">
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                <button className="p-2 rounded-lg bg-white hover:bg-blue-50 text-gray-600 hover:text-blue-600 border border-gray-200 transition-all opacity-0 group-hover:opacity-100">
                                                    <Download className="w-4 h-4" />
                                                </button>
                                            </>
                                        )}
                                        <button
                                            onClick={() => deleteFile(file.id)}
                                            className="p-2 rounded-lg bg-white hover:bg-red-50 text-gray-600 hover:text-red-600 border border-gray-200 transition-all opacity-0 group-hover:opacity-100"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {files.length === 0 && (
                        <div className="text-center py-12">
                            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                            <p className="text-gray-600">No files uploaded yet</p>
                            <p className="text-gray-500 text-sm mt-1">Upload your first CAD file to get started</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
