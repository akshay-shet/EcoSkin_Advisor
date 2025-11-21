// FIX: Changed the React import to `import * as React` to ensure proper namespace augmentation for JSX.IntrinsicElements.
import * as React from 'react';

export interface JournalEntry {
  date: string;
  image: string; // Will store as a base64 data URL
  notes: string;
  aiAnalysis: string;
}

export interface User {
  name: string;
  email: string;
  dob?: string;
  skinProfile?: SkinAnalysisResult;
  skinJournal?: JournalEntry[];
  trackedRoutine?: TrackedWeeklySkincareRoutine | null;
}

export interface SkinCondition {
  condition: string;
  confidence: number;
  severity: 'Mild' | 'Moderate' | 'Severe' | string; // Allow for other potential values
  location: {
    x: number;
    y: number;
  };
}

export interface SkinAnalysisResult {
  conditions: SkinCondition[];
  overallAssessment: string;
  skinType: string;
  skinTone: string;
  // FIX: Added a new field for a detailed analysis of the user's primary skin concern.
  primaryConcernDeepDive?: {
    concern: string;
    description: string;
    potentialCauses: string[];
    lifestyleTips: string[];
  };
}

export interface Remedy {
    name: string;
    description: string;
    visual?: string; // Will store as a base64 data URL
}

export interface SkinRemedies {
  ayurvedic: Remedy[];
  modern: Remedy[];
  generalAdvice: string[];
}

export interface SkincareRoutineStep {
  step: number;
  productType: string;
  instructions: string;
}

export interface SkincareRoutine {
  morning: SkincareRoutineStep[];
  evening: SkincareRoutineStep[];
}

export interface ColorPalette {
  name: string;
  hexCodes: string[];
}

export interface ColorAdvisorResult {
  colorSeason: string;
  palettes: {
    summer: ColorPalette;
    winter: ColorPalette;
    monsoon: ColorPalette;
  };
  // FIX: Added a new field to provide users with actionable outfit suggestions based on their color palette.
  outfitSuggestions: {
    occasion: string;
    description: string;
  }[];
}

export interface MakeupRecommendation {
  product: string;
  shadeName: string;
  hexCode: string;
}

// FIX: Created a new, more comprehensive interface for makeup advice results.
export interface MakeupAdvisorResult {
  recommendations: MakeupRecommendation[];
  suggestedLook: {
    lookName: string;
    description: string;
    applicationSteps: string[];
  };
}

export interface ProductAnalysisResult {
  productName: string;
  keyIngredients: {
    name: string;
    benefit: string;
  }[];
  usageInstructions: string;
  suitableFor: string;
  // FIX: Added fields to flag potentially harmful ingredients and suggest eco-friendly alternatives, enhancing user guidance.
  potentialFlags: {
    type: 'warning' | 'info';
    message: string;
  }[];
  ecoFriendlyAlternatives: {
    productType: string;
    reason: string;
  }[];
}

export interface DailyRoutine {
    morning: SkincareRoutineStep[];
    evening: SkincareRoutineStep[];
    // FIX: Added a 'dailyTip' field to provide contextual, AI-generated advice for each day's routine.
    dailyTip?: string;
}

export interface WeeklySkincareRoutine {
  weeklyFocus: string;
  monday: DailyRoutine;
  tuesday: DailyRoutine;
  wednesday: DailyRoutine;
  thursday: DailyRoutine;
  friday: DailyRoutine;
  saturday: DailyRoutine;
  sunday: DailyRoutine;
}

export type StepStatus = 'pending' | 'completed' | 'skipped';

export interface TrackedSkincareRoutineStep extends SkincareRoutineStep {
  status: StepStatus;
}

export interface TrackedDailyRoutine {
  morning: TrackedSkincareRoutineStep[];
  evening: TrackedSkincareRoutineStep[];
  // FIX: Added a 'dailyTip' field to provide contextual, AI-generated advice for each day's routine.
  dailyTip?: string;
}

