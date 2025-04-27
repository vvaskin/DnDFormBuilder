import { useState } from "react";
import { FormComponentConfig, ConditionRule } from "../../types/form";
import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Stack,
  Typography,
  SelectChangeEvent,
} from "@mui/material";

interface ConditionalProps {
  id: number; // The ID of the Multiple Choice Component
  config: FormComponentConfig;
  allComponents: FormComponentConfig[];
  rule: ConditionRule;
  ruleIndex: number;
  onConditionChange: (index: number, updatedRule: ConditionRule) => void;
  currentComponent: number;
}

export interface Condition {
  questionId: number;
  choiceId: number;
}

export default function Conditional({
  id,
  config,
  allComponents,
  rule,
  ruleIndex,
  onConditionChange,
  currentComponent,
}: ConditionalProps) {
  const [selectedChoiceId, setSelectedChoiceId] = useState<number | "">(
    rule.triggerChoiceId || ""
  );
  const [selectedQuestionId, setSelectedQuestionId] = useState<number | "">(
    rule.targetQuestionId || ""
  );

  const handleChoiceChange = (e: SelectChangeEvent<number>) => {
    const choiceId = e.target.value as number;
    setSelectedChoiceId(choiceId);
    onConditionChange(ruleIndex, {
      triggerChoiceId: choiceId,
      targetQuestionId: selectedQuestionId || 0,
    });
  };

  const handleQuestionChange = (e: SelectChangeEvent<number>) => {
    const questionId = e.target.value as number;
    setSelectedQuestionId(questionId);
    onConditionChange(ruleIndex, {
      triggerChoiceId: selectedChoiceId || 0,
      targetQuestionId: questionId,
    });
  };

  return (
    <>
      <FormControl fullWidth size="small">
        <Stack direction="row" spacing={2} sx={{ width: "100%" }}>
          <Typography variant="body2" sx={{ flex: 0.5, alignSelf: "center" }}>
            If user picks
          </Typography>
          {/* Choice Select */}
          <Select
            id={`choice-select-${ruleIndex}`}
            sx={{ flex: 1 }}
            value={selectedChoiceId}
            onChange={handleChoiceChange}
          >
            {(
              allComponents.find((component) => component.id == id)?.choices ||
              []
            )
              .filter((choice: { id: number; value: string }) =>
                choice.value?.trim()
              )
              .map((choice: { id: number; value: string }) => (
                <MenuItem key={choice.id} value={choice.id}>
                  {choice.value}
                </MenuItem>
              ))}
          </Select>
          {/* Question Select */}
          <Typography variant="body2" sx={{ flex: 0.5, alignSelf: "center" }}>
            then take them to
          </Typography>
          <Select
            id={`question-select-${ruleIndex}`}
            sx={{ flex: 1 }}
            value={selectedQuestionId}
            onChange={handleQuestionChange}
          >
            {allComponents.slice(currentComponent + 1).map((component) => (
              <MenuItem key={component.id} value={component.id}>
                {component.question}
              </MenuItem>
            ))}
          </Select>
        </Stack>
      </FormControl>
    </>
  );
}
