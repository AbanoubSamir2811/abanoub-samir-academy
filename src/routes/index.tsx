import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Code2,
  Sparkles,
  Brain,
  Trophy,
  Rocket,
  GraduationCap,
  CheckCircle2,
  Phone,
  Mail,
  ChevronDown,
  Loader2,
  PartyPopper,
} from "lucide-react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import instructorImg from "@/assets/instructor.jpeg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "كورس البرمجة الشامل - م. أبانوب سمير | احجز الآن" },
      {
        name: "description",
        content:
          "كورس برمجة وذكاء اصطناعي احترافي لطلاب أولى وثانية ثانوي - HTML, CSS, JavaScript مع شرح مبسط ومشاريع تطبيقية.",
      },
    ],
  }),
  component: LandingPage,
});

// ============== Reusable bits ==============
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

function SectionTitle({ eyebrow, title, sub }: { eyebrow?: string; title: string; sub?: string }) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
      className="text-center mb-12"
    >
      {eyebrow && (
        <span className="inline-block px-4 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/30 mb-4">
          {eyebrow}
        </span>
      )}
      <h2 className="text-3xl md:text-5xl font-extrabold mb-3">
        <span className="gradient-text">{title}</span>
      </h2>
      {sub && <p className="text-muted-foreground max-w-2xl mx-auto">{sub}</p>}
    </motion.div>
  );
}

function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <div className="blob bg-primary/40 w-[500px] h-[500px] -top-32 -right-32 animate-blob" />
      <div
        className="blob bg-accent/40 w-[400px] h-[400px] top-1/2 -left-32 animate-blob"
        style={{ animationDelay: "5s" }}
      />
      <div
        className="blob bg-primary-glow/30 w-[450px] h-[450px] bottom-0 right-1/3 animate-blob"
        style={{ animationDelay: "10s" }}
      />
    </div>
  );
}

