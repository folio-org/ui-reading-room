# Change history for ui-reading-room

## [3.0.0] IN PROGRESS

* *BREAKING* Add patron blocks accordion. Refs UIRR-35.
* *BREAKING* Add user notes accordion. Refs UIRR-32.
* Add 'subscribesTo' field for servicepoints in package.json. Refs UIRR-44.

## [2.0.1](https://github.com/folio-org/ui-reading-room/tree/v2.0.1) (2025-07-30)
[Full Changelog](https://github.com/folio-org/ui-reading-room/compare/v2.0.0...v2.0.1)

* Add patron blocks accordion. Refs UIRR-35.
* Add user notes accordion. Refs UIRR-32.

## [2.0.0](https://github.com/folio-org/ui-reading-room/tree/v2.0.0) (2025-03-14)
[Full Changelog](https://github.com/folio-org/ui-reading-room/compare/v1.1.0...v2.0.0)

* *BREAKING* Migrate stripes dependencies to their Sunflower versions. Refs UIRR-29.
* *BREAKING* Migrate react-intl to v7. Refs UIRR-28.

## [1.1.1](https://github.com/folio-org/ui-reading-room/tree/v1.1.1) (2025-05-19)
[Full Changelog](https://github.com/folio-org/ui-reading-room/compare/v1.1.0...v1.1.1)
* Add patron blocks accordion. Refs UIRR-35.
* Add user notes accordion. Refs UIRR-32.
* Update translation strings.

## [1.1.0](https://github.com/folio-org/ui-reading-room/tree/v1.1.0) (2025-01-22)
[Full Changelog](https://github.com/folio-org/ui-reading-room/compare/v1.0.0...v1.1.0)
* Bump module version to invaildate incorrect artifacts.

## [1.0.0](https://github.com/folio-org/ui-reading-room/tree/v1.0.0) (2024-10-30)

* Add initial files.
* New app created with stripes-cli
* Update version in package.json
* Add Reading Room Access App into App List. Refs UIRR-3.
* Update sub permissions of permission “Reading room access: In app - track access”. Refs UIRR-5.
* Display patron details on patron's barcode Scan. Refs UIRR-6.
* Display Patron's permissions and notes for the reading room. Refs UIRR-7.
* Implement "Allow access" and "Deny access" actions for saving access log. Refs UIRR-8.
* Add `PERSONAL_DATA_DISCLOSURE.md` file. Refs UIRR-9.
* Auto scan patron when patron selected from patron look up. Refs UIRR-10.
* Display error message for non-existent patron barcode. Refs UIRR-12.
* Auto dismiss callout messages. Refs UIRR-13.
* Update README.md file. Refs UIRR-15.
* Supply servicePointId and readingRoomName along with the current payload to reading room /access-log POST API. Refs UIRR-17.
* Improvements after UAT feedback. Refs UIRR-14.
* Upgrade version for `actions/upload-artifact` to v4. Refs UIRR-18.
