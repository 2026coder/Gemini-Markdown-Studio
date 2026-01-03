import { Injectable } from '@angular/core';
import { GoogleGenAI } from '@google/genai';

@Injectable({
  providedIn: 'root'
})
export class AiService {
  private ai: GoogleGenAI;

  constructor() {
    // Safely access process.env to prevent "ReferenceError: process is not defined" in browser
    let apiKey = '';
    try {
      if (typeof process !== 'undefined' && process.env) {
        apiKey = process.env['API_KEY'] || '';
      }
    } catch (e) {
      console.warn('Failed to read API_KEY from process.env');
    }
    
    this.ai = new GoogleGenAI({ apiKey });
  }

  async enhanceMarkdown(text: string, mode: 'grammar' | 'expand' | 'summarize'): Promise<string> {
    const model = 'gemini-2.5-flash';
    
    let prompt = '';
    
    switch (mode) {
      case 'grammar':
        prompt = `You are an expert editor. Fix the grammar, spelling, and punctuation of the following text. Do not change the meaning. Return ONLY the corrected Markdown text. Here is the text:\n\n${text}`;
        break;
      case 'expand':
        prompt = `You are a creative technical writer. Expand on the following text, adding more detail, examples, and professional formatting. Return ONLY the Markdown text. Here is the text:\n\n${text}`;
        break;
      case 'summarize':
        prompt = `You are a concise editor. Summarize the following text into a clean, bulleted Markdown list. Return ONLY the Markdown text. Here is the text:\n\n${text}`;
        break;
    }

    try {
      const response = await this.ai.models.generateContent({
        model: model,
        contents: prompt,
      });
      return response.text.trim();
    } catch (error) {
      console.error('Gemini API Error:', error);
      throw error;
    }
  }

  async generateFromTopic(topic: string): Promise<string> {
    const prompt = `Generate a comprehensive Markdown template for: "${topic}". Include headers, a table, and a sample code block. Return ONLY the Markdown text.`;
    
    try {
        const response = await this.ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text.trim();
    } catch (error) {
        console.error('Gemini API Error', error);
        throw error;
    }
  }
}