from django import template
import re

register = template.Library()

@register.filter
def youtube_id(value):
    """
    Extracts the YouTube video ID from a URL.
    """
    if not value:
        return ''
    regex = r'(?:v=|be/|embed/)([A-Za-z0-9_-]{11})'
    match = re.search(regex, value)
    if match:
        return match.group(1)
    return ''