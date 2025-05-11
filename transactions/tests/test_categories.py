from rest_framework.test import APITestCase
from django.urls import reverse
from rest_framework import status
from django.contrib.auth.models import User
from transactions.models import Category


class CategoryTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="testuser", password="pass1234")
        self.client.login(username="testuser", password="pass1234")

        url = reverse('token_obtain_pair')
        response = self.client.post(url, {"username": "testuser", "password": "pass1234"})
        self.token = response.data["access"]
        self.auth_headers = {"HTTP_AUTHORIZATION": f"Bearer {self.token}"}

    def test_create_category(self):
        url = reverse('category-list')
        data = {"name": "Groceries", "type": "expense"}
        response = self.client.post(url, data, **self.auth_headers)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Category.objects.count(), 1)

    def test_get_categories(self):
        Category.objects.create(name="Utilities", user=self.user)
        url = reverse('category-list')
        response = self.client.get(url, **self.auth_headers)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_update_category(self):
        cat = Category.objects.create(name="Health", user=self.user)
        url = reverse('category-detail', kwargs={'pk': cat.pk})
        response = self.client.patch(url, {"name": "Fitness"}, **self.auth_headers)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["name"], "Fitness")

    def test_delete_category(self):
        cat = Category.objects.create(name="Old", user=self.user)
        url = reverse('category-detail', kwargs={'pk': cat.pk})
        response = self.client.delete(url, **self.auth_headers)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_user_cannot_access_others_categories(self):
        other_user = User.objects.create_user(username="otheruser", password="otherpass")
        other_cat = Category.objects.create(name="Private", user=other_user)

        url = reverse('category-detail', kwargs={'pk': other_cat.pk})
        response = self.client.get(url, **self.auth_headers)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_user_cannot_update_others_category(self):
        other_user = User.objects.create_user(username="otheruser2", password="otherpass2")
        other_cat = Category.objects.create(name="Work", user=other_user)

        url = reverse('category-detail', kwargs={'pk': other_cat.pk})
        response = self.client.patch(url, {"name": "Hacked"}, **self.auth_headers)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_user_cannot_delete_others_category(self):
        other_user = User.objects.create_user(username="otheruser3", password="otherpass3")
        other_cat = Category.objects.create(name="Secret", user=other_user)

        url = reverse('category-detail', kwargs={'pk': other_cat.pk})
        response = self.client.delete(url, **self.auth_headers)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
