from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from django.contrib.auth.models import User
from transactions.models import Category, Transaction


class TransactionTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="testuser", password="pass1234")
        self.client.login(username="testuser", password="pass1234")
        self.category = Category.objects.create(name="Food", user=self.user, type="expense")

        url = reverse('token_obtain_pair')
        response = self.client.post(url, {"username": "testuser", "password": "pass1234"})
        self.token = response.data["access"]
        self.auth_headers = {"HTTP_AUTHORIZATION": f"Bearer {self.token}"}

    def test_create_transaction(self):
        url = reverse('transaction-list')
        data = {"amount": 50, "category_id": self.category.id}
        response = self.client.post(url, data, **self.auth_headers)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_get_transactions(self):
        Transaction.objects.create(user=self.user, amount=30, category=self.category)
        url = reverse('transaction-list')
        response = self.client.get(url, **self.auth_headers)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data), 1)

    def test_update_transaction(self):
        txn = Transaction.objects.create(user=self.user, amount=20, category=self.category)
        url = reverse('transaction-detail', kwargs={'pk': txn.pk})
        response = self.client.patch(url, {"amount": 100}, **self.auth_headers)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["amount"], 100)

    def test_delete_transaction(self):
        txn = Transaction.objects.create(user=self.user, amount=10, category=self.category)
        url = reverse('transaction-detail', kwargs={'pk': txn.pk})
        response = self.client.delete(url, **self.auth_headers)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_user_cannot_access_others_transactions(self):
        other_user = User.objects.create_user(username="otheruser", password="otherpass")
        other_category = Category.objects.create(name="Bills", user=other_user)
        other_txn = Transaction.objects.create(user=other_user, amount=999, category=other_category)

        # Try to access the transaction created by another user
        url = reverse('transaction-detail', kwargs={'pk': other_txn.pk})
        response = self.client.get(url, **self.auth_headers)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_user_cannot_update_others_transaction(self):
        other_user = User.objects.create_user(username="otheruser2", password="otherpass2")
        other_category = Category.objects.create(name="Salary", user=other_user)
        other_txn = Transaction.objects.create(user=other_user, amount=500, category=other_category)

        url = reverse('transaction-detail', kwargs={'pk': other_txn.pk})
        response = self.client.patch(url, {"amount": 5}, **self.auth_headers)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_user_cannot_delete_others_transaction(self):
        other_user = User.objects.create_user(username="otheruser3", password="otherpass3")
        other_category = Category.objects.create(name="Other", user=other_user)
        other_txn = Transaction.objects.create(user=other_user, amount=300, category=other_category)

        url = reverse('transaction-detail', kwargs={'pk': other_txn.pk})
        response = self.client.delete(url, **self.auth_headers)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
