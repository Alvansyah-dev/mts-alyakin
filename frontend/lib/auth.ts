import { auth } from '@/lib/firebase';

/**
 * Returns the currently authenticated admin user information, or null if not signed in.
 * This helper abstracts Firebase Auth access for admin pages.
 */
export async function getAdminUser() {
  if (!auth) return null;
  const user = auth.currentUser;
  if (user) {
    return { uid: user.uid, email: user.email };
  }
  return null;
}
