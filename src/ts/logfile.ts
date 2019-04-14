/// <reference path="./common.ts" />
/// <reference path="./logformatter.ts" />

namespace JSConsoleLogger {
    /**
     * @class LogFile
     * @classdesc Log file data object.
     */
    export class LogFile {
        private static readonly BOM: Uint8Array = new Uint8Array([0xef, 0xbb, 0xbf]);

        private _mimeType: string;
        private _lineFeedCodeType: LineFeedCodeType;
        private _withBOM: boolean;
        private _entity: Blob;

        /**
         * @param datas Target Log data object list.
         * @param [mimeType="text/plain"] Specify mime type string.
         * @param [withBOM=false] true : Insert BOM to top of the file.
         * @param [lineFeedCodeType="crlf"] Specify linefeed code type. "cr" | "lf" | "crlf".
         */
        constructor(datas: LogData[], mimeType: string = "text/plain", withBOM: boolean = false, lineFeedCodeType: LineFeedCodeType = "crlf") {
            let cls = LogFile;
            this._mimeType = mimeType;
            this._lineFeedCodeType = lineFeedCodeType;
            this._withBOM = withBOM;

            var contents: any[] = this._logData2StrList(datas);
            if (this._withBOM) {
                contents.unshift(cls.BOM);
            }

            this._entity = new Blob(contents, { type: this._mimeType });
        }

        /**
         * Log data convert to string list.
         * @param datas log data list
         * @return converted string list
         */
        private _logData2StrList(datas: LogData[]): string[] {
            let ret = [];
            for (let i = 0; i < datas.length; i++) {
                let logString = LogFormatter.format(datas[i]);
                // add linefeed code
                logString += "\n";
                logString = this._replaceLineFeedCode(logString);
                ret.push(logString);
            }
            return ret;
        }

        /**
         * Unify linefeed code.
         * @param target target string
         */
        private _replaceLineFeedCode(target: string): string {
            let ret = "";
            switch (this._lineFeedCodeType) {
                case "lf":
                    ret = target.replace("\r\n", "\n");
                    break;
                case "cr":
                    ret = target.replace("\r\n", "\r");
                    break;
                case "crlf":
                    ret = target.replace("\r\n", "\n");
                    ret = ret.replace("\r", "\n");
                    ret = ret.replace("\n", "\r\n");
                    break;
                default:
                    return target;
            }
            return ret;
        }

        get entity(): Blob {
            return this._entity;
        }
    }
}
