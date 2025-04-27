// All of the code is from https://docs.dndkit.com/introduction/getting-started

import { PropsWithChildren } from "react";
import { useDroppable } from "@dnd-kit/core";

function Droppable(props: PropsWithChildren) {
  const { isOver, setNodeRef } = useDroppable({
    id: "droppable",
  });
  const style = {
    color: isOver ? "green" : undefined,
  };

  return (
    <div ref={setNodeRef} style={style}>
      {props.children}
    </div>
  );
}

export default Droppable;
