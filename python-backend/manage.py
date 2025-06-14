#!/usr/bin/env python
"""Django's command-line utility for administrative tasks."""
import os
import sys

# Cli to start virtual env: source venv/bin/activate
# Cli to run app: python manage.py runserver 8088

# Cli to update requirement.text after install new package: 
# pip freeze > requirements.txt
def main():
    """Run administrative tasks."""
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
    execute_from_command_line(sys.argv)


if __name__ == '__main__':
    main()
