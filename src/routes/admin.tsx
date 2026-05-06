import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LogOut,
  Trash2,
  Search,
  Users,
  Loader2,
  Phone,
  Calendar,
  StickyNote,
  GraduationCap,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "لوحة التحكم - م. أبانوب سمير" }] }),
  component: AdminPage,
});

type Booking = {
  id: string;
  full_name: string;
  phone: string;
  academic_year: "first_secondary" | "second_secondary";
  study_type: "languages" | "general";
  notes: string | null;
  created_at: string;
};

const yearLabels: Record<Booking["academic_year"], string> = {
  first_secondary: "أولى ثانوي",
  second_secondary: "ثانية ثانوي",
};
const typeLabels: Record<Booking["study_type"], string> = {
  languages: "لغات",
  general: "عام",
};

// ============== Login Screen ==============
function LoginScreen({ onSuccess }: { onSuccess: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Try sign in. If admin doesn't exist yet, create him on first login attempt
    // with the provided credentials, then assign admin role.
    let { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error && error.message.toLowerCase().includes("invalid")) {
      // Attempt to create the admin account (signup is disabled globally except via signUp call which still works server-side here)
      const { data: signUpData, error: signUpErr } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: window.location.origin },
      });
      if (!signUpErr && signUpData.user) {
        // Assign admin role
        await supabase.from("user_roles").insert({
          user_id: signUpData.user.id,
          role: "admin",
        });
        const retry = await supabase.auth.signInWithPassword({ email, password });
        data = retry.data;
        error = retry.error;
      } else if (signUpErr) {
        error = signUpErr;
      }
    }

    setLoading(false);
    if (error) {
      toast.error("فشل تسجيل الدخول", { description: error.message });
      return;
    }
    if (data?.user) {
      // Check admin role
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", data.user.id);
      const isAdmin = roles?.some((r) => r.role === "admin");
      if (!isAdmin) {
        // Auto-assign for the configured admin email
        if (email.toLowerCase() === "abanoubsamir2811@gmail.com") {
          await supabase.from("user_roles").insert({ user_id: data.user.id, role: "admin" });
        } else {
          await supabase.auth.signOut();
          toast.error("لا تملك صلاحيات الدخول للوحة التحكم");
          return;
        }
      }
      onSuccess();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.form
        onSubmit={submit}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-3xl p-8 w-full max-w-md glow"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-4">
            <ShieldCheck className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-black gradient-text">لوحة التحكم</h1>
          <p className="text-sm text-muted-foreground mt-2">سجّل الدخول للوصول للوحة المسؤول</p>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium block mb-2">البريد الإلكتروني</label>
            <Input
              dir="ltr"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-input/50 text-right"
              placeholder="email@example.com"
            />
          </div>
          <div>
            <label className="text-sm font-medium block mb-2">كلمة المرور</label>
            <Input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-input/50"
            />
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-primary to-accent text-primary-foreground font-bold"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "تسجيل الدخول"}
          </Button>
        </div>
      </motion.form>
    </div>
  );
}

