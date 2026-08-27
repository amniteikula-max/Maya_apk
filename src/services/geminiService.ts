import { GoogleGenAI } from '@google/genai';
import { PERSONAS } from '../data/featuresData';
import { PersonaConfig } from '../types';

export class GeminiService {
  private customApiKey: string = '';

  constructor() {
    if (typeof window !== 'undefined') {
      const storedKey = localStorage.getItem('maya_gemini_api_key') || '';
      this.customApiKey = storedKey;
    }
  }

  public setApiKey(key: string) {
    this.customApiKey = key.trim();
    if (typeof window !== 'undefined') {
      localStorage.setItem('maya_gemini_api_key', this.customApiKey);
    }
  }

  public getApiKey(): string {
    return this.customApiKey;
  }

  public hasApiKey(): boolean {
    return this.customApiKey.length > 0;
  }

  public async generateBengaliResponse(
    prompt: string,
    persona: PersonaConfig,
    history: { role: string; text: string }[] = []
  ): Promise<string> {
    const key = this.customApiKey || (typeof process !== 'undefined' ? (process.env as any)?.GEMINI_API_KEY : '') || '';

    if (!key) {
      // Intelligent offline Bengali fallback engine
      return this.generateOfflineBengaliReply(prompt, persona);
    }

    try {
      const ai = new GoogleGenAI({ apiKey: key });
      const systemInstruction = `${persona.systemPrompt}
You are operating inside Maya Ultra 6.0.8 HUD for Android.
The user is speaking in Bengali or English.
Always provide fluent, accurate, elegant, and concise Bengali (বাংলা) responses.
Keep responses direct, high-tech, and helpful without unnecessary fluff.
If the user asks to trigger a system hardware, social, vision, media, productivity or security task, confirm execution smoothly in Bengali.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          systemInstruction,
          temperature: 0.7,
        }
      });

      return response.text?.trim() || 'মায়া আল্ট্রা আপনার বার্তা গ্রহণ করেছে। কি আদেশ দেবেন?';
    } catch (error: any) {
      console.warn('Gemini API call failed, using intelligent fallback:', error);
      return this.generateOfflineBengaliReply(prompt, persona);
    }
  }

  private generateOfflineBengaliReply(prompt: string, persona: PersonaConfig): string {
    const p = prompt.toLowerCase();

    if (p.includes('কেমন আছো') || p.includes('kemon acho') || p.includes('how are you')) {
      if (persona.id === 'friday') return 'ট্যাকটিক্যাল কোর ১০০% কার্যকরী স্যার। সমস্ত সিকিউরিটি সিস্টেম অনলাইন।';
      if (persona.id === 'venom') return 'আমরা সম্পূর্ণ শক্তিশালী ও সতর্ক! সব ডিফেন্স প্রোটোকল একটিভ।';
      return 'নমস্কার! আমি অত্যন্ত চমৎকারভাবে সক্রিয় আছি। আপনার অ্যান্ড্রয়েড সিস্টেমের সমস্ত ৮৫টি ফিচার পরিচালনা করতে আমি প্রস্তুত।';
    }

    if (p.includes('নাম কি') || p.includes('who are you') || p.includes('tumi ke')) {
      return `আমি ${persona.nameBn} (${persona.title})। আপনার সর্বাধুনিক অ্যান্ড্রয়েড পার্সোনাল অ্যাসিস্ট্যান্ট।`;
    }

    if (p.includes('ব্রাইটনেস') || p.includes('brightness') || p.includes('আলো')) {
      return 'স্ক্রিনের উজ্জ্বলতা সমন্বয় করা হয়েছে।';
    }

    if (p.includes('ভলিউম') || p.includes('volume') || p.includes('শব্দ')) {
      return 'মিডিয়া ভলিউম সমন্বয় করা হয়েছে।';
    }

    if (p.includes('ওয়াইফাই') || p.includes('wifi')) {
      return 'ওয়াইফাই নেটওয়ার্ক ইন্টারফেস টগল করা হয়েছে।';
    }

    if (p.includes('ফ্ল্যাশলাইট') || p.includes('টর্চ') || p.includes('flashlight')) {
      return 'টর্চলাইট ফ্ল্যাশ সক্রিয় করা হয়েছে।';
    }

    if (p.includes('র‍্যাম') || p.includes('ram') || p.includes('boost') || p.includes('মেমোরি')) {
      return 'র‌্যাম অপ্টিমাইজেশন সম্পন্ন হয়েছে! অপ্রয়োজনীয় ব্যাকগ্রাউন্ড প্রসেস বন্ধ করে মেমোরি খালি করা হয়েছে।';
    }

    if (p.includes('হোয়াটসঅ্যাপ') || p.includes('whatsapp') || p.includes('মেসেজ')) {
      return 'হোয়াটসঅ্যাপ অটো-মেসেজ ইন্টারফেস প্রস্তুত।';
    }

    if (p.includes('ক্যামেরা') || p.includes('স্ক্যান') || p.includes('ocr') || p.includes('vision')) {
      return 'ক্যামেরা ভিশন ও ওসিআর স্ক্যানার সক্রিয় করা হয়েছে।';
    }

    if (p.includes('sos') || p.includes('বাঁচাও') || p.includes('emergency') || p.includes('জরুরি')) {
      return 'জরুরি এসওএস অ্যালার্ম ও লাইভ জিপিএস লোকেশন সম্প্রচার সক্রিয় করা হয়েছে!';
    }

    if (p.includes('গান') || p.includes('music') || p.includes('play')) {
      return 'মিউজিক প্লেয়ার চালু করা হয়েছে।';
    }

    // Default polite Bengali response
    return `আমি আপনার নির্দেশ পেয়েছি: "${prompt}"। মায়া আল্ট্রা এটি অবিলম্বে সম্পন্ন করছে। আর কোনো বিষয়ে সাহায্য প্রয়োজন?`;
  }
}

export const geminiService = new GeminiService();
