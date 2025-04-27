import { Stack, TextField } from "@mui/material";
import FormComponentWrapper from "./FormComponentWrapper";
import { FormComponentConfig } from "../../types/form";

interface TextInputProps {
  id: number;
  config: FormComponentConfig;
  onConfigChange: (id: number, config: Partial<FormComponentConfig>) => void;
  onDelete: () => void;
  index: number;
}

export default function TextInput({
  id,
  config,
  onConfigChange,
  onDelete,
  index,
}: TextInputProps) {
  // Handler for min length changes
  const handleMinLengthChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = parseInt(event.target.value, 10);
    onConfigChange(id, { minLength: isNaN(value) ? 0 : value });
  };

  // Handler for max length changes
  const handleMaxLengthChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = parseInt(event.target.value, 10);
    onConfigChange(id, { maxLength: isNaN(value) ? undefined : value });
  };

  return (
    <FormComponentWrapper
      title="Text Input"
      onDelete={onDelete}
      config={config}
      onConfigChange={onConfigChange}
      index={index}
    >
      <Stack
        direction="row"
        spacing={2}
        sx={{ mt: 1, alignItems: "center", justifyContent: "space-between" }}
      >
        <TextField
          label="Min Length"
          type="number"
          variant="outlined"
          size="small"
          value={config.minLength ?? 0}
          onChange={handleMinLengthChange}
          error={
            (config.maxLength &&
              config.minLength &&
              config.maxLength <= config.minLength) ||
            false
          }
        />
        <TextField
          label="Max Length"
          type="number"
          variant="outlined"
          size="small"
          value={config.maxLength ?? ""}
          onChange={handleMaxLengthChange}
          error={
            (config.maxLength &&
              config.minLength &&
              config.maxLength <= config.minLength) ||
            false
          }
        />
      </Stack>
    </FormComponentWrapper>
  );
}
