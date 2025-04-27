import {
  Card,
  CardContent,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Checkbox,
  FormGroup,
} from "@mui/material";
import { Typography } from "@mui/material";
import { useState, useEffect } from "react";

interface MultipleChoicePreviewProps {
  id: number;
  question: string;
  choices: { id: number; value: string }[];
  oneAnswerOnly?: boolean;
  onChange: (id: number, value: number[]) => void;
  currentAnswer: number[];
}

export default function MultipleChoicePreview({
  id,
  question,
  choices,
  oneAnswerOnly = false,
  onChange,
  currentAnswer,
}: MultipleChoicePreviewProps) {
  const [selectedChoices, setSelectedChoices] =
    useState<number[]>(currentAnswer);

  useEffect(() => {
    setSelectedChoices(currentAnswer || []); // Ensure it's always an array
  }, [currentAnswer]);

  useEffect(() => {
    onChange(id, selectedChoices);
  }, [id, selectedChoices, onChange]);

  // Two functions manage the appearance of buttons
  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedChoices([Number(event.target.value)]);
  };

  const handleCheckboxChange = (choiceId: number) => {
    setSelectedChoices((prev = []) => {
      if (prev.includes(choiceId)) {
        return prev.filter((id) => id !== choiceId);
      } else {
        return [...prev, choiceId];
      }
    });
  };

  return (
    <>
      <Card sx={{ mb: 2, borderRadius: 2 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            {question}
          </Typography>

          {oneAnswerOnly ? (
            <FormControl component="fieldset">
              <RadioGroup
                value={
                  selectedChoices?.length > 0 ? String(selectedChoices[0]) : ""
                }
                onChange={handleRadioChange}
              >
                {choices.map((choice) => (
                  <FormControlLabel
                    key={choice.id}
                    value={String(choice.id)}
                    control={<Radio />}
                    label={choice.value}
                  />
                ))}
              </RadioGroup>
            </FormControl>
          ) : (
            <FormGroup>
              {choices.map((choice) => (
                <FormControlLabel
                  key={choice.id}
                  control={
                    <Checkbox
                      checked={selectedChoices?.includes(choice.id)}
                      onChange={() => handleCheckboxChange(choice.id)}
                    />
                  }
                  label={choice.value}
                />
              ))}
            </FormGroup>
          )}
        </CardContent>
      </Card>
    </>
  );
}
