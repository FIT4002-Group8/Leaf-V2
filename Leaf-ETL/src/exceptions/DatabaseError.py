class DatabaseError(RuntimeError):
    def __init__(self, message, original_error=None):
        super().__init__(message)
        self.message = message
        self.original_error = original_error

    def __str__(self):
        if self.original_error:
            return f"{self.message} (Original exception: {self.original_error})"
        return self.message
