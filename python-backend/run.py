from app import create_app

app = create_app()

# - Cli to create a new virtual env in "ROOT FOLDER": python3 -m venv .venv
# - Cli to activate virtual env in "ROOT FOLDER": source .venv/bin/activate
# - Cli to exit virtual env: deactivate

# - Cli to run app in "PYTHON PROJECT FOLDER":
# export FLASK_APP=run.py
# export FLASK_ENV=development
# flask run --reload --port=8088

# - Cli to install packages in virtual env from "requirement.text" file:
# pip install -r ./python-backend/requirements.txt

# - Cli to update packages list in "requirement.text" after install new package: 
# pip freeze > requirements.txt
if __name__ == "__main__":
    # This allows running the app with "python run.py" as well.
    # The host is set to '0.0.0.0', so python server 
    # listens on all interfaces (both external and localhost of physical machine or VM or container).
    app.run(host="0.0.0.0", port=8088)
