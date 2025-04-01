import SessionManager from "@arcblock/did-connect/lib/SessionManager";
import { useLocaleContext } from "@arcblock/ux/lib/Locale/context";

import useTheme from "@/lib/useTheme";

import { useSessionContext } from "../../lib/session";

export default function User() {
  const { session } = useSessionContext();
  const { locale } = useLocaleContext();
  const [theme] = useTheme();
  return (
    <SessionManager session={session} locale={locale} dark={theme === "dark"} size={24} />
  );
}
