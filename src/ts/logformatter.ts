/// <reference path="./common.ts" />

namespace JSConsoleLogger {
    /**
     * @static
     * @class LogFormatter
     * @classdesc Convert log data to formatted string.
     */
    export class LogFormatter {
        private static readonly DELIMITER: string = " ";

        constructor() {
            throw new Error("LogFormatter is static class.");
        }

        /**
         * Log data format to "yy/MM/dd HH:mm:ss"
         * @param logData Target Log data object.
         * @return Log format string.
         */
        public static format(logData: LogData): string {
            let logTypeStr = this._getLogTypeStr(logData.type);
            let dateStr = this._getDataStr(logData.time);
            let timeStr = this._getTimeStr(logData.time);
            let messageStr = logData.message || "";
            return [dateStr, timeStr, logTypeStr, messageStr].join(this.DELIMITER);
        }

        /**
         * Get string of log type.
         * @param logType Target log type.
         * @return "[logtype]" formatted string.
         */
        private static _getLogTypeStr(logType: LogType): string {
            return "[" + <string>logType + "]";
        }

        /**
         * Get string of date formatted "yy/MM/dd".
         * @param targetDate Target Date object
         * @return "yy/MM/dd" formatted string.
         */
        private static _getDataStr(targetDate: Date): string {
            let ret = "";
            try {
                let y = this._paddingStr(targetDate.getFullYear(), "0", 4);
                let m = this._paddingStr(targetDate.getMonth() + 1, "0", 2);
                let d = this._paddingStr(targetDate.getDate(), "0", 2);
                ret = [y, m, d].join("/");
            } catch (e) {
                ret = "--/--/--";
            }
            return ret;
        }

        /**
         * Get string of time formatted "HH:mm:ss".
         * @param targetDate Target Date object.
         * @return "HH:mm:ss" formatted string.
         */
        private static _getTimeStr(targetDate: Date): string {
            let ret = "";
            try {
                let h = this._paddingStr(targetDate.getHours(), "0", 2);
                let m = this._paddingStr(targetDate.getMinutes(), "0", 2);
                let s = this._paddingStr(targetDate.getSeconds(), "0", 2);
                let tz = this._getTimezoneStr(targetDate);
                ret = [h, m, s].join(":");
                ret += " " + tz;
            } catch (e) {
                ret = "??:??:?? +0000";
            }
            return ret;
        }

        /**
         * Get timezone string.
         * @param d Date object.
         * @return example. JST => +0900
         */
        private static _getTimezoneStr(d: Date): string {
            let num = Math.abs((d.getTimezoneOffset() * 100) / 60);
            let polarity = d.getTimezoneOffset() > 0 ? "-" : "+";
            return polarity + this._paddingStr(num, "0", 4);
        }

        private static _paddingStr(target: string | number, paddingChar: string, length: number): string {
            let ret = "";
            try {
                let paddingStr: string = new Array(length + 1).join(paddingChar.slice(0, 1));
                ret = (paddingStr + target).slice(-1 * length);
            } catch (e) {
                ret = "" + <string>target;
            }
            return ret;
        }
    }
}
