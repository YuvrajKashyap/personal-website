export const MAIL_OPENED_EVENT = "yuv-mail-opened";
export const MAIL_SENT_EVENT = "yuv-mail-sent";

export type MailSentDetail = Readonly<{
  /** Viewport coordinates the paper plane should launch from. */
  x: number;
  y: number;
}>;
