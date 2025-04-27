import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Form, FormComponentConfig } from "../../types/form";
import { Typography, Button, Box, Stack } from "@mui/material";
import MultipleChoicePreview from "./MultipleChoicePreview";
import TextInputPreview from "./TextInputPreview";
import TablePreview from "./TablePreview";

export type TableRowAnswers = {
  [columnId: number]: string | number;
};

interface FormResponse {
  [componentId: number]: string | number[] | TableRowAnswers[];
}

export default function FormPreview() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form, setForm] = useState<Form>();
  const [currentComponent, setCurrentComponent] = useState(0);
  const [currentAnswers, setCurrentAnswers] = useState<FormResponse>({});
  const [navigationHistory, setNavigationHistory] = useState<number[]>([0]);

  useEffect(() => {
    const fetchForm = async () => {
      const response = await fetch(`http://localhost:3000/forms/${id}`);
      const data = await response.json();
      setForm(data);
    };
    fetchForm();
  }, [id]);

  const handleAllowNext = () => {
    const component = form?.components[currentComponent];
    if (!component) return false;

    const answer = currentAnswers[component.id];

    if (component.type === "textInput") {
      return answer && answer !== "";
    } else if (component.type === "multipleChoice") {
      return Array.isArray(answer) && answer.length > 0;
    } else if (component.type === "table") {
      return (
        Array.isArray(answer) &&
        answer.length > 0 &&
        answer.every((row) => {
          const values = Object.values(row);
          return (
            values.length > 0 &&
            values.every((value) => typeof value !== "string" || value !== "")
          );
        })
      );
    }
    return true;
  };

  const handleNext = () => {
    if (!form) return;

    const allComponents = form.components;
    const currentComponentConfig = allComponents[currentComponent];
    let nextComponentIndex = currentComponent + 1;
    let isConditionalNavigation = false;

    if (
      currentComponentConfig.type === "multipleChoice" &&
      currentComponentConfig.oneAnswerOnly &&
      currentComponentConfig.conditionalLogic &&
      currentComponentConfig.conditionalLogic.length > 0
    ) {
      const answerArray = currentAnswers[currentComponentConfig.id] as number[];
      if (Array.isArray(answerArray) && answerArray.length === 1) {
        const selectedChoiceId = answerArray[0];
        const matchingRule = currentComponentConfig.conditionalLogic.find(
          (rule) => rule.triggerChoiceId === selectedChoiceId
        );

        if (matchingRule && matchingRule.targetQuestionId) {
          const targetIndex = allComponents.findIndex(
            (comp) => comp.id === matchingRule.targetQuestionId
          );
          if (targetIndex !== -1) {
            nextComponentIndex = targetIndex;
            isConditionalNavigation = true;
          } else {
            nextComponentIndex = allComponents.length;
            isConditionalNavigation = true;
          }
        }
      }
    }

    let finalNavigationIndex = -1;

    if (nextComponentIndex >= allComponents.length) {
      finalNavigationIndex = -1;
    } else if (isConditionalNavigation) {
      finalNavigationIndex = nextComponentIndex;
    } else {
      for (let i = nextComponentIndex; i < allComponents.length; i++) {
        const candidateComponent = allComponents[i];
        if (!isConditionalTarget(candidateComponent.id, allComponents)) {
          finalNavigationIndex = i;
          break;
        }
      }
    }

    if (
      finalNavigationIndex !== -1 &&
      finalNavigationIndex < allComponents.length
    ) {
      setNavigationHistory((prevHistory) => [
        ...prevHistory,
        finalNavigationIndex,
      ]);
      setCurrentComponent(finalNavigationIndex);
    }
  };

  const handlePrevious = () => {
    if (navigationHistory.length > 1) {
      const newHistory = navigationHistory.slice(0, -1);
      const previousIndex = newHistory[newHistory.length - 1];
      setNavigationHistory(newHistory);
      setCurrentComponent(previousIndex);
    }
  };

  const handleSubmit = async () => {
    if (form) {
      const response = await fetch(
        `http://localhost:3000/forms/${id}/responses`,
        {
          method: "POST",
          body: JSON.stringify({ answers: currentAnswers }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to save form response");
      }
      const data = await response.json();
      console.log("Form response saved successfully:", data);
      navigate("/");
    }
  };

  const handleTextInputChange = useCallback(
    (componentId: number, value: string) => {
      setCurrentAnswers((prev) => ({
        ...prev,
        [componentId]: value,
      }));
    },
    []
  );

  const handleMultipleChoiceChange = useCallback(
    (componentId: number, value: number[]) => {
      setCurrentAnswers((prev) => ({
        ...prev,
        [componentId]: value,
      }));
    },
    []
  );

  const handleTableChange = useCallback(
    (componentId: number, value: TableRowAnswers[]) => {
      setCurrentAnswers((prev) => ({
        ...prev,
        [componentId]: value,
      }));
    },
    []
  );

  // Helper function to check if a component ID is a target of any rule in the form
  const isConditionalTarget = (
    targetId: number,
    allComponents: FormComponentConfig[]
  ): boolean => {
    for (const component of allComponents) {
      if (component.conditionalLogic) {
        for (const rule of component.conditionalLogic) {
          if (rule.targetQuestionId === targetId) {
            return true; // Found a rule targeting this ID
          }
        }
      }
    }
    return false; // No rule targets this ID
  };

  let hasNextValidComponent = false;
  if (form) {
    const allComponents = form.components;
    const currentComponentConfig = allComponents[currentComponent];
    let potentialNextIndex = currentComponent + 1;
    let isConditionalNavigation = false;

    if (
      currentComponentConfig.type === "multipleChoice" &&
      currentComponentConfig.oneAnswerOnly &&
      currentComponentConfig.conditionalLogic &&
      currentComponentConfig.conditionalLogic.length > 0
    ) {
      const answerArray = currentAnswers[currentComponentConfig.id] as number[];
      if (Array.isArray(answerArray) && answerArray.length === 1) {
        const selectedChoiceId = answerArray[0];
        const matchingRule = currentComponentConfig.conditionalLogic.find(
          (rule) => rule.triggerChoiceId === selectedChoiceId
        );

        if (matchingRule && matchingRule.targetQuestionId) {
          const targetIndex = allComponents.findIndex(
            (comp) => comp.id === matchingRule.targetQuestionId
          );
          if (targetIndex !== -1) {
            potentialNextIndex = targetIndex;
            isConditionalNavigation = true;
          } else {
            potentialNextIndex = allComponents.length; // Set index out of bounds
            isConditionalNavigation = true; // Still "determined" by a rule
          }
        }
      }
    }

    if (potentialNextIndex >= allComponents.length) {
      hasNextValidComponent = false;
    } else if (isConditionalNavigation) {
      hasNextValidComponent = true;
    } else {
      let foundNextSequential = false;
      for (let i = potentialNextIndex; i < allComponents.length; i++) {
        const candidateComponent = allComponents[i];
        if (!isConditionalTarget(candidateComponent.id, allComponents)) {
          hasNextValidComponent = true;
          foundNextSequential = true;
          break;
        }
      }
      if (!foundNextSequential) {
        hasNextValidComponent = false;
      }
    }
  }

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" sx={{ mb: 2 }}>
        {form?.title}
      </Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "400px",
        }}
      >
        {(() => {
          const component = form?.components[currentComponent];

          if (!component) {
            return (
              <Typography>No component selected or form is empty.</Typography>
            );
          }

          switch (component.type) {
            case "textInput": {
              const currentAnswer = currentAnswers[component.id];
              return (
                <TextInputPreview
                  key={component.id}
                  id={component.id}
                  question={component.question || ""}
                  onChange={(id, value) => handleTextInputChange(id, value)}
                  currentAnswer={currentAnswer as string}
                />
              );
            }
            case "multipleChoice": {
              const currentAnswer = currentAnswers[component.id];
              return (
                <MultipleChoicePreview
                  key={component.id}
                  id={component.id}
                  question={component.question || ""}
                  choices={component.choices || []}
                  oneAnswerOnly={component.oneAnswerOnly}
                  onChange={handleMultipleChoiceChange}
                  currentAnswer={currentAnswer as number[]}
                />
              );
            }
            case "table": {
              const currentAnswer = currentAnswers[component.id] || [];
              return (
                <TablePreview
                  key={component.id}
                  id={component.id}
                  question={component.question || ""}
                  columns={component.columns || []}
                  onChange={handleTableChange}
                  currentAnswer={currentAnswer as TableRowAnswers[]}
                />
              );
            }
            default:
              return (
                <Typography>No support for this component type yet</Typography>
              );
          }
        })()}
      </Box>
      <Stack
        direction="row"
        spacing={2}
        sx={{ mt: 4, justifyContent: "center" }}
      >
        <Button
          variant="outlined"
          onClick={handlePrevious}
          disabled={navigationHistory.length <= 1}
        >
          Previous
        </Button>
        {hasNextValidComponent && (
          <Button
            variant="outlined"
            onClick={handleNext}
            disabled={!handleAllowNext()}
          >
            Next
          </Button>
        )}
        {!hasNextValidComponent && (
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={!handleAllowNext()}
          >
            Submit
          </Button>
        )}
        <Button
          variant="outlined"
          onClick={() => {
            navigate(-1);
          }}
        >
          Back
        </Button>
      </Stack>
    </Box>
  );
}
