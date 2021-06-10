import qs from "qs";

export interface IGitCommit {
  hash: string;
  date: Date;
  message: {
    subject: string;
    body: string | null;
  };
}

export const getGitInfo = (): IGitCommit[] =>
  (process.env.VUE_APP_GIT_COMMIT_HASH || "")
    .split(";;;;;")
    .filter((s) => s)
    .map((commitStr) => {
      const parts = commitStr.split(";");
      const text = parts[2].trim();
      const hasBody = text.indexOf("\n") !== -1;
      const subject = hasBody ? text.substring(0, text.indexOf("\n")) : text;
      const body = hasBody ? text.substr(text.indexOf("\n") + 1) : null;
      return {
        hash: parts[0].trim(),
        date: new Date(parts[1].trim()),
        message: {
          subject,
          body,
        },
      };
    });

export const createIssueLink = (args: { title: string; body: string }) =>
  `https://github.com/avoonix/material-e621/issues/new?${qs.stringify(args)}`;
