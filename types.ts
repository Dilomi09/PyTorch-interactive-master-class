export interface UserState {
  xp: number;
  completedModules: string[];
  darkMode: boolean;
  currentModuleId: string | null;
}

export interface ModuleData {
  id: string;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedTime: string;
  content: string; // Markdown content
  initialCode: string;
  tags: string[];
}

export interface ExecutionResponse {
  stdout: string;
  error?: string;
  loss_history?: number[]; // For training curves
  model_structure?: ModelLayer[]; // For visualization
}

export interface ModelLayer {
  type: string; // e.g., "Linear", "Conv2d", "ReLU"
  params: string; // e.g., "in_features=10, out_features=5"
}

export enum VisualizationType {
  NONE = 'NONE',
  NETWORK = 'NETWORK',
  TRAINING = 'TRAINING',
}