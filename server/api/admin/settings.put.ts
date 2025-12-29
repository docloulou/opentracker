import { requireAdminSession } from '../../utils/adminAuth';
import {
  setRegistrationOpen,
  setSetting,
  SETTINGS_KEYS,
} from '../../utils/settings';
import { validateBody, adminSettingsSchema } from '../../utils/schemas';

/**
 * PUT /api/admin/settings
 * Update tracker settings (admin only)
 */
export default defineEventHandler(async (event) => {
  await requireAdminSession(event);

  // Validate request body with Zod
  const body = await validateBody(event, adminSettingsSchema);

  if (typeof body.registrationOpen === 'boolean') {
    await setRegistrationOpen(body.registrationOpen);
  }

  if (typeof body.minRatio === 'number') {
    await setSetting(SETTINGS_KEYS.MIN_RATIO, body.minRatio.toString());
  }

  if (typeof body.starterUpload === 'number') {
    await setSetting(
      SETTINGS_KEYS.STARTER_UPLOAD,
      body.starterUpload.toString()
    );
  }

  return {
    success: true,
    registrationOpen: body.registrationOpen,
    minRatio: body.minRatio,
    starterUpload: body.starterUpload,
  };
});
