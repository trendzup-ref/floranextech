import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  UploadCloud,
  FileText,
  Image as ImageIcon,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  X,
  Sparkles,
  BookOpen,
  DollarSign,
  Tag,
  Shield,
} from 'lucide-react';
import { publishEbook } from '@/api/adminApi';

export default function PublishEbook() {
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: 'eBook',
    fileType: 'pdf',
    isPublished: true,
  });

  // Files state
  const [coverImageFile, setCoverImageFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [digitalAssetFile, setDigitalAssetFile] = useState(null);

  // Drag-and-drop hover states
  const [isCoverDragging, setIsCoverDragging] = useState(false);
  const [isAssetDragging, setIsAssetDragging] = useState(false);

  // UI status
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Refs for hidden inputs
  const coverInputRef = useRef(null);
  const assetInputRef = useRef(null);

  // Handle Cover File selection
  const handleCoverSelect = (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Cover file must be a valid image (PNG, JPG, WEBP, etc.)');
      return;
    }
    setError('');
    setCoverImageFile(file);
    const reader = new FileReader();
    reader.onload = () => setCoverPreview(reader.result);
    reader.readAsDataURL(file);
  };

  // Handle Asset File selection
  const handleAssetSelect = (file) => {
    if (!file) return;
    const ext = file.name.split('.').pop()?.toLowerCase();
    const validExts = ['pdf', 'epub', 'zip'];
    if (!validExts.includes(ext)) {
      setError('Digital file must be a PDF, EPUB, or ZIP asset.');
      return;
    }
    setError('');
    setDigitalAssetFile(file);
    setFormData((prev) => ({ ...prev, fileType: ext }));
  };

  // Drag & drop handlers for Cover
  const onCoverDragOver = (e) => {
    e.preventDefault();
    setIsCoverDragging(true);
  };
  const onCoverDragLeave = () => {
    setIsCoverDragging(false);
  };
  const onCoverDrop = (e) => {
    e.preventDefault();
    setIsCoverDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleCoverSelect(e.dataTransfer.files[0]);
    }
  };

  // Drag & drop handlers for Asset
  const onAssetDragOver = (e) => {
    e.preventDefault();
    setIsAssetDragging(true);
  };
  const onAssetDragLeave = () => {
    setIsAssetDragging(false);
  };
  const onAssetDrop = (e) => {
    e.preventDefault();
    setIsAssetDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleAssetSelect(e.dataTransfer.files[0]);
    }
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!coverImageFile) {
      setError('Please provide a cover image file.');
      return;
    }

    if (!digitalAssetFile) {
      setError('Please provide the digital asset file (PDF, EPUB, or ZIP).');
      return;
    }

    try {
      setLoading(true);

      const data = new FormData();
      data.append('title', formData.title.trim());
      data.append('description', formData.description.trim());
      data.append('price', formData.price);
      data.append('category', formData.category);
      data.append('fileType', formData.fileType);
      data.append('isPublished', formData.isPublished);
      data.append('coverImage', coverImageFile);
      data.append('digitalFile', digitalAssetFile);

      const res = await publishEbook(data);

      if (res.success) {
        setSuccess('eBook published successfully into MongoDB GridFS!');
        setTimeout(() => {
          navigate('/admin/dashboard');
        }, 1500);
      } else {
        setError(res.message || 'Failed to publish eBook.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error occurred while uploading and publishing.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      {/* Top back navigation & title */}
      <div className="flex items-center justify-between gap-4 pb-6 border-b border-secondary/20 mb-8">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/dashboard"
            className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-secondary hover:bg-white/10 transition-colors"
            title="Back to Dashboard"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display text-2xl sm:text-3xl text-white tracking-wider">
                Publish New eBook
              </h1>
            </div>
          </div>
        </div>

        <Link
          to="/admin/dashboard"
          className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-gray-300 bg-white/5 border border-white/10 hover:border-secondary hover:text-white transition-colors"
        >
          <BookOpen className="w-3.5 h-3.5 text-secondary" />
          <span>View All eBooks</span>
        </Link>
      </div>

      {/* Notifications */}
      {error && (
        <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
          <button onClick={() => setError('')} className="p-1 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 rounded-2xl bg-secondary/10 border border-secondary/30 text-secondary text-sm flex items-center gap-2.5">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span>{success} Redirecting to dashboard...</span>
        </div>
      )}

      {/* Form Container */}
      <form onSubmit={handleSubmit} className="space-y-8 font-body">
        {/* SECTION 1: BASIC DETAILS */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#0c0c0c] border border-white/10 space-y-6 shadow-xl">
          <h2 className="font-display text-xl text-white tracking-wide flex items-center gap-2">
            eBook Details
          </h2>

          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-300 font-semibold mb-2">
                eBook Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Modern Web Architecture with Node.js & React"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-secondary transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-300 font-semibold mb-2">
                Price (€ EUR) *
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                required
                placeholder="19.99"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-secondary transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-300 font-semibold mb-2">
                Description *
              </label>
              <textarea
                rows={5}
                required
                placeholder="Comprehensive summary of what readers will learn, table of contents, and prerequisites..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-secondary transition-colors"
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: DRAG & DROP FILE UPLOADS */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#0c0c0c] border border-white/10 space-y-6 shadow-xl">
          <h2 className="font-display text-xl text-white tracking-wide flex items-center gap-2">
            File Uploads
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* DROP ZONE: COVER IMAGE */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-300 font-semibold mb-2 flex items-center justify-between">
                <span>Cover Image *</span>
                <span className="text-[10px] text-gray-500 normal-case">PNG, JPG, WEBP (Max 50MB)</span>
              </label>

              <input
                ref={coverInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => handleCoverSelect(e.target.files?.[0])}
                className="hidden"
              />

              <div
                onDragOver={onCoverDragOver}
                onDragLeave={onCoverDragLeave}
                onDrop={onCoverDrop}
                onClick={() => coverInputRef.current?.click()}
                className={`relative flex flex-col items-center justify-center p-6 sm:p-8 rounded-2xl border-2 border-dashed cursor-pointer transition-all ${isCoverDragging
                  ? 'border-secondary bg-secondary/10 scale-[1.01]'
                  : coverPreview
                    ? 'border-secondary/40 bg-white/[0.02]'
                    : 'border-white/15 hover:border-secondary/60 bg-white/[0.01]'
                  }`}
              >
                {coverPreview ? (
                  <div className="relative group flex flex-col items-center">
                    <img
                      src={coverPreview}
                      alt="Cover Preview"
                      className="w-32 h-44 object-cover rounded-xl shadow-lg border border-white/15 mb-3"
                    />
                    <p className="text-xs text-secondary font-medium truncate max-w-xs">
                      {coverImageFile?.name}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-0.5">
                      {(coverImageFile?.size / 1024).toFixed(1)} KB • Click or drop to replace
                    </p>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setCoverImageFile(null);
                        setCoverPreview(null);
                      }}
                      className="absolute -top-2 -right-2 p-1.5 rounded-full bg-red-600 text-white shadow-lg hover:bg-red-500 transition-colors"
                      title="Remove file"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="w-14 h-14 rounded-2xl bg-secondary/10 border border-secondary/30 text-secondary flex items-center justify-center mb-3">
                      <ImageIcon className="w-7 h-7" />
                    </div>
                    <p className="text-sm text-white font-medium text-center">
                      Drag & drop cover image here
                    </p>
                    <p className="text-xs text-gray-400 text-center mt-1">
                      or <span className="text-secondary font-semibold">browse files</span> from your computer
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* DROP ZONE: DIGITAL ASSET FILE */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-300 font-semibold mb-2 flex items-center justify-between">
                <span>Digital Asset File *</span>
                <span className="text-[10px] text-gray-500 normal-case">PDF, EPUB, ZIP (Max 50MB)</span>
              </label>

              <input
                ref={assetInputRef}
                type="file"
                accept=".pdf,.epub,.zip,application/pdf,application/epub+zip,application/zip"
                onChange={(e) => handleAssetSelect(e.target.files?.[0])}
                className="hidden"
              />

              <div
                onDragOver={onAssetDragOver}
                onDragLeave={onAssetDragLeave}
                onDrop={onAssetDrop}
                onClick={() => assetInputRef.current?.click()}
                className={`relative flex flex-col items-center justify-center p-6 sm:p-8 rounded-2xl border-2 border-dashed cursor-pointer transition-all min-h-[190px] ${isAssetDragging
                  ? 'border-secondary bg-secondary/10 scale-[1.01]'
                  : digitalAssetFile
                    ? 'border-secondary/40 bg-white/[0.02]'
                    : 'border-white/15 hover:border-secondary/60 bg-white/[0.01]'
                  }`}
              >
                {digitalAssetFile ? (
                  <div className="relative group flex flex-col items-center text-center">
                    <div className="w-14 h-14 rounded-2xl bg-secondary/20 border border-secondary/40 text-secondary flex items-center justify-center mb-3">
                      <FileText className="w-7 h-7" />
                    </div>
                    <p className="text-sm text-white font-semibold truncate max-w-xs">
                      {digitalAssetFile.name}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="uppercase text-[10px] font-bold px-2 py-0.5 rounded bg-secondary/20 text-secondary">
                        {formData.fileType}
                      </span>
                      <span className="text-[11px] text-gray-400">
                        {(digitalAssetFile.size / (1024 * 1024)).toFixed(2)} MB
                      </span>
                    </div>
                    <p className="text-[10px] text-gray-500 mt-2">Click or drop to replace file</p>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDigitalAssetFile(null);
                      }}
                      className="absolute -top-2 -right-2 p-1.5 rounded-full bg-red-600 text-white shadow-lg hover:bg-red-500 transition-colors"
                      title="Remove file"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="w-14 h-14 rounded-2xl bg-secondary/10 border border-secondary/30 text-secondary flex items-center justify-center mb-3">
                      <UploadCloud className="w-7 h-7" />
                    </div>
                    <p className="text-sm text-white font-medium text-center">
                      Drag & drop eBook asset here
                    </p>
                    <p className="text-xs text-gray-400 text-center mt-1">
                      PDF, EPUB, or ZIP • <span className="text-secondary font-semibold">browse files</span>
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>

        </div>

        {/* SUBMIT BUTTON BAR */}
        <div className="flex items-center justify-end gap-4 pt-2">
          <Link
            to="/admin/dashboard"
            className="px-6 py-3 rounded-xl text-sm font-semibold text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 px-8 py-3 rounded-xl font-body text-sm font-semibold bg-secondary text-primary hover:bg-[#00e6c5] transition-all disabled:opacity-50 shadow-[0_0_20px_rgba(1,255,219,0.3)] active:scale-95"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                <span>Uploading to GridFS...</span>
              </>
            ) : (
              <>
                <UploadCloud className="w-4 h-4" />
                <span>Publish eBook</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
