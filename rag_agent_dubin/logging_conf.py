import logging.config
import colorlog

def julia_fiesta_logs():
    logging_config = {
        'version': 1,
        'disable_existing_loggers': False,
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
            },
            'file': {
                'level': 'DEBUG',
                'class': 'logging.FileHandler',
                'filename': 'debug.log',
                'formatter': 'emoji_file',
                'encoding': 'utf-8',  # Important for emoji compatibility
            },
        },
        'loggers': {
            # Root logger
            '': {
                'handlers': ['console', 'file'],
                'level': 'DEBUG',
                'propagate': True,
            },

            # Dubin RAG agents
            'router.dubin': {
                'handlers': ['console', 'file'],
                'level': 'DEBUG',
                'propagate': False,
            },
            'agent.julia': {
                'handlers': ['console', 'file'],
                'level': 'DEBUG',
                'propagate': False,
            },
            'agent.kadian': {
                'handlers': ['console', 'file'],
                'level': 'DEBUG',
                'propagate': False,
            },

            # If Django logs are ever used in this repo
            'django': {
                'handlers': ['console', 'file'],
                'level': 'DEBUG',
                'propagate': True,
            },
            'django.request': {
                'handlers': ['console', 'file'],
                'level': 'DEBUG',
                'propagate': False,
            },
        },
    }

    logging.config.dictConfig(logging_config)
