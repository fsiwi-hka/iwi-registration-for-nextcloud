#! /usr/bin/python3
import unittest
import os
import json
from iwi_api import getBearerToken, callRESTapi

class TestApi(unittest.TestCase):
    def setUp(self):
        self.base_url = 'https://www.iwi.h-ka.de/iwii/REST'
        self.username = os.environ.get('IWI_API_USERNAME')
        self.password = os.environ.get('IWI_API_PASSWORD')
    
    def test_getBearerToken(self):
        token = getBearerToken(self.username, self.password, self.base_url)
        self.assertIsInstance(token, str)
    
    def test_callRESTapi(self):
        token = getBearerToken(self.username, self.password, self.base_url)
        response = callRESTapi(token, self.base_url)
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.text)
        self.assertIsInstance(data, dict)
        self.assertIn('role', data)
        self.assertIsInstance(data['role'], str)
        self.assertIn('faculty', data['student'])
        self.assertIsInstance(data['student']['faculty'], str)

if __name__ == '__main__':
    unittest.main()
