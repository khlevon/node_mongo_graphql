const { execSync } = require("child_process");
const buildFolder = "../dist";

const files = new Set(["**/*.gql"]);
const folders = new Set(["./types"]);

execSync(`cd ./src && mkdir -p ${buildFolder}`);

// Copy Files
files.forEach((file) => {
  execSync(
    `cd ./src && rsync -r --include='${file}' --include='*/' --exclude='*' . ${buildFolder}`
  );
});

// Copy Folders
folders.forEach((folder) => {
  execSync(`cd ./src && rsync -r ${folder} ${buildFolder}`);
});
