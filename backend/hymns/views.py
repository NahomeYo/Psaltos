from django.contrib.auth import login, logout
from django.contrib.auth.models import User
from django.middleware.csrf import get_token
from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from django.http import StreamingHttpResponse
from urllib.request import urlopen, Request
from urllib.error import URLError, HTTPError

from .models import Profile, Hymn, Playlist, PlaylistItem, Like
from .serializers import (
    ProfileSerializer,
    RegisterSerializer,
    LoginSerializer,
    UserSerializer,
    HymnSerializer,
    PlaylistSerializer,
    PlaylistItemSerializer,
    LikeSerializer,
)


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def csrf(request):
    return Response({'csrfToken': get_token(request)})


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def register(request):
    serializer = RegisterSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    user = serializer.save()
    login(request, user)
    return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def login_view(request):
    serializer = LoginSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    user = serializer.validated_data['user']
    login(request, user)
    return Response(UserSerializer(user).data)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def logout_view(request):
    logout(request)
    return Response({'detail': 'Logged out'})


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def me(request):
    if not request.user.is_authenticated:
        return Response({'authenticated': False})
    return Response({'authenticated': True, 'user': UserSerializer(request.user).data})


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def proxy_audio(request):
    url = request.query_params.get('url')
    if not url:
        return Response({'detail': 'url is required'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        req = Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        remote = urlopen(req, timeout=15)
        content_type = remote.headers.get('Content-Type', 'audio/mpeg')
        response = StreamingHttpResponse(remote, content_type=content_type)
        response['Access-Control-Allow-Origin'] = '*'
        return response
    except (HTTPError, URLError) as err:
        return Response({'detail': f'Failed to fetch audio: {err}'}, status=status.HTTP_502_BAD_GATEWAY)


class ProfileViewSet(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]

    def retrieve(self, request):
        profile, _ = Profile.objects.get_or_create(user=request.user)
        return Response(ProfileSerializer(profile).data)

    def update(self, request):
        profile, _ = Profile.objects.get_or_create(user=request.user)
        serializer = ProfileSerializer(profile, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


class HymnViewSet(viewsets.ModelViewSet):
    queryset = Hymn.objects.all().order_by('-created_at')
    serializer_class = HymnSerializer

    def get_permissions(self):
        if self.action in ['create']:
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    def perform_create(self, serializer):
        serializer.save(uploaded_by=self.request.user)


class PlaylistViewSet(viewsets.ModelViewSet):
    serializer_class = PlaylistSerializer

    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated:
            return Playlist.objects.filter(owner=user).order_by('-created_at')
        return Playlist.objects.none()

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.IsAuthenticated()]
        return [permissions.IsAuthenticated()]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    @action(detail=True, methods=['get', 'post', 'delete'], permission_classes=[permissions.IsAuthenticated])
    def items(self, request, pk=None):
        playlist = self.get_object()
        if request.method == 'GET':
            serializer = PlaylistItemSerializer(playlist.items.all(), many=True)
            return Response(serializer.data)
        if request.method == 'POST':
            serializer = PlaylistItemSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            PlaylistItem.objects.create(playlist=playlist, hymn=serializer.validated_data['hymn'])
            return Response({'detail': 'Added'}, status=status.HTTP_201_CREATED)
        if request.method == 'DELETE':
            hymn_id = request.data.get('hymn_id')
            if not hymn_id:
                return Response({'detail': 'hymn_id required'}, status=status.HTTP_400_BAD_REQUEST)
            PlaylistItem.objects.filter(playlist=playlist, hymn_id=hymn_id).delete()
            return Response({'detail': 'Removed'})


class LikeViewSet(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]

    def list(self, request):
        likes = Like.objects.filter(user=request.user).order_by('-created_at')
        serializer = LikeSerializer(likes, many=True)
        return Response(serializer.data)

    def create(self, request):
        serializer = LikeSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        Like.objects.get_or_create(user=request.user, hymn=serializer.validated_data['hymn'])
        return Response({'detail': 'Liked'}, status=status.HTTP_201_CREATED)

    def destroy(self, request, pk=None):
        Like.objects.filter(user=request.user, hymn_id=pk).delete()
        return Response({'detail': 'Unliked'})
