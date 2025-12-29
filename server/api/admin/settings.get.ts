import { requireAdminSession } from '../../utils/adminAuth';
import {
  isRegistrationOpen,
  getMinRatio,
  getStarterUpload,
} from '../../utils/settings';

/**
 * GET /api/admin/settings
 * Get tracker settings (admin only)
 */
export default defineEventHandler(async (event) => {
  await requireAdminSession(event);

  const registrationOpen = await isRegistrationOpen();
  const minRatio = await getMinRatio();
  const starterUpload = await getStarterUpload();

  return {
    registrationOpen,
    minRatio,
    starterUpload,
  };
});
