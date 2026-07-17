/**
 * Cross-component contact events. Lives in its own module so components that
 * only dispatch the event (the copy button) don't pull the whole canvas
 * hologram into their chunk.
 */
export const CONTACT_COPY_EVENT = "contact-email-copied";
