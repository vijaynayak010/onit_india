import { Navigate, useSearchParams } from "react-router-dom";

/** Role-specific login entry — /providerlogin or /performerlogin → /auth with role preset. */
export default function AuthRoleRedirect({ role }) {
  const [searchParams] = useSearchParams();
  const normalized = String(role || "").toUpperCase();
  const email = searchParams.get("email");
  const authPath = email
    ? `/auth?email=${encodeURIComponent(email)}`
    : "/auth";

  return (
    <Navigate
      to={authPath}
      replace
      state={{
        role: normalized,
        mode: "login",
        ...(email ? { email } : {}),
      }}
    />
  );
}