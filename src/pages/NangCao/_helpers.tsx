import { ReactNode } from 'react';

export function Sec({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="lesson-section">
      <div className="lesson-section-title">{title}</div>
      {children}
    </div>
  );
}

export function Concept({ children }: { children: ReactNode }) {
  return <div className="lesson-concept">{children}</div>;
}
