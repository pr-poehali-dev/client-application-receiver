import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type Status = 'new' | 'progress' | 'done' | 'rejected';

const statusMeta: Record<Status, { label: string; color: string; dot: string }> = {
  new: { label: 'Новая', color: 'bg-blue-50 text-blue-700 border-blue-200', dot: 'bg-blue-500' },
  progress: { label: 'В работе', color: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-500' },
  done: { label: 'Выполнена', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' },
  rejected: { label: 'Отклонена', color: 'bg-rose-50 text-rose-700 border-rose-200', dot: 'bg-rose-500' },
};

interface Request {
  id: string;
  title: string;
  type: string;
  date: string;
  status: Status;
}

const initialRequests: Request[] = [
  { id: 'ЗК-1043', title: 'Расширение тарифного плана', type: 'Продажи', date: '04.07.2026', status: 'progress' },
  { id: 'ЗК-1039', title: 'Настройка интеграции с 1С', type: 'Техподдержка', date: '02.07.2026', status: 'new' },
  { id: 'ЗК-1031', title: 'Возврат средств по счёту №8842', type: 'Финансы', date: '28.06.2026', status: 'done' },
  { id: 'ЗК-1024', title: 'Консультация по договору', type: 'Юридический', date: '21.06.2026', status: 'done' },
  { id: 'ЗК-1018', title: 'Замена оборудования на складе', type: 'Логистика', date: '15.06.2026', status: 'rejected' },
];

const chartData = [
  { m: 'Фев', v: 12 },
  { m: 'Мар', v: 19 },
  { m: 'Апр', v: 15 },
  { m: 'Май', v: 27 },
  { m: 'Июн', v: 22 },
  { m: 'Июл', v: 31 },
];

const Index = () => {
  const [requests, setRequests] = useState<Request[]>(initialRequests);
  const [form, setForm] = useState({ title: '', type: '', desc: '' });

  const stats = {
    total: requests.length,
    progress: requests.filter((r) => r.status === 'progress' || r.status === 'new').length,
    done: requests.filter((r) => r.status === 'done').length,
  };

  const maxV = Math.max(...chartData.map((d) => d.v));

  const submit = () => {
    if (!form.title || !form.type) return;
    const newReq: Request = {
      id: `ЗК-${1044 + requests.length}`,
      title: form.title,
      type: form.type,
      date: '05.07.2026',
      status: 'new',
    };
    setRequests([newReq, ...requests]);
    setForm({ title: '', type: '', desc: '' });
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-white/80 backdrop-blur-md">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary">
              <Icon name="Layers" size={20} className="text-primary-foreground" />
            </div>
            <div>
              <p className="text-sm font-semibold leading-none">Клиентский портал</p>
              <p className="text-xs text-muted-foreground">Управление заявками</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative text-muted-foreground transition-colors hover:text-foreground">
              <Icon name="Bell" size={20} />
              <span className="absolute -right-0.5 -top-0.5 flex h-2 w-2 rounded-full bg-rose-500" />
            </button>
            <div className="flex items-center gap-2 border-l border-border pl-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-sm font-semibold text-primary">
                АК
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium leading-none">Алексей Козлов</p>
                <p className="text-xs text-muted-foreground">ООО «Меркурий»</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container px-4 py-8">
        {/* Title */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Панель заявок</h1>
          <p className="mt-1 text-muted-foreground">Подавайте обращения и отслеживайте их статус в реальном времени</p>
        </div>

        {/* Stat cards */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            { icon: 'Inbox', label: 'Всего заявок', value: stats.total, accent: 'text-primary', bg: 'bg-accent' },
            { icon: 'Clock', label: 'В обработке', value: stats.progress, accent: 'text-amber-600', bg: 'bg-amber-50' },
            { icon: 'CircleCheck', label: 'Выполнено', value: stats.done, accent: 'text-emerald-600', bg: 'bg-emerald-50' },
          ].map((c, i) => (
            <div
              key={c.label}
              className="animate-fade-in rounded-lg border border-border bg-card p-5 shadow-sm"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{c.label}</span>
                <div className={`flex h-9 w-9 items-center justify-center rounded-md ${c.bg}`}>
                  <Icon name={c.icon} size={18} className={c.accent} />
                </div>
              </div>
              <p className="mt-3 text-3xl font-bold tabular-nums">{c.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Form */}
          <div className="lg:col-span-1">
            <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
              <div className="mb-5 flex items-center gap-2">
                <Icon name="FilePlus2" size={18} className="text-primary" />
                <h2 className="font-semibold">Новая заявка</h2>
              </div>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="title">Тема обращения</Label>
                  <Input
                    id="title"
                    placeholder="Кратко опишите вопрос"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Категория</Label>
                  <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите отдел" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Продажи">Продажи</SelectItem>
                      <SelectItem value="Техподдержка">Техподдержка</SelectItem>
                      <SelectItem value="Финансы">Финансы</SelectItem>
                      <SelectItem value="Юридический">Юридический</SelectItem>
                      <SelectItem value="Логистика">Логистика</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="desc">Описание</Label>
                  <Textarea
                    id="desc"
                    placeholder="Подробности запроса…"
                    rows={4}
                    value={form.desc}
                    onChange={(e) => setForm({ ...form, desc: e.target.value })}
                  />
                </div>
                <Button className="w-full" onClick={submit}>
                  <Icon name="Send" size={16} className="mr-2" />
                  Отправить заявку
                </Button>
              </div>
            </div>

            {/* Support */}
            <div className="mt-6 rounded-lg border border-border bg-primary p-6 text-primary-foreground shadow-sm">
              <div className="flex items-center gap-2">
                <Icon name="Headset" size={18} />
                <h3 className="font-semibold">Поддержка</h3>
              </div>
              <p className="mt-2 text-sm text-primary-foreground/70">
                Наши специалисты на связи в будни с 9:00 до 20:00
              </p>
              <Button variant="secondary" className="mt-4 w-full">
                <Icon name="MessageCircle" size={16} className="mr-2" />
                Открыть чат
              </Button>
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-6 lg:col-span-2">
            {/* Chart */}
            <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon name="ChartColumn" size={18} className="text-primary" />
                  <h2 className="font-semibold">Активность по заявкам</h2>
                </div>
                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                  +18% к прошлому периоду
                </span>
              </div>
              <div className="flex h-44 items-end justify-between gap-3">
                {chartData.map((d, i) => (
                  <div key={d.m} className="flex flex-1 flex-col items-center gap-2">
                    <div className="flex w-full flex-1 items-end">
                      <div
                        className="w-full origin-bottom animate-grow-bar rounded-t-md bg-gradient-to-t from-primary to-primary/60 transition-opacity hover:opacity-80"
                        style={{ height: `${(d.v / maxV) * 100}%`, animationDelay: `${i * 90}ms` }}
                        title={`${d.v} заявок`}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">{d.m}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Requests list */}
            <div className="rounded-lg border border-border bg-card shadow-sm">
              <div className="flex items-center justify-between border-b border-border px-6 py-4">
                <div className="flex items-center gap-2">
                  <Icon name="History" size={18} className="text-primary" />
                  <h2 className="font-semibold">История заявок</h2>
                </div>
                <button className="flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground">
                  <Icon name="ListFilter" size={15} />
                  Фильтр
                </button>
              </div>
              <div className="divide-y divide-border">
                {requests.map((r) => {
                  const m = statusMeta[r.status];
                  return (
                    <div
                      key={r.id}
                      className="flex items-center justify-between gap-4 px-6 py-4 transition-colors hover:bg-secondary/40"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs text-muted-foreground">{r.id}</span>
                          <span className="text-xs text-muted-foreground">·</span>
                          <span className="text-xs text-muted-foreground">{r.type}</span>
                        </div>
                        <p className="mt-0.5 truncate font-medium">{r.title}</p>
                      </div>
                      <div className="flex shrink-0 items-center gap-4">
                        <span className="hidden text-xs text-muted-foreground sm:block">{r.date}</span>
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${m.color}`}
                        >
                          <span className={`h-1.5 w-1.5 rounded-full ${m.dot}`} />
                          {m.label}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-border py-6">
        <div className="container px-4 text-center text-sm text-muted-foreground">
          © 2026 Клиентский портал · Все обращения обрабатываются в течение 24 часов
        </div>
      </footer>
    </div>
  );
};

export default Index;
