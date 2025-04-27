// All of the code is from https://docs.dndkit.com/introduction/getting-started

import { PropsWithChildren } from "react";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import { Box } from "@mui/material";

interface DraggableProps extends PropsWithChildren {
  id: string;
}

/* Wrap other components in the Draggable component to make them draggable AND include the drag handle */
export default function Draggable({ id, children }: DraggableProps) {
  {
    /* Code from the docs of dndkit */
  }
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
  });
  const style = {
    /* This code visually translates the draggable element */
    transform: CSS.Translate.toString(transform),
  };

  return (
    <Box
      ref={setNodeRef}
      style={style}
      sx={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Drag handle */}
      <Box
        sx={{
          position: "absolute",
          top: "8px",
          right: "8px",
          cursor: "grab",
          "&:active": { cursor: "grabbing" },
          zIndex: 1,
        }}
        {...listeners}
        {...attributes}
      >
        <DragIndicatorIcon />
      </Box>

      {/* This is where one of the three form components will go */}
      {children}
    </Box>
  );
}
