from urllib.parse import urlparse, urlunparse, parse_qs, urlencode

def append_transformation(url: str, tr: str) -> str:
    parsed = urlparse(url)
    query = parse_qs(parsed.query)
    query['tr'] = tr  # this overwrites any existing 'tr' if present
    new_query = urlencode(query, doseq=True)
    return urlunparse(parsed._replace(query=new_query))