import { Button, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import { Form } from "../../types/form";
import FormItem from "./FormItem";
import { useNavigate } from "react-router-dom";

export default function ViewForms() {
  const [forms, setForms] = useState<Form[]>([]);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchForms = async () => {
      try {
        const response = await fetch("http://localhost:3000/forms");
        const data = await response.json();
        setForms(data);
      } catch (error) {
        console.log("Error fetching forms: ", error);
      }
    };

    fetchForms();
  }, []);

  const onDelete = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:3000/forms/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setForms((prevForms) => prevForms.filter((form) => form.id !== id));
      }
    } catch (error) {
      console.log("Error deleting form: ", error);
    }
  };

  return (
    <>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Here are your created forms:
      </Typography>
      {forms.map((form: Form) => (
        <FormItem key={form.id} form={form} onDelete={onDelete} />
      ))}
      <Button
        variant="outlined"
        onClick={() => {
          navigate(-1);
        }}
      >
        Back
      </Button>
    </>
  );
}
