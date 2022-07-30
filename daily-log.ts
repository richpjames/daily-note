// Name: daily log
// Schedule: 0 9 * * *
// Index: 0

const nonWorkTemplate = `# {{index}} {{today}}
  
## What happened
-

## What was good
-

## What I learned
-
  
## Picture of the day  
`;

const workTemplate = `# {{index}} {{today}}
  
## What happened
-

## What was good
-

## What I learned
-
`;

const dateFns = require("date-fns");
const { render } = require("mustache");
const { writeFile, readdir } = require("fs/promises");
const logDir = process.env.LOG_DIRECTORY;
const workLogDir = process.env.WORK_LOG_DIRECTORY;
const today = dateFns.format(new Date(), "dd-MM-yy");

const getIndex = async (dirName: string) => {
  console.log("getting index", `${dirName}`);
  const notes = await readdir(dirName);

  const indexOfTodaysNote = notes.indexOf((note) => note.includes(today));

  if (indexOfTodaysNote >= 0)
    console.log(`Note for today (${today}) already exists`);

  let numberOfEntries = 1;

  notes.forEach((note) => {
    if (note.endsWith(".md")) numberOfEntries++;
  });

  return numberOfEntries;
};

const getFileName = async (dirName, today) => {
  const index = await getIndex(dirName);

  return `${index} ${today}.md`;
};

const renderTemplate = (template, index, today) =>
  render(template, { index, today });

const makeLogEntry = async (dirName, today, template, type) => {
  const index = await getIndex(dirName);
  console.log(`got index ${index}`);

  const fileName = await getFileName(dirName, today);
  console.log(`got filename ${fileName}`);

  const markdown = renderTemplate(template, index, today);
  console.log(`got markdown ${markdown}`);

  await writeFile(`${dirName}/${fileName}`, markdown);
  console.log(`wrote a new ${type} log file for ${fileName}`);
};

console.log("Starting");
makeLogEntry(workLogDir, today, workTemplate, "work");
// makeLogEntry(logDir, today, nonWorkTemplate, "not work");
console.log("Done");
