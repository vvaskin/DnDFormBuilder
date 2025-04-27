import { Card, CardContent, Typography, Box, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Link } from "react-router-dom";
import { Form } from "../../types/form";

interface FormItemProps {
  form: Form;
  onDelete: (id: number) => void;
}

const FormItem = ({ form, onDelete }: FormItemProps) => {
  const handleDelete = () => {
    onDelete(form.id);
  };

  return (
    <Card sx={{ mb: 2, borderRadius: 2 }}>
      <CardContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box
            component={Link}
            to={`/forms/${String(form.id)}`}
            sx={{
              textDecoration: "none",
              color: "inherit",
            }}
          >
            <Typography variant="h6">{form.title}</Typography>
          </Box>
          <Box>
            <IconButton
              component={Link}
              to={`/create/${String(form.id)}`}
              aria-label="edit"
            >
              <EditIcon />
            </IconButton>
            <IconButton
              onClick={handleDelete}
              aria-label="delete"
              color="error"
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default FormItem;
