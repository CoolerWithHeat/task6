from django.test import TestCase
import requests

request = requests.post('http://127.0.0.1:8000/Clear/badassGuys/')

print(request.status_code)