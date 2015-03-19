from django.conf.urls import patterns, url
from games import views

urlpatterns = patterns('',
	url(r'^$', views.index, name = 'index'),
	url(r'^tictactoe/$', views.tictactoe, name = 'tictactoe'),
)
