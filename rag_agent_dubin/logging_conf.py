import os
import logging
import logging.config
import colorlog

# 🛡️ Ensure logs/ directory exists to prevent FileNotFoundError
os.makedirs("logs", exist_ok=True)

class RedactOpenAITokenFilter(logging.Filter):
    """Redacts OpenAI API keys in logs."""
    def filter(self, record):
        if record.args:
            record.args = tuple(
                str(arg).replace("sk-", "sk-***") if isinstance(arg, str) else arg
                for arg in record.args
            )
        return True


class FixOpenAILogFormat(logging.Filter):
    """Prevents TypeError when OpenAI SDK logs dict keys as args."""
    def filter(self, record):
        if isinstance(record.args, tuple) and len(record.args) == 1 and isinstance(record.args[0], dict):
            record.msg = f"{record.msg} {record.args[0]}"
            record.args = ()
        return True


def julia_fiesta_logs():
    logging_config = {
        'version': 1,
        'disable_existing_loggers': False,

        'filters': {
            'redact_openai_token': {
                '()': RedactOpenAITokenFilter,
            },
            'fix_openai_logs': {
                '()': FixOpenAILogFormat,
            },
        },

        'formatters': {
            'color_console': {
                '()': 'colorlog.ColoredFormatter',
                'format': '{log_color}{levelname:<8}{reset} {asctime} {blue}{filename}:{lineno}{reset} {message}',
                'style': '{',
                'log_colors': {
                    'DEBUG': 'cyan',
                    'INFO': 'green',
                    'WARNING': 'yellow',
                    'ERROR': 'red',
                    'CRITICAL': 'bold_red',
                },
            },
            'emoji_file': {
                'format': '{asctime} 📝 {levelname:<8} {filename}:{lineno} — {message}',
                'style': '{',
            },
        },

        'handlers': {
            'console': {
                'level': 'DEBUG',
                'class': 'colorlog.StreamHandler',
                'formatter': 'color_console',
                'filters': ['redact_openai_token', 'fix_openai_logs'],
            },
            'file_all': {
                'level': 'DEBUG',
                'class': 'logging.FileHandler',
                'filename': 'logs/all_debug.log',
                'formatter': 'emoji_file',
                'encoding': 'utf-8',
                'filters': ['redact_openai_token', 'fix_openai_logs'],
            },
            'file_julia': {
                'level': 'DEBUG',
                'class': 'logging.FileHandler',
                'filename': 'logs/julia.log',
                'formatter': 'emoji_file',
                'encoding': 'utf-8',
                'filters': ['redact_openai_token', 'fix_openai_logs'],
            },
            'file_dubin': {
                'level': 'DEBUG',
                'class': 'logging.FileHandler',
                'filename': 'logs/dubin.log',
                'formatter': 'emoji_file',
                'encoding': 'utf-8',
                'filters': ['redact_openai_token', 'fix_openai_logs'],
            },
            'file_kadian': {
                'level': 'DEBUG',
                'class': 'logging.FileHandler',
                'filename': 'logs/kadian.log',
                'formatter': 'emoji_file',
                'encoding': 'utf-8',
                'filters': ['redact_openai_token', 'fix_openai_logs'],
            },
        },

        'loggers': {
            '': {
                'handlers': ['console', 'file_all'],
                'level': 'DEBUG',
                'propagate': True,
            },
            'agent.julia': {
                'handlers': ['console', 'file_julia'],
                'level': 'DEBUG',
                'propagate': False,
            },
            'agent.kadian': {
                'handlers': ['console', 'file_kadian'],
                'level': 'DEBUG',
                'propagate': False,
            },
            'router.dubin': {
                'handlers': ['console', 'file_dubin'],
                'level': 'DEBUG',
                'propagate': False,
            },
        }
    }

    logging.config.dictConfig(logging_config)

    # 🚫 Quiet OpenAI SDK + httpx noise globally
    for noisy in ["openai", "httpx", "httpcore"]:
        logging.getLogger(noisy).setLevel(logging.WARNING)
