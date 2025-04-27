// Source of the code: https://docs.dndkit.com/presets/sortable

import { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Stack,
} from "@mui/material";
import TextInput from "./TextInput";
import MultipleChoice from "./MultipleChoice";
import Table from "./Table";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import { FormComponentConfig } from "../../types/form";

import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import SortableItem from "./SortableItem";
import { useParams, useNavigate, Link } from "react-router-dom";

function FormBuilder() {
  const { id: formIdFromUrl } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const [formTitle, setFormTitle] = useState<string>("");
  const [formComponents, setFormComponents] = useState<FormComponentConfig[]>(
    []
  );
  const [savedForm, setSavedForm] = useState<boolean>(false);
  const [isSavingForm, setIsSavingForm] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(!!formIdFromUrl);
  const [formId, setFormId] = useState<number | null>(
    formIdFromUrl ? parseInt(formIdFromUrl, 10) : null
  );

  // Fetches the form data from server if we are in edit mode
  useEffect(() => {
    if (formIdFromUrl) {
      const fetchFormData = async () => {
        try {
          console.log(`Fetching data for form ID: ${formIdFromUrl}`);
          const response = await fetch(
            `http://localhost:3000/forms/${formIdFromUrl}` // Default get method
          );
          if (!response.ok) {
            throw new Error(`Failed to fetch form: ${response.statusText}`);
          }
          const data = await response.json();
          console.log("Fetched form data:", data);

          if (
            data &&
            typeof data.title === "string" &&
            Array.isArray(data.components)
          ) {
            setFormTitle(data.title);
            const components =
              typeof data.components === "string"
                ? JSON.parse(data.components)
                : data.components;
            setFormComponents(components);
            setFormId(parseInt(formIdFromUrl, 10));
            setIsEditing(true);
            setSavedForm(true);
          }
        } catch (error) {
          console.error("Error fetching form data:", error);
        }
      };

      fetchFormData();
    } else {
      // Sets the default components
      setFormTitle("");
      setFormComponents([]);
      setFormId(null);
      setIsEditing(false);
      setSavedForm(false);
    }
  }, [formIdFromUrl]);

  // Add a new component to the form
  const handleAddComponent = (type: string) => {
    setSavedForm(false);
    // Placeholder new component object
    const newComponent: FormComponentConfig = {
      id: Date.now(),
      type,
      // Generate a default question based on the type
      question: `New ${
        type === "textInput"
          ? "Text Input"
          : type === "multipleChoice"
          ? "Multiple Choice"
          : "Table"
      } Question`,
    };

    if (type === "textInput") {
      newComponent.minLength = 0;
      newComponent.maxLength = 100;
    } else if (type === "multipleChoice") {
      newComponent.choices = [];
      newComponent.oneAnswerOnly = false;
    }

    setFormComponents((prevComponents) => [...prevComponents, newComponent]);
    console.log(formComponents);
  };

  // Update an EXISTING component in the form, stored in the formComponent
  const handleUpdateComponent = (
    id: number,
    updatedComponent: Partial<FormComponentConfig>
  ) => {
    setFormComponents((prevComponents) =>
      prevComponents.map((component: FormComponentConfig) =>
        component.id === id ? { ...component, ...updatedComponent } : component
      )
    );
    setSavedForm(false);
  };

  // Delete a component from formComponents
  function onDelete(id: number) {
    setSavedForm(false);
    setFormComponents((prevComponents) => {
      const updatedComponents = prevComponents.filter(
        (component) => component.id !== id
      );
      return updatedComponents;
    });
  }

  // Sensors part of dnd-kit
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Part of dnd-kit
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setFormComponents((items) => {
        const oldIndex = items.findIndex(
          (item) => item.id.toString() === active.id
        );
        const newIndex = items.findIndex(
          (item) => item.id.toString() === over.id
        );

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }

  const handleSaveForm = async () => {
    try {
      setIsSavingForm(true);

      const response = await fetch("http://localhost:3000/create/save", {
        method: "POST",
        body: JSON.stringify({
          title: formTitle,
          formComponents: formComponents,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      setFormId(data.id);
      setIsEditing(true);

      if (!response.ok) {
        throw new Error("Failed to save form");
      }
    } catch (error) {
      console.error("Error saving form:", error);
    } finally {
      setIsSavingForm(false);
    }
  };

  const handleUpdateForm = async () => {
    if (formId === null) {
      console.error("Cannot update form without an ID.");
      return;
    }
    try {
      setIsSavingForm(true);
      const response = await fetch(`http://localhost:3000/create/${formId}`, {
        method: "PUT",
        body: JSON.stringify({
          title: formTitle,
          components: formComponents,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      console.log(data);
      setSavedForm(true);
    } catch (error) {
      console.error("Error updating form:", error);
    } finally {
      setIsSavingForm(false);
    }
  };

  // Form Validation - disables the save/update button if the form is not valid
  const isFormValid = (): boolean => {
    if (!formTitle || formTitle.trim() === "") {
      return false;
    }

    if (formComponents.length === 0) {
      return false;
    }

    for (const component of formComponents) {
      if (!component.question || component.question.trim() === "") {
        return false; // Found an empty question
      }

      if (component.type === "textInput") {
        if (
          component.minLength &&
          component.maxLength &&
          component.minLength >= component.maxLength
        ) {
          return false;
        }
      }

      if (component.type === "multipleChoice") {
        const choices = component.choices || [];
        if (choices.length < 2) {
          return false;
        }
        for (const choice of choices) {
          if (!choice.value || choice.value.trim() === "") {
            return false; // Found an empty choice value
          }
        }
        for (const rule of component.conditionalLogic || []) {
          if (rule.triggerChoiceId === 0 || rule.targetQuestionId === 0) {
            return false;
          }
        }
      }
      if (component.type === "table") {
        if (!component.columns || component.columns.length === 0) {
          return false;
        }
        for (const column of component.columns) {
          if (!column.headerTitle || column.headerTitle.trim() === "") {
            return false;
          }
        }
      }
    }

    return true;
  };

  return (
    <Box sx={{ padding: 4, maxWidth: "1200px", margin: "0 auto" }}>
      {/* Form title */}
      <Paper sx={{ padding: 2, mb: 4 }}>
        <TextField
          fullWidth
          label="Form Title"
          value={formTitle}
          onChange={(e) => setFormTitle(e.target.value)}
          required
          error={!formTitle.trim()}
        />
      </Paper>

      <Stack direction="column" spacing={4}>
        {/* Components Menu */}
        <Paper sx={{ padding: 2 }}>
          <Typography variant="h6" sx={{ marginBottom: 2 }}>
            Add Component
          </Typography>

          <Stack
            direction="row"
            spacing={2}
            sx={{
              minHeight: "150px",
            }}
          >
            <Button
              fullWidth
              sx={{ flex: 1 }}
              onClick={() => handleAddComponent("textInput")}
            >
              Text Input
            </Button>
            <Button
              fullWidth
              sx={{ flex: 1 }}
              onClick={() => handleAddComponent("multipleChoice")}
            >
              Multiple Choice
            </Button>
            <Button
              fullWidth
              sx={{ flex: 1 }}
              onClick={() => handleAddComponent("table")}
            >
              Table
            </Button>
          </Stack>
        </Paper>

        {/* Form Builder (drag and drop area) */}
        <Paper sx={{ minHeight: "500px", padding: 2 }}>
          <Typography variant="h6" sx={{ marginBottom: 2 }}>
            Form Builder
          </Typography>
          {/* The component editor */}
          <DndContext
            collisionDetection={closestCenter}
            sensors={sensors}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={formComponents.map((component) => component.id.toString())}
              strategy={verticalListSortingStrategy}
            >
              <Stack spacing={2}>
                {formComponents.map((component, index) => (
                  <SortableItem key={component.id} id={component.id.toString()}>
                    {component.type === "textInput" && (
                      <TextInput
                        id={component.id}
                        config={component}
                        onConfigChange={handleUpdateComponent}
                        onDelete={() => onDelete(component.id)}
                        index={index}
                      />
                    )}
                    {component.type === "multipleChoice" && (
                      <MultipleChoice
                        id={component.id}
                        config={component}
                        onConfigChange={handleUpdateComponent}
                        onDelete={() => onDelete(component.id)}
                        allComponents={formComponents}
                        index={index}
                      />
                    )}
                    {component.type === "table" && (
                      <Table
                        id={component.id}
                        config={component}
                        onConfigChange={handleUpdateComponent}
                        onDelete={() => onDelete(component.id)}
                        index={index}
                      />
                    )}
                  </SortableItem>
                ))}
              </Stack>
            </SortableContext>
          </DndContext>
        </Paper>
      </Stack>

      {/* Save/Update and Preview buttons */}
      <Button
        variant="contained"
        onClick={isEditing ? handleUpdateForm : handleSaveForm}
        disabled={isSavingForm || !isFormValid()}
        sx={{ marginTop: 4, marginRight: 4 }}
      >
        {isSavingForm ? "Saving..." : isEditing ? "Update Form" : "Save Form"}
      </Button>
      <Button
        variant="contained"
        disabled={!savedForm}
        sx={{ marginTop: 4, marginRight: 4 }}
        component={Link}
        to={`/forms/${formId}`}
      >
        View Rendered Form
      </Button>
      <Button
        variant="outlined"
        onClick={() => {
          navigate(-1);
        }}
        sx={{ marginTop: 4, marginRight: 4 }}
      >
        Back
      </Button>
    </Box>
  );
}
export default FormBuilder;
