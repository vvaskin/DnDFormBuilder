import React, { useState } from "react";
import { Card, CardContent, TextField, Typography } from "@mui/material";

interface TextInputPreviewProps {
  id: number;
  question: string;
  onChange: (id: number, value: string) => void;
  currentAnswer: string;
}

const TextInputPreview = ({
  id,
  question,
  onChange,
  currentAnswer,
}: TextInputPreviewProps) => {
  const [value, setValue] = useState<string>(currentAnswer);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
    onChange(id, event.target.value);
  };

  return (
    <Card sx={{ mb: 2, borderRadius: 2 }}>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2 }}>
          {question}
        </Typography>

        <TextField
          fullWidth
          variant="outlined"
          label="Your Answer"
          value={value}
          onChange={handleChange}
        />
      </CardContent>
    </Card>
  );
};

export default TextInputPreview;
