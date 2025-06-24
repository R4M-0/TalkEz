export const translateText = async (text: string, from: string, to: string): Promise<string> => {
  try {
    const response = await fetch('http://127.0.0.1:8000/translate', { 
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        source: from,
        target: to,
      }),
    });

    if (!response.ok) {
      throw new Error(`Translation service error: ${response.status}`);
    }

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error);
    }

    return data.translatedText || text;
  } catch (error) {
    console.error('Translation error:', error);
    throw new Error('Translation service is currently unavailable. Please try again later.');
  }
};