// ============== Booking Card ==============
function BookingCard({ b, onDelete }: { b: Booking; onDelete: (id: string) => void }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="glass rounded-2xl p-5 hover:border-primary/60 transition-all"
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-bold text-lg">{b.full_name}</h3>
          <p className="text-xs text-muted-foreground mt-1">
            {new Date(b.created_at).toLocaleString("ar-EG")}
          </p>
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button size="icon" variant="ghost" className="text-destructive hover:bg-destructive/10">
              <Trash2 className="w-4 h-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>تأكيد الحذف</AlertDialogTitle>
              <AlertDialogDescription>
                هل أنت متأكد من حذف حجز "{b.full_name}"؟ لا يمكن التراجع.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>إلغاء</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => onDelete(b.id)}
                className="bg-destructive text-destructive-foreground"
              >
                حذف
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Phone className="w-4 h-4 text-primary" /> <span dir="ltr">{b.phone}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Calendar className="w-4 h-4 text-primary" /> {yearLabels[b.academic_year]}
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <GraduationCap className="w-4 h-4 text-primary" /> {typeLabels[b.study_type]}
        </div>
        {b.notes && (
          <div className="flex items-start gap-2 text-muted-foreground bg-muted/30 rounded-lg p-2 mt-2">
            <StickyNote className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
            <span>{b.notes}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ============== Dashboard ==============
function Dashboard({ onLogout }: { onLogout: () => void }) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [yearFilter, setYearFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .order("created_at", { ascending: false });
    setLoading(false);
    if (error) {
      toast.error("فشل تحميل البيانات", { description: error.message });
      return;
    }
    setBookings((data ?? []) as Booking[]);
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id: string) => {
    const prev = bookings;
    setBookings((b) => b.filter((x) => x.id !== id));
    const { error } = await supabase.from("bookings").delete().eq("id", id);
    if (error) {
      setBookings(prev);
      toast.error("فشل الحذف", { description: error.message });
    } else {
      toast.success("تم الحذف");
    }
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return bookings.filter((b) => {
      if (yearFilter !== "all" && b.academic_year !== yearFilter) return false;
      if (typeFilter !== "all" && b.study_type !== typeFilter) return false;
      if (!q) return true;
      return (
        b.full_name.toLowerCase().includes(q) ||
        b.phone.toLowerCase().includes(q) ||
        (b.notes ?? "").toLowerCase().includes(q)
      );
    });
  }, [bookings, search, yearFilter, typeFilter]);

  // Group: study_type -> academic_year
  const groups: Array<{
    key: string;
    title: string;
    type: Booking["study_type"];
    year: Booking["academic_year"];
  }> = [
    { key: "lang-1", title: "لغات - أولى ثانوي", type: "languages", year: "first_secondary" },
    { key: "lang-2", title: "لغات - ثانية ثانوي", type: "languages", year: "second_secondary" },
    { key: "gen-1", title: "عام - أولى ثانوي", type: "general", year: "first_secondary" },
    { key: "gen-2", title: "عام - ثانية ثانوي", type: "general", year: "second_secondary" },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="md:w-64 md:min-h-screen border-b md:border-b-0 md:border-l border-border glass p-6 flex md:flex-col gap-4 md:gap-6 items-center md:items-stretch justify-between md:justify-start">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h2 className="font-black text-lg gradient-text">لوحة التحكم</h2>
            <p className="text-xs text-muted-foreground">م. أبانوب سمير</p>
          </div>
        </div>
        <nav className="hidden md:flex flex-col gap-2 mt-6 flex-1">
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-primary/10 text-primary font-bold">
            <Users className="w-4 h-4" /> الطلاب
          </div>
        </nav>
        <Button
          variant="ghost"
          onClick={onLogout}
          className="md:mt-auto text-destructive hover:bg-destructive/10"
        >
          <LogOut className="w-4 h-4 ml-2" /> خروج
        </Button>
      </aside>

      {/* Main */}
      <main className="flex-1 p-6 md:p-10 max-w-full overflow-x-hidden">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-black mb-2">
            <span className="gradient-text">حجوزات الطلاب</span>
          </h1>
          <p className="text-muted-foreground">
            إجمالي: {bookings.length} طالب • معروض: {filtered.length}
          </p>
        </motion.div>

        {/* Filters */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="relative md:col-span-1">
            <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="ابحث بالاسم أو الهاتف..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pr-10 bg-input/50"
            />
          </div>
          <Select value={yearFilter} onValueChange={setYearFilter}>
            <SelectTrigger className="bg-input/50">
              <SelectValue placeholder="الصف" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">كل الصفوف</SelectItem>
              <SelectItem value="first_secondary">أولى ثانوي</SelectItem>
              <SelectItem value="second_secondary">ثانية ثانوي</SelectItem>
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="bg-input/50">
              <SelectValue placeholder="النوع" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">كل الأنواع</SelectItem>
              <SelectItem value="languages">لغات</SelectItem>
              <SelectItem value="general">عام</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-10">
            {groups.map((g) => {
              const items = filtered.filter(
                (b) => b.study_type === g.type && b.academic_year === g.year,
              );
              return (
                <section key={g.key}>
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-border">
                    <h2 className="text-xl md:text-2xl font-bold">{g.title}</h2>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/30">
                      {items.length} طالب
                    </span>
                  </div>
                  {items.length === 0 ? (
                    <p className="text-muted-foreground text-sm py-4">لا يوجد طلاب في هذا القسم</p>
                  ) : (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      <AnimatePresence>
                        {items.map((b) => (
                          <BookingCard key={b.id} b={b} onDelete={handleDelete} />
                        ))}
                      </AnimatePresence>
                    </div>
                  )}
                </section>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

// ============== Page ==============
function AdminPage() {
  const navigate = useNavigate();
  const [authed, setAuthed] = useState<boolean | null>(null);

  const checkAuth = async () => {
    const { data } = await supabase.auth.getSession();
    if (!data.session) {
      setAuthed(false);
      return;
    }
    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", data.session.user.id);
    const isAdmin = roles?.some((r) => r.role === "admin");
    if (!isAdmin) {
      await supabase.auth.signOut();
      setAuthed(false);
      return;
    }
    setAuthed(true);
  };

  useEffect(() => {
    checkAuth();
    const { data: sub } = supabase.auth.onAuthStateChange(() => {
      checkAuth();
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setAuthed(false);
    navigate({ to: "/admin" });
  };

  if (authed === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      {authed ? (
        <Dashboard onLogout={handleLogout} />
      ) : (
        <LoginScreen onSuccess={() => setAuthed(true)} />
      )}
    </div>
  );
}
