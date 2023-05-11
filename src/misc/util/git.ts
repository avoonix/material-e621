import qs from "qs";

declare const VUE_APP_GIT_COMMIT_INFO: string;
declare const VUE_APP_GIT_BRANCH: string;

export interface IGitCommit {
  hash: string;
  date: Date;
  author: string;
  message: {
    subject: string;
    body: string | null;
  };
}

export const getGitBranchInfo = () => String(VUE_APP_GIT_BRANCH);

export const getGitInfo = (): IGitCommit[] =>
  String(VUE_APP_GIT_COMMIT_INFO)
    .split(";;;;;")
    .filter((s) => s)
    .map((commitStr) => {
      const parts = commitStr.split(";", 4);
      const text = parts[3].trim();
      const hasBody = text.indexOf("\n") !== -1;
      const subject = hasBody ? text.substring(0, text.indexOf("\n")) : text;
      const body = hasBody ? text.substring(text.indexOf("\n") + 1) : null;
      const author = parts[2].trim();
      return {
        hash: parts[0].trim(),
        date: new Date(parts[1].trim()),
        author,
        message: {
          subject,
          body,
        },
      };
    });

export const createIssueLink = (args: { title: string; body: string }) =>
  `https://github.com/avoonix/material-e621/issues/new?${qs.stringify(args)}`;
