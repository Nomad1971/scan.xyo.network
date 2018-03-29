/**
 * @Author: XY | The Findables Company <arietrouw>
 * @Date:   Thursday, March 29, 2018 9:12 AM
 * @Email:  developer@xyfindables.com
 * @Filename: atom.js
 * @Last modified by:   arietrouw
 * @Last modified time: Thursday, March 29, 2018 11:31 AM
 * @License: All Rights Reserved
 * @Copyright: Copyright XY | The Findables Company
 */

/* eslint no-console:0 */

const gulp = require(`gulp`);
const { exec } = require(`child_process`);

const atomInstall = (pkg, callback) => {
  exec(`apm install ${pkg}`, (err, stdout, stderr) => {
    console.log(stdout);
    console.error(stderr);
    callback(err);
  });
};

const atom =
  callback => atomInstall(
    `atom-beautify`,
    () => atomInstall(
      `linter`,
      () => atomInstall(
        `linter-eslint`,
        () => atomInstall(
          `linter-sass-lint`,
          () => atomInstall(
            `linter-solidity`,
            () => atomInstall(
              `linter-tidy`,
              () => atomInstall(
                `linter-ui-default`,
                () => atomInstall(
                  `linter-bootlint`,
                  () => atomInstall(
                    `language-json5`,
                    () => atomInstall(
                      `language-ethereum`,
                      () => atomInstall(
                        `intentions`,
                        () => atomInstall(
                          `atom-ide-ui`,
                          () => atomInstall(
                            `autocomplete-html-entities`,
                            () => atomInstall(
                              `busy-signal`,
                              () => atomInstall(
                                `file-type-icons`,
                                () => atomInstall(`file-header`, callback),
                              ),
                            ),
                          ),
                        ),
                      ),
                    ),
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
    ),
  );

gulp.task(`atom`, atom);

module.exports = atom;
