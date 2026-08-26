import { createFileRoute, redirect } from "@tanstack/react-router";

import { RegisterForm } from "@/features/auth/components/RegisterForm";
import { supabase } from "@/lib/supabase/client";

export const Route = createFileRoute("/kayit")({
  head: () => ({
    meta: [
      { title: "Kayıt Ol — Nabız" },
      {
        name: "description",
        content: "Nabız'a katıl ve sevdiklerinle bağlantıda kal.",
      },
      { property: "og:title", content: "Kayıt Ol — Nabız" },
      {
        property: "og:description",
        content: "Hesabını oluştur, sevdiklerinin nabzını tutmaya başla.",
      },
    ],
  }),
  beforeLoad: async () => {
    const { data } = await supabase.auth.getSession();
    if (data.session) {
      throw redirect({ to: "/" });
    }
  },
  component: RegisterPage,
});

function RegisterPage() {
  return <RegisterForm />;
}
