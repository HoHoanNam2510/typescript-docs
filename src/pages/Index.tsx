import { useState } from 'react';
import { Link } from 'react-router-dom';
import TocDots from '../components/TocDots';
import { useChecklist } from '../hooks/useChecklist';
import { getAllProgress } from '../hooks/useProgress';

const TOC_SECTIONS = [
  { id: 'hero', label: 'Đầu trang' },
  { id: 'why-ts', label: 'Tại sao TS?' },
  { id: 'roadmap', label: 'Lộ trình' },
  { id: 'knowledge', label: 'Kiến thức' },
  { id: 'progress', label: 'Tiến độ' },
  { id: 'interview', label: 'Phỏng vấn' },
];

const MODULES = [
  {
    id: 'module_00',
    name: 'Trang chủ & Mục lục',
    to: '/',
    total: 0,
    priority: 'overview',
    time: '~15 phút',
    lessons: '',
    desc: 'Lộ trình tổng thể, danh sách kiến thức cần nắm cho phỏng vấn TypeScript.',
  },
  {
    id: 'module_01',
    name: 'TypeScript Cơ Bản',
    to: '/01-co-ban',
    total: 10,
    priority: 'high',
    time: '~3–4 giờ',
    lessons: '10 bài',
    desc: 'Giới thiệu TS, kiểu nguyên thủy, type inference, special types, arrays, tuples, objects, enums, union/intersection.',
  },
  {
    id: 'module_02',
    name: 'Kiểu Dữ Liệu Nâng Cao',
    to: '/02-kieu-du-lieu',
    total: 10,
    priority: 'high',
    time: '~3–4 giờ',
    lessons: '10 bài',
    desc: 'Type aliases, interfaces, functions, type casting, null handling — nền tảng type system.',
  },
  {
    id: 'module_03',
    name: 'OOP & Classes',
    to: '/03-oop',
    total: 10,
    priority: 'high',
    time: '~4–5 giờ',
    lessons: '10 bài',
    desc: 'Classes, access modifiers, inheritance, polymorphism, abstract classes, mixins.',
  },
  {
    id: 'module_04',
    name: 'Generics & Utility Types',
    to: '/04-generics',
    total: 10,
    priority: 'high',
    time: '~4–5 giờ',
    lessons: '10 bài',
    desc: 'Generic functions/classes, constraints, Partial/Omit/Pick/Record/ReturnType, keyof/typeof.',
  },
  {
    id: 'module_05',
    name: 'TypeScript Nâng Cao',
    to: '/05-nang-cao',
    total: 12,
    priority: 'medium',
    time: '~5–6 giờ',
    lessons: '12 bài',
    desc: 'Type guards, conditional types, mapped types, template literal types, decorators, async.',
  },
  {
    id: 'module_06',
    name: 'Thực Chiến & Ecosystem',
    to: '/06-thuc-chien',
    total: 10,
    priority: 'medium',
    time: '~4–5 giờ',
    lessons: '10 bài',
    desc: 'TS với Node.js, Express typed, tsconfig nâng cao, @types, best practices, branded types.',
  },
] as const;

const HIGH_ITEMS = [
  { key: 'ck_primitives', label: 'Primitive types: string, number, boolean, bigint, symbol' },
  { key: 'ck_inference', label: 'Type inference vs explicit annotation' },
  { key: 'ck_special', label: 'Special types: any, unknown, never, void' },
  { key: 'ck_union', label: 'Union (|) và Intersection (&) types' },
  { key: 'ck_discriminated', label: 'Discriminated unions — pattern quan trọng' },
  { key: 'ck_interface', label: 'Interface vs Type alias — khi nào dùng cái nào' },
  { key: 'ck_generics', label: 'Generics cơ bản — function, class, constraint' },
  { key: 'ck_utility', label: 'Utility types: Partial, Pick, Omit, Record, ReturnType' },
  { key: 'ck_typeguard', label: 'Type guards: typeof, instanceof, in, type predicate' },
  { key: 'ck_narrowing', label: 'Type narrowing trong if/switch' },
  { key: 'ck_readonly', label: 'readonly và const assertion (as const)' },
  { key: 'ck_optional', label: 'Optional chaining (?.) và nullish coalescing (??)' },
];

