#!/usr/bin/env python3
"""Local development runner"""

import os
import sys
from app import app
from config import Config

if __name__ == '__main__':
    print(f"Starting {os.getenv('SERVICE_NAME', 'ML Model')} server...")
    print(f"Environment: {Config.ENVIRONMENT}")
    print(f"Debug mode: {Config.DEBUG}")
    print(f"Server will be available at: http://{Config.HOST}:{Config.PORT}")
    
    app.run(
        host=Config.HOST,
        port=Config.PORT,
        debug=Config.DEBUG
    )
