from rest_framework.test import APITestCase
from django.urls import reverse
from rest_framework import status
from django.contrib.auth.models import User


class AuthTests(APITestCase):
    def test_register_user(self):
        url = reverse('register')
        data = {"username": "testuser", "password": "TestPass123!"}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(User.objects.filter(username="testuser").exists())

    def test_login_user(self):
        User.objects.create_user(username="testuser", password="TestPass123!")
        url = reverse('token_obtain_pair')
        data = {"username": "testuser", "password": "TestPass123!"}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data)

    def test_login_refresh(self):
        User.objects.create_user(username="testuser", password="TestPass123!")
        url = reverse('token_refresh')
        data = {"refresh": "dummy_refresh_token"}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
