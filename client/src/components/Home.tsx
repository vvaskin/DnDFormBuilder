import { Typography } from "@mui/material";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <Box sx={{ padding: 4, maxWidth: "800px", margin: "0 auto" }}>
      <Typography variant="h3" sx={{ marginBottom: 4, textAlign: "center" }}>
        Welcome to the form builder! Pick what you want to do:
      </Typography>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={3}
        justifyContent="center"
        sx={{ marginTop: 2 }}
      >
        <Button
          variant="contained"
          component={Link}
          to="/create"
          size="large"
          sx={{ padding: "12px 24px" }}
        >
          Create a new form
        </Button>
        <Button
          variant="contained"
          component={Link}
          to="/forms"
          size="large"
          sx={{ padding: "12px 24px" }}
        >
          View my forms
        </Button>
      </Stack>
    </Box>
  );
}