const MEDIUM_ITEMS = [
  { key: 'ck_mapped', label: 'Mapped types — [K in keyof T]' },
  { key: 'ck_conditional', label: 'Conditional types — T extends U ? X : Y' },
  { key: 'ck_infer', label: 'infer keyword trong conditional types' },
  { key: 'ck_template', label: 'Template literal types' },
  { key: 'ck_keyof', label: 'keyof và indexed access types (T[K])' },
  { key: 'ck_overloads', label: 'Function overloads' },
  { key: 'ck_enums', label: 'Enums — numeric, string, const enum' },
  { key: 'ck_classes', label: 'Classes: access modifiers, abstract, implements' },
  { key: 'ck_decl_merge', label: 'Declaration merging — extend thư viện' },
  { key: 'ck_satisfies', label: 'satisfies operator (TS 4.9+)' },
  { key: 'ck_branded', label: 'Branded types cho type safety' },
  { key: 'ck_result', label: 'Result type pattern — thay thế throw/catch' },
];

const LOW_ITEMS = [
  { key: 'ck_decorators', label: 'Decorators (experimentalDecorators)' },
  { key: 'ck_mixins', label: 'Mixin pattern' },
  { key: 'ck_ambient', label: 'Ambient declarations (.d.ts files)' },
  { key: 'ck_module_aug', label: 'Module augmentation' },
  { key: 'ck_tsconfig', label: 'tsconfig nâng cao: paths, noUncheckedIndexedAccess' },
  { key: 'ck_project_ref', label: 'TypeScript project references' },
  { key: 'ck_zod', label: 'Zod — runtime type validation với TS' },
  { key: 'ck_trpc', label: 'tRPC — end-to-end type safety' },
];

const INTERVIEW_QA = [
  {
    q: 'type vs interface — khi nào dùng cái nào?',
    a: 'Interface cho object shapes/public APIs + cần declaration merging. Type cho union, intersection, primitives, computed types.',
  },
  {
    q: 'unknown vs any — khác nhau thế nào?',
    a: 'any tắt type checking hoàn toàn. unknown type-safe: phải narrow (typeof/instanceof) trước khi dùng.',
  },
  {
    q: 'Discriminated Union là gì?',
    a: 'Union type có common literal field (kind/type). TypeScript tự narrow trong switch/if dựa trên field đó.',
  },
  {
    q: 'Conditional Types dùng khi nào?',
    a: 'Type-level if/else: T extends U ? X : Y. Với infer để extract nested types. Dùng cho Awaited, ReturnType tự tạo.',
  },
  {
    q: 'Mapped Types là gì?',
    a: '[K in keyof T]: transform mọi property. Dùng +/- để add/remove readonly/?. Ví dụ tự implement Partial, Readonly.',
  },
  {
    q: 'satisfies operator (TS 4.9) dùng để làm gì?',
    a: 'Check type compatibility nhưng giữ nguyên inferred literal types — không widening như annotation.',
  },
];

function priorityBadge(p: string) {
  if (p === 'high') return 'badge badge-high';
  if (p === 'medium') return 'badge badge-medium';
  if (p === 'overview') return 'badge badge-low';
  return 'badge badge-low';
}
function priorityLabel(p: string) {
  if (p === 'high') return 'HIGH';
  if (p === 'medium') return 'MEDIUM';
  if (p === 'overview') return 'Tổng quan';
  return 'LOW';
}

