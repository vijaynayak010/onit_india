import React, { useState } from "react";
import imageCompression from "browser-image-compression";
import { API_BASE } from "../../config";

function AddPost() {
  const [form, setForm] = useState({
    title: "",
    author: "",
    category: "",
    description: "",
    image: "",
    image2: "",
    image3: "",
    keywords: "",
  });

  const [uploading, setUploading] = useState({
    image: false,
    image2: false,
    image3: false,
  });

  const [saving, setSaving] = useState(false);

  /* -----------------------------------------------------------
      CLOUDINARY IMAGE UPLOAD (Compressed)
  ------------------------------------------------------------ */
  const uploadImage = async (file, field) => {
    try {
      setUploading((prev) => ({ ...prev, [field]: true }));

      // ⭐ Compress image to FAST upload
      const compressed = await imageCompression(file, {
        maxSizeMB: 1,
        maxWidthOrHeight: 1500,
        useWebWorker: true,
      });

      const fd = new FormData();
      fd.append("image", compressed);

      const res = await fetch(`${API_BASE}/api/upload-image`, {
        method: "POST",
        body: fd,
      });

      const data = await res.json();

      setUploading((prev) => ({ ...prev, [field]: false }));

      return data.url;
    } catch (err) {
      console.error("Upload Error:", err);
      setUploading((prev) => ({ ...prev, [field]: false }));
      return null;
    }
  };

  /* -----------------------------------------------------------
      SUBMIT BLOG
  ------------------------------------------------------------ */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    // ⭐ STRONG CHECK — prevent null image
    if (uploading.image) {
      alert("⏳ Please wait… Main image is still uploading");
      setSaving(false);
      return;
    }

    if (!form.image) {
      alert("❌ Main image missing. Upload again!");
      setSaving(false);
      return;
    }

    const payload = {
      ...form,
      keywords: form.keywords
        .split(",")
        .map((k) => k.trim().toLowerCase())
        .filter(Boolean),
    };

    const res = await fetch(`${API_BASE}/api/add-blog`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    setSaving(false);

    if (res.ok) {
      alert("🎉 Blog added successfully!");
      setForm({
        title: "",
        author: "",
        category: "",
        description: "",
        image: "",
        image2: "",
        image3: "",
        keywords: "",
      });
    } else {
      alert(data.error || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e6fff4] via-[#f8fcff] to-[#eaf8ff] flex justify-center p-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-3xl bg-white/40 backdrop-blur-2xl shadow-xl border border-white/40 rounded-3xl p-10 space-y-6"
      >
        <h1 className="text-4xl font-medium text-center text-gray-900 mb-6">
          ✍️ Add New Blog Post
        </h1>

        {/* TITLE */}
        <InputField
          label="Title *"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          placeholder="Enter blog title"
        />

        {/* AUTHOR */}
        <InputField
          label="Author *"
          value={form.author}
          onChange={(e) => setForm({ ...form, author: e.target.value })}
          placeholder="Author name"
        />

        {/* CATEGORY */}
        <InputField
          label="Category"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          placeholder="Tech, Business, AI..."
        />

        {/* MAIN IMAGE */}
        <ImageUploader
          label="Main Image *"
          required
          uploading={uploading.image}
          url={form.image}
          onUpload={async (file) => {
            const url = await uploadImage(file, "image");
            setForm({ ...form, image: url });
          }}
        />

        {/* SECOND IMAGE */}
        <ImageUploader
          label="Second Image"
          uploading={uploading.image2}
          url={form.image2}
          onUpload={async (file) => {
            const url = await uploadImage(file, "image2");
            setForm({ ...form, image2: url });
          }}
        />

        {/* THIRD IMAGE */}
        <ImageUploader
          label="Third Image"
          uploading={uploading.image3}
          url={form.image3}
          onUpload={async (file) => {
            const url = await uploadImage(file, "image3");
            setForm({ ...form, image3: url });
          }}
        />

        {/* DESCRIPTION */}
        <div>
          <label className="block text-gray-700 font-semibold mb-1">
            Description *
          </label>
          <textarea
            className="w-full p-4 rounded-xl border bg-white/60 h-32 focus:ring-2 focus:ring-blue-400"
            required
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
            placeholder="Write the blog content..."
          />
        </div>

        {/* KEYWORDS */}
        <InputField
          label="Keywords (comma-separated)"
          value={form.keywords}
          onChange={(e) => setForm({ ...form, keywords: e.target.value })}
          placeholder="ai, ui, design..."
        />

        {/* SUBMIT */}
        <button
          type="submit"
          disabled={saving}
          className={`w-full py-3 rounded-xl font-bold shadow-lg transition-all ${
            saving
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-green-400 to-blue-500 text-white"
          }`}
        >
          {saving ? "⏳ Publishing..." : "🚀 Publish Blog"}
        </button>
      </form>
    </div>
  );
}

export default AddPost;

/* -----------------------------------------------------------
   REUSABLE INPUT COMPONENT
------------------------------------------------------------ */
function InputField({ label, value, onChange, placeholder }) {
  return (
    <div>
      <label className="block text-gray-700 font-semibold mb-1">{label}</label>
      <input
        className="w-full p-3 rounded-xl border bg-white/60 focus:ring-2 focus:ring-blue-400"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    </div>
  );
}

/* -----------------------------------------------------------
   REUSABLE IMAGE UPLOADER COMPONENT
------------------------------------------------------------ */
function ImageUploader({ label, required, uploading, url, onUpload }) {
  return (
    <div>
      <label className="block text-gray-700 font-semibold mb-1">
        {label} {required && "*"}
      </label>

      <input
        type="file"
        accept="image/*"
        required={required}
        onChange={(e) => onUpload(e.target.files[0])}
      />

      {uploading && (
        <p className="text-blue-600 text-sm mt-1 animate-pulse">
          Uploading image...
        </p>
      )}

      {url && (
        <img
          src={url}
          className="w-40 rounded-xl mt-3 border shadow-md"
          alt="Uploaded blog post image preview"
        />
      )}
    </div>
  );
}
