#!/usr/bin/env node

const path = require("path");
const inquirer = require("inquirer");
const chalk = require("chalk");
const figlet = require("figlet");
const shell = require("shelljs");

const DEFAULT_VERSION = "1.0.0";
const DEFAULT_FILETYPE = "Markdown";

const argv = require("yargs")
  .usage("Usage: $0 [options]")
  .option("default", {
    alias: "d",
    describe: `Generate ${DEFAULT_FILETYPE} license file version ${DEFAULT_VERSION}`,
  })
  .example(
    "$0 -d",
    `Skip the questionnaire and generate ${DEFAULT_FILETYPE} license file version ${DEFAULT_VERSION}`
  )
  .help("h")
  .alias("h", "help").argv;

const FILE_TYPE_EXTENSIONS = {
  markdown: "md",
  html: "html",
  plain: "",
};

const showIntro = () => {
  const introText = chalk.blue(
    figlet.textSync("Blue Oak\nModel License", {
      font: "Standard",
      verticalLayout: "full",
    })
  );

  console.log(introText);
};

const askQuestions = () => {
  const questions = [
    {
      name: "version",
      type: "list",
      message: "Which version of the license do you want to use?",
      choices: ["1.0.0"],
    },
    {
      name: "fileType",
      type: "list",
      message: "What type of file should be created?",
      choices: ["Markdown", "HTML", "Plain"],
    },
  ];

  return inquirer.prompt(questions);
};

const resolveExtension = (fileType) => {
  const extension = FILE_TYPE_EXTENSIONS[fileType.toLowerCase()];

  if (extension != null) {
    return extension.length > 0 ? `.${extension}` : extension;
  } else {
    throw new Error("Could not resolve file type extension");
  }
};

const createLicenseFile = (version, fileType) => {
  const extension = resolveExtension(fileType);
  const sourceFileName = `templates/LICENSE_${version}${extension}`;
  const sourceFilePath = path.resolve(__dirname, sourceFileName);
  const destinationFilePath = `${process.cwd()}/LICENSE${extension}`;

  shell.cp(sourceFilePath, destinationFilePath);

  return destinationFilePath;
};

const showSuccess = (filePath) => {
  const successText = chalk.green.bold(
    `Great success! License file created at:\n${filePath}`
  );

  console.log(successText);
};

const run = async () => {
  showIntro();
  const answers = await askQuestions();
  const { version, fileType } = answers;
  return createLicenseFile(version, fileType);
};

if (argv.default) {
  showSuccess(createLicenseFile(DEFAULT_VERSION, DEFAULT_FILETYPE));
} else {
  run().then(showSuccess);
}