export default function Index() {
  const { checked, toggle } = useChecklist();
  const [openQA, setOpenQA] = useState<number | null>(null);

  const progressData = getAllProgress(
    MODULES.filter(m => m.total > 0).map(m => ({ id: m.id, total: m.total }))
  );
  const progressMap = Object.fromEntries(progressData.map(p => [p.id, p]));

  return (
    <>
      <TocDots sections={TOC_SECTIONS} />

      {/* ── HERO ── */}
      <section className="hero" id="hero">
        <div className="hero-bg" />
        <div className="grid-overlay" />
        <div className="hero-inner">
          <div className="hero-badge">
            <span className="dot" />
            Tài liệu ôn tập TypeScript — phỏng vấn tháng 6
          </div>
          <h1>
            Master <span className="hl-ts">TypeScript</span>
            <br />
            cho phỏng vấn
            <br />
            <span className="hl-accent">frontend & backend</span>
          </h1>
          <p className="hero-sub">
            6 modules, 60+ bài học, tập trung vào những gì JD thực tế yêu cầu — type system,
            generics, OOP, và best practices mà phỏng vấn viên hay hỏi nhất.
          </p>
          <div className="hero-stats">
            {[
              { num: '6', label: 'Modules' },
              { num: '62+', label: 'Bài học' },
              { num: '~25h', label: 'Thời gian' },
              { num: '100%', label: 'TypeScript' },
            ].map(s => (
              <div key={s.label} className="hero-stat">
                <span className="hero-stat-num">{s.num}</span>
                <span className="hero-stat-label">{s.label}</span>
              </div>
            ))}
          </div>
          <div className="hero-cta">
            <Link to="/01-co-ban" className="btn-primary">
              Bắt đầu học →
            </Link>
            <a
              href="#roadmap"
              className="btn-secondary"
              onClick={e => {
                e.preventDefault();
                document.getElementById('roadmap')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Xem lộ trình
            </a>
          </div>
        </div>
      </section>

      {/* ── TẠI SAO TYPESCRIPT ── */}
      <div className="section-alt" id="why-ts">
        <div className="section-inner">
          <span className="section-tag">Lý do ôn TypeScript</span>
          <h2 className="section-title">Tại sao TypeScript quan trọng với phỏng vấn 2025?</h2>
          <p className="section-sub">Không phải lý thuyết — đây là thực tế thị trường</p>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
              gap: 12,
            }}
          >
            {[
              {
                icon: '💼',
                title: 'JD yêu cầu TypeScript',
                desc: 'Hơn 80% JD tuyển frontend/backend 2024–2025 tại Việt Nam ghi "TypeScript preferred" hoặc bắt buộc.',
              },
              {
                icon: '🎯',
                title: 'Câu hỏi phỏng vấn phổ biến',
                desc: 'type vs interface, generics, utility types, type guards — đây là top câu hỏi phỏng vấn TypeScript thực tế.',
              },
              {
                icon: '⚡',
                title: 'Code review & production',
                desc: 'Biết TS tốt = code review nhanh hơn, ít bug hơn, dễ onboard vào codebase mới — công ty đánh giá cao.',
              },
              {
                icon: '🦾',
                title: 'Nền tảng cho mọi framework',
                desc: 'React, Vue, Angular, NestJS, Next.js — tất cả đều dùng TypeScript. Master TS = học framework mới nhanh hơn.',
              },
              {
                icon: '🔍',
                title: 'Type system tư duy khác JS',
                desc: 'Hiểu type-level programming giúp bạn thiết kế API tốt hơn và bắt lỗi sớm ở compile time.',
              },
            ].map(card => (
              <div
                key={card.title}
                style={{
                  background: 'var(--bg2)',
                  border: '1px solid var(--border)',
                  borderRadius: 12,
                  padding: '1.25rem',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div style={{ fontSize: '1.3rem', marginBottom: '0.6rem' }}>{card.icon}</div>
                <div
                  style={{
                    fontWeight: 700,
                    fontSize: 14,
                    color: 'var(--text)',
                    marginBottom: '0.35rem',
                  }}
                >
                  {card.title}
                </div>
                <div style={{ fontSize: 13, color: 'var(--text3)', lineHeight: 1.5 }}>
                  {card.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── LỘ TRÌNH ── */}
      <section className="section" id="roadmap">
        <span className="section-tag">Lộ trình học</span>
        <h2 className="section-title">6 modules — từ cơ bản đến type-level programming</h2>
        <p className="section-sub">
          Mỗi module xây dựng trên module trước. Hoàn thành cả 6 = tự tin trả lời 90% câu hỏi phỏng
          vấn TypeScript.
        </p>
        <div className="module-grid">
          {MODULES.map((m, i) => (
            <Link
              key={m.id}
              to={m.to}
              className="module-card"
              style={
                i === 0
                  ? { borderColor: 'var(--border2)' }
                  : i === 1
                    ? { borderColor: 'rgba(91,164,229,0.25)', background: 'rgba(91,164,229,0.02)' }
                    : {}
              }
            >
              <div className="module-card-num">
                <span>Module 0{i}</span>
                <span className={priorityBadge(m.priority)}>{priorityLabel(m.priority)}</span>
              </div>
              <div className="module-card-title">{m.name}</div>
              <div className="module-card-desc">{m.desc}</div>
              <div className="module-card-meta">
                <span className="module-card-stat">⏱ {m.time}</span>
                {m.lessons && <span className="module-card-stat">📚 {m.lessons}</span>}
                <span className="badge badge-ts">TS</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── KIẾN THỨC ── */}
      <div className="section-alt" id="knowledge">
        <div className="section-inner">
          <span className="section-tag">Checklist kiến thức</span>
          <h2 className="section-title">Những gì cần nắm trước khi phỏng vấn</h2>
          <p className="section-sub">Tick vào khi đã nắm vững — tự động lưu vào trình duyệt</p>
          <div className="checklist-grid">
            <div>
              <div className="checklist-col-title">
                <span className="badge badge-high">PHẢI BIẾT</span>
              </div>
              {HIGH_ITEMS.map(item => (
                <div key={item.key} className={`checklist-item${checked[item.key] ? ' done' : ''}`}>
                  <input
                    type="checkbox"
                    checked={!!checked[item.key]}
                    onChange={() => toggle(item.key)}
                  />
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
            <div>
              <div className="checklist-col-title">
                <span className="badge badge-medium">NÊN BIẾT</span>
              </div>
              {MEDIUM_ITEMS.map(item => (
                <div key={item.key} className={`checklist-item${checked[item.key] ? ' done' : ''}`}>
                  <input
                    type="checkbox"
                    checked={!!checked[item.key]}
                    onChange={() => toggle(item.key)}
                  />
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
            <div>
              <div className="checklist-col-title">
                <span className="badge badge-low">BONUS</span>
              </div>
              {LOW_ITEMS.map(item => (
                <div key={item.key} className={`checklist-item${checked[item.key] ? ' done' : ''}`}>
                  <input
                    type="checkbox"
                    checked={!!checked[item.key]}
                    onChange={() => toggle(item.key)}
                  />
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── TIẾN ĐỘ ── */}
      <section className="section" id="progress">
        <span className="section-tag">Theo dõi học tập</span>
        <h2 className="section-title">Tiến độ học</h2>
        <p className="section-sub">
          Tổng hợp từ localStorage — tự động cập nhật khi hoàn thành bài
        </p>
        <div className="progress-overview-grid">
          {MODULES.filter(m => m.total > 0).map(m => {
            const prog = progressMap[m.id] || { done: 0, pct: 0 };
            return (
              <Link
                key={m.id}
                to={m.to}
                className="progress-module-item"
                style={{ textDecoration: 'none', display: 'block' }}
              >
                <div className="progress-module-name">{m.name}</div>
                <div className="progress-bar-wrap-sm">
                  <div className="progress-bar-fill-sm" style={{ width: `${prog.pct}%` }} />
                </div>
                <div className="progress-module-count">
                  {prog.done}/{m.total} bài · {prog.pct}%
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ── PHỎNG VẤN NHANH ── */}
      <div className="section-alt" id="interview">
        <div className="section-inner">
          <span className="section-tag">Ôn thi nhanh</span>
          <h2 className="section-title">Top câu hỏi phỏng vấn TypeScript</h2>
          <p className="section-sub">Click để xem đáp án — ôn trước buổi phỏng vấn</p>
          {INTERVIEW_QA.map((qa, i) => (
            <div key={i} className={`accordion-item${openQA === i ? ' open' : ''}`}>
              <div
                className="accordion-header"
                onClick={() => setOpenQA(prev => (prev === i ? null : i))}
              >
                <span>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      color: 'var(--accent)',
                      marginRight: 10,
                      fontSize: 12,
                    }}
                  >
                    Q{i + 1}
                  </span>
                  {qa.q}
                </span>
                <span className="accordion-chevron">▼</span>
              </div>
              {openQA === i && (
                <div className="accordion-body">
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      color: 'var(--accent)',
                      marginRight: 8,
                      fontSize: 11,
                    }}
                  >
                    A:
                  </span>
                  {qa.a}
                </div>
              )}
            </div>
          ))}
          <div style={{ marginTop: '1.5rem', textAlign: 'right' }}>
            <Link
              to="/01-co-ban"
              style={{ fontSize: 13, color: 'var(--accent)', textDecoration: 'none' }}
            >
              Xem đầy đủ trong các module →
            </Link>
          </div>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <footer
        style={{ borderTop: '1px solid var(--border)', padding: '2rem', textAlign: 'center' }}
      >
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            color: 'var(--text3)',
            marginBottom: '0.4rem',
          }}
        >
          TypeScript Docs · Ôn Tập Phỏng Vấn · 6 Modules · 62+ Bài học
        </div>
        <div style={{ fontSize: 12, color: 'var(--text3)' }}>
          Được xây dựng để học thực tế — không phải để đọc cho vui
        </div>
      </footer>
    </>
  );
}
