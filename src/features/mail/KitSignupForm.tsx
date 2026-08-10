"use client";

import { useEffect, useRef, useState } from "react";

import styles from "./MailPage.module.css";

type KitSignupFormProps = Readonly<{
  formUid: string;
}>;

export function KitSignupForm({ formUid }: KitSignupFormProps) {
  const mountRef = useRef<HTMLDivElement>(null);
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
    };

    const observer = new MutationObserver(connectLabel);
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
