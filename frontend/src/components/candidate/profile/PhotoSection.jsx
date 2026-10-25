import { useState, useRef } from 'react';
import { Camera, UploadCloud, Trash2, Link2 } from 'lucide-react';
import { toast } from '../../../context/ToastContext.jsx';

// Profile avatar upload with local canvas compression and link options
export default function PhotoSection({ profile, setProfile, breakdown, sectionRef }) {
  const [showUrlInput, setShowUrlInput] = useState(false);
  const photoInputRef = useRef(null);

  // Process manual image upload with client-side canvas compression
  const handlePhotoFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file (PNG, JPG, WebP)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxDim = 400;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxDim) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          }
        } else {
          if (height > maxDim) {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
        setProfile((prev) => ({ ...prev, photoUrl: compressedDataUrl }));
        toast.success('Photo selected! Click Save Changes to update.');
      };
      img.onerror = () => {
        setProfile((prev) => ({ ...prev, photoUrl: event.target.result }));
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  return (
    <div className="space-y-3" ref={sectionRef}>
      <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
        <span className="text-xs font-bold uppercase tracking-wider text-zinc-800 flex items-center gap-1.5">
          <Camera className="w-4 h-4 text-zinc-500" />
          <span>7. Profile Photo (5%)</span>
        </span>
        <span className="text-[11px] font-bold text-zinc-400">
          {breakdown?.photo ?? 0} / 5%
        </span>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-2xl bg-zinc-50 border border-zinc-200">
        <div className="relative shrink-0">
          {profile.photoUrl ? (
            <img
              src={profile.photoUrl}
              alt="Avatar preview"
              className="w-16 h-16 rounded-full object-cover border-2 border-zinc-300 bg-white shadow-xs"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-zinc-200 flex items-center justify-center text-zinc-400 border-2 border-dashed border-zinc-300">
              <Camera className="w-6 h-6" />
            </div>
          )}
        </div>

        <div className="flex-1 w-full space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <input
              type="file"
              ref={photoInputRef}
              accept="image/png,image/jpeg,image/webp,image/gif"
              className="hidden"
              onChange={handlePhotoFileSelect}
            />
            <button
              type="button"
              onClick={() => photoInputRef.current?.click()}
              className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition cursor-pointer inline-flex items-center gap-1.5 shadow-xs"
            >
              <UploadCloud className="w-3.5 h-3.5" />
              <span>{profile.photoUrl ? 'Replace photo' : 'Upload photo from device'}</span>
            </button>

            {profile.photoUrl && (
              <button
                type="button"
                onClick={() => setProfile({ ...profile, photoUrl: '' })}
                className="px-3 py-1.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-semibold transition cursor-pointer inline-flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setShowUrlInput(!showUrlInput)}
              className="px-2.5 py-1.5 text-xs text-indigo-600 hover:text-indigo-700 font-semibold cursor-pointer inline-flex items-center gap-1 transition"
            >
              <Link2 className="w-3.5 h-3.5" />
              <span>{showUrlInput ? 'Hide link input' : 'Or use image link'}</span>
            </button>
          </div>

          {showUrlInput && (
            <input
              type="url"
              placeholder="Paste image link URL (e.g. https://images.unsplash.com/...)"
              value={profile.photoUrl || ''}
              onChange={(e) => setProfile({ ...profile, photoUrl: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 bg-white placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600/20 transition"
            />
          )}

          <p className="text-[11px] text-slate-500">
            Upload directly from your device (PNG, JPG, WebP) or paste an image link.
          </p>
        </div>
      </div>
    </div>
  );
}
