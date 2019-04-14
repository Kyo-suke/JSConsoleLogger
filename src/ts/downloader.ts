/// <reference path="./common.ts" />

namespace JSConsoleLogger {
    /**
     * @static
     * @class Downloader
     * @classdesc Download log file.
     */
    export class Downloader {
        private static readonly ELEMENT_ID: string = "JSConsoleLogDownloader";
        private static readonly DEFAULT_FILENAME: string = "log_%d_%t.log";
        private static readonly REVOKE_TIMEOUT: number = 5000;

        constructor() {
            throw new Error("Downloader is static class.");
        }

        /**
         * Download specified log file.
         * @static
         * @param logFile Download log file object.
         * @param [filenameBase] Download filename.
         * %d : replace current date(YYmmDD), %t : replace current time(HHMMSS).
         * If you not specified this parameter, using default filename.
         * For example "log_%d_%t.log" => log_20190123_123456.log
         */
        public static download(logFile: LogFile, filenameBase?: string): void {
            let blob = logFile.entity;
            if (!blob) {
                return;
            }
            let filename = this._genFilename(filenameBase);

            // for Internet Explorer
            if (navigator.msSaveBlob) {
                navigator.msSaveBlob(blob, filename);
                return;
            }

            // create html link element
            var url: string = null;
            try {
                let element = this._createLinkElement();
                url = URL.createObjectURL(blob);
                this._setAttributes(element, filename, url);

                // download
                element.click();

                // revoke url on download after
                setTimeout(() => {
                    this._revoke(url);
                }, this.REVOKE_TIMEOUT);
            } catch (e) {
                console.error("failed to download.");
                console.error(e.meesage);
                console.error(e.stack);
                this._removeLinkElement();
                if (url) {
                    this._revoke(url);
                }
            }
        }

        /**
         * Revoke download url object.
         * @param url Revoke target url.
         */
        private static _revoke(url: string): void {
            URL.revokeObjectURL(url);
            this._removeLinkElement();
        }

        private static _genFilename(filenameBase?: string): string {
            if (!filenameBase) {
                filenameBase = this.DEFAULT_FILENAME;
            }
            let filename = filenameBase;
            let date = new Date();
            let d = [date.getFullYear(), date.getMonth(), date.getDate()].join("");
            filename = filename.replace("%d", d);
            let t = [date.getHours(), date.getMinutes(), date.getSeconds()].join("");
            filename = filename.replace("%t", t);
            return filename;
        }

        /**
         * Create HTML link element for download.
         * @return Created HTML link element.
         */
        private static _createLinkElement(): HTMLAnchorElement {
            let element = <HTMLAnchorElement>document.querySelector("#" + this.ELEMENT_ID);
            if (element) {
                this._removeLinkElement();
            }
            let a = document.createElement("a");
            a.setAttribute("id", this.ELEMENT_ID);
            a.setAttribute("download", "");
            a.setAttribute("target", "_blank");
            a.setAttribute("href", "");
            a.setAttribute("style", "display: block; visibility: hidden; width: 0; height: 0;");
            return document.body.appendChild(a);
        }

        private static _removeLinkElement(): void {
            let element = document.querySelector("#" + this.ELEMENT_ID);
            if (element) {
                document.body.removeChild(element);
            }
        }

        private static _setAttributes(element: Element, filename: string, href: string): HTMLAnchorElement {
            element.setAttribute("download", filename);
            element.setAttribute("href", href);
            return <HTMLAnchorElement>element;
        }
    }
}
