import { Component, signal, computed, effect, inject, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AiService } from './services/ai.service';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

// Declare globals loaded via CDN
declare const marked: any;
declare const DOMPurify: any;

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styles: []
})
export class AppComponent {
  private aiService = inject(AiService);
  private sanitizer = inject(DomSanitizer);

  @ViewChild('editorTextarea') editorTextarea!: ElementRef<HTMLTextAreaElement>;

  // State
  rawMarkdown = signal<string>(`# Welcome to Markdown Studio

This is a **live preview** editor powered by Angular and Gemini.

## Features
- Real-time preview
- AI-powered enhancement
- Syntax highlighting style

## Try it out
1. Type some text on the left
2. Click the **AI Assist** button to polish it
3. Enjoy the magic!

\`\`\`javascript
const greet = () => {
  console.log("Hello, World!");
};
\`\`\`

> "Simplicity is the ultimate sophistication." - Leonardo da Vinci
`);
  
  isProcessing = signal<boolean>(false);
  aiMode = signal<'grammar' | 'expand' | 'summarize' | null>(null);
  showAiMenu = signal<boolean>(false);
  
  // Mobile UI State
  activeMobileTab = signal<'editor' | 'preview'>('editor');

  // Computed
  sanitizedHtml = computed(() => {
    const raw = this.rawMarkdown();
    const parsed = marked.parse(raw);
    const clean = DOMPurify.sanitize(parsed);
    return this.sanitizer.bypassSecurityTrustHtml(clean);
  });

  // Actions
  updateMarkdown(event: Event) {
    const input = event.target as HTMLTextAreaElement;
    this.rawMarkdown.set(input.value);
  }

  insertSyntax(syntax: string) {
    const textarea = this.editorTextarea.nativeElement;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = this.rawMarkdown();
    const selection = text.substring(start, end);

    let insertion = '';
    let newCursorPos = end;

    switch (syntax) {
      case 'bold':
        insertion = `**${selection || 'bold text'}**`;
        newCursorPos = end + 2 + (selection ? 0 : 9); // Adjust cursor if no selection
        break;
      case 'italic':
        insertion = `*${selection || 'italic text'}*`;
        newCursorPos = end + 1 + (selection ? 0 : 11);
        break;
      case 'h1':
        insertion = `# ${selection || 'Heading 1'}`;
        break;
      case 'h2':
        insertion = `## ${selection || 'Heading 2'}`;
        break;
      case 'code':
        insertion = `\`${selection || 'code'}\``;
        break;
      case 'codeblock':
        insertion = `\n\`\`\`\n${selection || 'code block'}\n\`\`\`\n`;
        break;
      case 'link':
        insertion = `[${selection || 'Link Text'}](url)`;
        break;
      case 'list':
        insertion = `\n- ${selection || 'List item'}`;
        break;
    }

    const newText = text.substring(0, start) + insertion + text.substring(end);
    this.rawMarkdown.set(newText);
    
    // Defer focus to allow UI update
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + insertion.length, start + insertion.length);
    }, 0);
  }

  toggleAiMenu() {
    this.showAiMenu.update(v => !v);
  }

  setActiveMobileTab(tab: 'editor' | 'preview') {
    this.activeMobileTab.set(tab);
  }

  async runAiEnhancement(mode: 'grammar' | 'expand' | 'summarize') {
    this.showAiMenu.set(false);
    this.isProcessing.set(true);
    
    try {
      const currentText = this.rawMarkdown();
      if (!currentText.trim()) return;

      const enhancedText = await this.aiService.enhanceMarkdown(currentText, mode);
      this.rawMarkdown.set(enhancedText);
      
      // On mobile, switch to preview after enhancement to show results
      if (window.innerWidth < 768) {
        this.activeMobileTab.set('preview');
      }
    } catch (err) {
      alert('Failed to process with AI. Please check your API key and quota.');
    } finally {
      this.isProcessing.set(false);
    }
  }

  async generateTemplate() {
     this.showAiMenu.set(false);
     const topic = prompt("Enter a topic for the Markdown template (e.g., 'Project README'):");
     if (!topic) return;

     this.isProcessing.set(true);
     try {
         const generated = await this.aiService.generateFromTopic(topic);
         this.rawMarkdown.set(generated);
         // Switch to preview to show the result
         if (window.innerWidth < 768) {
            this.activeMobileTab.set('preview');
         }
     } catch (e) {
         alert("Generation failed.");
     } finally {
         this.isProcessing.set(false);
     }
  }
}