import { Box, Typography, Stack, TextField, Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import React from "react";
import { FormComponentConfig } from "../../types/form";

export interface FormComponentWrapperProps {
  title: string;
  children: React.ReactNode;
  config: FormComponentConfig;
  index: number;
  onConfigChange: (id: number, config: Partial<FormComponentConfig>) => void;
  onDelete: () => void;
}

// Basic template wrapper to wrap the form components: adds a question field and a delete button
export default function FormComponentWrapper({
  title,
  children,
  config,
  onConfigChange,
  onDelete,
  index,
}: FormComponentWrapperProps) {
  return (
    <Box
      sx={{
        p: 2,
        border: "1px dashed #ccc",
        borderRadius: 1,
        position: "relative",
      }}
    >
      <Typography
        variant="caption"
        sx={{
          position: "absolute",
          top: 8,
          left: 8,
          fontWeight: "bold",
          color: "text.secondary",
          backgroundColor: "rgba(255, 255, 255, 0.7)",
          padding: "0px 4px",
          borderRadius: "4px",
          zIndex: 1,
        }}
      >
        Question {index + 1} {/* Display 1-based index */}
      </Typography>

      {/* Delete Button */}
      <Button
        onClick={onDelete}
        sx={{
          position: "absolute",
          top: 8,
          right: 8 + 32 + 8,
          minWidth: "32px",
          height: "32px",
          padding: 0,
          zIndex: 2,
          color: "error.main",
        }}
        size="small"
        aria-label="Delete component"
      >
        <CloseIcon fontSize="small" /> {/* Delete Button Icon */}
      </Button>

      {/* Question Field */}
      <Stack spacing={2}>
        <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
          {title}
        </Typography>
        <TextField
          label="Question"
          variant="outlined"
          fullWidth
          required
          value={config.question || ""}
          onChange={(e) =>
            onConfigChange(config.id, { question: e.target.value })
          }
          sx={{ mt: 1 }}
          error={!config.question?.trim()}
        />

        {children}
      </Stack>
    </Box>
  );
}
