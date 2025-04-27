import {
  Paper,
  TableRow,
  TableCell,
  Typography,
  Table,
  TableHead,
  TableBody,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import { TableColumn } from "../../types/form";
import { TableRowAnswers } from "./FormPreview";
import { useState, useEffect } from "react";

interface TablePreviewProps {
  id: number;
  question: string;
  columns: TableColumn[];
  onChange: (id: number, value: TableRowAnswers[]) => void;
  currentAnswer: TableRowAnswers[];
}

export default function TablePreview({
  id,
  question,
  columns,
  onChange,
  currentAnswer,
}: TablePreviewProps) {
  const [answers, setAnswers] = useState<TableRowAnswers[]>(currentAnswer);

  useEffect(() => {
    setAnswers(currentAnswer);
  }, [currentAnswer]);

  useEffect(() => {
    onChange(id, answers);
  }, [id, answers, onChange]);

  return (
    <Paper>
      <Typography variant="h6" sx={{ mb: 2 }}>
        {question}
      </Typography>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        {/* Table Header */}
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell key={column.id}>{column.headerTitle}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        {/* Table Body */}
        <TableBody>
          <TableRow>
            {columns.map((column) => {
              if (column.columnType === "textInput") {
                const textValue = answers[0]?.[column.id] ?? "";
                return (
                  <TableCell key={column.id}>
                    <TextField
                      onChange={(e) => {
                        const value = e.target.value;
                        setAnswers((prevAnswers = []) => {
                          const updatedAnswers = [...prevAnswers];
                          const currentRow = updatedAnswers[0]
                            ? { ...updatedAnswers[0] }
                            : {};
                          currentRow[column.id] = value;
                          updatedAnswers[0] = currentRow;
                          return updatedAnswers;
                        });
                      }}
                      label={column.headerTitle}
                      variant="outlined"
                      value={textValue}
                      fullWidth
                    />
                  </TableCell>
                );
              } else if (column.columnType === "dropdown") {
                const dropdownValue = answers[0]?.[column.id] ?? "";
                return (
                  <TableCell key={column.id}>
                    <FormControl fullWidth required>
                      <InputLabel>{column.headerTitle}</InputLabel>
                      <Select
                        label={column.headerTitle}
                        fullWidth
                        value={dropdownValue}
                        onChange={(e) => {
                          const value = Number(e.target.value);
                          setAnswers((prevAnswers = []) => {
                            const updatedAnswers = [...prevAnswers];
                            const currentRow = updatedAnswers[0]
                              ? { ...updatedAnswers[0] }
                              : {};
                            currentRow[column.id] = value;
                            updatedAnswers[0] = currentRow;
                            return updatedAnswers;
                          });
                        }}
                      >
                        {column.choices?.map((choice) => (
                          <MenuItem key={choice.id} value={choice.id}>
                            {choice.value}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </TableCell>
                );
              }
              return <TableCell key={column.id}>Unsupported Type</TableCell>;
            })}
          </TableRow>
        </TableBody>
      </Table>
    </Paper>
  );
}
