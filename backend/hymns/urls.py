from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'hymns', views.HymnViewSet, basename='hymn')
router.register(r'playlists', views.PlaylistViewSet, basename='playlist')
router.register(r'likes', views.LikeViewSet, basename='like')

urlpatterns = [
    path('auth/csrf/', views.csrf),
    path('auth/register/', views.register),
    path('auth/login/', views.login_view),
    path('auth/logout/', views.logout_view),
    path('auth/me/', views.me),
    path('profile/', views.ProfileViewSet.as_view({'get': 'retrieve', 'put': 'update'})),
    path('', include(router.urls)),
]
