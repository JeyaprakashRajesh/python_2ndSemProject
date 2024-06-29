import logging
from django.contrib.auth import authenticate, login
from django.contrib.auth.forms import UserCreationForm
from django.http import JsonResponse, HttpResponse
from django.shortcuts import render, redirect
from .models import Music, LikedMusic, Playlist

logger = logging.getLogger(__name__)

def get_all_music(request):
    all_music = Music.objects.all()
    data = [{'title': music.title, 'artist': music.artist, 'audio_file': music.audio_file.url, 'poster': music.poster.url} for music in all_music]
    return JsonResponse(data, safe=False)

def get_liked_music(request, user_id):
    liked_music = LikedMusic.objects.filter(user_id=user_id).values('music__title', 'music__artist', 'music__audio_file', 'music__poster')
    return JsonResponse(list(liked_music), safe=False)

def get_playlist(request, user_id):
    playlist = Playlist.objects.filter(user_id=user_id).values('music__title', 'music__artist', 'music__audio_file', 'music__poster')
    return JsonResponse(list(playlist), safe=False)

def add_music(request):
    return JsonResponse({'message': 'Music added successfully'})

def login_view(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        logger.debug("Attempting login with username: %s", username)
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return redirect('home') 
            logger.error("Invalid login for username: %s", username)
            return render(request, 'login.html', {'error_message': 'Invalid username or password'})
    else:
        return render(request, 'login.html')

def signup_view(request):
    if request.method == 'POST':
        form = UserCreationForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('login') 
        else:
            logger.error("Signup form is not valid: %s", form.errors)
    else:
        form = UserCreationForm()
    return render(request, 'signup.html', {'form': form})
