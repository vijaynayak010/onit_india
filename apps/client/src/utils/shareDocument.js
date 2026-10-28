export const formatFileSize = (bytes) => {
  if (!bytes) return "—";
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  return `${(kb / 1024).toFixed(1)} MB`;
};

export const formatUploadedDate = (dateValue) => {
  if (!dateValue) return "Recently";
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "Recently";
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
};

const buildSharePayload = (fileUrl, fileName) => {
  const title = fileName || "Document";
  const text = `Check out this file: ${title}`;
  return { title, text, url: fileUrl };
};

export const copyDocumentLink = async (fileUrl) => {
  await navigator.clipboard.writeText(fileUrl);
};

export const shareDocumentNative = async (fileUrl, fileName) => {
  const { title, text, url } = buildSharePayload(fileUrl, fileName);
  if (navigator.share) {
    await navigator.share({ title, text, url });
    return true;
  }
  return false;
};

export const getDocumentShareTargets = (fileUrl, fileName) => {
  const { title, text, url } = buildSharePayload(fileUrl, fileName);
  const encodedUrl = encodeURIComponent(url);
  const encodedText = encodeURIComponent(`${text}\n${url}`);
  const encodedSubject = encodeURIComponent(title);

  return [
    {
      id: "gmail",
      label: "Gmail",
      href: `https://mail.google.com/mail/?view=cm&fs=1&su=${encodedSubject}&body=${encodedText}`,
    },
    {
      id: "linkedin",
      label: "LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    },
    {
      id: "whatsapp",
      label: "WhatsApp",
      href: `https://wa.me/?text=${encodedText}`,
    },
    {
      id: "twitter",
      label: "X (Twitter)",
      href: `https://twitter.com/intent/tweet?text=${encodedText}`,
    },
    {
      id: "facebook",
      label: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    },
    {
      id: "email",
      label: "Email app",
      href: `mailto:?subject=${encodedSubject}&body=${encodedText}`,
    },
  ];
};

export const openShareTarget = (target, fileUrl, fileName) => {
  const match = getDocumentShareTargets(fileUrl, fileName).find((t) => t.id === target);
  if (match?.href) {
    window.open(match.href, "_blank", "noopener,noreferrer");
  }
};
