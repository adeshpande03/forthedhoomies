import os
import json
#! RUN THIS BEFORE GIT PUSHING
def main():
    directory_path = './img'
    json_file_path = 'filenames.json'
    filenames = []
    for filename in os.listdir(directory_path):
        file_path = os.path.join(directory_path, filename)
        if os.path.isfile(file_path):
            filenames.append(filename)
    filenames.sort(key = lambda x: int(x[:-4]))
    with open(json_file_path, 'w') as json_file:
        json.dump(filenames, json_file)
    print(f"Filenames have been saved to {json_file_path}.")
main()