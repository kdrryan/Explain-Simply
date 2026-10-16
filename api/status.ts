export default function handler(_req: any, res: any) {
  const apiKey = process.env.GEMINI_API_KEY;
  const configured = Boolean(apiKey && apiKey.trim() !== '' && apiKey !== 'MY_GEMINI_API_KEY');

  res.setHeader('Content-Type', 'application/json');
  return res.status(200).json({
    configured,
    provider: 'Google Gemini',
    model: 'gemini-3.8-flash',
  });
}
