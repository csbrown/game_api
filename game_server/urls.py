from django.conf.urls import patterns, include, url
from django.contrib import admin

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'game_server.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),
    url(r'^games/', include('games.urls', namespace="games")),
    url(r'^admin/', include(admin.site.urls)),
    url(r'^api/', include('api.urls', namespace="api"))
)
