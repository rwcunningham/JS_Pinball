from flask import Flask


def create_app():
    app = Flask(__name__)
    app.run(use_reloader=True)
    
    from .routes import main
    app.register_blueprint(main)
    return app

    
