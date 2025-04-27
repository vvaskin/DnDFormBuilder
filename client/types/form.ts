export interface ConditionRule {
  triggerChoiceId: number;  
  targetQuestionId: number; // The ID of the question component to jump to
}

// Types for Table Component Columns
export interface TableColumnChoice {
  id: number;
  value: string;
}

export interface TableColumn {
  id: number;
  headerTitle: string;
  columnType: 'textInput' | 'dropdown';
  choices?: TableColumnChoice[];
}

export interface FormComponentConfig {
    // All components
    id: number;
    type: string; // One of the three types of component
    question?: string;
  
    // Text input data
    minLength?: number;
    maxLength?: number;
  
    // Multiple choice data
    choices?: { id: number; value: string }[];
    oneAnswerOnly?: boolean;

    conditionalLogic?: ConditionRule[]; 

    // Table data
    columns?: TableColumn[];
}

export interface Form {
  id: number;
  title: string;
  components: FormComponentConfig[];
  created_at: string;
}