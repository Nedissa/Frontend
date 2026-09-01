import type { ReactNode } from 'react';

type ServiceSectionProps = {
  id?: string;
  children: ReactNode;
  background?: string;
  /** false för sektioner som inte ska tvinga fullskärmshöjd på desktop. */
  fullHeight?: boolean;
};

/**
 * Delad shell för /digital-sektionerna — ersätter den upprepade
 * "py-[140px] px-[30px] min-h-screen box-border"-strängen som tidigare
 * kopierades in i varje sektionsfil för sig.
 */
export function ServiceSection({ id, children, background, fullHeight = true }: ServiceSectionProps) {
  return (
    <section
      className={`service-section-shell section-padding ${fullHeight ? 'section-full-desktop' : ''}`}
      style={background ? { background } : undefined}
    >
      {/* id sitter på den inre wrappern (inte <section>) så att scrollToAnchorId i SiteNav
          landar precis vid innehållets faktiska start, utan att behöva kompensera för
          sektionens egen padding-top (140px). */}
      <div id={id} className="max-w-[1440px] mx-auto">{children}</div>
    </section>
  );
}
