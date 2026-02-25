import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { Modal } from "@/components/ui/modal";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "@/components/ui/toaster";
import { useAuthStore } from "@/store/authStore";
import {
  AlertTriangle,
  Calendar,
  Edit3,
  Eye,
  EyeOff,
  Key,
  Lock,
  Mail,
  Phone,
  Settings,
  Shield,
  Trash2,
  User,
} from "lucide-react";

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

function authHeaders(): Record<string, string> {
  try {
    const raw = localStorage.getItem("auth");
    if (!raw) return {};
    const { token } = JSON.parse(raw) as { token: string };
    return token ? { Authorization: `Bearer ${token}` } : {};
  } catch {
    return {};
  }
}

// ─── Input helpers ───

function InputField({
  label,
  id,
  type = "text",
  value,
  onChange,
  placeholder,
  icon,
  rightElement,
}: {
  label: string;
  id: string;
  type?: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  icon?: React.ReactNode;
  rightElement?: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block text-xs font-medium text-slate-600 dark:text-slate-400"
      >
        {label}
      </label>
      <div className="relative">
        {icon && (
          <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            {icon}
          </div>
        )}
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 ${
            icon ? "pl-9" : ""
          } ${rightElement ? "pr-10" : ""}`}
        />
        {rightElement && (
          <div className="absolute right-2 top-1/2 -translate-y-1/2">
            {rightElement}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Component ───

export function SettingsPage() {
  const { user, updateUser, logout } = useAuthStore();
  const navigate = useNavigate();
  const [editOpen, setEditOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);

  if (!user) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Settings className="h-5 w-5 text-slate-400" />
        <h1 className="text-xl font-semibold">Ayarlar</h1>
      </div>

      <Tabs defaultValue="account" className="space-y-4">
        <TabsList>
          <TabsTrigger value="account">
            <User className="mr-1.5 h-3.5 w-3.5" />
            Hesap
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="mr-1.5 h-3.5 w-3.5" />
            Güvenlik
          </TabsTrigger>
        </TabsList>

        {/* ═══ TAB 1: HESAP ═══ */}
        <TabsContent value="account">
          <Card className="border-slate-200 dark:border-slate-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 ring-2 ring-emerald-400/40">
                  <span className="text-xl font-semibold text-emerald-400">
                    {user.firstName[0]}
                    {user.lastName[0]}
                  </span>
                </div>
                <div>
                  <CardTitle className="text-lg">
                    {user.firstName} {user.lastName}
                  </CardTitle>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {user.email}
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5"
                onClick={() => setEditOpen(true)}
              >
                <Edit3 className="h-3.5 w-3.5" />
                Düzenle
              </Button>
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
        </TabsContent>

        {/* ═══ TAB 2: GÜVENLİK ═══ */}
        <TabsContent value="security">
          <div className="space-y-6">
            {/* Password change */}
            <Card className="border-slate-200 dark:border-slate-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Key className="h-4 w-4 text-amber-400" />
                  Şifre
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-700 dark:text-slate-200">
                      Hesap şifrenizi değiştirin
                    </p>
                    <p className="mt-0.5 text-xs text-slate-400">
                      Güçlü bir şifre kullanmanız önerilir
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1.5"
                    onClick={() => setPasswordOpen(true)}
                  >
                    <Key className="h-3.5 w-3.5" />
                    Şifre Değiştir
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Danger zone */}
            <DangerZone
              onDeleted={() => {
                logout();
                navigate("/login");
              }}
            />
          </div>
        </TabsContent>
      </Tabs>

      {/* ═══ Modals ═══ */}
      <ProfileEditModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        user={user}
        updateUser={updateUser}
      />
      <PasswordChangeModal
        open={passwordOpen}
        onClose={() => setPasswordOpen(false)}
      />
    </div>
  );
}

// ─── InfoRow ───

function InfoRow({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-slate-100 bg-slate-50/50 p-3 dark:border-slate-800/60 dark:bg-slate-900/40">
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

// ─── Profile Edit Modal ───

function ProfileEditModal({
  open,
  onClose,
  user,
  updateUser,
}: {
  open: boolean;
  onClose: () => void;
  user: { firstName: string; lastName: string; phone?: string | null; dateOfBirth?: string | null };
  updateUser: (partial: Record<string, unknown>) => void;
}) {
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [phone, setPhone] = useState(user.phone ?? "");
  const [dateOfBirth, setDateOfBirth] = useState(
    user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split("T")[0] : "",
  );
  const [saving, setSaving] = useState(false);

  // Reset form when modal opens
  if (open && firstName !== user.firstName && !saving) {
    setFirstName(user.firstName);
    setLastName(user.lastName);
    setPhone(user.phone ?? "");
    setDateOfBirth(
      user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split("T")[0] : "",
    );
  }

  async function handleSave() {
    if (!firstName.trim() || !lastName.trim()) {
      toast.error("Ad ve soyad boş bırakılamaz.");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`${API_BASE}/api/auth/user`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          phone: phone.trim() || null,
          dateOfBirth: dateOfBirth || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Güncelleme hatası.");

      updateUser({
        firstName: data.data.firstName,
        lastName: data.data.lastName,
        phone: data.data.phone,
        dateOfBirth: data.data.dateOfBirth,
      });
      toast.success("Profil bilgileri güncellendi.");
      onClose();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Hata oluştu.";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Profili Düzenle">
      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <InputField
            label="Ad"
            id="edit-firstName"
            value={firstName}
            onChange={setFirstName}
            placeholder="Adınız"
            icon={<User className="h-3.5 w-3.5" />}
          />
          <InputField
            label="Soyad"
            id="edit-lastName"
            value={lastName}
            onChange={setLastName}
            placeholder="Soyadınız"
            icon={<User className="h-3.5 w-3.5" />}
          />
        </div>
        <InputField
          label="Telefon"
          id="edit-phone"
          type="tel"
          value={phone}
          onChange={setPhone}
          placeholder="+90 5xx xxx xx xx"
          icon={<Phone className="h-3.5 w-3.5" />}
        />
        <InputField
          label="Doğum Tarihi"
          id="edit-dateOfBirth"
          type="date"
          value={dateOfBirth}
          onChange={setDateOfBirth}
          icon={<Calendar className="h-3.5 w-3.5" />}
        />

        <Separator />

        <div className="flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={onClose}>
            İptal
          </Button>
          <Button size="sm" onClick={handleSave} disabled={saving} className="gap-1.5">
            {saving ? <Spinner size="sm" /> : null}
            {saving ? "Kaydediliyor..." : "Kaydet"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

// ─── Password Change Modal ───

function PasswordChangeModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [saving, setSaving] = useState(false);

  function resetAndClose() {
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setShowOld(false);
    setShowNew(false);
    onClose();
  }

  async function handleChange() {
    if (!oldPassword || !newPassword) {
      toast.error("Tüm alanları doldurun.");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Yeni şifre en az 6 karakter olmalıdır.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Yeni şifreler eşleşmiyor.");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(`${API_BASE}/api/auth/password`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({ oldPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Şifre değiştirme hatası.");

      toast.success("Şifre başarıyla değiştirildi.");
      resetAndClose();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Hata oluştu.";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal open={open} onClose={resetAndClose} title="Şifre Değiştir">
      <div className="space-y-4">
        <InputField
          label="Mevcut Şifre"
          id="modal-oldPassword"
          type={showOld ? "text" : "password"}
          value={oldPassword}
          onChange={setOldPassword}
          placeholder="••••••••"
          icon={<Lock className="h-3.5 w-3.5" />}
          rightElement={
            <button
              type="button"
              onClick={() => setShowOld(!showOld)}
              className="text-slate-400 hover:text-slate-600"
            >
              {showOld ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          }
        />
        <InputField
          label="Yeni Şifre"
          id="modal-newPassword"
          type={showNew ? "text" : "password"}
          value={newPassword}
          onChange={setNewPassword}
          placeholder="En az 6 karakter"
          icon={<Key className="h-3.5 w-3.5" />}
          rightElement={
            <button
              type="button"
              onClick={() => setShowNew(!showNew)}
              className="text-slate-400 hover:text-slate-600"
            >
              {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          }
        />
        <InputField
          label="Yeni Şifre (Tekrar)"
          id="modal-confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={setConfirmPassword}
          placeholder="Yeni şifreyi tekrar girin"
          icon={<Key className="h-3.5 w-3.5" />}
        />

        <Separator />

        <div className="flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={resetAndClose}>
            İptal
          </Button>
          <Button size="sm" onClick={handleChange} disabled={saving} className="gap-1.5">
            {saving ? <Spinner size="sm" /> : null}
            {saving ? "Değiştiriliyor..." : "Şifreyi Değiştir"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

// ─── Danger Zone ───

function DangerZone({ onDeleted }: { onDeleted: () => void }) {
  const [password, setPassword] = useState("");
  const [confirmText, setConfirmText] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  async function handleDelete() {
    if (confirmText !== "HESABIMI SIL") {
      toast.error("Lütfen onay metnini doğru yazın.");
      return;
    }
    if (!password) {
      toast.error("Şifrenizi girin.");
      return;
    }

    setDeleting(true);
    try {
      const res = await fetch(`${API_BASE}/api/auth/account`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Hesap silme hatası.");

      toast.success("Hesabınız silindi.");
      onDeleted();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Hata oluştu.";
      toast.error(msg);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <Card className="border-rose-200/60 dark:border-rose-500/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm text-rose-600 dark:text-rose-400">
          <AlertTriangle className="h-4 w-4" />
          Tehlikeli Bölge
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="rounded-lg bg-rose-50/50 p-4 dark:bg-rose-500/5">
            <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
              Hesabınızı sildiğinizde tüm verileriniz (profil, deneyimler, eğitimler,
              projeler, yüklenen CV'ler ve analiz sonuçları) <strong>kalıcı olarak</strong>{" "}
              silinecektir. Bu işlem geri alınamaz.
            </p>
          </div>

          {!showConfirm ? (
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 text-rose-600 hover:bg-rose-50 hover:text-rose-700 dark:text-rose-400 dark:hover:bg-rose-500/10"
              onClick={() => setShowConfirm(true)}
            >
              <Trash2 className="h-3.5 w-3.5" />
              Hesabımı Sil
            </Button>
          ) : (
            <div className="space-y-3 max-w-md rounded-lg border border-rose-200 p-4 dark:border-rose-500/30">
              <p className="text-xs font-medium text-rose-600 dark:text-rose-400">
                Onaylamak için aşağıya <strong>HESABIMI SIL</strong> yazın:
              </p>
              <input
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder="HESABIMI SIL"
                className="w-full rounded-lg border border-rose-200 bg-white px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500 dark:border-rose-500/30 dark:bg-slate-900 dark:text-slate-200"
              />
              <InputField
                label="Şifreniz"
                id="deletePassword"
                type="password"
                value={password}
                onChange={setPassword}
                placeholder="Şifrenizi girin"
                icon={<Lock className="h-3.5 w-3.5" />}
              />
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  className="gap-1.5 bg-rose-600 hover:bg-rose-700 text-white"
                  onClick={handleDelete}
                  disabled={deleting || confirmText !== "HESABIMI SIL"}
                >
                  {deleting ? <Spinner size="sm" /> : <Trash2 className="h-3.5 w-3.5" />}
                  {deleting ? "Siliniyor..." : "Kalıcı Olarak Sil"}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setShowConfirm(false);
                    setConfirmText("");
                    setPassword("");
                  }}
                >
                  İptal
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
