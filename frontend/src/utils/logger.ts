// src/utils/logger.ts

const isDev = import.meta.env.DEV;

type LogArgs = unknown[]; // 👈 Safer than `any[]`

export const logger = {
    log: (...args: LogArgs): void => {
        if (isDev) console.log("[LOG]", ...args);
    },
    info: (...args: LogArgs): void => {
        if (isDev) console.info("[INFO]", ...args);
    },
    warn: (...args: LogArgs): void => {
        if (isDev) console.warn("[WARN]", ...args);
    },
    error: (...args: LogArgs): void => {
        console.error("[ERROR]", ...args); // always log errors
    },
};
