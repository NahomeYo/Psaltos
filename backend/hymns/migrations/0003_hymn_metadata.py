from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('hymns', '0002_hymn_audio_url'),
    ]

    operations = [
        migrations.AddField(
            model_name='hymn',
            name='cantor',
            field=models.CharField(blank=True, max_length=255),
        ),
        migrations.AddField(
            model_name='hymn',
            name='coptic_title',
            field=models.CharField(blank=True, max_length=255),
        ),
        migrations.AddField(
            model_name='hymn',
            name='season',
            field=models.CharField(blank=True, max_length=255),
        ),
    ]
