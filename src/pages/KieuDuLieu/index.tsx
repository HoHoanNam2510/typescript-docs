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

export default function KieuDuLieu() {
  const { done, toggle, count, pct } = useProgress('module_02', 10);
  const t = (id: string) => () => toggle(id);

  return (
    <div style={{ paddingTop: 'var(--nav-h)' }}>
      <PageHeader
        moduleNum="Module 02"
        title="Kiểu Dữ Liệu Nâng Cao"
        subtitle="Type aliases, interfaces, functions, và type manipulation"
        priority="high"
        time="~3–4 giờ"
        lessonCount={10}
        prevLink={{ to: '/01-co-ban', label: 'TypeScript Cơ Bản' }}
        nextLink={{ to: '/03-oop', label: 'OOP & Classes' }}
        prereqs={['Module 01 — TypeScript Cơ Bản', 'Hiểu Union & Intersection types']}
      />

      <TocBar count={count} total={10} pct={pct} links={TOC_LINKS} />

      <div className="section">
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <div style={GROUP_LABEL_STYLE}>Nhóm A — Định nghĩa kiểu dữ liệu</div>
          <Lesson01 isDone={done.has('l01')} onToggleDone={t('l01')} />
          <Lesson02 isDone={done.has('l02')} onToggleDone={t('l02')} />
          <Lesson03 isDone={done.has('l03')} onToggleDone={t('l03')} />
          <Lesson04 isDone={done.has('l04')} onToggleDone={t('l04')} />
          <Lesson05 isDone={done.has('l05')} onToggleDone={t('l05')} />

          <div style={{ ...GROUP_LABEL_STYLE, marginTop: '2.5rem' }}>
            Nhóm B — Thao tác & biến đổi kiểu dữ liệu
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
                <a href="/01-co-ban#cb-08" className="related-link">
                  Object types
                </a>
                <a href="/01-co-ban#cb-10" className="related-link">
                  Union & Intersection
                </a>
                <a href="/01-co-ban#cb-05" className="related-link">
                  unknown & never
                </a>
              </div>
              <div>
                <div className="related-col-title">Học tiếp theo</div>
                <a href="/03-oop" className="related-link">
                  Classes & OOP
                </a>
                <a href="/04-generics" className="related-link">
                  Generics
                </a>
                <a href="/04-generics" className="related-link">
                  Advanced Utility Types
                </a>
              </div>
              <div>
                <div className="related-col-title">Cùng chủ đề</div>
                <a href="#kd-02" className="related-link">
                  Interface vs Type
                </a>
                <a href="#kd-07" className="related-link">
                  Mapped Types
                </a>
                <a href="#kd-10" className="related-link">
                  Utility Types
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ModuleFooter
        prev={{ to: '/01-co-ban', label: 'TypeScript Cơ Bản' }}
        next={{ to: '/03-oop', label: 'OOP & Classes' }}
        moduleLabel="Module 02/06"
      />
    </div>
  );
}
