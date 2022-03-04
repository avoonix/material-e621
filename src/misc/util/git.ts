import qs from "qs";

declare const VUE_APP_GIT_COMMIT_INFO: string;

export interface IGitCommit {
  hash: string;
  date: Date;
  message: {
    subject: string;
    body: string | null;
  };
}

export const getGitInfo = (): IGitCommit[] =>
  String(VUE_APP_GIT_COMMIT_INFO)
    .split(";;;;;")
    .filter((s) => s)
    .map((commitStr) => {
      const parts = commitStr.split(";");
      const text = parts[2].trim();
      const hasBody = text.indexOf("\n") !== -1;
      const subject = hasBody ? text.substring(0, text.indexOf("\n")) : text;
      const body = hasBody ? text.substring(text.indexOf("\n") + 1) : null;
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
