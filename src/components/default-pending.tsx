import { CircularProgressIndicator } from "./circular-progress-indicator";
import { css } from "styled-system/css";
import { Center } from "styled-system/jsx";

export function DefaultPending() {
  return (
    <Center
      className={css({
        flex: 1,
        width: "stretch",
        height: "stretch",
        margin: "auto",
      })}
    >
      <CircularProgressIndicator
        size="xl"
        label="Loading data"
        className={css({ margin: "2rem" })}
      />
    </Center>
  );
}
