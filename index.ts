import Enquirer from "enquirer";
import config from "./config.json";
import { $ } from "bun";

const dirs: string[] = config.dirs ?? [];

const add = async () => {
  const response: { dir: string } = await Enquirer.prompt({
    type: "input",
    name: "dir",
    message: "Directory",
    validate: (val) => {
      if (!val) {
        return "cannot be empty";
      }
      return true;
    },
  });
  const targetDir = response.dir;
  dirs.push(targetDir);
  const data = { dirs: dirs };
  await Bun.write("config.json", JSON.stringify(data, null, 2));
  console.log(`${targetDir} successfully added`);
};

const remove = async () => {
  if (dirs.length == 0) {
    console.log("Directory List is Empty, please add with --add");
    return;
  }
  const selected: { value: string[] } = await Enquirer.prompt({
    type: "multiselect",
    name: "value",
    message: "Pick Target Directory",
    choices: dirs.map((e) => {
      return {
        name: e,
        value: e,
      };
    }),
  });
  const newDirs = dirs.filter((e) => !selected.value.includes(e));
  const data = { dirs: newDirs };
  await Bun.write("config.json", JSON.stringify(data, null, 2));
  console.log(`${selected.value.join(", ")} successfully removed`);
};

const run = async () => {
  if (dirs.length == 0) {
    console.log("Directory List is Empty, please add with --add");
    return;
  }
  const selected: { value: string[] } = await Enquirer.prompt({
    type: "multiselect",
    name: "value",
    message: "Pick Target Directory",
    choices: dirs.map((e) => {
      return {
        name: e,
        value: e,
      };
    }),
  });
  selected.value.forEach(async (e) => {
    await $`wezterm cli spawn --cwd ${e}`.quiet();
    console.log("opening", e);
  });
};

const arg = Bun.argv[2];

switch (arg) {
  case "--add":
    add();
    break;
  case "--remove":
    remove();
    break;
  default:
    run();
    break;
}

