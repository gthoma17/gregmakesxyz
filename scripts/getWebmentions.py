import json
import sys
import os
import os.path
import itertools
from urllib.request import urlopen
from urllib.parse import urlparse

CONTENT_PATH_ROOT = "astro_site/src/content"

def main():

  webmention_url = os.getenv("WEBMENTIONS_URL")
  webmention_domain = urlparse(webmention_url).netloc
  if webmention_url == None:
    print("Webmentions url invalid, failing...")
    sys.exit(1) 

  raw_webmentions = get_raw_webmentions(webmention_url)

  if len(raw_webmentions) == 0:
    print("No webmentions found, exiting...")
    sys.exit(0) 

  processed_webmentions = [process_webmention(mention, webmention_domain) for mention in raw_webmentions]

  grouped_webmentions = itertools.groupby(raw_webmentions, key=lambda m: m["relative_url"])

  for relative_url, group_of_webmentions in grouped_webmentions:
    webmentions_for_content = list(group_of_webmentions)
    write_webmentions_to_content_path(relative_url, webmentions_for_content)
    print("Writing {} webmention(s) to {}".format(len(webmentions_for_content),relative_url))

def get_raw_webmentions(webmentions_url):
  try:
    raw_response = urlopen(webmentions_url).read()
    return json.loads(raw_response)["json"]
  except:
    traceback.print_exc()
    print("\n\n encountered the above error while retrieving webmentions. Failing...")
    sys.exit(1) 

def process_webmention(webmention, webmention_domain):
  webmention["relative_url"] = webmention["target"].split(webmention_domain,1)[1]
  return webmention
  

def write_webmentions_to_content_path(relative_url, webmention):
  content_path = CONTENT_PATH_ROOT + relative_url
  
  # Handle Hugo-style index.md files in folders
  if os.path.isfile(content_path+"index.md"):
    write_webmentions_to_file(webmention, content_path)
    return
  
  # Handle Astro-style flattened .md files
  # Convert /posts/backinbusiness/ to /posts/BackInBusiness.md
  if relative_url.startswith("/posts/") and relative_url.endswith("/"):
    slug = relative_url[7:-1]  # Remove "/posts/" and trailing "/"
    # Try to find matching post file (case insensitive)
    posts_dir = CONTENT_PATH_ROOT + "/posts"
    if os.path.isdir(posts_dir):
      for filename in os.listdir(posts_dir):
        if filename.lower().replace('.md', '') == slug.lower():
          file_path = posts_dir + "/" + filename
          webmentions_path = posts_dir + "/" + filename.replace('.md', '') + "-webmentions.json"
          with open(webmentions_path, "w") as outfile:
            json.dump(webmention, outfile)
          return
  
  # Handle notes similarly
  if relative_url.startswith("/notes/") and relative_url.endswith("/"):
    slug = relative_url[7:-1]  # Remove "/notes/" and trailing "/"
    notes_dir = CONTENT_PATH_ROOT + "/notes"
    if os.path.isdir(notes_dir):
      for filename in os.listdir(notes_dir):
        if filename.lower().replace('.md', '') == slug.lower():
          file_path = notes_dir + "/" + filename
          webmentions_path = notes_dir + "/" + filename.replace('.md', '') + "-webmentions.json"
          with open(webmentions_path, "w") as outfile:
            json.dump(webmention, outfile)
          return


def write_webmentions_to_file(output, path):
  file_name = path + "webmentions.json"
  output_as_string = json.dumps(output)
  with open(file_name, "w") as outfile:
    outfile.write(output_as_string)


if __name__ == "__main__":
    main()