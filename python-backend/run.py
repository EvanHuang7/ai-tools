from app import create_app

app = create_app()

# Cli to start virtual env: source .venv/bin/activate
# Cli to exit virtual env: deactivate

# Cli to run app:
# export FLASK_APP=run.py
# export FLASK_ENV=development
# flask run --reload --port=8088

# Cli to install packages in "requirement.text":
# pip install -r ./python-backend/requirements.txt

# Cli to update "requirement.text" after install new package: 
# pip freeze > requirements.txt
if __name__ == "__main__":
    # This allows running the app with "python run.py" as well.
    # The host is set to '0.0.0.0', so python server 
    # listens on all interfaces (external + localhost).
    app.run(host="0.0.0.0", port=8088)
