from django.contrib.auth import authenticate, get_user_model
from rest_framework import serializers
from .models import Profile, Hymn, Playlist, PlaylistItem, Like

User = get_user_model()


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['display_name', 'avatar']


class UserSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer(required=False)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'profile']


class RegisterSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150)
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, min_length=6)
    display_name = serializers.CharField(max_length=120, required=False, allow_blank=True)

    def create(self, validated_data):
        display_name = validated_data.pop('display_name', '')
        base_username = validated_data.get('username')
        username = base_username
        suffix = 1
        while User.objects.filter(username=username).exists():
            username = f"{base_username}{suffix}"
            suffix += 1
        validated_data['username'] = username
        user = User.objects.create_user(**validated_data)
        Profile.objects.create(user=user, display_name=display_name)
        return user


class LoginSerializer(serializers.Serializer):
    username_or_email = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        username_or_email = data.get('username_or_email')
        password = data.get('password')

        user = authenticate(username=username_or_email, password=password)
        if not user:
            try:
                user_obj = User.objects.get(email=username_or_email)
            except User.DoesNotExist:
                user_obj = None
            if user_obj:
                user = authenticate(username=user_obj.username, password=password)

        if not user:
            raise serializers.ValidationError('Invalid credentials')

        data['user'] = user
        return data


class HymnSerializer(serializers.ModelSerializer):
    uploaded_by = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Hymn
        fields = [
            'id',
            'title',
            'coptic_title',
            'season',
            'cantor',
            'audio_file',
            'audio_url',
            'uploaded_by',
            'created_at',
        ]

    def validate(self, data):
        audio_file = data.get('audio_file')
        audio_url = data.get('audio_url')
        if not audio_file and not audio_url:
            raise serializers.ValidationError('Provide either audio_file or audio_url.')
        return data


class PlaylistItemSerializer(serializers.ModelSerializer):
    hymn = HymnSerializer(read_only=True)
    hymn_id = serializers.PrimaryKeyRelatedField(source='hymn', queryset=Hymn.objects.all(), write_only=True)

    class Meta:
        model = PlaylistItem
        fields = ['id', 'hymn', 'hymn_id', 'created_at']


class PlaylistSerializer(serializers.ModelSerializer):
    owner = serializers.StringRelatedField(read_only=True)
    items = PlaylistItemSerializer(many=True, read_only=True)

    class Meta:
        model = Playlist
        fields = ['id', 'title', 'is_public', 'thumbnail', 'owner', 'created_at', 'items']


class LikeSerializer(serializers.ModelSerializer):
    hymn = HymnSerializer(read_only=True)
    hymn_id = serializers.PrimaryKeyRelatedField(source='hymn', queryset=Hymn.objects.all(), write_only=True)

    class Meta:
        model = Like
        fields = ['id', 'hymn', 'hymn_id', 'created_at']
