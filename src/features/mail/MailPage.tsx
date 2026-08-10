import { PageBackdrop } from "@/components/layout/PageBackdrop";
import { Reveal } from "@/components/motion/Reveal";
import { KitSignupForm } from "@/features/mail/KitSignupForm";
import { mailPageContent } from "@/features/mail/mail-content";

import styles from "./MailPage.module.css";

type MailPageProps = Readonly<{
  confirmed?: boolean;
}>;

export function MailPage({ confirmed = false }: MailPageProps) {
  return (
    <main className={`internal-page ${styles.page}`}>
      <PageBackdrop />
      <section className={`site-container-wide ${styles.hero}`}>
        <Reveal className={styles.intro}>
          <p className="text-kicker">A letter from Yuvraj</p>
          <h1 className={`text-page-title text-balance ${styles.title}`}>
            {mailPageContent.title}
          </h1>
          <p className={`text-body-large text-pretty ${styles.tagline}`}>
            {mailPageContent.tagline}
          </p>
          <p className={`text-body text-pretty ${styles.description}`}>
            {mailPageContent.description}
          </p>
        </Reveal>

        <Reveal className={styles.letter} delay={0.1} variant="scale-soft">
          {confirmed ? (
            <div className={styles.confirmed} role="status">
              <p className={styles.confirmedTitle}>You&apos;re in.</p>
              <p>Welcome to Yuv Got Mail. The first letter will find you soon.</p>
            </div>
          ) : (
            <>
              <div className={styles.letterHeading}>
                <p className={styles.letterLabel}>YUV GOT MAIL</p>
                <p className={styles.issueMark}>Weekly, roughly</p>
              </div>
              <h2 className={styles.letterTitle}>Come along for the rabbit holes.</h2>
              <KitSignupForm formUid={mailPageContent.formUid} />
            </>
          )}
        </Reveal>
      </section>

      <section className={`site-container-wide ${styles.notes}`} aria-label="What to expect">
        <Reveal className={styles.note}>
          <h2>What shows up</h2>
          <p>{mailPageContent.relationshipNote}</p>
        </Reveal>
        <Reveal className={styles.note} delay={0.06}>
          <h2>When it shows up</h2>
          <p>{mailPageContent.scheduleNote}</p>
        </Reveal>
        <Reveal className={styles.note} delay={0.12}>
          <h2>The fine print</h2>
          <p>{mailPageContent.privacyNote}</p>
        </Reveal>
      </section>
    </main>
  );
}
