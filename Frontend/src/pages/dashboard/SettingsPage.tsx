import { Settings } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, Calendar, User } from "lucide-react";

export function SettingsPage() {
  const { user } = useAuthStore();

  if (!user) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Settings className="h-5 w-5 text-slate-400" />
        <h1 className="text-xl font-semibold">Tercihler</h1>
      </div>

      <Card className="border-slate-200 dark:border-slate-800">
        <CardHeader className="flex flex-row items-center gap-4 space-y-0">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 ring-2 ring-emerald-400/40">
            <span className="text-xl font-semibold text-emerald-400">
              {user.firstName[0]}
              {user.lastName[0]}
            </span>
          </div>
          <div className="flex-1">
            <CardTitle className="text-lg">
              {user.firstName} {user.lastName}
            </CardTitle>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {user.email}
            </p>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2">
            <InfoRow icon={<User className="h-4 w-4" />} label="Ad Soyad">
              {user.firstName} {user.lastName}
            </InfoRow>
            <InfoRow icon={<Mail className="h-4 w-4" />} label="E-posta">
              {user.email}
            </InfoRow>
            <InfoRow icon={<Phone className="h-4 w-4" />} label="Telefon">
              {user.phone || "Belirtilmedi"}
            </InfoRow>
            <InfoRow
              icon={<Calendar className="h-4 w-4" />}
              label="Doğum Tarihi"
            >
              {user.dateOfBirth
                ? new Date(user.dateOfBirth).toLocaleDateString("tr-TR")
                : "Belirtilmedi"}
            </InfoRow>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

type InfoRowProps = {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
};

function InfoRow({ icon, label, children }: InfoRowProps) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/40 p-3">
      <div className="mt-0.5 text-slate-400">{icon}</div>
      <div>
        <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
        <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
          {children}
        </p>
      </div>
    </div>
  );
}
