/**
 * JSConsoleLogger v1.0.0
 * Released under the MIT license
 * https://github.com/Kyo-suke/JSConsoleLogger
 */
var JSConsoleLogger;
(function (JSConsoleLogger) {
    var LoggingTarget;
    (function (LoggingTarget) {
        LoggingTarget[LoggingTarget["debug"] = 1] = "debug";
        LoggingTarget[LoggingTarget["error"] = 2] = "error";
        LoggingTarget[LoggingTarget["info"] = 4] = "info";
        LoggingTarget[LoggingTarget["log"] = 8] = "log";
        LoggingTarget[LoggingTarget["warn"] = 16] = "warn";
    })(LoggingTarget = JSConsoleLogger.LoggingTarget || (JSConsoleLogger.LoggingTarget = {}));
})(JSConsoleLogger || (JSConsoleLogger = {}));
var JSConsoleLogger;
(function (JSConsoleLogger) {
    var Downloader = (function () {
        function Downloader() {
            throw new Error("Downloader is static class.");
        }
        Downloader.download = function (logFile, filenameBase) {
            var _this = this;
            var blob = logFile.entity;
            if (!blob) {
                return;
            }
            var filename = this._genFilename(filenameBase);
            if (navigator.msSaveBlob) {
                navigator.msSaveBlob(blob, filename);
                return;
            }
            var url = null;
            try {
                var element = this._createLinkElement();
                url = URL.createObjectURL(blob);
                this._setAttributes(element, filename, url);
                element.click();
                setTimeout(function () {
                    _this._revoke(url);
                }, this.REVOKE_TIMEOUT);
            }
            catch (e) {
                console.error("failed to download.");
                console.error(e.meesage);
                console.error(e.stack);
                this._removeLinkElement();
                if (url) {
                    this._revoke(url);
                }
            }
        };
        Downloader._revoke = function (url) {
            URL.revokeObjectURL(url);
            this._removeLinkElement();
        };
        Downloader._genFilename = function (filenameBase) {
            if (!filenameBase) {
                filenameBase = this.DEFAULT_FILENAME;
            }
            var filename = filenameBase;
            var date = new Date();
            var d = [date.getFullYear(), date.getMonth(), date.getDate()].join("");
            filename = filename.replace("%d", d);
            var t = [date.getHours(), date.getMinutes(), date.getSeconds()].join("");
            filename = filename.replace("%t", t);
            return filename;
        };
        Downloader._createLinkElement = function () {
            var element = document.querySelector("#" + this.ELEMENT_ID);
            if (element) {
                this._removeLinkElement();
            }
            var a = document.createElement("a");
            a.setAttribute("id", this.ELEMENT_ID);
            a.setAttribute("download", "");
            a.setAttribute("target", "_blank");
            a.setAttribute("href", "");
            a.setAttribute("style", "display: block; visibility: hidden; width: 0; height: 0;");
            return document.body.appendChild(a);
        };
        Downloader._removeLinkElement = function () {
            var element = document.querySelector("#" + this.ELEMENT_ID);
            if (element) {
                document.body.removeChild(element);
            }
        };
        Downloader._setAttributes = function (element, filename, href) {
            element.setAttribute("download", filename);
            element.setAttribute("href", href);
            return element;
        };
        Downloader.ELEMENT_ID = "JSConsoleLogDownloader";
        Downloader.DEFAULT_FILENAME = "log_%d_%t.log";
        Downloader.REVOKE_TIMEOUT = 5000;
        return Downloader;
    }());
    JSConsoleLogger.Downloader = Downloader;
})(JSConsoleLogger || (JSConsoleLogger = {}));
var JSConsoleLogger;
(function (JSConsoleLogger) {
    var Logger = (function () {
        function Logger() {
            throw new Error("Logger is static class.");
        }
        Logger.initialize = function (bufferSize) {
            if (bufferSize === void 0) { bufferSize = 1000; }
            var loggingTargets = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                loggingTargets[_i - 1] = arguments[_i];
            }
            if (loggingTargets.length <= 0) {
                loggingTargets = ["debug", "error", "info", "log", "warn"];
            }
            this._bufferSize = bufferSize;
            this.clear();
            this.setLoggingTarget.apply(this, loggingTargets);
            this._hook();
        };
        Logger.clear = function () {
            this._buffer = [];
        };
        Logger.setLoggingTarget = function () {
            var loggingTargets = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                loggingTargets[_i] = arguments[_i];
            }
            if (!loggingTargets) {
                return;
            }
            this._loggingTarget = 0;
            for (var _a = 0, loggingTargets_1 = loggingTargets; _a < loggingTargets_1.length; _a++) {
                var target = loggingTargets_1[_a];
                if (!(target in JSConsoleLogger.LoggingTarget)) {
                    continue;
                }
                this._loggingTarget |= JSConsoleLogger.LoggingTarget[target];
            }
        };
        Logger.setLogBufferSize = function (bufferSize) {
            bufferSize = bufferSize || 0;
            this._bufferSize = bufferSize;
            this._rotate();
        };
        Logger.setStackTraceOnConsole = function (enabled) {
            this._isStackTrace = enabled;
        };
        Logger.push = function (type, messages) {
            if (!this._isLoggingTarget(type)) {
                return;
            }
            var message = "";
            var delimiter = ", ";
            for (var i = 0; i < messages.length; i++) {
                var item = messages[i];
                if (i > 0) {
                    message += delimiter;
                }
                switch (typeof item) {
                    case typeof "":
                        message += item;
                        break;
                    case typeof 0:
                        var _item = item;
                        message += _item.toString();
                        break;
                    case typeof {}:
                        try {
                            message += JSON.stringify(item);
                        }
                        catch (e) {
                            message += "[object]";
                        }
                    case typeof undefined:
                        message += "undefined";
                        break;
                    default:
                        message += "";
                        break;
                }
            }
            var logData = {
                type: type,
                message: message,
                time: new Date()
            };
            this._buffer.push(logData);
            this._rotate();
        };
        Logger._rotate = function () {
            if (this._bufferSize > 0 && this._buffer.length > this._bufferSize) {
                var overSize = this._buffer.length - this._bufferSize;
                this._buffer.splice(0, overSize);
            }
        };
        Logger._hook = function () {
            var cls = this;
            function _genTraceFunc(type, origFunc) {
                return function _trace() {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i] = arguments[_i];
                    }
                    if (_trace.caller) {
                        if (_trace.caller === _trace) {
                            return;
                        }
                    }
                    origFunc.apply(console, args);
                    if (console.trace && cls._isStackTrace) {
                        console.trace();
                    }
                    cls.push(type, args);
                    return;
                };
            }
            if (!console) {
                return;
            }
            console.debug = _genTraceFunc("debug", console.debug);
            console.error = _genTraceFunc("error", console.error);
            console.info = _genTraceFunc("info", console.info);
            console.log = _genTraceFunc("log", console.log);
            console.warn = _genTraceFunc("warn", console.warn);
        };
        Logger._isLoggingTarget = function (logType) {
            if (!(logType in JSConsoleLogger.LoggingTarget)) {
                return false;
            }
            var bits = JSConsoleLogger.LoggingTarget[logType];
            return (this._loggingTarget & bits) > 0;
        };
        Logger.getLogData = function () {
            return this._buffer;
        };
        Logger._bufferSize = 1000;
        Logger._isStackTrace = false;
        return Logger;
    }());
    JSConsoleLogger.Logger = Logger;
    Logger.initialize();
})(JSConsoleLogger || (JSConsoleLogger = {}));
var JSConsoleLogger;
(function (JSConsoleLogger) {
    function log() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        JSConsoleLogger.Logger.push("log", args);
    }
    JSConsoleLogger.log = log;
    function info() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        JSConsoleLogger.Logger.push("info", args);
    }
    JSConsoleLogger.info = info;
    function debug() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        JSConsoleLogger.Logger.push("debug", args);
    }
    JSConsoleLogger.debug = debug;
    function warn() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        JSConsoleLogger.Logger.push("warn", args);
    }
    JSConsoleLogger.warn = warn;
    function error() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        JSConsoleLogger.Logger.push("error", args);
    }
    JSConsoleLogger.error = error;
    function clear() {
        JSConsoleLogger.Logger.clear();
    }
    JSConsoleLogger.clear = clear;
    function getLogData() {
        return JSConsoleLogger.Logger.getLogData();
    }
    JSConsoleLogger.getLogData = getLogData;
    function getLogFileBlob(mimeType, withBOM, lineFeedCodeType) {
        if (mimeType === void 0) { mimeType = "text/plain"; }
        if (withBOM === void 0) { withBOM = false; }
        if (lineFeedCodeType === void 0) { lineFeedCodeType = "crlf"; }
        var logData = JSConsoleLogger.Logger.getLogData();
        var logFile = new JSConsoleLogger.LogFile(logData, mimeType, withBOM, lineFeedCodeType);
        return logFile.entity;
    }
    JSConsoleLogger.getLogFileBlob = getLogFileBlob;
    function save(filename, mimeType, withBOM, lineFeedCodeType) {
        if (filename === void 0) { filename = null; }
        if (mimeType === void 0) { mimeType = "text/plain"; }
        if (withBOM === void 0) { withBOM = false; }
        if (lineFeedCodeType === void 0) { lineFeedCodeType = "crlf"; }
        var logData = JSConsoleLogger.Logger.getLogData();
        var logFile = new JSConsoleLogger.LogFile(logData, mimeType, withBOM, lineFeedCodeType);
        JSConsoleLogger.Downloader.download(logFile, filename);
    }
    JSConsoleLogger.save = save;
    function setLoggingTarget() {
        var loggingTargets = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            loggingTargets[_i] = arguments[_i];
        }
        JSConsoleLogger.Logger.setLoggingTarget.apply(JSConsoleLogger.Logger, loggingTargets);
    }
    JSConsoleLogger.setLoggingTarget = setLoggingTarget;
    function setLogBufferSize(bufferSize) {
        JSConsoleLogger.Logger.setLogBufferSize(bufferSize);
    }
    JSConsoleLogger.setLogBufferSize = setLogBufferSize;
    function setStackTraceOnConsole(enabled) {
        JSConsoleLogger.Logger.setStackTraceOnConsole(enabled);
    }
    JSConsoleLogger.setStackTraceOnConsole = setStackTraceOnConsole;
})(JSConsoleLogger || (JSConsoleLogger = {}));
var JSConsoleLogger;
(function (JSConsoleLogger) {
    var LogFormatter = (function () {
        function LogFormatter() {
            throw new Error("LogFormatter is static class.");
        }
        LogFormatter.format = function (logData) {
            var logTypeStr = this._getLogTypeStr(logData.type);
            var dateStr = this._getDataStr(logData.time);
            var timeStr = this._getTimeStr(logData.time);
            var messageStr = logData.message || "";
            return [dateStr, timeStr, logTypeStr, messageStr].join(this.DELIMITER);
        };
        LogFormatter._getLogTypeStr = function (logType) {
            return "[" + logType + "]";
        };
        LogFormatter._getDataStr = function (targetDate) {
            var ret = "";
            try {
                var y = this._paddingStr(targetDate.getFullYear(), "0", 4);
                var m = this._paddingStr(targetDate.getMonth(), "0", 2);
                var d = this._paddingStr(targetDate.getDate(), "0", 2);
                ret = [y, m, d].join("/");
            }
            catch (e) {
                ret = "--/--/--";
            }
            return ret;
        };
        LogFormatter._getTimeStr = function (targetData) {
            var ret = "";
            try {
                var h = this._paddingStr(targetData.getHours(), "0", 2);
                var m = this._paddingStr(targetData.getMinutes(), "0", 2);
                var s = this._paddingStr(targetData.getSeconds(), "0", 2);
                ret = [h, m, s].join(":");
            }
            catch (e) {
                ret = "??:??:??";
            }
            return ret;
        };
        LogFormatter._paddingStr = function (target, paddingChar, length) {
            var ret = "";
            try {
                var paddingStr = new Array(length + 1).join(paddingChar.slice(0, 1));
                ret = (paddingStr + target).slice(-1 * length);
            }
            catch (e) {
                ret = "" + target;
            }
            return ret;
        };
        LogFormatter.DELIMITER = " ";
        return LogFormatter;
    }());
    JSConsoleLogger.LogFormatter = LogFormatter;
})(JSConsoleLogger || (JSConsoleLogger = {}));
var JSConsoleLogger;
(function (JSConsoleLogger) {
    var LogFile = (function () {
        function LogFile(datas, mimeType, withBOM, lineFeedCodeType) {
            if (mimeType === void 0) { mimeType = "text/plain"; }
            if (withBOM === void 0) { withBOM = false; }
            if (lineFeedCodeType === void 0) { lineFeedCodeType = "crlf"; }
            var cls = LogFile;
            this._mimeType = mimeType;
            this._lineFeedCodeType = lineFeedCodeType;
            this._withBOM = withBOM;
            var contents = this._logData2StrList(datas);
            if (this._withBOM) {
                contents.unshift(cls.BOM);
            }
            this._entity = new Blob(contents, { type: this._mimeType });
        }
        LogFile.prototype._logData2StrList = function (datas) {
            var ret = [];
            for (var i = 0; i < datas.length; i++) {
                var logString = JSConsoleLogger.LogFormatter.format(datas[i]);
                logString += "\n";
                logString = this._replaceLineFeedCode(logString);
                ret.push(logString);
            }
            return ret;
        };
        LogFile.prototype._replaceLineFeedCode = function (target) {
            var ret = "";
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
        };
        Object.defineProperty(LogFile.prototype, "entity", {
            get: function () {
                return this._entity;
            },
            enumerable: true,
            configurable: true
        });
        LogFile.BOM = new Uint8Array([0xef, 0xbb, 0xbf]);
        return LogFile;
    }());
    JSConsoleLogger.LogFile = LogFile;
})(JSConsoleLogger || (JSConsoleLogger = {}));
