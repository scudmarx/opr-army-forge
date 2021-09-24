const fs = require("fs");
const path = require("path");

const isDir = (fileName) => {
  return !fs.lstatSync(fileName).isFile();
};
const dir = "./public/definitions";

const armyLists = fs
  .readdirSync(dir)
  .map((fileName) => path.join(dir, fileName))
  .filter(isDir)
  .map((gameDir) => {
    // Each in gf/aof folders
    return {
      key: gameDir.substring(gameDir.lastIndexOf("\\") + 1),
      items: fs
        .readdirSync(gameDir)
        .map((fileName) => path.join(gameDir, fileName))
        .map((filePath) => {
          // Read json file string
          const fileContent = fs.readFileSync(filePath, "utf8");
          // Parse json file
          const armyData = JSON.parse(fileContent);

          return {
            name: armyData.name,
            dataToolVersion: armyData.dataToolVersion,
            version: armyData.version,
            path: filePath.substring(filePath.indexOf("\\")+1).replace(/\\/g, "/")
          };
        }),
    };
  });

fs.writeFile("./public/definitions/army-files.json", JSON.stringify(armyLists), (err) => {
  console.error(err);
});
