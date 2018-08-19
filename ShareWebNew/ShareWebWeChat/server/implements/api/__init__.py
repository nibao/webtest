"""
useful handler methods to overwrite
"""


def get_debug_post(self):
    if self.debug:
        self.post()


def write_error_log2db(self, status_code, **kwargs):
    try:
        e = kwargs["exc_info"]
        if isinstance(e, Exception):
            #todo: write log to database
            pass
    except KeyError:
        pass
