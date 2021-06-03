export interface IGitCommit {
  hash: string;
  date: Date;
  message: string;
}

export const getGitInfo = (): IGitCommit[] =>
  (process.env.VUE_APP_GIT_COMMIT_HASH || "")
    .split(";;;;;")
    .filter((s) => s)
    .map((commitStr) => {
      const parts = commitStr.split(";");
      return {
        hash: parts[0].trim(),
        date: new Date(parts[1].trim()),
        message: parts[2].trim(),
      };
    });
