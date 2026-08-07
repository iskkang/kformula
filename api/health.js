'use strict';

module.exports = function health(_request, response) {
  response.setHeader('Cache-Control', 'no-store');
  response.status(200).json({
    ok: true,
    service: 'varda-quick-scan',
    configured: Boolean(
      process.env.OPENAI_API_KEY
      && process.env.SUPABASE_URL
      && (process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY)
    )
  });
};
