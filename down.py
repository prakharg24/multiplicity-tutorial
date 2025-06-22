import requests
import pandas as pd
import time
from tqdm import tqdm

API_URL = "https://api.semanticscholar.org/graph/v1/paper/search"

def search_paper_semanticscholar(paper_name, max_retries=5):
    params = {
        'query': paper_name,
        'fields': 'title,authors,url',
        'limit': 1
    }
    retry_delay = 5  # start with 5 seconds
    for attempt in range(max_retries):
        try:
            response = requests.get(API_URL, params=params)
            if response.status_code == 200:
                data = response.json()
                if 'data' in data and len(data['data']) > 0:
                    paper = data['data'][0]
                    title = paper.get('title', '')
                    authors = ', '.join([author['name'] for author in paper.get('authors', [])])
                    link = paper.get('url', '')
                    return title, authors, link
                else:
                    return '', '', ''
            elif response.status_code == 429:
                print(f"Rate limit hit. Waiting {retry_delay} seconds before retrying...")
                time.sleep(retry_delay)
                retry_delay *= 2  # exponential backoff
            else:
                print(f"Error {response.status_code} for query '{paper_name}': {response.text}")
                return '', '', ''
        except Exception as e:
            print(f"Exception for query '{paper_name}': {e}")
            return '', '', ''
    print(f"Max retries exceeded for query '{paper_name}'")
    return '', '', ''

def main(input_csv, output_csv):
    df = pd.read_csv(input_csv)
    results = []

    # assuming paper names are in a column named 'paper_name'
    for paper, tags in tqdm(zip(df['Title'], df['Tags'])):
        title, authors, link = search_paper_semanticscholar(paper)

        authors = authors.replace(',', ';')
        tags = tags.replace(',', ';')
        results.append({'Title': title, 'Link': link, 'Authors': authors, 'Tags': tags})

        results_df = pd.DataFrame(results)
        results_df.to_csv(output_csv, index=False)
        # print(f"Saved results to {output_csv}")

if __name__ == '__main__':
    main('long_list.csv', 'papers_metadata.csv')
