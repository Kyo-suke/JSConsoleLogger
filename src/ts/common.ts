namespace JSConsoleLogger {
    export type LogType = "debug" | "error" | "info" | "log" | "warn";
    export type LineFeedCodeType = "lf" | "cr" | "crlf";

    /**
     * Define bit on log type.
     */
    export enum LoggingTarget {
        "debug" = 1,
        "error" = 2,
        "info" = 4,
        "log" = 8,
        "warn" = 16
    }

    /**
     * Log data object.
     */
    export interface LogData {
        type: LogType;
        message: string;
        time: Date;
    }
}
