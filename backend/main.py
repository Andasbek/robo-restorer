# # backend/main.py

# import argparse
# from backend.ui.cli_app_0 import run_cli

# def main():
#     parser = argparse.ArgumentParser(description="AI Conservator CLI")
#     parser.add_argument(
#         "--image",
#         required=True,
#         help="Путь к изображению артефакта (JPEG/PNG)."
#     )
#     args = parser.parse_args()
#     run_cli(args.image)

# if __name__ == "__main__":
#     main()


# backend/main.py (версия с эмулятором)

import argparse
from backend.ui.cli_app import run_cli

def main():
    parser = argparse.ArgumentParser(description="AI Conservator CLI")
    parser.add_argument(
        "--image",
        required=True,
        help="Путь к изображению артефакта (JPEG/PNG)."
    )
    parser.add_argument(
        "--emulator",
        action="store_true",
        help="Использовать эмулятор датчиков вместо Arduino."
    )
    args = parser.parse_args()

    run_cli(args.image, use_emulator=args.emulator)

if __name__ == "__main__":
    main()
