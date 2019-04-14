/// <reference path="./common.ts" />
/// <reference path="./logger.ts" />

namespace JSConsoleLogger {
    /**
     * Logging message as a type "log".
     * @param args Logging messages.
     */
    export function log(...args: any[]): void {
        Logger.push("log", args);
    }

    /**
     * Logging message as a type "info".
     * @param args Logging messages.
     */
    export function info(...args: any[]): void {
        Logger.push("info", args);
    }

    /**
     * Logging message as a type "debug".
     * @param args Logging messages.
     */
    export function debug(...args: any[]): void {
        Logger.push("debug", args);
    }

    /**
     * Logging message as a type "warn".
     * @param args Logging messages.
     */
    export function warn(...args: any[]): void {
        Logger.push("warn", args);
    }

    /**
     * Logging message as a type "error".
     * @param args Logging messages.
     */
    export function error(...args: any[]): void {
        Logger.push("error", args);
    }

    /**
     * Clear Log buffer.
     */
    export function clear(): void {
        Logger.clear();
    }

    /**
     * Get log data list.
     * @return log data object list.
     */
    export function getLogData(): LogData[] {
        return Logger.getLogData();
    }

    /**
     * Get Log file blob object.
     * @param [mimeType="text/plain"] Specify mime type string.
     * @param [withBOM=false] true : Insert BOM to top of the file.
     * @param [lineFeedCodeType="crlf"] Specify linefeed code type. "cr" | "lf" | "crlf".
     */
    export function getLogFileBlob(mimeType: string = "text/plain", withBOM: boolean = false, lineFeedCodeType: LineFeedCodeType = "crlf"): Blob {
        let logData = Logger.getLogData();
        let logFile = new LogFile(logData, mimeType, withBOM, lineFeedCodeType);
        return logFile.entity;
    }

    /**
     * Save log file to local.
     * @param [filename] Download filename.
     * @param [mimeType="text/plain"] Specify mime type string.
     * @param [withBOM=false] true : Insert BOM to top of the file.
     * @param [lineFeedCodeType="crlf"] Specify linefeed code type. "cr" | "lf" | "crlf".
     */
    export function save(
        filename: string = null,
        mimeType: string = "text/plain",
        withBOM: boolean = false,
        lineFeedCodeType: LineFeedCodeType = "crlf"
    ): void {
        let logData = Logger.getLogData();
        let logFile = new LogFile(logData, mimeType, withBOM, lineFeedCodeType);
        Downloader.download(logFile, filename);
    }

    /**
     * Set filter logging target.
     * @param loggingTargets - Specify Logging target strings.
     */
    export function setLoggingTarget(...loggingTargets: LogType[]): void {
        Logger.setLoggingTarget.apply(Logger, loggingTargets);
    }

    /**
     * Set Logging buffer size.
     * @param bufferSize Number of logs to keep.
     */
    export function setLogBufferSize(bufferSize: number): void {
        Logger.setLogBufferSize(bufferSize);
    }

    /**
     * Hooking a console method can obcure the caller on browser console.
     * The problem is solved by displaying the stack trace
     * when the hooked console method is executed.
     * This feature is off by default.
     * @param enabled true: show stack trace on hooked console method.
     */
    export function setStackTraceOnConsole(enabled: boolean): void {
        Logger.setStackTraceOnConsole(enabled);
    }
}
