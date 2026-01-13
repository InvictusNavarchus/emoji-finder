/**
 * Notification/toast system for user feedback
 */

const NOTIFICATION_DURATION_MS = 1000

/**
 * Show a temporary notification to the user
 */
export function showNotification(message: string): void {
  const notification = document.createElement('div')
  notification.classList.add('alert')
  notification.textContent = message
  document.body.append(notification)

  setTimeout(() => notification.remove(), NOTIFICATION_DURATION_MS)
}

/**
 * Show a "copied" notification for an emoji
 */
export function showCopiedNotification(emoji: string): void {
  showNotification(`Copied ${emoji}`)
}
