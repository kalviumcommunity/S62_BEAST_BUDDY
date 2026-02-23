import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";

const EditProfile = () => {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();

  // Initialize form state from user (hide raw backend structure)
  const [name, setName] = useState(user?.name || "");
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar || "");
  const [avatarFile, setAvatarFile] = useState(null);
  

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Local preview URL for uploaded file
  const [preview, setPreview] = useState(avatarUrl || null);

  useEffect(() => {
    if (avatarFile) {
      const url = URL.createObjectURL(avatarFile);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    }
    setPreview(avatarUrl || null);
  }, [avatarFile, avatarUrl]);

  // Handle user selecting a local file (upload is stubbed)
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      // Keep avatarUrl empty when user uploads a file
      setAvatarUrl("");
    }
  };

  // Support pasting a remote URL
  const handleAvatarUrlChange = (e) => {
    setAvatarUrl(e.target.value);
    setAvatarFile(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const updates = { name };
    // No preferences UI currently; do not modify preferences unless backend or UI requires it
    // Include avatar: prefer uploaded file (base64) otherwise use URL if provided
    if (avatarFile) {
      // convert file to base64
      const toBase64 = (file) => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (err) => reject(err);
      });
      try {
        const b64 = await toBase64(avatarFile);
        updates.avatar = b64;
      } catch (err) {
        console.error('Avatar file conversion failed', err);
      }
    } else if (avatarUrl) {
      updates.avatar = avatarUrl;
    }

    try {
      await updateProfile(updates);
      // Note: avatar upload is a UI convenience only for now. To persist avatar server-side, backend support is required.
      navigate('/user-dashboard');
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Could not save changes. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Revert local changes and go back
    navigate('/user-dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-indigo-950 to-pink-950 flex items-start justify-center py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl bg-white/5 backdrop-blur-lg rounded-3xl p-8 border border-white/10"
      >
        <h1 className="text-2xl font-semibold text-white mb-2">Your Profile</h1>
        <p className="text-gray-300 mb-6">A gentle place to update how you appear in BeastBuddy. Small changes only — we keep it simple.</p>

        {error && <div className="mb-4 text-red-400">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm text-gray-300 mb-2">Display name</label>
            <input
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white"
            />
            <p className="text-xs text-gray-400 mt-2">This is shown to other members and on your journey insights.</p>
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-2">Profile photo (optional)</label>
            <div className="mb-3 flex items-center gap-4">
              <div className="w-24 h-24 rounded-full bg-gray-800 border-2 border-white/10 overflow-hidden flex items-center justify-center">
                {preview ? (
                  <img src={preview} alt="preview" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-3xl">✨</span>
                )}
              </div>
              <div className="flex-1">
                <input type="file" accept="image/*" onChange={handleFileChange} className="mb-2 text-sm text-gray-300" />
                <div className="text-sm text-gray-400">Or paste an image URL below.</div>
              </div>
            </div>

            <input
              name="avatarUrl"
              placeholder="https://...jpg (optional)"
              value={avatarUrl}
              onChange={handleAvatarUrlChange}
              className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white"
            />
            <p className="text-xs text-gray-400 mt-2">Uploading will preview locally but is not yet saved to your account.</p>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 rounded-2xl bg-orange-500 text-white font-semibold hover:bg-orange-600 transition"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>

            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-3 rounded-2xl bg-white/10 text-white font-semibold hover:bg-white/20 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default EditProfile;