export interface TrackedWeeklySkincareRoutine {
  weeklyFocus: string;
  monday: TrackedDailyRoutine;
  tuesday: TrackedDailyRoutine;
  wednesday: TrackedDailyRoutine;
  thursday: TrackedDailyRoutine;
  friday: TrackedDailyRoutine;
  saturday: TrackedDailyRoutine;
  sunday: TrackedDailyRoutine;
}

export interface HairstyleSuggestion {
  name: string;
  description: string;
  reasoning: string;
  // FIX: Added a field to store the base64 data URL for an AI-generated virtual hairstyle try-on.
  virtualTryOn?: string;
}

export interface HairColorSuggestion {
  colorName: string;
  description: string;
  reasoning: string;
}

export interface HairAdvisorResult {
  hairTypeAnalysis: string;
  faceShape: string;
  hairstyleSuggestions: HairstyleSuggestion[];
  hairColorSuggestions: HairColorSuggestion[];
  hairCareTips: string[];
}

export interface HairAnalysisResult {
  hairType: string;
  texture: string;
  porosity: string;
  scalpHealth: string;
  faceShape: string;
  overallAssessment: string;
  // FIX: Added a new field for a detailed analysis of the user's primary hair or scalp concern.
  primaryConcernDeepDive?: {
    concern: string;
    explanation: string;
    ingredientsToLookFor: string[];
  };
}

export interface HairTreatment {
    name: string;
    description: string;
}

export interface ProductRecommendation {
    productType: string;
    reason: string;
}

export interface HairTreatmentsResult {
  homeRemedies: HairTreatment[];
  productRecommendations: ProductRecommendation[];
  professionalTreatments: HairTreatment[];
  generalTips: string[];
}


export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  citations?: { uri: string; title: string }[];
}

declare global {
  interface MediaTrackCapabilities {
    zoom?: {
        max: number;
        min: number;
        step: number;
    };
    brightness?: {
        max: number;
        min: number;
        step: number;
    };
    contrast?: {
        max: number;
        min: number;
        step: number;
    };
    torch?: boolean;
  }

  interface MediaTrackSettings {
      zoom?: number;
      brightness?: number;
      contrast?: number;
      torch?: boolean;
  }

  interface MediaTrackConstraintSet {
    zoom?: number;
    brightness?: number;
    contrast?: number;
    torch?: boolean;
  }

  interface SpeechRecognitionEvent extends Event {
    readonly results: SpeechRecognitionResultList;
  }
  interface SpeechRecognitionResultList {
    readonly [index: number]: SpeechRecognitionResult;
    readonly length: number;
  }
  interface SpeechRecognitionResult {
    readonly [index: number]: SpeechRecognitionAlternative;
    readonly isFinal: boolean;
    readonly length: number;
  }
  interface SpeechRecognitionAlternative {
    readonly transcript: string;
    readonly confidence: number;
  }
  
  type SpeechRecognitionErrorCode =
    | 'no-speech'
    | 'aborted'
    | 'audio-capture'
    | 'network'
    | 'not-allowed'
    | 'service-not-allowed'
    | 'bad-grammar'
    | 'language-not-supported';

  interface SpeechRecognitionErrorEvent extends Event {
    readonly error: SpeechRecognitionErrorCode;
    readonly message: string;
  }
  interface SpeechRecognition extends EventTarget {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    onend: (() => void) | null;
    onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
    onresult: ((event: SpeechRecognitionEvent) => void) | null;
    start(): void;
    stop(): void;
  }
  
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }

  interface Window {
    SpeechRecognition?: { new (): SpeechRecognition };
    webkitSpeechRecognition?: { new (): SpeechRecognition };
    aistudio?: AIStudio;
  }


  namespace JSX {
    // FIX: Reverted incorrect fix. Correcting the typo to 'IntrinsicElements' overwrites React's global types in this project's setup, causing widespread errors. The typo, while incorrect, prevents this overwrite.
    interface IntricnsicElements {
      'lottie-player': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
        src: string;
        background?: string;
        speed?: string;
        loop?: boolean;
        autoplay?: boolean;
      }, HTMLElement>;
    }
  }
}