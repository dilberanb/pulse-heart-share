import { createFileRoute, redirect } from "@tanstack/react-router";

import { LoginForm } from "@/features/auth/components/LoginForm";
import { supabase } from "@/lib/supabase/client";

export const Route = createFileRoute("/giris")({
  head: () => ({
    meta: [
      { title: "Giriş Yap — Nabız" },
      {
        name: "description",
        content: "Nabız'a giriş yap ve sevdiklerinle bağlantıda kal.",
      },
      { property: "og:title", content: "Giriş Yap — Nabız" },
      {
        property: "og:description",
        content: "Telefon numaranla giriş yap, sevdiklerinin nabzını tut.",
      },
    ],
  }),
  beforeLoad: async () => {
    const { data } = await supabase.auth.getSession();
    if (data.session) {
      throw redirect({ to: "/" });
    }
  },
  component: LoginPage,
});

function LoginPage() {
  return <LoginForm />;
}
