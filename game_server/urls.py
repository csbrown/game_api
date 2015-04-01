from django.conf.urls import patterns, include, url
from django.contrib import admin

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'game_server.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),
    url(r'^games/', include('games.urls', namespace="games", app_name="games")),
    url(r'^admin/', include(admin.site.urls)),
    url(r'^api/', include('api.urls', namespace="api", app_name="api")),
    url(r'^/', include('home.urls', namespace="home", app_name="home"))
)
