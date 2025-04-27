import {
  Stack,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Box,
} from "@mui/material";
import FormComponentWrapper from "./FormComponentWrapper";
import { FormComponentConfig, ConditionRule } from "../../types/form";
import { useState } from "react";
import Conditional, { Condition } from "./Conditional";

interface MultipleChoiceProps {
  id: number;
  config: FormComponentConfig;
  onConfigChange: (id: number, config: Partial<FormComponentConfig>) => void;
  onDelete: () => void;
  allComponents: FormComponentConfig[];
  index: number;
}

export default function MultipleChoice({
  id,
  config,
  onConfigChange,
  onDelete,
  allComponents,
  index,
}: MultipleChoiceProps) {
  // Avoid errors if choices is undefined - set it to an empty array
  const choices = config.choices || [];
  const conditions = config.conditionalLogic || [];

  const handleAddChoice = () => {
    const newChoice = { id: Date.now(), value: "" };
    onConfigChange(id, { choices: [...choices, newChoice] });
  };

  // Handler for deleting the last choice
  const handleDeleteLastChoice = () => {
    if (choices.length > 0) {
      onConfigChange(id, { choices: choices.slice(0, -1) });
    }
  };

  // Handler for changing a choice's value
  const handleChoiceValueChange = (choiceId: number, newValue: string) => {
    const updatedChoices = choices.map((choice) =>
      choice.id === choiceId ? { ...choice, value: newValue } : choice
    );
    onConfigChange(id, { choices: updatedChoices });
  };

  // Handler for the "one answer only" checkbox
  const handleOneAnswerOnlyChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    onConfigChange(id, { oneAnswerOnly: event.target.checked });
    onConfigChange(id, { conditionalLogic: [] });
  };

  const handleAddCondition = () => {
    const newCondition = { triggerChoiceId: 0, targetQuestionId: 0 };
    onConfigChange(id, { conditionalLogic: [...conditions, newCondition] });
  };

  const handleDeleteCondition = () => {
    if (conditions.length > 0) {
      onConfigChange(id, { conditionalLogic: conditions.slice(0, -1) });
    }
  };

  const handleConditionRuleChange = (
    index: number,
    updatedRule: ConditionRule
  ) => {
    const updatedConditions = [...conditions];
    updatedConditions[index] = updatedRule;
    onConfigChange(id, { conditionalLogic: updatedConditions });
  };

  const canAddCondition = () => {
    const validChoices = choices.filter((choice) => choice.value?.trim());
    const numberOfValidChoices = validChoices.length;

    const numberOfTargetQuestions = allComponents.length - 1;

    return (
      numberOfValidChoices > 0 && // Need at least one valid choice to trigger from
      numberOfTargetQuestions > 0 &&
      conditions.length <
        Math.min(numberOfValidChoices, numberOfTargetQuestions)
    );
  };

  return (
    <FormComponentWrapper
      title="Multiple Choice"
      onDelete={onDelete}
      config={config}
      onConfigChange={onConfigChange}
      index={index}
    >
      <Stack direction="row" spacing={2} sx={{ width: "100%" }}>
        <Button
          variant="outlined"
          size="small"
          onClick={handleAddChoice}
          sx={{ flexGrow: 1.15 }}
        >
          Add Choice
        </Button>

        {choices.length > 0 && (
          <Button
            variant="outlined"
            size="small"
            onClick={handleDeleteLastChoice}
            sx={{ flexGrow: 1 }}
          >
            Delete Last Choice
          </Button>
        )}
      </Stack>
      <Stack spacing={1} sx={{ mt: 2 }}>
        {choices.map((choice, index) => (
          <TextField
            required
            key={choice.id}
            label={`Choice ${index + 1}`}
            value={choice.value}
            onChange={(e) => handleChoiceValueChange(choice.id, e.target.value)}
            size="small"
            error={!choice.value?.trim()}
          />
        ))}
        {choices.length > 0 && (
          <FormControlLabel
            control={
              <Checkbox
                checked={config.oneAnswerOnly || false}
                onChange={handleOneAnswerOnlyChange}
              />
            }
            label="One answer only"
          />
        )}
      </Stack>

      {/* Conditionally render the Buttons Stack */}
      {config.oneAnswerOnly && (canAddCondition() || conditions.length > 0) && (
        <Stack direction="row" spacing={2} sx={{ width: "100%", mt: 2 }}>
          {canAddCondition() && (
            <Button
              variant="outlined"
              size="small"
              onClick={handleAddCondition}
              sx={{ flexGrow: 1 }}
            >
              Add Conditional Logic
            </Button>
          )}
          {conditions.length > 0 && (
            <Button
              variant="outlined"
              size="small"
              sx={{ flexGrow: 1 }}
              onClick={handleDeleteCondition}
            >
              Delete Conditional Logic
            </Button>
          )}
        </Stack>
      )}

      {config.oneAnswerOnly && conditions.length > 0 && (
        <Stack direction="column" spacing={2} sx={{ mt: 2, width: "100%" }}>
          {conditions.map((rule, ruleIndex) => (
            <Conditional
              key={ruleIndex}
              id={id}
              config={config}
              allComponents={allComponents}
              rule={rule}
              ruleIndex={ruleIndex}
              onConditionChange={handleConditionRuleChange}
              currentComponent={index}
            />
          ))}
        </Stack>
      )}
    </FormComponentWrapper>
  );
}
