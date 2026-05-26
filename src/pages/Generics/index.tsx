import PageHeader from '../../components/PageHeader';
import TocBar from '../../components/TocBar';
import ModuleFooter from '../../components/ModuleFooter';
import { useProgress } from '../../hooks/useProgress';
import { TOC_LINKS } from './_toc';
import Lesson01 from './Lesson01';
import Lesson02 from './Lesson02';
import Lesson03 from './Lesson03';
import Lesson04 from './Lesson04';
import Lesson05 from './Lesson05';
import Lesson06 from './Lesson06';
import Lesson07 from './Lesson07';
import Lesson08 from './Lesson08';
import Lesson09 from './Lesson09';
import Lesson10 from './Lesson10';
import ProjectSection from './ProjectSection';

const GROUP_LABEL_STYLE: React.CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: 11,
  color: 'var(--text3)',
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  margin: '2rem 0 1rem',
  paddingBottom: 8,
  borderBottom: '1px solid var(--border)',
};

export default function Generics() {
  const { done, toggle, count, pct } = useProgress('module_04', 10);
  const t = (id: string) => () => toggle(id);

  return (
    <div style={{ paddingTop: 'var(--nav-h)' }}>
      <PageHeader
        moduleNum="Module 04"
        title="Generics & Utility Types"
        subtitle="Tái sử dụng code với generics, custom utility types, và higher-order functions"
        priority="high"
        time="~4–5 giờ"
        lessonCount={10}
        prevLink={{ to: '/03-oop', label: 'OOP & Classes' }}
        nextLink={{ to: '/05-nang-cao', label: 'TypeScript Nâng Cao' }}
        prereqs={['Module 03 — OOP & Classes', 'Conditional & Mapped Types (Module 02)']}
      />

      <TocBar count={count} total={10} pct={pct} links={TOC_LINKS} />

      <div className="section">
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <div style={GROUP_LABEL_STYLE}>Nhóm A — Generics Core</div>
          <Lesson01 isDone={done.has('l01')} onToggleDone={t('l01')} />
          <Lesson02 isDone={done.has('l02')} onToggleDone={t('l02')} />
          <Lesson03 isDone={done.has('l03')} onToggleDone={t('l03')} />
          <Lesson04 isDone={done.has('l04')} onToggleDone={t('l04')} />
          <Lesson05 isDone={done.has('l05')} onToggleDone={t('l05')} />

          <div style={{ ...GROUP_LABEL_STYLE, marginTop: '2.5rem' }}>
            Nhóm B — Advanced Generics & Utility Types
          </div>
          <Lesson06 isDone={done.has('l06')} onToggleDone={t('l06')} />
          <Lesson07 isDone={done.has('l07')} onToggleDone={t('l07')} />
          <Lesson08 isDone={done.has('l08')} onToggleDone={t('l08')} />
          <Lesson09 isDone={done.has('l09')} onToggleDone={t('l09')} />
          <Lesson10 isDone={done.has('l10')} onToggleDone={t('l10')} />

          <ProjectSection />

          <div className="related-section">
            <h3 style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>Kiến thức liên quan</h3>
            <div className="related-grid">
              <div>
                <div className="related-col-title">Cần biết trước</div>
                <a href="/02-kieu-du-lieu#kd-09" className="related-link">
                  Conditional Types
                </a>
                <a href="/02-kieu-du-lieu#kd-07" className="related-link">
                  Mapped Types
                </a>
                <a href="/03-oop#oop-07" className="related-link">
                  Generic Classes (OOP)
                </a>
              </div>
              <div>
                <div className="related-col-title">Học tiếp theo</div>
                <a href="/05-nang-cao" className="related-link">
                  TypeScript Nâng Cao
                </a>
                <a href="/05-nang-cao" className="related-link">
                  Decorators
                </a>
                <a href="/06-thuc-chien" className="related-link">
                  TypeScript + Frameworks
                </a>
              </div>
              <div>
                <div className="related-col-title">Cùng chủ đề</div>
                <a href="#gen-06" className="related-link">
                  infer & Extract
                </a>
                <a href="#gen-07" className="related-link">
                  Recursive Types
                </a>
                <a href="#gen-09" className="related-link">
                  Custom Utility Types
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ModuleFooter
        prev={{ to: '/03-oop', label: 'OOP & Classes' }}
        next={{ to: '/05-nang-cao', label: 'TypeScript Nâng Cao' }}
        moduleLabel="Module 04/06"
      />
    </div>
  );
}
