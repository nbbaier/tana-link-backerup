const fieldRegex = /^\s\s([^:\n]*):\s(.*)$/g;
const childRegex = /^\s\s(.*)/g;

function extractFieldsAndChildren(nodes: string[]) {
  const fields: { [x: string]: string }[] = [];
  const children: string[] = [];

  nodes
    .filter((line) => line !== "  Starred?:")
    .map((line) => {
      if (fieldRegex.test(line)) {
        const [k, v, ...rest] = line.replace(fieldRegex, "$1: $2").split(": ");
        fields.push({ [k]: rest.length > 0 ? [v, ...rest].join("- ") : v });
      } else if (childRegex.test(line)) {
        line = line.replace(childRegex, "$1"); // Remove the leading indentation
        children.push(line);
      }
    });
  return { fields, children };
}

const tagRegex = /#(\w+)/g;

function extractTags(title: string) {
  let tags: string[] = [];
  const matches = title.match(tagRegex);
  if (matches) {
    tags.push(...matches.map((tag) => tag.replace("#", "")));
  }
  return tags;
}

function getCreatedTime(fields: { [x: string]: string }[]) {
  const created = fields.find((field) => field["temp-created"]);

  if (created) {
    return { time: created["temp-created"] };
  } else {
    return { time: "Not found" };
  }
}

function getURL(fields: { [x: string]: string }[]) {
  const url = fields.find((field) => field["URL"]);

  if (url) {
    return { url: url["URL"] };
  } else {
    return { url: "Not found" };
  }
}

export function parseNode(node: string) {
  let [title, ...lines] = node.split("\n");
  const { fields, children } = extractFieldsAndChildren(lines);
  const { time: created } = getCreatedTime(fields);
  const { url } = getURL(fields);
  const tags = extractTags(title);
  title = title.replace(/#(\w+)/g, "").trim();

  const keysToRemove = ["temp-created", "URL"];

  const otherFields = fields.filter((obj) => {
    for (const key of keysToRemove) {
      if (obj.hasOwnProperty(key)) {
        return false; // Exclude the object if it has any of the keys to be removed
      }
    }
    return true; // Include the object if it doesn't have any of the keys to be removed
  });

  const joinedFields: { [x: string]: string[] } = {};

  for (const obj of otherFields) {
    for (const key in obj) {
      if (joinedFields.hasOwnProperty(key)) {
        joinedFields[key].push(obj[key]);
      } else {
        joinedFields[key] = [obj[key]];
      }
    }
  }

  return { title, tags, created, url, fields: joinedFields, children };
}
