import os

def create_folder_structure(base_path):
    folder_structure = {
        '.vscode': ['settings.json'],
        '.github/workflows': ['unittests.yml'],
        'src': [],
        'notebooks': ['__init__.py', 'README.md'],
        'tests': ['__init__.py'],
        'scripts': ['__init__.py', 'README.md'],
    }

    files = ['.gitignore', 'requirements.txt', 'README.md']

    # Create directories and files
    for folder, sub_files in folder_structure.items():
        folder_path = os.path.join(base_path, folder)
        os.makedirs(folder_path, exist_ok=True)
        for file in sub_files:
            file_path = os.path.join(folder_path, file)
            with open(file_path, 'w') as f:
                f.write('')

    # Create root-level files  activate: venv\Scripts\activate  create: python -m venv venv 
    for file in files:
        file_path = os.path.join(base_path, file)
        with open(file_path, 'w') as f:
            f.write('')

if __name__ == "__main__":
    base_path = os.getcwd()  # Change this to your desired root path
    create_folder_structure(base_path)
    print(f"Folder structure created under: {base_path}")
 