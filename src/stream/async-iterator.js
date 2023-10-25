import fs from "node:fs";
import { parse } from "csv-parse";

const csvFilePath = new URL("./tasks.csv", import.meta.url);

async function processFile() {
  const parseConfig = {
    delimiter: ",",
    from_line: 2,
    skip_empty_lines: true,
  };
  const streamParser = fs
    .createReadStream(csvFilePath)
    .pipe(parse(parseConfig));

  for await (const taskBody of streamParser) {
    const [title, description] = taskBody;

    fetch("http://localhost:8080/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, description }),
    });
  }
}

(async () => {
  await processFile();
})();
