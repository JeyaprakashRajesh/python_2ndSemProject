from django.db import models

class Music(models.Model):
    title = models.CharField(max_length=255)
    artist = models.CharField(max_length=255)
    audio_file = models.FileField(upload_to='audio_files/')
    poster = models.ImageField(upload_to='posters/')

class LikedMusic(models.Model):
    user_id = models.IntegerField()
    music = models.ForeignKey(Music, on_delete=models.CASCADE)

class Playlist(models.Model):
    user_id = models.IntegerField()
    music = models.ForeignKey(Music, on_delete=models.CASCADE)
