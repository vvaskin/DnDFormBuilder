import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { PropsWithChildren } from "react";
import { Box } from "@mui/material";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";

interface SortableItemProps extends PropsWithChildren {
  id: string;
}

function SortableItem(props: SortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: props.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
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
        {...listeners}
        {...attributes}
        sx={{
          position: "absolute",
          top: "8px",
          right: "8px",
          cursor: "grab",
          "&:active": { cursor: "grabbing" },
          zIndex: 1,
        }}
      >
        <DragIndicatorIcon />
      </Box>
      {props.children}
    </Box>
  );
}

export default SortableItem;
