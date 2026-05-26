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

export default function Coban() {
  const { done, toggle, count, pct } = useProgress('module_01', 10);
  const t = (id: string) => () => toggle(id);

  return (
    <div style={{ paddingTop: 'var(--nav-h)' }}>
      <PageHeader
        moduleNum="Module 01"
        title="TypeScript Cơ Bản"
        subtitle="Nắm vững nền tảng — từ đây mọi thứ trở nên rõ ràng"
        priority="high"
        time="~3–4 giờ"
        lessonCount={10}
        prevLink={{ to: '/', label: 'Trang chủ' }}
        nextLink={{ to: '/02-kieu-du-lieu', label: 'Kiểu Dữ Liệu' }}
        prereqs={['JavaScript cơ bản (ES6+)', 'Node.js cài sẵn']}
      />

      <TocBar count={count} total={10} pct={pct} links={TOC_LINKS} />

      <div className="section">
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <div style={GROUP_LABEL_STYLE}>Nhóm A — Kiểu dữ liệu cơ bản</div>
          <Lesson01 isDone={done.has('l01')} onToggleDone={t('l01')} />
          <Lesson02 isDone={done.has('l02')} onToggleDone={t('l02')} />
          <Lesson03 isDone={done.has('l03')} onToggleDone={t('l03')} />
          <Lesson04 isDone={done.has('l04')} onToggleDone={t('l04')} />
          <Lesson05 isDone={done.has('l05')} onToggleDone={t('l05')} />

          <div style={{ ...GROUP_LABEL_STYLE, marginTop: '2.5rem' }}>
            Nhóm B — Cấu trúc dữ liệu & kiểu nâng cao
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
                <a href="#cb-01" className="related-link">
                  Tại sao dùng TypeScript
                </a>
                <a href="#cb-03" className="related-link">
                  Primitive types
                </a>
                <a href="#cb-10" className="related-link">
                  Union types
                </a>
              </div>
              <div>
                <div className="related-col-title">Học tiếp theo</div>
                <a href="/02-kieu-du-lieu" className="related-link">
                  Type aliases & interfaces
                </a>
                <a href="/02-kieu-du-lieu" className="related-link">
                  Function types
                </a>
                <a href="/02-kieu-du-lieu" className="related-link">
                  Type casting
                </a>
              </div>
              <div>
                <div className="related-col-title">Cùng chủ đề</div>
                <a href="#cb-05" className="related-link">
                  unknown vs any
                </a>
                <a href="#cb-09" className="related-link">
                  Enums vs union types
                </a>
                <a href="#cb-10" className="related-link">
                  Discriminated unions
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ModuleFooter
        prev={{ to: '/', label: 'Trang chủ' }}
        next={{ to: '/02-kieu-du-lieu', label: 'Kiểu Dữ Liệu Nâng Cao' }}
        moduleLabel="Module 01/06"
      />
    </div>
  );
}
