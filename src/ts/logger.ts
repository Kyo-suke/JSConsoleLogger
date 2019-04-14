/// <reference path="./common.ts" />

namespace JSConsoleLogger {
    /**
     * @static
     * @class Logger
     * @classdesc Logging several messages.
     */
    export class Logger {
        /**
         * Max size of log message list.
         */
        private static _bufferSize: number = 1000;
        /**
         * log message list entity.
         */
        private static _buffer: LogData[];
        /**
         * Bits of logging target.
         */
        private static _loggingTarget: LoggingTarget;
        /**
         * Show stack trace on console logging.
         */
        private static _isStackTrace: boolean = false;

        constructor() {
            throw new Error("Logger is static class.");
        }

        /**
         * Initialize method.
         * @static
         * @param [bufferSize=1000] Max size of log message buffer list
         * @param loggingTargets Specify Logging target strings.
         */
        public static initialize(bufferSize: number = 1000, ...loggingTargets: LogType[]): void {
            if (loggingTargets.length <= 0) {
                loggingTargets = ["debug", "error", "info", "log", "warn"];
            }
            this._bufferSize = bufferSize;
            this.clear();
            this.setLoggingTarget.apply(this, loggingTargets);
            this._hook();
        }

        /**
         * Make to empty buffer list.
         * @static
         */
        public static clear(): void {
            this._buffer = [];
        }

        /**
         * Set filter logging target.
         * @static
         * @param loggingTargets Specify Logging target strings.
         */
        public static setLoggingTarget(...loggingTargets: LogType[]): void {
            if (!loggingTargets) {
                return;
            }
            // set logging target bit flag
            this._loggingTarget = 0;
            for (let target of loggingTargets) {
                if (!(target in LoggingTarget)) {
                    continue;
                }
                this._loggingTarget |= LoggingTarget[target];
            }
        }

        /**
         * Set Logging buffer size.
         * @param bufferSize Number of logs to keep.
         */
        public static setLogBufferSize(bufferSize: number): void {
            bufferSize = bufferSize || 0;
            this._bufferSize = bufferSize;
            this._rotate();
        }

        /**
         * Set enable of stack trace on hooked console method.
         * @param enabled true: show stack trace on hooked console method.
         */
        public static setStackTraceOnConsole(enabled: boolean): void {
            this._isStackTrace = enabled;
        }

        /**
         * Append log message to buffer list.
         * @static
         * @param type Log type string
         * @param messages Target of message
         */
        public static push(type: LogType, messages: any[]): void {
            if (!this._isLoggingTarget(type)) {
                return;
            }

            let message = "";
            let delimiter = ", ";
            // formatting arguments taken to console method to string
            for (let i = 0; i < messages.length; i++) {
                let item = messages[i];
                if (i > 0) {
                    message += delimiter;
                }
                switch (typeof item) {
                    // string
                    case typeof "":
                        message += item;
                        break;
                    // number
                    case typeof 0:
                        var _item: number = <number>item;
                        message += _item.toString();
                        break;
                    // object
                    case typeof {}:
                        try {
                            message += JSON.stringify(item);
                        } catch (e) {
                            message += "[object]";
                        }
                    // undefined
                    case typeof undefined:
                        message += "undefined";
                        break;
                    // etc
                    default:
                        message += "";
                        break;
                }
            }
            // append log data
            var logData: LogData = {
                type: type,
                message: message,
                time: new Date()
            };
            this._buffer.push(logData);

            // rotate
            this._rotate();
        }

        /**
         * Log rotate.
         */
        private static _rotate(): void {
            if (this._bufferSize > 0 && this._buffer.length > this._bufferSize) {
                let overSize = this._buffer.length - this._bufferSize;
                this._buffer.splice(0, overSize);
            }
        }

        /**
         * Hook various console method.
         */
        private static _hook(): void {
            let cls = this;
            function _genTraceFunc(type: LogType, origFunc: Function) {
                return (...args: any[]): void => {
                    // original trace
                    origFunc.apply(console, args);
                    if (console.trace && cls._isStackTrace) {
                        console.trace();
                    }

                    // push log data
                    cls.push(type, args);
                    return;
                };
            }

            // console is not defined on not developer mode in old Internet Explorer.
            if (!console) {
                return;
            }

            // console.debug
            console.debug = _genTraceFunc("debug", console.debug);
            // console.error
            console.error = _genTraceFunc("error", console.error);
            // console.info
            console.info = _genTraceFunc("info", console.info);
            // console.log
            console.log = _genTraceFunc("log", console.log);
            // console.warn
            console.warn = _genTraceFunc("warn", console.warn);
        }

        /**
         * Check log type contain in logging targets.
         * @param logType Log type string
         * @return Return true When log type contain in logging target
         */
        private static _isLoggingTarget(logType: LogType): boolean {
            if (!(logType in LoggingTarget)) {
                return false;
            }
            let bits = LoggingTarget[logType];
            return (this._loggingTarget & bits) > 0;
        }

        public static getLogData(): LogData[] {
            return this._buffer;
        }
    }

    Logger.initialize();
}
