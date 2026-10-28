const SESSION_TOKEN_KEY = 'admin_google_verification_token';
const SESSION_PROFILE_KEY = 'admin_google_profile';

export const getAdminGoogleVerificationToken = () =>
    localStorage.getItem(SESSION_TOKEN_KEY);

export const getAdminGoogleProfile = () => {
    const rawProfile = localStorage.getItem(SESSION_PROFILE_KEY);
    if (!rawProfile) return null;

    try {
        return JSON.parse(rawProfile);
    } catch {
        clearAdminGoogleVerification();
        return null;
    }
};

export const isAdminGoogleVerified = () => {
    const token = getAdminGoogleVerificationToken();
    const profile = getAdminGoogleProfile();

    if (!token || !profile?.expiresAt) return false;

    return new Date(profile.expiresAt).getTime() > Date.now();
};

export const storeAdminGoogleVerification = (payload) => {
    localStorage.setItem(SESSION_TOKEN_KEY, payload.verificationToken);
    localStorage.setItem(
        SESSION_PROFILE_KEY,
        JSON.stringify({
            googleEmail: payload.googleEmail,
            googleName: payload.googleName,
            googlePicture: payload.googlePicture,
            verifiedAt: payload.verifiedAt,
            expiresAt: payload.expiresAt,
        })
    );
};

export const clearAdminGoogleVerification = () => {
    localStorage.removeItem(SESSION_TOKEN_KEY);
    localStorage.removeItem(SESSION_PROFILE_KEY);
};
