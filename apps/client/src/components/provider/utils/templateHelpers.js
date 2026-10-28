/** Parse paginated GET /templates response. */
export function parseTemplatesListResponse(response) {
  if (Array.isArray(response?.data)) {
    return {
      data: response.data,
      pagination: response.pagination ?? null,
    };
  }
  if (Array.isArray(response)) {
    return { data: response, pagination: null };
  }
  return { data: [], pagination: null };
}

export const mapTemplateFromApi = (template) => ({
  id: template.id,
  providerUserId: template.providerUserId,
  title: template.title || "",
  description: template.description || "",
  category: template.category || "Design",
  duration: template.details?.duration || "",
  skills: Array.isArray(template.skills) ? template.skills : [],
  priceAmount: template.priceAmount ?? "",
  priceCurrency: template.priceCurrency || "INR",
  locationAddress: template.locationAddress || "",
  locationLat: template.locationLat ?? null,
  locationLng: template.locationLng ?? null,
  details: template.details ?? null,
  createdAt: template.createdAt,
  updatedAt: template.updatedAt,
});

/** Map API template to post-task / browse card shape. */
export const mapTemplateToTaskCard = (template) => {
  const mapped = mapTemplateFromApi(template);
  const amount = mapped.priceAmount;
  const budget =
    amount === "" || amount == null
      ? ""
      : `₹${Number(amount).toLocaleString("en-IN")}`;

  return {
    ...mapped,
    tag: mapped.category,
    budget,
    taskType: mapped.details?.taskType || "Fixed",
    usageCount: mapped.details?.usageCount,
  };
};

export const buildTemplatePayload = (form) => {
  const payload = {
    title: form.title.trim(),
  };

  const description = form.description?.trim();
  if (description) payload.description = description;

  if (form.category) payload.category = form.category;

  const skills = (form.skills || [])
    .map((s) => (typeof s === "string" ? s.trim() : s))
    .filter(Boolean);
  if (skills.length) payload.skills = skills;

  const details = { ...(form.details && typeof form.details === "object" ? form.details : {}) };
  if (form.duration) details.duration = form.duration;
  if (Object.keys(details).length) payload.details = details;

  const price =
    form.priceAmount === "" || form.priceAmount == null ? null : Number(form.priceAmount);
  if (price != null && !Number.isNaN(price) && price >= 0) {
    payload.priceAmount = price;
    payload.priceCurrency = form.priceCurrency || "INR";
  }

  const locationAddress = form.locationAddress?.trim();
  if (locationAddress) payload.locationAddress = locationAddress;

  const lat =
    form.locationLat === "" || form.locationLat == null ? null : Number(form.locationLat);
  const lng =
    form.locationLng === "" || form.locationLng == null ? null : Number(form.locationLng);
  if (lat != null && !Number.isNaN(lat)) payload.locationLat = lat;
  if (lng != null && !Number.isNaN(lng)) payload.locationLng = lng;

  return payload;
};
