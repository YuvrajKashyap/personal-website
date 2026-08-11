"use client";

import { useEffect, useRef, useState } from "react";

import { MAIL_SENT_EVENT } from "@/features/mail/mail-events";

import styles from "./MailPage.module.css";

type KitSignupFormProps = Readonly<{
  formUid: string;
}>;

export function KitSignupForm({ formUid }: KitSignupFormProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const sentRef = useRef(false);
  const [loadFailed, setLoadFailed] = useState(false);

  useEffect(() => {
    const mount = mountRef.current;

    if (!mount) {
      return;
    }

    const connectLabel = () => {
      const input = mount.querySelector<HTMLInputElement>('input[name="email_address"]');

      if (!input) {
        return;
      }

      input.id = "yuv-got-mail-email";
      input.setAttribute("aria-describedby", "yuv-got-mail-email-note");
      input.setAttribute("autocomplete", "email");
      input.placeholder = "your@email.com";
    };

    const detectSuccess = () => {
      if (sentRef.current) {
        return;
      }

      const success = mount.querySelector(
        ".formkit-alert-success, .formkit-alert.formkit-alert-success",
      );

      if (!success) {
        return;
      }

      sentRef.current = true;
      const rect = mount.getBoundingClientRect();
      window.dispatchEvent(
        new CustomEvent(MAIL_SENT_EVENT, {
          detail: {
            x: rect.left + rect.width / 2,
            y: rect.top,
          },
        }),
      );
    };

    const observer = new MutationObserver(() => {
      connectLabel();
      detectSuccess();
    });
    observer.observe(mount, { childList: true, subtree: true });

    const script = document.createElement("script");
    script.async = true;
    script.dataset.uid = formUid;
    script.src = `https://yuv-got-mail.kit.com/${formUid}/index.js`;
    script.addEventListener("load", connectLabel);
    script.addEventListener("error", () => setLoadFailed(true));
    mount.appendChild(script);

    return () => {
      observer.disconnect();
      script.remove();
    };
  }, [formUid]);

  return (
    <div className={styles.signupArea}>
      <label className={styles.label} htmlFor="yuv-got-mail-email">
        Email address
      </label>
      <div ref={mountRef} className={styles.kitMount} aria-live="polite" />
      <p id="yuv-got-mail-email-note" className={styles.formNote}>
        One confirmation email, then you are in. Unsubscribe anytime.
      </p>
      {loadFailed ? (
        <p className={styles.error} role="alert">
          The signup form did not load. Try refreshing, or email
          {" "}
          <a href="mailto:mail@yuvrajkashyap.com">mail@yuvrajkashyap.com</a>.
        </p>
      ) : null}
    </div>
  );
}
