import { GoogleGenAI, Modality, Type } from "@google/genai";

// Helper to decode base64 audio string
const decodeAudioData = async (
  base64String: string,
  audioContext: AudioContext
): Promise<AudioBuffer> => {
  const binaryString = atob(base64String);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return await audioContext.decodeAudioData(bytes.buffer);
};

export class GeminiService {
  private ai: GoogleGenAI;
  private audioContext: AudioContext | null = null;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  private getAudioContext() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({
        sampleRate: 24000,
      });
    }
    return this.audioContext;
  }

  /**
   * Refines the agent prompt using a sophisticated text model.
   */
  async refinePrompt(currentPrompt: string): Promise<string> {
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `You are an expert AI agent architect. 
        Rewrite the following agent system prompt to be more professional, concise, and instruction-following. 
        Keep the core intent but improve clarity.
        
        Original Prompt:
        "${currentPrompt}"
        
        Return ONLY the refined prompt text, no explanations.`,
      });
      return response.text || currentPrompt;
    } catch (error) {
      console.error("Error refining prompt:", error);
      throw error;
    }
  }

  /**
   * Modifies an existing prompt based on specific user instructions.
   */
  async modifyPrompt(currentPrompt: string, instructions: string): Promise<string> {
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `You are an expert AI agent architect. 
        I have an existing AI agent system prompt. I want you to modify it based on my instructions.
        
        Current System Prompt:
        "${currentPrompt}"
        
        My Instructions for changes:
        "${instructions}"
        
        Please rewrite the system prompt to incorporate these changes while maintaining the original structure where appropriate.
        Return ONLY the new system prompt text. Do not include markdown formatting or explanations.`,
      });
      return response.text || currentPrompt;
    } catch (error) {
      console.error("Error modifying prompt:", error);
      throw error;
    }
  }

  /**
   * Generates speech (TTS) for the agent's welcome message.
   */
  async previewVoice(text: string, voiceName: string = 'Kore'): Promise<void> {
    try {
      const response = await this.ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: text }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: voiceName },
            },
          },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (!base64Audio) {
        throw new Error("No audio data received from Gemini.");
      }

      const ctx = this.getAudioContext();
      if (ctx.state === 'suspended') {
        await ctx.resume();
      }

      const audioBuffer = await decodeAudioData(base64Audio, ctx);
      const source = ctx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(ctx.destination);
      source.start();

    } catch (error) {
      console.error("Error generating voice preview:", error);
      alert("Failed to generate voice preview. Check API Key and console.");
    }
  }

  /**
   * Chat simulation with the agent.
   */
  async chatWithAgent(systemInstruction: string, history: {role: 'user' | 'model', text: string}[], message: string): Promise<string> {
    try {
      const chat = this.ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
          systemInstruction: systemInstruction,
        },
        history: history.map(h => ({
            role: h.role,
            parts: [{ text: h.text }]
        }))
      });

      const result = await chat.sendMessage({ message: message });
      return result.text || "";
    } catch (error) {
      console.error("Chat error:", error);
      return "I'm having trouble connecting right now.";
    }
  }

  /**
   * Auto-builds an agent based on user inputs.
   */
  async autoBuildAgent(inputs: {
    name: string;
    languages: string[];
    objective: string;
    nextSteps: string;
    context: string;
    transcript: string;
  }): Promise<{ name: string; prompt: string; welcomeMessage: string }> {
    try {
        const promptText = `
        You are an expert AI Voice Agent Builder. Create a comprehensive system prompt and a welcome message for a telephone AI agent based on the following requirements:
        
        Agent Name: ${inputs.name}
        Languages: ${inputs.languages.join(", ")}
        Call Objective: ${inputs.objective}
        Ideal Next Steps: ${inputs.nextSteps}
        Additional Context/FAQs: ${inputs.context}
        Sample Transcript: ${inputs.transcript}

        The system prompt should be detailed, instructing the AI on its persona, tone, constraints, and how to handle the specific objectives and next steps. 
        The welcome message should be natural and inviting, suitable for a voice call.
        `;

        const response = await this.ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: promptText,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        name: { type: Type.STRING, description: "The final name of the agent" },
                        prompt: { type: Type.STRING, description: "The detailed system prompt for the agent" },
                        welcomeMessage: { type: Type.STRING, description: "The opening sentence the agent says when the call connects" }
                    },
                    required: ["name", "prompt", "welcomeMessage"]
                }
            }
        });
        
        const text = response.text;
        if (!text) throw new Error("No response from Gemini");
        return JSON.parse(text);
    } catch (error) {
        console.error("Auto build agent error:", error);
        throw error;
    }
  }
}

export const geminiService = new GeminiService();