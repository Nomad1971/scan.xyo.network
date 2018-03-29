/**
 * @Author: XY | The Findables Company <arietrouw>
 * @Date:   Thursday, March 29, 2018 9:12 AM
 * @Email:  developer@xyfindables.com
 * @Filename: atom.js
 * @Last modified by:   arietrouw
 * @Last modified time: Thursday, March 29, 2018 9:43 AM
 * @License: All Rights Reserved
 * @Copyright: Copyright XY | The Findables Company
 */

const gulp = require(`gulp`);
const exec = require(`child_process`).exec;

const atom_install = (pkg, callback) => {
  exec(`apm install ${pkg}`, (err, stdout, stderr) => {
    console.log(stdout);
    console.log(stderr);
    callback(err);
  });
};

const atom =
  callback => atom_install(
    `atom-beautify`,
    () => atom_install(
      `linter`,
      () => atom_install(
        `linter-eslint`,
        () => atom_install(
          `linter-sass-lint`,
          () => atom_install(
            `linter-solidity`,
            () => atom_install(
              `linter-tidy`,
              () => atom_install(
                `linter-ui-default`,
                () => atom_install(
                  `linter-bootlint`,
                  () => atom_install(
                    `language-json5`,
                    () => atom_install(
                      `language-ethereum`,
                      () => atom_install(
                        `intentions`,
                        () => atom_install(
                          `atom-ide-ui`,
                          () => atom_install(
                            `autocomplete-html-entities`,
                            () => atom_install(
                              `busy-signal`,
                              () => atom_install(
                                `file-type-icons`,
                                () => atom_install(`file-header`, callback),
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
