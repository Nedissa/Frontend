import type { ReactNode } from 'react';

type ServiceSectionProps = {
  id?: string;
  children: ReactNode;
  background?: string;
  /** false för sektioner som inte ska tvinga fullskärmshöjd på desktop. */
  fullHeight?: boolean;
};

/**
 * Delad shell för /tjanster-sektionerna — ersätter den upprepade
 * "py-[140px] px-[30px] min-h-screen box-border"-strängen som tidigare
 * kopierades in i varje sektionsfil för sig.
 */
export function ServiceSection({ id, children, background, fullHeight = true }: ServiceSectionProps) {
  return (
    <section
      id={id}
      className={`service-section-shell section-padding ${fullHeight ? 'section-full-desktop' : ''}`}
      style={background ? { background } : undefined}
    >
      <div className="max-w-[1440px] mx-auto">{children}</div>
    </section>
  );
}
