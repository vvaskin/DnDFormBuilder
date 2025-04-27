import { useState } from "react";
import {
  FormComponentConfig,
  TableColumn,
  TableColumnChoice,
} from "../../types/form";
import FormComponentWrapper from "./FormComponentWrapper";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Stack,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Typography,
  TableContainer,
  Table as MuiTable,
  TableHead,
  TableRow,
  TableCell,
  Paper,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";

interface TableProps {
  id: number;
  config: FormComponentConfig;
  index: number;
  onDelete: () => void;
  onConfigChange: (id: number, config: Partial<FormComponentConfig>) => void;
}

export default function Table({
  id,
  config,
  onDelete,
  onConfigChange,
  index,
}: TableProps) {
  const columns = config.columns || [];

  // State for Add Column Dialog
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newColumnHeader, setNewColumnHeader] = useState("");
  const [newColumnType, setNewColumnType] = useState<string>("textInput");
  const [isEditingColumn, setIsEditingColumn] = useState<boolean>(false);
  const [editingColumnId, setEditingColumnId] = useState<number | null>(null);

  // State for managing choices while defining a dropdown column (still the dialog)
  const [currentChoices, setCurrentChoices] = useState<TableColumnChoice[]>([]);
  const [newChoiceValue, setNewChoiceValue] = useState("");

  const handleOpenDialog = (columnId?: number) => {
    if (columnId) {
      const columnToEdit = columns.find((col) => col.id === columnId);
      if (columnToEdit) {
        setNewColumnHeader(columnToEdit.headerTitle);
        setNewColumnType(columnToEdit.columnType);
        setCurrentChoices(columnToEdit.choices || []);
        setIsEditingColumn(true);
        setEditingColumnId(columnToEdit.id);
      }
    } else {
      setNewColumnHeader("");
      setNewColumnType("textInput"); // Default choice
      setCurrentChoices([]);
      setIsEditingColumn(false);
      setEditingColumnId(null);
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setIsEditingColumn(false);
    setNewColumnHeader("");
    setNewColumnType("textInput");
    setCurrentChoices([]);
    setNewChoiceValue("");
  };

  const handleAddChoiceToDialog = () => {
    if (newChoiceValue.trim()) {
      setCurrentChoices([
        ...currentChoices,
        { id: Date.now(), value: newChoiceValue.trim() },
      ]);
      setNewChoiceValue(""); // Clear input
    }
  };

  const handleDeleteLastChoiceFromDialog = () => {
    if (currentChoices.length > 0) {
      setCurrentChoices(currentChoices.slice(0, -1));
    }
  };

  // Add the column to the config storage
  const handleAddColumn = () => {
    if (!newColumnHeader.trim()) return;

    const newColumn: TableColumn = {
      id: Date.now(),
      headerTitle: newColumnHeader.trim(),
      columnType: newColumnType as "textInput" | "dropdown",
    };

    if (newColumnType === "dropdown") {
      if (currentChoices.length === 0) return;
      newColumn.choices = currentChoices;
    }

    if (isEditingColumn && editingColumnId !== null) {
      // Update existing column
      const updatedColumns = columns.map((col) =>
        col.id === editingColumnId ? newColumn : col
      );
      onConfigChange(id, { columns: updatedColumns });
    } else {
      // Add new column
      onConfigChange(id, { columns: [...columns, newColumn] });
    }

    handleCloseDialog();
  };

  const handleDeleteColumn = (columnId: number) => {
    const updatedColumns = columns.filter((col) => col.id !== columnId);
    onConfigChange(id, { columns: updatedColumns });
  };

  const handleEditColumn = (columnId: number) => {
    const columnToEdit = columns.find((col) => col.id === columnId);
    if (columnToEdit) {
      setNewColumnHeader(columnToEdit.headerTitle);
      setNewColumnType(columnToEdit.columnType);
    }
  };

  // Validation, similar to add choice in MultipleChoice
  const canAddColumnInDialog = () => {
    if (!newColumnHeader.trim()) return false;
    if (newColumnType === "dropdown" && currentChoices.length < 1) return false;
    if (newColumnType === "dropdown") {
      return currentChoices.every((choice) => choice.value?.trim());
    }
    return true;
  };

  return (
    <FormComponentWrapper
      title="Table"
      onDelete={onDelete}
      config={config}
      onConfigChange={onConfigChange}
      index={index}
    >
      <Stack spacing={2} sx={{ mt: 2 }}>
        {/* Button to Add Column */}
        <Button
          variant="outlined"
          onClick={() => handleOpenDialog()}
          sx={{ alignSelf: "flex-start" }}
        >
          Add Column
        </Button>

        {/* Preview of Added Columns */}
        {columns.length > 0 && (
          <Typography variant="subtitle2" sx={{ mt: 1 }}>
            Defined Columns:
          </Typography>
        )}
        <TableContainer component={Paper} variant="outlined">
          <MuiTable size="small">
            <TableHead>
              <TableRow>
                {columns.map((col) => (
                  <TableCell key={col.id} sx={{ fontWeight: "bold" }}>
                    {col.headerTitle} (
                    {col.columnType === "dropdown" ? "Dropdown" : "Text"})
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteColumn(col.id)}
                      sx={{ ml: 1 }}
                    >
                      <Delete fontSize="inherit" color="error" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleOpenDialog(col.id)}
                      sx={{ ml: 1 }}
                    >
                      <Edit fontSize="inherit" color="primary" />
                    </IconButton>
                  </TableCell>
                ))}
                {columns.length === 0 && (
                  <TableCell align="center">(No columns defined)</TableCell>
                )}
              </TableRow>
            </TableHead>
          </MuiTable>
        </TableContainer>

        {/* --- Add Column Dialog --- */}
        <Dialog
          open={isDialogOpen}
          onClose={handleCloseDialog}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>Add New Column</DialogTitle>
          <DialogContent>
            <Stack spacing={3} sx={{ mt: 1 }}>
              {/* Header Title */}
              <TextField
                autoFocus
                required
                margin="dense"
                id="headerTitle"
                label="Header Title"
                type="text"
                fullWidth
                variant="outlined"
                value={newColumnHeader}
                onChange={(e) => setNewColumnHeader(e.target.value)}
                error={!newColumnHeader.trim()}
              />

              {/* Column Type */}
              <FormControl fullWidth required>
                <InputLabel id="column-type-label">Column Type</InputLabel>
                <Select
                  labelId="column-type-label"
                  id="column-type-select"
                  value={newColumnType}
                  label="Column Type"
                  onChange={(e) =>
                    setNewColumnType(e.target.value as "textInput" | "dropdown")
                  }
                >
                  <MenuItem value="textInput">Text Input</MenuItem>
                  <MenuItem value="dropdown">Dropdown (single-choice)</MenuItem>
                </Select>
              </FormControl>

              {/* --- Dropdown Choices Definition (Conditional) --- */}
              {newColumnType === "dropdown" && (
                <Stack
                  spacing={1}
                  sx={{ border: "1px solid #e0e0e0", p: 2, borderRadius: 1 }}
                >
                  <Typography variant="subtitle2">
                    Define Dropdown Choices:
                  </Typography>
                  <List dense>
                    {currentChoices.map((choice, index) => (
                      <ListItem key={choice.id} disablePadding>
                        <ListItemText
                          primary={`${index + 1}. ${choice.value}`}
                        />
                      </ListItem>
                    ))}
                    {currentChoices.length === 0 && (
                      <ListItemText secondary="(No choices added yet)" />
                    )}
                  </List>
                  <TextField
                    label="New Choice Value"
                    variant="outlined"
                    size="small"
                    value={newChoiceValue}
                    onChange={(e) => setNewChoiceValue(e.target.value)}
                    error={
                      currentChoices.length > 0 &&
                      currentChoices.some((c) => !c.value?.trim()) &&
                      !newChoiceValue.trim()
                    }
                  />
                  <Stack direction="row" spacing={1} justifyContent="flex-end">
                    {currentChoices.length > 0 && (
                      <Button
                        size="small"
                        variant="outlined"
                        color="warning"
                        onClick={handleDeleteLastChoiceFromDialog}
                      >
                        Delete Last Choice
                      </Button>
                    )}
                    <Button
                      size="small"
                      variant="contained"
                      onClick={handleAddChoiceToDialog}
                      disabled={!newChoiceValue.trim()}
                    >
                      Add Choice
                    </Button>
                  </Stack>
                </Stack>
              )}
              {/* --- End Dropdown Choices --- */}
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button
              onClick={handleAddColumn}
              disabled={!canAddColumnInDialog()}
            >
              {isEditingColumn ? "Update Column" : "Add Column"}
            </Button>
          </DialogActions>
        </Dialog>
        {/* --- End Dialog --- */}
      </Stack>
    </FormComponentWrapper>
  );
}
