from django.urls import path
from .views import get_all_music, get_liked_music, get_playlist, add_music, login_view, signup_view

urlpatterns = [
    path('all_music/', get_all_music, name='all_music'),
    path('liked_music/<int:user_id>/', get_liked_music, name='liked_music'),
    path('playlist/<int:user_id>/', get_playlist, name='playlist'),
    path('add_music/', add_music, name='add_music'),
    path('login/', login_view, name='login'),
    path('signup/', signup_view, name='signup'),
]