// ============== Hero ==============
function Hero() {
  return (
    <section className="relative min-h-screen flex items-center px-4 pt-20 pb-12 overflow-hidden">
      <div className="container mx-auto grid md:grid-cols-2 gap-10 items-center">
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center md:text-right order-2 md:order-1"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/30 mb-6">
            <Sparkles className="w-3.5 h-3.5" /> كورس متاح الآن للحجز
          </span>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-4 leading-tight">
            كورس <span className="gradient-text">البرمجة</span> والذكاء الاصطناعي
          </h1>
          <p className="text-xl md:text-2xl font-bold mb-2">Eng. Abanoub Samir</p>
          <p className="text-lg text-muted-foreground mb-2">Full Stack Developer</p>
          <p className="text-muted-foreground mb-8">
            مطوّر ومدرّس برمجة - تأسيس قوي من الصفر لطلاب أولى وثانية ثانوي
          </p>
          <div className="flex flex-wrap gap-4 justify-center md:justify-start">
            <Button
              size="lg"
              className="bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground font-bold shadow-lg shadow-primary/30"
              onClick={() =>
                document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" })
              }
            >
              <Rocket className="w-4 h-4 ml-2" /> احجز مكانك الآن
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-primary/40 hover:bg-primary/10"
              onClick={() =>
                document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })
              }
            >
              تعرّف عليّ
            </Button>
          </div>

          <div className="flex gap-6 mt-10 justify-center md:justify-start">
            {[
              { label: "HTML", color: "from-orange-500 to-red-500" },
              { label: "CSS", color: "from-blue-500 to-cyan-500" },
              { label: "JS", color: "from-yellow-400 to-amber-500" },
            ].map((t) => (
              <motion.div
                key={t.label}
                whileHover={{ y: -6, scale: 1.05 }}
                className={`w-14 h-14 md:w-16 md:h-16 rounded-xl bg-gradient-to-br ${t.color} flex items-center justify-center font-black text-white shadow-lg`}
              >
                {t.label}
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative order-1 md:order-2 flex justify-center"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/40 to-accent/40 blur-3xl rounded-full" />
          <div className="relative animate-float">
            <div className="absolute -inset-3 rounded-3xl bg-gradient-to-br from-primary to-accent opacity-70 blur-xl" />
            <img
              src={instructorImg}
              alt="المهندس أبانوب سمير - مدرّس البرمجة"
              className="relative w-72 md:w-96 rounded-3xl border-2 border-primary/40 shadow-2xl"
            />
          </div>
        </motion.div>
      </div>

      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-muted-foreground"
      >
        <ChevronDown className="w-6 h-6" />
      </motion.div>
    </section>
  );
}

// ============== About ==============
function About() {
  return (
    <section id="about" className="py-20 px-4">
      <div className="container mx-auto max-w-5xl">
        <SectionTitle eyebrow="نبذة عني" title="من هو المهندس أبانوب؟" />
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="glass rounded-3xl p-8 md:p-12 text-center"
        >
          <p className="text-lg md:text-xl leading-relaxed text-muted-foreground mb-8">
            مطوّر ويب Full Stack ومدرّس برمجة شغوف بنقل المعرفة بأسلوب مبسّط واحترافي.
            هدفي أن أساعدك على بناء أساس قوي في البرمجة من الصفر، وفتح أبواب عالم التكنولوجيا
            والذكاء الاصطناعي أمامك بثقة.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

// ============== Why Programming ==============
function WhyProgramming() {
  const items = [
    { icon: Trophy, title: "سوق عمل واسع", desc: "فرص وظيفية لا تنتهي محليًا وعالميًا" },
    { icon: Brain, title: "تفكير منطقي", desc: "تنمي قدرتك على حل المشكلات بطريقة ذكية" },
    { icon: Sparkles, title: "دخل مرتفع", desc: "من أعلى المهن دخلًا في العالم" },
    { icon: Rocket, title: "إبداع بلا حدود", desc: "حوّل أفكارك إلى مشاريع وتطبيقات حقيقية" },
  ];
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <SectionTitle
          eyebrow="لماذا البرمجة؟"
          title="لماذا تتعلم البرمجة الآن؟"
          sub="البرمجة هي لغة المستقبل، تعلّمها يفتح لك أبوابًا لا تتخيلها"
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((it, i) => (
            <motion.div
              key={it.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              whileHover={{ y: -8 }}
              className="glass rounded-2xl p-6 text-center group hover:border-primary/60 transition-all"
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-4 group-hover:shadow-lg group-hover:shadow-primary/40 transition-all">
                <it.icon className="w-7 h-7 text-primary-foreground" />
              </div>
              <h3 className="font-bold text-lg mb-2">{it.title}</h3>
              <p className="text-sm text-muted-foreground">{it.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============== Course Benefits ==============
function CourseBenefits() {
  const benefits = [
    "تأسيس قوي من الصفر",
    "مشاريع عملية تطبيقية",
    "شرح مبسّط واحترافي",
    "متابعة مستمرة ودعم كامل",
    "تعلم HTML, CSS, JavaScript",
    "مناسب لأولى وثانية ثانوي - بكالوريا",
  ];
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <SectionTitle
          eyebrow="مميزات الكورس"
          title="ماذا ستتعلم في الكورس؟"
          sub="منهج متكامل يأخذك من الصفر إلى الاحتراف خطوة بخطوة"
        />
        <div className="grid md:grid-cols-2 gap-4">
          {benefits.map((b, i) => (
            <motion.div
              key={b}
              initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="flex items-center gap-4 glass rounded-2xl p-5 hover:border-primary/60 transition-all hover:translate-x-[-4px]"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-medium text-lg">{b}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============== Booking Form ==============
const bookingSchema = z.object({
  full_name: z
    .string()
    .trim()
    .min(3, "الاسم يجب أن يكون 3 أحرف على الأقل")
    .max(100, "الاسم طويل جدًا"),
  phone: z
    .string()
    .trim()
    .regex(/^[0-9+\s-]{8,20}$/, "رقم هاتف غير صالح"),
  parent_name: z
    .string()
    .trim()
    .min(3, "اسم ولي الأمر يجب أن يكون 3 أحرف على الأقل")
    .max(100, "اسم ولي الأمر طويل جدًا"),
  parent_phone: z
    .string()
    .trim()
    .regex(/^[0-9+\s-]{8,20}$/, "رقم هاتف ولي الأمر غير صالح"),
  academic_year: z.enum(["first_secondary", "second_secondary"], {
    required_error: "اختر الصف الدراسي",
  }),
  study_type: z.enum(["languages", "general"], {
    required_error: "اختر نوع الدراسة",
  }),
  notes: z.string().trim().max(500, "الملاحظات طويلة جدًا").optional(),
});

type BookingFormValues = z.infer<typeof bookingSchema>;

function BookingForm() {
  const [done, setDone] = useState(false);
  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: { full_name: "", phone: "", parent_name: "", parent_phone: "", notes: "" },
  });

  const onSubmit = async (values: BookingFormValues) => {
    const { error } = await supabase.from("bookings").insert({
      full_name: values.full_name,
      phone: values.phone,
      parent_name: values.parent_name,
      parent_phone: values.parent_phone,
      academic_year: values.academic_year,
      study_type: values.study_type,
      notes: values.notes || null,
    });
    if (error) {
      toast.error("حدث خطأ أثناء الحفظ", { description: error.message });
      return;
    }
    toast.success("تم الحجز بنجاح!", { description: "سنتواصل معك قريبًا." });
    setDone(true);
    form.reset();
  };

  return (
    <section id="booking" className="py-20 px-4">
      <div className="container mx-auto max-w-3xl">
        <SectionTitle
          eyebrow="احجز الآن"
          title="سجّل في الكورس"
          sub="املأ النموذج وسنتواصل معك في أقرب وقت لتأكيد الحجز"
        />

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="glass rounded-3xl p-6 md:p-10 glow"
        >
          {done ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8"
            >
              <PartyPopper className="w-16 h-16 mx-auto mb-4 text-primary" />
              <h3 className="text-2xl font-bold mb-2">تم تسجيل حجزك بنجاح!</h3>
              <p className="text-muted-foreground mb-6">
                شكرًا لثقتك بنا. سنتواصل معك خلال 24 ساعة على رقمك المسجّل.
              </p>
              <Button onClick={() => setDone(false)} variant="outline">
                تسجيل حجز آخر
              </Button>
            </motion.div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <FormField
                  control={form.control}
                  name="full_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>الاسم الكامل *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="ادخل اسمك الكامل"
                          className="bg-input/50"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>رقم الهاتف *</FormLabel>
                      <FormControl>
                        <Input
                          dir="ltr"
                          placeholder="01xxxxxxxxx"
                          className="bg-input/50 text-right"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="parent_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>اسم ولي الأمر *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="ادخل اسم ولي الأمر"
                          className="bg-input/50"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="parent_phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>رقم تليفون ولي الأمر *</FormLabel>
                      <FormControl>
                        <Input
                          dir="ltr"
                          placeholder="01xxxxxxxxx"
                          className="bg-input/50 text-right"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid md:grid-cols-2 gap-5">
                  <FormField
                    control={form.control}
                    name="academic_year"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>الصف الدراسي *</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-input/50">
                              <SelectValue placeholder="اختر الصف" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="first_secondary">أولى ثانوي</SelectItem>
                            <SelectItem value="second_secondary">ثانية ثانوي</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="study_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>نوع الدراسة *</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-input/50">
                              <SelectValue placeholder="اختر النوع" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="languages">لغات</SelectItem>
                            <SelectItem value="general">عام</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ملاحظات (اختياري)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="أي تفاصيل أو استفسارات تحب تشاركها"
                          className="bg-input/50 min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  size="lg"
                  disabled={form.formState.isSubmitting}
                  className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground font-bold text-lg py-6 shadow-lg shadow-primary/30"
                >
                  {form.formState.isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 ml-2 animate-spin" /> جاري الإرسال...
                    </>
                  ) : (
                    <>
                      <GraduationCap className="w-5 h-5 ml-2" /> احجز مكاني الآن
                    </>
                  )}
                </Button>
              </form>
            </Form>
          )}
        </motion.div>
      </div>
    </section>
  );
}

// ============== CTA ==============
function CTA() {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-3xl overflow-hidden p-10 md:p-16 text-center bg-gradient-to-br from-primary/30 via-accent/20 to-primary-glow/30 border border-primary/40"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-accent/10 blur-3xl -z-10" />
          <Code2 className="w-12 h-12 mx-auto mb-4 text-primary" />
          <h2 className="text-3xl md:text-5xl font-black mb-4">
            جاهز لبداية رحلتك في <span className="gradient-text">البرمجة</span>؟
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            لا تفوّت الفرصة - الأماكن محدودة، احجز مكانك الآن وابدأ في تعلّم أهم مهارة في عصرنا.
          </p>
          <Button
            size="lg"
            className="bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground font-bold text-lg px-8 py-6"
            onClick={() =>
              document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" })
            }
          >
            <Rocket className="w-5 h-5 ml-2" /> احجز مكانك الآن
          </Button>
        </motion.div>
      </div>
    </section>
  );
}

// ============== Footer ==============
function Footer() {
  return (
    <footer className="py-10 px-4 border-t border-border mt-10">
      <div className="container mx-auto max-w-5xl flex flex-col md:flex-row items-center justify-between gap-6 text-sm">
        <div className="flex flex-col md:flex-row items-center gap-4">
          <a
            href="tel:01277744647"
            className="flex items-center gap-2 hover:text-primary transition-colors"
          >
            <Phone className="w-4 h-4" /> 01277744647
          </a>
          <a
            href="mailto:Abanoubsamir2811@gmail.com"
            className="flex items-center gap-2 hover:text-primary transition-colors"
          >
            <Mail className="w-4 h-4" /> Abanoubsamir2811@gmail.com
          </a>
        </div>
        <p className="text-muted-foreground">© {new Date().getFullYear()} م. أبانوب سمير</p>
      </div>
    </footer>
  );
}

function LandingPage() {
  return (
    <div className="relative min-h-screen">
      <AnimatedBackground />
      <Hero />
      <About />
      <WhyProgramming />
      <CourseBenefits />
      <CTA />
      <BookingForm />
      <Footer />
    </div>
  );
}
