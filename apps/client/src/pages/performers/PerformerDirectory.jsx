import React, { useMemo, useState } from "react";
import { MapPin, Star, Filter, ArrowRight, ArrowLeft, Navigation, X, Search } from "react-feather";
import { useLocation, useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, CircleMarker, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import SEO from "../../components/seo/SEO";
import Footer from "../../components/layout/Footer";
import AnimatedSection from "../../components/ui/AnimatedSection";
import Navbar from "../../components/layout/Navbar";
import ScrollingInfo from "../../components/ui/ScrollingInfo";
import SplashCursor from "../../components/ui/SplashCursor";
import { sampleTaskers } from "./FindTaskerNearby";

const cities = ["All metros", "Bengaluru", "Mumbai", "Delhi NCR", "Hyderabad", "Chennai"];
const domains = [
  "All domains",
  "Business Operations & Research",
  "Content, Design & Marketing",
  "Tech, Data and Admin",
  "Academic & Knowledge Support",
  "On-Ground & Local Assistance",
];

const cityCenters = {
  bengaluru: { label: "Bengaluru", lat: 12.9716, lng: 77.5946 },
  mumbai: { label: "Mumbai", lat: 19.076, lng: 72.8777 },
  delhi: { label: "Delhi NCR", lat: 28.6139, lng: 77.209 },
  hyderabad: { label: "Hyderabad", lat: 17.385, lng: 78.4867 },
  chennai: { label: "Chennai", lat: 13.0827, lng: 80.2707 },
};

const cityOrder = ["bengaluru", "mumbai", "delhi", "hyderabad", "chennai"];

const markerGeoOffsets = [
  { lat: 0.021, lng: 0.014 },
  { lat: 0.012, lng: -0.019 },
  { lat: -0.017, lng: 0.016 },
  { lat: -0.023, lng: -0.011 },
  { lat: 0.006, lng: 0.028 },
  { lat: -0.009, lng: -0.026 },
];

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const createPerformerDivIcon = (index, isSelected = false) =>
  L.divIcon({
    className: "custom-performer-pin",
    html: `
      <div style="
        width:${isSelected ? 28 : 24}px;
        height:${isSelected ? 28 : 24}px;
        border-radius:9999px;
        background:${isSelected ? "#047857" : "#0ea5e9"};
        color:#ffffff;
        display:flex;
        align-items:center;
        justify-content:center;
        font-size:11px;
        font-weight:700;
        border:2px solid #ffffff;
        box-shadow:0 6px 14px rgba(15,23,42,0.26);
      ">${index + 1}</div>
      <div style="
        width:0;
        height:0;
        margin: -1px auto 0;
        border-left:6px solid transparent;
        border-right:6px solid transparent;
        border-top:${isSelected ? "10px solid #047857" : "10px solid #0ea5e9"};
        filter:drop-shadow(0 2px 2px rgba(15,23,42,0.2));
      "></div>
    `,
    iconSize: isSelected ? [28, 38] : [24, 34],
    iconAnchor: isSelected ? [14, 38] : [12, 34],
    popupAnchor: [0, -32],
  });

function useQuery() {
  const { search } = useLocation();
  return React.useMemo(() => new URLSearchParams(search), [search]);
}

function haversineKm(lat1, lon1, lat2, lon2) {
  const toRad = (v) => (v * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return 6371 * c;
}

function MapSelectionSync({ selectedCoords }) {
  const map = useMap();

  React.useEffect(() => {
    if (!selectedCoords) return;
    map.flyTo([selectedCoords.lat, selectedCoords.lng], Math.max(map.getZoom(), 13), {
      duration: 0.7,
    });
  }, [selectedCoords, map]);

  return null;
}

const PerformerDirectory = () => {
  const navigate = useNavigate();
  const query = useQuery();
  const initialDomain = query.get("domain") || "All domains";
  const [cityFilter, setCityFilter] = useState("All metros");
  const [domainFilter, setDomainFilter] = useState(initialDomain);
  const [searchText, setSearchText] = useState("");
  const [showMapView, setShowMapView] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [mapStatus, setMapStatus] = useState("");
  const [userCoords, setUserCoords] = useState(null);
  const [detectedCityKey, setDetectedCityKey] = useState(null);
  const [selectedMapPerformerKey, setSelectedMapPerformerKey] = useState(null);

  const canUseGeolocation = typeof navigator !== "undefined" && "geolocation" in navigator;

  const filteredTaskers = useMemo(() => {
    const q = searchText.trim().toLowerCase();

    return sampleTaskers.filter((t) => {
      const cityMatch =
        cityFilter === "All metros" || (t.city && t.city.toLowerCase().includes(cityFilter.toLowerCase().split(" ")[0]));

      const domainMatch = domainFilter === "All domains" || t.domain === domainFilter;

      const searchMatch =
        !q ||
        t.name.toLowerCase().includes(q) ||
        t.location.toLowerCase().includes(q) ||
        t.domain.toLowerCase().includes(q);

      return cityMatch && domainMatch && searchMatch;
    });
  }, [cityFilter, domainFilter, searchText]);

  const mapCityKey = useMemo(() => {
    const cityToKey = {
      Bengaluru: "bengaluru",
      Mumbai: "mumbai",
      "Delhi NCR": "delhi",
      Hyderabad: "hyderabad",
      Chennai: "chennai",
    };

    // Manual city filter should take precedence over detected location.
    if (cityFilter !== "All metros") {
      return cityToKey[cityFilter] || "bengaluru";
    }

    if (detectedCityKey) return detectedCityKey;
    return "bengaluru";
  }, [detectedCityKey, cityFilter]);

  const mapCenter = cityCenters[mapCityKey] || cityCenters.bengaluru;

  const mapTaskers = useMemo(() => {
    const byCity = sampleTaskers.filter((t) => t.city === mapCityKey);
    const base = byCity.length ? byCity : filteredTaskers;
    const withCoords = base.slice(0, 6).map((t, idx) => ({
      ...t,
      id: `${t.name}-${t.location}`,
      coords: {
        lat: mapCenter.lat + markerGeoOffsets[idx % markerGeoOffsets.length].lat,
        lng: mapCenter.lng + markerGeoOffsets[idx % markerGeoOffsets.length].lng,
      },
    }));

    if (!userCoords) return withCoords;

    return withCoords
      .map((t) => ({
        ...t,
        distanceFromUserKm: haversineKm(userCoords.lat, userCoords.lng, t.coords.lat, t.coords.lng),
      }))
      .sort((a, b) => a.distanceFromUserKm - b.distanceFromUserKm);
  }, [mapCityKey, filteredTaskers, mapCenter.lat, mapCenter.lng, userCoords]);

  const handleViewMap = () => {
    setShowMapView(true);
    setSelectedMapPerformerKey(null);
    if (!canUseGeolocation) {
      setMapStatus("Location permission is unavailable in this browser. Showing city-based nearby performers.");
      return;
    }

    setIsLocating(true);
    setMapStatus("Detecting your location...");

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserCoords(coords);

        let nearestKey = "bengaluru";
        let nearestDistance = Number.POSITIVE_INFINITY;
        cityOrder.forEach((key) => {
          const center = cityCenters[key];
          const distance = haversineKm(coords.lat, coords.lng, center.lat, center.lng);
          if (distance < nearestDistance) {
            nearestDistance = distance;
            nearestKey = key;
          }
        });

        setDetectedCityKey(nearestKey);
        setMapStatus(`Showing nearby performers around ${cityCenters[nearestKey].label}.`);
        setIsLocating(false);
      },
      () => {
        setMapStatus("Could not detect your exact location. Showing nearby performers by selected city.");
        setIsLocating(false);
      },
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 60_000 }
    );
  };

  const pageTitle = "Explore Performers by Domain & Region";
  const pageDescription =
    "Browse OnIT INDIA performers by domain and metro city. Discover taskers for research, content, data, academic work, and on-ground assistance across major Indian cities.";

  const handleSearchClick = () => {
    // Filters are live; this button gives a clear explicit search action.
    setSearchText((prev) => prev.trim());
  };

  return (
    <div className="min-h-screen w-full bg-[#f3f4f6] pb-16 font-sans antialiased">
      <ScrollingInfo />
      <Navbar />
      <SplashCursor />
      {/*
        Matches App layout: fixed ScrollingInfo (~40px) + Navbar (64px/80px) — keep content below chrome.
      */}
      <div className="pt-28 md:pt-32">
        <SEO
          title={pageTitle}
          description={pageDescription}
          keywords="OnIT INDIA performers, explore performers, taskers directory, find taskers by city, business operations, content, design, marketing, data, admin, academic support, on-ground assistance, hire tasker India, find performer by location"
          canonical="https://www.onitindia.com/performers-directory"
          webPageSchema={{
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: pageTitle,
            description: pageDescription,
            url: "https://www.onitindia.com/performers-directory",
          }}
        />

        <main className="max-w-6xl mx-auto px-4 sm:px-6 md:px-12 lg:px-20">
        <header className="mb-8 sm:mb-10 rounded-3xl bg-white shadow-sm border border-slate-200/80 p-5 sm:p-6 md:p-7">
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-emerald-300 hover:text-emerald-700 hover:shadow-md"
              >
                <ArrowLeft size={16} aria-hidden />
                Back
              </button>

              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800 border border-emerald-100">
                  <Filter size={14} aria-hidden />
                  Performer Directory
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900">
                Explore performers by domain & region
              </h1>
              <p className="text-sm sm:text-base text-slate-600 max-w-2xl">
                Filter the OnIT INDIA performer network by metro city and domain to understand what kind of execution capacity
                is available in your region.
              </p>

              <p className="text-xs sm:text-sm text-slate-500">
                Current selection:{" "}
                <span className="font-semibold text-slate-800">{cityFilter}</span> •{" "}
                <span className="font-semibold text-slate-800">{domainFilter}</span>
              </p>
            </div>
          </div>
        </header>

        <section className="mb-8 rounded-2xl bg-white shadow-sm border border-slate-200/80 p-4 sm:p-5 md:p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 flex-1">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  City / metro
                </label>
                <div className="relative">
                  <select
                    value={cityFilter}
                    onChange={(e) => setCityFilter(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 shadow-sm focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/10"
                  >
                    {cities.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Domain
                </label>
                <select
                  value={domainFilter}
                  onChange={(e) => setDomainFilter(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 shadow-sm focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/10"
                >
                  {domains.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Search by name or area
                </label>
                <input
                  type="text"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  placeholder="e.g. market research, Andheri, Hitech City"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 shadow-sm placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/10"
                />
              </div>
            </div>

            <div className="mt-1">
              <p className="text-xs sm:text-sm text-slate-500">
                Showing <span className="font-semibold text-slate-800">{filteredTaskers.length}</span> performers
                {cityFilter !== "All metros" ? ` in ${cityFilter}` : ""}{" "}
                {domainFilter !== "All domains" ? `for ${domainFilter}` : ""}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleSearchClick}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:border-emerald-300 hover:text-emerald-700 hover:shadow-md"
                >
                  <Search size={14} aria-hidden />
                  Search
                </button>
                <button
                  type="button"
                  onClick={handleViewMap}
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-700 hover:shadow-md"
                >
                  <MapPin size={14} aria-hidden />
                  {isLocating ? "Detecting location..." : "View performers on map"}
                </button>
              </div>
            </div>
          </div>
        </section>

        {showMapView && (
          <section className="mb-8 rounded-2xl border border-slate-200/80 bg-white shadow-sm p-4 sm:p-5 md:p-6">
            <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900">Nearby Performers Map View</h2>
                <p className="mt-1 text-xs sm:text-sm text-slate-600">
                  Your location and nearby performers in {mapCenter.label}.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowMapView(false)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:border-slate-300 transition"
              >
                <X size={14} aria-hidden />
                Close
              </button>
            </div>

            <div className="mb-4 flex flex-wrap items-center gap-3 text-xs">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 font-semibold text-emerald-700">
                <Navigation size={12} aria-hidden />
                You
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-50 px-2.5 py-1 font-semibold text-sky-700">
                <MapPin size={12} aria-hidden />
                Performer
              </span>
              {mapStatus && <span className="text-slate-600">{mapStatus}</span>}
            </div>

            <div className="grid gap-4 lg:grid-cols-[1.1fr_1fr]">
              <div className="h-72 sm:h-80 rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                <MapContainer
                  center={[mapCenter.lat, mapCenter.lng]}
                  zoom={12}
                  scrollWheelZoom
                  className="h-full w-full"
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <MapSelectionSync
                    selectedCoords={mapTaskers.find((t) => t.id === selectedMapPerformerKey)?.coords || null}
                  />

                  {userCoords && (
                    <>
                      <CircleMarker
                        center={[userCoords.lat, userCoords.lng]}
                        pathOptions={{ color: "#059669", fillColor: "#059669", fillOpacity: 0.35 }}
                        radius={16}
                      />
                      <CircleMarker
                        center={[userCoords.lat, userCoords.lng]}
                        pathOptions={{ color: "#047857", fillColor: "#10b981", fillOpacity: 0.85 }}
                        radius={7}
                      >
                        <Popup>You are here</Popup>
                      </CircleMarker>
                    </>
                  )}

                  {mapTaskers.map((t, idx) => (
                    <Marker
                      key={`${t.name}-${idx}`}
                      position={[t.coords.lat, t.coords.lng]}
                      icon={createPerformerDivIcon(idx, selectedMapPerformerKey === t.id)}
                      zIndexOffset={selectedMapPerformerKey === t.id ? 1000 : 0}
                      eventHandlers={{
                        click: () => setSelectedMapPerformerKey(t.id),
                      }}
                    >
                      <Popup>
                        <div className="min-w-[220px] rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-700">
                              OnIT INDIA
                            </span>
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-600">
                              <Star size={11} />
                              {t.rating}
                            </span>
                          </div>

                          <p className="text-sm font-bold text-slate-900 leading-tight">{t.name}</p>
                          <p className="text-[11px] text-slate-600 mt-0.5">{t.domain}</p>

                          <div className="mt-2 rounded-lg bg-slate-50 px-2.5 py-2">
                            <p className="text-[11px] text-slate-600">{t.location}</p>
                            {typeof t.distanceFromUserKm === "number" && (
                              <p className="text-[11px] font-semibold text-emerald-700 mt-1">
                                {t.distanceFromUserKm.toFixed(1)} km from your location
                              </p>
                            )}
                          </div>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3 sm:p-4">
                <h3 className="text-sm font-semibold text-slate-900 mb-3">Nearby performer details</h3>
                <ul className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                  {mapTaskers.map((t) => (
                    <li
                      key={`${t.name}-${t.location}`}
                      className={`rounded-xl border px-3 py-2.5 cursor-pointer transition ${
                        selectedMapPerformerKey === t.id
                          ? "border-emerald-300 bg-emerald-50/70 shadow-sm"
                          : "border-slate-200 bg-white hover:border-emerald-200"
                      }`}
                      onClick={() => setSelectedMapPerformerKey(t.id)}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-slate-900 truncate">{t.name}</p>
                          <p className="text-[11px] text-slate-600 truncate">{t.domain}</p>
                          <p className="text-[11px] text-slate-500 mt-1">{t.location}</p>
                          {typeof t.distanceFromUserKm === "number" && (
                            <p className="text-[11px] text-emerald-700 mt-1 font-semibold">
                              {t.distanceFromUserKm.toFixed(1)} km away
                            </p>
                          )}
                        </div>
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-600">
                          <Star size={11} />
                          {t.rating}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        )}

        <section className="rounded-2xl bg-white shadow-sm border border-slate-200/80 p-4 sm:p-5 md:p-6">
          {filteredTaskers.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-sm text-slate-600">
              <p className="font-semibold text-slate-900 mb-1">No performers match these filters yet.</p>
              <p>Try switching to &ldquo;All metros&rdquo; or &ldquo;All domains&rdquo; to see indicative capacity.</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:gap-5 md:grid-cols-2">
              {filteredTaskers.map((t) => (
                <article
                  key={`${t.name}-${t.location}`}
                  className="flex flex-col justify-between rounded-xl border border-slate-200 bg-slate-50/60 px-4 py-3.5 shadow-sm hover:bg-white hover:shadow-md hover:border-emerald-200 transition-all"
                >
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h2 className="text-sm sm:text-base font-semibold text-slate-900">
                        {t.name}
                      </h2>
                      <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-700">
                        {t.domain}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center gap-1 text-[11px] text-slate-600">
                      <MapPin size={11} className="shrink-0 text-emerald-600" aria-hidden />
                      <span className="truncate">{t.location}</span>
                    </div>
                    <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-slate-600">
                      <span className="inline-flex items-center gap-1">
                        <Star size={12} className="shrink-0 text-amber-500" aria-hidden />
                        {t.rating}
                      </span>
                      <span className="text-slate-400" aria-hidden>
                        ·
                      </span>
                      <span>{t.jobs}+ jobs completed</span>
                      <span className="text-slate-400" aria-hidden>
                        ·
                      </span>
                      <span>{t.distance} avg radius</span>
                    </div>
                  </div>
                  <div className="mt-3 flex justify-end">
                    <button
                      type="button"
                      className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-700 hover:shadow-md"
                    >
                      View sample profile
                      <ArrowRight size={14} aria-hidden />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
        </main>

        <AnimatedSection id="footer" variant="up" delay={0.04}>
          <Footer />
        </AnimatedSection>
      </div>
    </div>
  );
};

export default PerformerDirectory;

