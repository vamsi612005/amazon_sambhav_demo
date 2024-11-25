from django.urls import path
from . import views  # Import your views

urlpatterns = [
    # Add this line to map your API endpoint
    path('scrape_instagram/', views.scrape_instagram, name='scrape_instagram'),
]